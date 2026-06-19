'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import { apiFetch } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

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
  const { user } = useAuth()
  const [bio, setBio] = useState('')
  const [subjects, setSubjects] = useState('')
  const [hourlyRate, setHourlyRate] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

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
      await apiFetch('/api/tutor/profile', {
        method: 'PUT',
        body: JSON.stringify({
          bio,
          subject: subjects.split(',').map((s) => s.trim()).filter(Boolean),
          hourlyPrice: parseFloat(hourlyRate) || 0,
          ...(categoryId ? { categoryId } : {}),
        }),
      })
      toast.success('Tutor profile saved!')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save profile'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

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
        <CardContent className='space-y-3'>
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
