'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/components/auth-provider'
import { apiFetch } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Camera, Link, X } from 'lucide-react'

type Category = { id: string; name: string }

type TutorProfile = {
  bio?: string
  hourlyPrice?: number
  subject?: string[]
  categoryId?: string
  category?: { id: string; name: string }
  user?: { email: string }
}

async function loadTutorProfile(userEmail: string): Promise<TutorProfile | null> {
  try {
    const res = await apiFetch<{ data: TutorProfile }>('/api/tutor/profile')
    if (res.data) return res.data
  } catch {
    // fall back to listing tutors if GET is not supported
  }

  const tutorRes = await apiFetch<{ data: TutorProfile[] }>('/api/tutors')
  return tutorRes.data?.find((t) => t.user?.email === userEmail) ?? null
}

export default function TutorProfilePage() {
  const { user, refetch } = useAuth()
  const [bio, setBio] = useState('')
  const [subjects, setSubjects] = useState('')
  const [hourlyRate, setHourlyRate] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [imageUrlInput, setImageUrlInput] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (user?.image) {
      setAvatarPreview(user.image)
      setImageUrlInput(user.image)
    }
  }, [user])

  useEffect(() => {
    if (!user) return

    Promise.all([
      loadTutorProfile(user.email),
      apiFetch<{ data: Category[] }>('/api/categories').catch(() => ({ data: [] as Category[] })),
    ])
      .then(([myProfile, catRes]) => {
        setCategories(catRes.data ?? [])

        if (myProfile) {
          setBio(myProfile.bio ?? '')
          setSubjects(myProfile.subject?.join(', ') ?? '')
          setHourlyRate(myProfile.hourlyPrice != null ? myProfile.hourlyPrice.toString() : '')
          setCategoryId(myProfile.categoryId ?? myProfile.category?.id ?? '')
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      let imageUrl = user?.image ?? ''

      // Priority 1: Uploaded file → upload to server
      if (avatarFile) {
        const formData = new FormData()
        formData.append('avatar', avatarFile)
        const uploadRes = await apiFetch<{ success: boolean; data?: { image?: string } }>('/api/users/avatar', {
          method: 'POST',
          body: formData,
        })
        if (uploadRes.success && uploadRes.data?.image) {
          imageUrl = uploadRes.data.image
          setAvatarFile(null)
        }
      }
      // Priority 2: URL typed in the URL input field
      else if (imageUrlInput.trim() && imageUrlInput.trim() !== user?.image) {
        imageUrl = imageUrlInput.trim()
      }

      await apiFetch('/api/tutor/profile', {
        method: 'PUT',
        body: JSON.stringify({
          bio,
          subject: subjects.split(',').map((s) => s.trim()).filter(Boolean),
          hourlyPrice: parseFloat(hourlyRate) || 0,
          ...(categoryId ? { categoryId } : {}),
        }),
      })

      // Always update image if it changed
      if (imageUrl !== (user?.image ?? '')) {
        await apiFetch('/api/users/profile', {
          method: 'PATCH',
          body: JSON.stringify({ image: imageUrl }),
        })
      }

      toast.success('Tutor profile saved!')
      await refetch()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save profile'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2 MB')
      return
    }
    setAvatarFile(file)
    setShowUrlInput(false)
    const reader = new FileReader()
    reader.onload = () => {
      setAvatarPreview(reader.result as string)
      setImageUrlInput('')
    }
    reader.readAsDataURL(file)
  }

  function handleUrlInputChange(url: string) {
    setImageUrlInput(url)
    if (url.trim()) {
      setAvatarPreview(url.trim())
      setAvatarFile(null)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function clearAvatar() {
    setAvatarPreview(null)
    setAvatarFile(null)
    setImageUrlInput('')
    setShowUrlInput(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  const initials = (user?.name ?? 'U')
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  if (loading) {
    return (
      <div className='max-w-lg space-y-6'>
        <h1 className='text-2xl font-bold'>Tutor Profile</h1>
        <p className='text-sm text-muted-foreground'>Loading profile…</p>
      </div>
    )
  }

  return (
    <div className='max-w-lg space-y-6'>
      <h1 className='text-2xl font-bold'>Tutor Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Account Info</CardTitle>
        </CardHeader>
        <CardContent className='space-y-5'>
          <div className='flex items-center gap-5'>
            <div className='relative group'>
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarPreview}
                  alt='avatar preview'
                  className='h-16 w-16 rounded-full object-cover ring-2 ring-indigo-500/40'
                  onError={() => setAvatarPreview(null)}
                />
              ) : (
                <div className='h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl'>
                  {initials}
                </div>
              )}
              <button
                onClick={() => fileRef.current?.click()}
                className='absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200'
                type='button'
              >
                <Camera className='h-5 w-5 text-white' />
              </button>
              <input
                ref={fileRef}
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handleFileChange}
              />
            </div>
            <div className='space-y-1'>
              <p className='text-sm font-medium'>{user?.name ?? 'Your Name'}</p>
              <p className='text-xs text-muted-foreground'>{user?.email}</p>
              <div className='flex items-center gap-2 mt-1'>
                <button
                  onClick={() => fileRef.current?.click()}
                  type='button'
                  className='text-xs text-indigo-500 hover:text-indigo-400 transition-colors underline'
                >
                  Upload photo
                </button>
                <span className='text-xs text-muted-foreground'>·</span>
                <button
                  type='button'
                  onClick={() => setShowUrlInput((v) => !v)}
                  className='text-xs text-indigo-500 hover:text-indigo-400 transition-colors underline flex items-center gap-1'
                >
                  <Link className='h-3 w-3' />
                  Use URL
                </button>
                {avatarPreview && (
                  <>
                    <span className='text-xs text-muted-foreground'>·</span>
                    <button
                      type='button'
                      onClick={clearAvatar}
                      className='text-xs text-red-500 hover:text-red-400 transition-colors underline flex items-center gap-1'
                    >
                      <X className='h-3 w-3' />
                      Remove
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* URL input panel */}
          {showUrlInput && (
            <div className='space-y-1'>
              <label className='text-xs font-medium text-muted-foreground'>Image URL</label>
              <Input
                type='url'
                value={imageUrlInput}
                onChange={(e) => handleUrlInputChange(e.target.value)}
                placeholder='https://example.com/avatar.jpg'
                className='text-sm'
              />
              <p className='text-xs text-muted-foreground'>
                Paste a direct image link. This will be saved when you click Save Profile.
              </p>
            </div>
          )}
          
          <div className='space-y-1'>
            <label className='text-sm font-medium'>Name</label>
            <Input value={user?.name ?? ''} disabled className='opacity-60' />
          </div>
          <div className='space-y-1'>
            <label className='text-sm font-medium'>Email</label>
            <Input value={user?.email ?? ''} disabled className='opacity-60' />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Teaching Details</CardTitle>
          <CardDescription>Fill in your tutoring information shown to students.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className='space-y-4'>
            <div className='space-y-1'>
              <label className='text-sm font-medium'>Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder='Tell students about yourself…'
                rows={4}
                className='w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
              />
            </div>
            <div className='space-y-1'>
              <label className='text-sm font-medium'>Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
              >
                <option value=''>Select a category…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className='space-y-1'>
              <label className='text-sm font-medium'>Subjects (comma separated)</label>
              <Input
                value={subjects}
                onChange={(e) => setSubjects(e.target.value)}
                placeholder='Math, Physics, Chemistry'
              />
            </div>
            <div className='space-y-1'>
              <label className='text-sm font-medium'>Hourly Rate ($)</label>
              <Input
                type='number'
                min={0}
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                placeholder='25'
              />
            </div>
            <Button type='submit' disabled={saving}>
              {saving ? 'Saving…' : 'Save Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
