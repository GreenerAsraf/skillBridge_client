'use client'

import { useState } from 'react'
import { useAuth } from '@/components/auth-provider'
import { apiFetch } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function StudentProfilePage() {
  const { user, setUser } = useAuth()
  const [name, setName] = useState(user?.name ?? '')
  const [saving, setSaving] = useState(false)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await apiFetch('/auth/me', { method: 'PATCH', body: JSON.stringify({ name }) })
      if (user) setUser({ ...user, name })
      toast.success('Profile updated!')
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className='max-w-lg space-y-6'>
      <h1 className='text-2xl font-bold'>My Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your display name.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className='space-y-4'>
            <div className='space-y-1'>
              <label className='text-sm font-medium'>Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder='Your name' />
            </div>
            <div className='space-y-1'>
              <label className='text-sm font-medium'>Email</label>
              <Input value={user?.email ?? ''} disabled className='opacity-60' />
              <p className='text-xs text-muted-foreground'>Email cannot be changed here.</p>
            </div>
            <div className='space-y-1'>
              <label className='text-sm font-medium'>Role</label>
              <Input value={user?.role ?? ''} disabled className='opacity-60' />
            </div>
            <Button type='submit' disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
