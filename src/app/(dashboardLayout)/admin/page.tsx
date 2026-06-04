'use client'

import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, BookOpen, Tag } from 'lucide-react'

export default function AdminDashboardPage() {
  const [userCount, setUserCount] = useState<number | null>(null)
  const [bookingCount, setBookingCount] = useState<number | null>(null)

  useEffect(() => {
    apiFetch<{ data: unknown[] }>('/api/admin/users')
      .then((r) => setUserCount(r.data?.length ?? 0))
      .catch(() => {})

    apiFetch<{ data: unknown[] }>('/bookings')
      .then((r) => setBookingCount(r.data?.length ?? 0))
      .catch(() => {})
  }, [])

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Admin Dashboard</h1>
      <p className='text-muted-foreground text-sm'>Platform overview at a glance.</p>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>Total Users</CardTitle>
            <Users className='h-4 w-4 text-blue-500' />
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold'>{userCount ?? '…'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>Total Bookings</CardTitle>
            <BookOpen className='h-4 w-4 text-green-500' />
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold'>{bookingCount ?? '…'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>Categories</CardTitle>
            <Tag className='h-4 w-4 text-purple-500' />
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold'>—</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
