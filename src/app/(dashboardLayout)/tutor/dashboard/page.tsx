'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth-provider'
import { apiFetch } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Star, BookOpen, Clock, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type Booking = {
  id: string
  status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  scheduledAt: string
  student?: { name: string }
}

type Review = {
  id: string
  rating: number
  comment: string
  createdAt: string
  user?: { name: string }
}

type TutorProfile = {
  id: string
  rating: number
  reviews?: Review[]
}

export default function TutorDashboardPage() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [profile, setProfile] = useState<TutorProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      apiFetch<{ data: Booking[] }>('/api/bookings'),
      apiFetch<{ data: TutorProfile }>('/api/tutor/profile').catch(() => ({ data: null as any }))
    ])
      .then(([bookingsRes, profileRes]) => {
        setBookings(bookingsRes.data ?? [])
        setProfile(profileRes.data ?? null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function updateStatus(id: string, status: 'COMPLETED' | 'CANCELLED') {
    const toastId = toast.loading(`Updating session to ${status.toLowerCase()}...`)
    try {
      await apiFetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      })
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      )
      toast.success(`Session marked as ${status.toLowerCase()}!`, { id: toastId })
    } catch (err: any) {
      toast.error(err.message ?? 'Update failed', { id: toastId })
    }
  }

  const upcoming = bookings.filter((b) => b.status === 'CONFIRMED')
  const completed = bookings.filter((b) => b.status === 'COMPLETED')

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>Welcome, {user?.name ?? 'Tutor'} 👋</h1>
        <p className='text-muted-foreground text-sm mt-1'>Here's your teaching overview.</p>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>Upcoming Sessions</CardTitle>
            <BookOpen className='h-4 w-4 text-blue-500' />
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold'>{upcoming.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>Completed</CardTitle>
            <CheckCircle className='h-4 w-4 text-green-500' />
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold'>{completed.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>Total Sessions</CardTitle>
            <Clock className='h-4 w-4 text-purple-500' />
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold'>{bookings.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>Average Rating</CardTitle>
            <Star className='h-4 w-4 text-yellow-500 fill-yellow-500' />
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold'>
              {profile && profile.rating != null ? profile.rating.toFixed(1) : 'New'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Upcoming sessions */}
        <div className='lg:col-span-2'>
          <Card className='h-full'>
            <CardHeader>
              <CardTitle className='text-base'>Upcoming Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className='text-sm text-muted-foreground'>Loading…</p>
              ) : upcoming.length === 0 ? (
                <p className='text-sm text-muted-foreground'>No upcoming sessions scheduled.</p>
              ) : (
                <ul className='divide-y'>
                  {upcoming.map((b) => (
                    <li key={b.id} className='py-3 flex items-center justify-between'>
                      <div>
                        <p className='text-sm font-medium'>{b.student?.name ?? 'Student'}</p>
                        <p className='text-xs text-muted-foreground flex items-center gap-1'>
                          <Clock className='h-3 w-3' />
                          {new Date(b.scheduledAt).toLocaleString()}
                        </p>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Button
                          size='sm'
                          className='bg-green-600 hover:bg-green-700 text-white text-[11px] h-7 px-2.5 shadow-none'
                          onClick={() => updateStatus(b.id, 'COMPLETED')}
                        >
                          Complete
                        </Button>
                        <Button
                          size='sm'
                          variant='outline'
                          className='text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 text-[11px] h-7 px-2.5 shadow-none'
                          onClick={() => updateStatus(b.id, 'CANCELLED')}
                        >
                          Cancel
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Reviews list */}
        <div>
          <Card className='h-full'>
            <CardHeader>
              <CardTitle className='text-base'>Received Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className='text-sm text-muted-foreground'>Loading…</p>
              ) : !profile?.reviews || profile.reviews.length === 0 ? (
                <p className='text-sm text-muted-foreground'>No reviews received yet.</p>
              ) : (
                <ul className='divide-y space-y-4 pt-1'>
                  {profile.reviews.map((r) => (
                    <li key={r.id} className='py-3 first:pt-0'>
                      <div className='flex items-center justify-between mb-1'>
                        <div className='flex items-center gap-1.5'>
                          <div className='h-6 w-6 rounded-full bg-indigo-500/10 text-indigo-300 font-bold flex items-center justify-center text-[10px]'>
                            {(r.user?.name ?? 'S')[0].toUpperCase()}
                          </div>
                          <p className='text-xs font-semibold text-slate-200'>{r.user?.name ?? 'Student'}</p>
                        </div>
                        <div className='flex items-center gap-0.5 text-amber-400 text-xs font-medium'>
                          <Star className='h-3 w-3 fill-amber-450 stroke-amber-400' />
                          {r.rating.toFixed(1)}
                        </div>
                      </div>
                      <p className='text-xs text-slate-400 bg-slate-900/40 p-2.5 rounded-lg border border-white/5 leading-relaxed italic'>
                        "{r.comment}"
                      </p>
                      <p className='text-[9px] text-muted-foreground mt-1 text-right'>
                        {new Date(r.createdAt).toLocaleDateString()}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
