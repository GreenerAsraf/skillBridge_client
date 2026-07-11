'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/components/auth-provider'
import { apiFetch } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Camera, Lock, User, Eye, EyeOff, CheckCircle2 } from 'lucide-react'

export default function StudentProfilePage() {
  const { user, refetch } = useAuth()
  const [name, setName] = useState(user?.name ?? '')
  const [saving, setSaving] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // Password change state
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [changingPw, setChangingPw] = useState(false)

  useEffect(() => {
    if (user?.name) setName(user.name)
  }, [user?.name])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await apiFetch('/api/users/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          name,
          ...(avatarPreview ? { image: avatarPreview } : {}),
        }),
      })
      await refetch()
      toast.success('Profile updated!')
    } catch (err: unknown) {
      // Fallback: older endpoint
      try {
        await apiFetch('/api/auth/me', { method: 'PATCH', body: JSON.stringify({ name }) })
        await refetch()
        toast.success('Profile updated!')
      } catch {
        const message = err instanceof Error ? err.message : 'Failed to update profile'
        toast.error(message)
      }
    } finally {
      setSaving(false)
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    if (newPw !== confirmPw) {
      toast.error('New passwords do not match')
      return
    }
    if (newPw.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }
    setChangingPw(true)
    try {
      await apiFetch('/api/users/change-password', {
        method: 'PATCH',
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      })
      toast.success('Password changed successfully!')
      setCurrentPw('')
      setNewPw('')
      setConfirmPw('')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to change password'
      toast.error(message)
    } finally {
      setChangingPw(false)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2 MB')
      return
    }
    const reader = new FileReader()
    reader.onload = () => setAvatarPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const initials = (user?.name ?? 'U')
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const pwStrength = !newPw
    ? null
    : newPw.length < 6
    ? 'weak'
    : newPw.length < 10
    ? 'fair'
    : /[A-Z]/.test(newPw) && /[0-9]/.test(newPw)
    ? 'strong'
    : 'fair'

  return (
    <div className='max-w-lg space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>My Profile</h1>
        <p className='text-muted-foreground text-sm mt-1'>Manage your account info and security.</p>
      </div>

      {/* Profile Info Card */}
      <Card className='border-white/10 bg-slate-900/60 backdrop-blur-sm'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-base'>
            <User className='h-4 w-4 text-indigo-400' /> Personal Information
          </CardTitle>
          <CardDescription>Update your display name and avatar.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Avatar upload */}
          <div className='flex items-center gap-5 mb-6'>
            <div className='relative group'>
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarPreview}
                  alt='avatar preview'
                  className='h-16 w-16 rounded-full object-cover ring-2 ring-indigo-500/40'
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
            <div>
              <p className='text-sm font-medium text-slate-100'>{user?.name ?? 'Your Name'}</p>
              <p className='text-xs text-slate-500'>{user?.email}</p>
              <button
                onClick={() => fileRef.current?.click()}
                type='button'
                className='text-xs text-indigo-400 hover:text-indigo-300 transition-colors mt-1 underline'
              >
                Change avatar
              </button>
            </div>
          </div>

          <form onSubmit={handleSave} className='space-y-4'>
            <div className='space-y-1'>
              <label className='text-sm font-medium'>Name</label>
              <Input
                id='profile-name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Your name'
                className='bg-slate-900 border-white/10'
              />
            </div>
            <div className='space-y-1'>
              <label className='text-sm font-medium'>Email</label>
              <Input value={user?.email ?? ''} disabled className='opacity-50 bg-slate-900 border-white/5' />
              <p className='text-xs text-muted-foreground'>Email cannot be changed here.</p>
            </div>
            <div className='space-y-1'>
              <label className='text-sm font-medium'>Role</label>
              <Input value={user?.role ?? ''} disabled className='opacity-50 bg-slate-900 border-white/5 capitalize' />
            </div>
            <Button
              id='save-profile'
              type='submit'
              disabled={saving}
              className='bg-indigo-600 hover:bg-indigo-500 text-white font-semibold'
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password Change Card */}
      <Card className='border-white/10 bg-slate-900/60 backdrop-blur-sm'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-base'>
            <Lock className='h-4 w-4 text-amber-400' /> Change Password
          </CardTitle>
          <CardDescription>Keep your account secure with a strong password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className='space-y-4'>
            {/* Current password */}
            <div className='space-y-1'>
              <label className='text-sm font-medium'>Current Password</label>
              <div className='relative'>
                <Input
                  id='current-password'
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  placeholder='••••••••'
                  className='pr-10 bg-slate-900 border-white/10'
                />
                <button
                  type='button'
                  onClick={() => setShowCurrent((v) => !v)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors'
                >
                  {showCurrent ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                </button>
              </div>
            </div>

            {/* New password */}
            <div className='space-y-1'>
              <label className='text-sm font-medium'>New Password</label>
              <div className='relative'>
                <Input
                  id='new-password'
                  type={showNew ? 'text' : 'password'}
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  placeholder='Min. 6 characters'
                  className='pr-10 bg-slate-900 border-white/10'
                />
                <button
                  type='button'
                  onClick={() => setShowNew((v) => !v)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors'
                >
                  {showNew ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                </button>
              </div>
              {/* Strength meter */}
              {pwStrength && (
                <div className='space-y-1 pt-1'>
                  <div className='flex gap-1'>
                    {['weak', 'fair', 'strong'].map((level, i) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                          pwStrength === 'strong'
                            ? 'bg-emerald-500'
                            : pwStrength === 'fair' && i < 2
                            ? 'bg-amber-500'
                            : pwStrength === 'weak' && i === 0
                            ? 'bg-rose-500'
                            : 'bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${
                    pwStrength === 'strong' ? 'text-emerald-400' : pwStrength === 'fair' ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {pwStrength === 'strong' ? '✓ Strong password' : pwStrength === 'fair' ? 'Fair — add numbers/uppercase' : 'Too short'}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div className='space-y-1'>
              <label className='text-sm font-medium'>Confirm New Password</label>
              <div className='relative'>
                <Input
                  id='confirm-password'
                  type='password'
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  placeholder='Re-enter new password'
                  className={`bg-slate-900 border-white/10 ${
                    confirmPw && confirmPw !== newPw ? 'border-rose-500/50' : ''
                  } ${confirmPw && confirmPw === newPw ? 'border-emerald-500/50' : ''}`}
                />
                {confirmPw && confirmPw === newPw && (
                  <CheckCircle2 className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400' />
                )}
              </div>
              {confirmPw && confirmPw !== newPw && (
                <p className='text-xs text-rose-400'>Passwords do not match</p>
              )}
            </div>

            <Button
              id='change-password'
              type='submit'
              disabled={changingPw || !currentPw || !newPw || newPw !== confirmPw}
              className='bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold'
            >
              {changingPw ? 'Updating…' : 'Update Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
