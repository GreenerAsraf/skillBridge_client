'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth-provider'
import { apiFetch } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarCheck, Clock, CheckCircle, XCircle, Star } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

type Booking = {
  id: string
  status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  date?: string
  startTime?: string
  scheduledAt?: string
  tutor?: { user?: { name: string } }
  review?: { id: string } | null
}

const statusStyle: Record<string, string> = {
  CONFIRMED: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

export default function StudentDashboardPage() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch<{ data: Booking[] }>('/api/bookings')
      .then((res) => setBookings(res.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const upcoming  = bookings.filter((b) => b.status === 'CONFIRMED')
  const completed = bookings.filter((b) => b.status === 'COMPLETED')
  const cancelled = bookings.filter((b) => b.status === 'CANCELLED')
  const past = bookings.filter((b) => b.status === 'COMPLETED' || b.status === 'CANCELLED')

  async function handleCancel(id: string) {
    const toastId = toast.loading('Cancelling session…')
    try {
      await apiFetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'CANCELLED' }),
      })
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'CANCELLED' } : b)))
      toast.success('Session cancelled.', { id: toastId })
    } catch (err: any) {
      toast.error(err.message ?? 'Cancel failed', { id: toastId })
    }
  }

  const formatDate = (b: Booking) => {
    if (b.date) {
      const d = new Date(b.date).toLocaleDateString(undefined, { dateStyle: 'medium' })
      return b.startTime ? `${d} · ${b.startTime}` : d
    }
    if (b.scheduledAt) return new Date(b.scheduledAt).toLocaleString()
    return '—'
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>Welcome back, {user?.name ?? 'Student'} 👋</h1>
        <p className='text-muted-foreground text-sm mt-1'>Here's what's happening with your sessions.</p>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 sm:grid-cols-4 gap-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>Upcoming</CardTitle>
            <CalendarCheck className='h-4 w-4 text-blue-500' />
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
            <CardTitle className='text-sm font-medium'>Cancelled</CardTitle>
            <XCircle className='h-4 w-4 text-red-500' />
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold'>{cancelled.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>Total</CardTitle>
            <Star className='h-4 w-4 text-amber-500' />
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold'>{bookings.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming sessions */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='text-base'>Upcoming Sessions</CardTitle>
          <Link href='/dashboard/bookings' className='text-xs text-muted-foreground underline hover:text-foreground'>
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className='text-sm text-muted-foreground'>Loading…</p>
          ) : upcoming.length === 0 ? (
            <p className='text-sm text-muted-foreground'>
              No upcoming sessions.{' '}
              <Link href='/tutors' className='underline'>Browse tutors</Link> to book one!
            </p>
          ) : (
            <ul className='divide-y'>
              {upcoming.map((b) => (
                <li key={b.id} className='py-3 flex items-center justify-between gap-4'>
                  <div className='min-w-0'>
                    <p className='text-sm font-medium'>{b.tutor?.user?.name ?? 'Tutor'}</p>
                    <p className='text-xs text-muted-foreground flex items-center gap-1 mt-0.5'>
                      <Clock className='h-3 w-3 shrink-0' />
                      {formatDate(b)}
                    </p>
                  </div>
                  <div className='flex items-center gap-2 shrink-0'>
                    <span className='text-xs rounded-full bg-blue-100 text-blue-700 px-2 py-0.5'>Confirmed</span>
                    <Button
                      size='sm'
                      variant='outline'
                      className='text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 text-[11px] h-7 px-2.5 shadow-none'
                      onClick={() => handleCancel(b.id)}
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

      {/* Past sessions */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='text-base'>Past Sessions</CardTitle>
          <Link href='/dashboard/bookings' className='text-xs text-muted-foreground underline hover:text-foreground'>
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className='text-sm text-muted-foreground'>Loading…</p>
          ) : past.length === 0 ? (
            <p className='text-sm text-muted-foreground'>No past sessions yet.</p>
          ) : (
            <ul className='divide-y'>
              {past.slice(0, 5).map((b) => (
                <li key={b.id} className='py-3 flex items-center justify-between gap-4'>
                  <div className='min-w-0'>
                    <p className='text-sm font-medium'>{b.tutor?.user?.name ?? 'Tutor'}</p>
                    <p className='text-xs text-muted-foreground flex items-center gap-1 mt-0.5'>
                      <Clock className='h-3 w-3 shrink-0' />
                      {formatDate(b)}
                    </p>
                  </div>
                  <div className='flex items-center gap-2 shrink-0'>
                    <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${statusStyle[b.status]}`}>
                      {b.status}
                    </span>
                    {b.status === 'COMPLETED' && b.review && (
                      <span className='text-xs text-green-600 font-medium flex items-center gap-1'>
                        <Star className='h-3 w-3 fill-green-400 stroke-green-400' />
                        Reviewed
                      </span>
                    )}
                  </div>
                </li>
              ))}
              {past.length > 5 && (
                <li className='pt-3 text-center'>
                  <Link href='/dashboard/bookings' className='text-xs text-muted-foreground underline hover:text-foreground'>
                    See {past.length - 5} more…
                  </Link>
                </li>
              )}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
