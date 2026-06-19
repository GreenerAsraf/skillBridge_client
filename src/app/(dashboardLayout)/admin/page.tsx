'use client'

import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, BookOpen, Tag } from 'lucide-react'

type User = {
  id: string
  name: string
  email: string
  role: 'STUDENT' | 'TUTOR' | 'ADMIN'
}

type Booking = {
  id: string
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
}

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [categoryCount, setCategoryCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      apiFetch<{ data: User[] }>('/api/admin/users'),
      apiFetch<{ data: Booking[] }>('/api/admin/bookings'),
      apiFetch<{ data: any[] }>('/api/categories').catch(() => ({ data: [] }))
    ])
      .then(([usersRes, bookingsRes, catsRes]) => {
        setUsers(usersRes.data ?? [])
        setBookings(bookingsRes.data ?? [])
        setCategoryCount(catsRes.data?.length ?? 0)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Bookings by status
  const bookingsByStatus = bookings.reduce(
    (acc, b) => {
      const status = b.status || 'PENDING'
      acc[status] = (acc[status] || 0) + 1
      return acc
    },
    { PENDING: 0, CONFIRMED: 0, COMPLETED: 0, CANCELLED: 0 } as Record<string, number>
  )

  // Users by role
  const usersByRole = users.reduce(
    (acc, u) => {
      const role = u.role || 'STUDENT'
      acc[role] = (acc[role] || 0) + 1
      return acc
    },
    { STUDENT: 0, TUTOR: 0, ADMIN: 0 } as Record<string, number>
  )

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>Admin Dashboard</h1>
        <p className='text-muted-foreground text-sm mt-1'>Platform overview at a glance.</p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>Total Users</CardTitle>
            <Users className='h-4 w-4 text-blue-500' />
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold'>{loading ? '…' : users.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>Total Bookings</CardTitle>
            <BookOpen className='h-4 w-4 text-green-500' />
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold'>{loading ? '…' : bookings.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>Categories</CardTitle>
            <Tag className='h-4 w-4 text-purple-500' />
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold'>{categoryCount ?? '…'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Bookings Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle className='text-base font-semibold'>Bookings by Status</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {loading ? (
              <p className='text-sm text-muted-foreground'>Loading chart data...</p>
            ) : bookings.length === 0 ? (
              <p className='text-sm text-muted-foreground'>No bookings recorded.</p>
            ) : (
              <div className='space-y-4'>
                {Object.entries(bookingsByStatus).map(([status, count]) => {
                  const percentage = bookings.length > 0 ? (count / bookings.length) * 100 : 0
                  const colorMap: Record<string, string> = {
                    COMPLETED: 'from-emerald-500 to-teal-500 bg-emerald-500',
                    CONFIRMED: 'from-blue-500 to-indigo-500 bg-blue-500',
                    PENDING: 'from-amber-500 to-orange-500 bg-amber-500',
                    CANCELLED: 'from-rose-500 to-red-500 bg-rose-500',
                  }
                  const barColor = colorMap[status] || 'bg-slate-500'
                  return (
                    <div key={status} className='space-y-1.5'>
                      <div className='flex justify-between text-xs font-medium'>
                        <span className='text-slate-350'>{status}</span>
                        <span className='text-slate-400'>
                          {count} ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <div className='w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-white/5'>
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Users by Role Chart */}
        <Card>
          <CardHeader>
            <CardTitle className='text-base font-semibold'>Users by Role</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {loading ? (
              <p className='text-sm text-muted-foreground'>Loading chart data...</p>
            ) : users.length === 0 ? (
              <p className='text-sm text-muted-foreground'>No users registered.</p>
            ) : (
              <div className='space-y-4'>
                {Object.entries(usersByRole).map(([role, count]) => {
                  const percentage = users.length > 0 ? (count / users.length) * 100 : 0
                  const colorMap: Record<string, string> = {
                    STUDENT: 'from-emerald-400 to-cyan-500 bg-emerald-400',
                    TUTOR: 'from-indigo-500 to-purple-500 bg-indigo-500',
                    ADMIN: 'from-pink-500 to-rose-500 bg-pink-500',
                  }
                  const barColor = colorMap[role] || 'bg-slate-500'
                  return (
                    <div key={role} className='space-y-1.5'>
                      <div className='flex justify-between text-xs font-medium'>
                        <span className='text-slate-350'>{role}</span>
                        <span className='text-slate-400'>
                          {count} ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <div className='w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-white/5'>
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
