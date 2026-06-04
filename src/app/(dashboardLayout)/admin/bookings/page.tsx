'use client'

import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock } from 'lucide-react'

type Booking = {
  id: string
  status: string
  date?: string
  startTime?: string
  endTime?: string
  scheduledAt?: string
  student?: { name: string }
  tutor?: { user?: { name: string } }
}

const statusStyle: Record<string, string> = {
  CONFIRMED: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch<{ data: Booking[] }>('/api/admin/bookings')
      .then((r) => setBookings(r.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>All Bookings</h1>

      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Booking Records</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className='text-sm text-muted-foreground'>Loading…</p>
          ) : bookings.length === 0 ? (
            <p className='text-sm text-muted-foreground'>No bookings yet.</p>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b text-muted-foreground text-xs'>
                    <th className='text-left py-2 pr-4'>Student</th>
                    <th className='text-left py-2 pr-4'>Tutor</th>
                    <th className='text-left py-2 pr-4'>Date</th>
                    <th className='text-left py-2'>Status</th>
                  </tr>
                </thead>
                <tbody className='divide-y'>
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td className='py-2.5 pr-4 font-medium'>{b.student?.name ?? '—'}</td>
                      <td className='py-2.5 pr-4 text-muted-foreground'>{b.tutor?.user?.name ?? '—'}</td>
                      <td className='py-2.5 pr-4 text-muted-foreground'>
                        <span className='flex items-center gap-1'>
                          <Clock className='h-3 w-3' />
                          {b.date
                            ? `${new Date(b.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}${b.startTime ? ` · ${b.startTime}` : ''}`
                            : b.scheduledAt
                            ? new Date(b.scheduledAt).toLocaleString()
                            : '—'}
                        </span>
                      </td>
                      <td className='py-2.5'>
                        <span className={`text-xs rounded-full px-2.5 py-0.5 font-medium ${statusStyle[b.status] ?? 'bg-muted text-foreground'}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
