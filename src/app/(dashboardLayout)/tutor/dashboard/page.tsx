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

export default function TutorDashboardPage() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch<{ data: Booking[] }>('/api/bookings')
      .then((res) => setBookings(res.data ?? []))
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
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
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
            <Star className='h-4 w-4 text-yellow-500' />
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold'>{bookings.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming sessions */}
      <Card>
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
  )
}
