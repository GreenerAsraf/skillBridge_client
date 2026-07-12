'use client'

import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, BookOpen, Tag } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts'

type User = { id: string }
type Booking = { id: string, status: string }

type AnalyticsData = {
  usersByRole: { name: string; value: number }[]
  revenueOverTime: { name: string; bookings: number; revenue: number }[]
}

const COLORS = ['#10b981', '#6366f1', '#f43f5e', '#f59e0b', '#0ea5e9']

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [categoryCount, setCategoryCount] = useState<number | null>(null)
  
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      apiFetch<{ data: User[] }>('/api/admin/users').catch(() => ({ data: [] })),
      apiFetch<{ data: Booking[] }>('/api/admin/bookings').catch(() => ({ data: [] })),
      apiFetch<{ data: any[] }>('/api/categories').catch(() => ({ data: [] })),
      apiFetch<{ data: AnalyticsData }>('/api/stats/admin/analytics').catch(() => ({ data: { usersByRole: [], revenueOverTime: [] } }))
    ])
      .then(([usersRes, bookingsRes, catsRes, analyticsRes]) => {
        setUsers(usersRes.data ?? [])
        setBookings(bookingsRes.data ?? [])
        setCategoryCount(catsRes.data?.length ?? 0)
        setAnalytics(analyticsRes.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Bookings by status for a pie chart (fallback to local calculation if needed)
  const bookingsByStatusData = bookings.reduce(
    (acc, b) => {
      const status = b.status || 'PENDING'
      const existing = acc.find(a => a.name === status)
      if (existing) {
        existing.value += 1
      } else {
        acc.push({ name: status, value: 1 })
      }
      return acc
    },
    [] as { name: string; value: number }[]
  )

  const usersByRole = analytics?.usersByRole || []
  const revenueData = analytics?.revenueOverTime || []

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>Admin Dashboard</h1>
        <p className='text-muted-foreground text-sm mt-1'>Platform overview at a glance.</p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <Card className='bg-slate-900/60 border-white/10'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>Total Users</CardTitle>
            <Users className='h-4 w-4 text-blue-500' />
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold'>{loading ? '…' : users.length}</p>
          </CardContent>
        </Card>
        <Card className='bg-slate-900/60 border-white/10'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>Total Bookings</CardTitle>
            <BookOpen className='h-4 w-4 text-green-500' />
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold'>{loading ? '…' : bookings.length}</p>
          </CardContent>
        </Card>
        <Card className='bg-slate-900/60 border-white/10'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>Categories</CardTitle>
            <Tag className='h-4 w-4 text-purple-500' />
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold'>{loading ? '…' : (categoryCount ?? '…')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        
        {/* Revenue Over Time Chart */}
        <Card className='bg-slate-900/60 border-white/10 col-span-1 lg:col-span-2'>
          <CardHeader>
            <CardTitle className='text-base font-semibold'>Revenue & Bookings Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-[300px] w-full'>
              {loading ? (
                <div className='w-full h-full flex items-center justify-center text-slate-500'>Loading chart...</div>
              ) : revenueData.length === 0 ? (
                <div className='w-full h-full flex items-center justify-center text-slate-500'>No data available.</div>
              ) : (
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#334155' vertical={false} />
                    <XAxis dataKey='name' stroke='#94a3b8' tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis yAxisId="left" stroke='#94a3b8' tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" stroke='#94a3b8' tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} 
                      itemStyle={{ color: '#f8fafc' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Line yAxisId="left" type='monotone' dataKey='revenue' name='Revenue ($)' stroke='#10b981' strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
                    <Line yAxisId="right" type='monotone' dataKey='bookings' name='Bookings' stroke='#6366f1' strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Users by Role Pie Chart */}
        <Card className='bg-slate-900/60 border-white/10'>
          <CardHeader>
            <CardTitle className='text-base font-semibold'>Users by Role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-[300px] w-full'>
              {loading ? (
                <div className='w-full h-full flex items-center justify-center text-slate-500'>Loading chart...</div>
              ) : usersByRole.length === 0 ? (
                <div className='w-full h-full flex items-center justify-center text-slate-500'>No users registered.</div>
              ) : (
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={usersByRole}
                      cx='50%'
                      cy='50%'
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey='value'
                      label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                    >
                      {usersByRole.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} 
                      itemStyle={{ color: '#f8fafc' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Bookings Status Bar Chart */}
        <Card className='bg-slate-900/60 border-white/10'>
          <CardHeader>
            <CardTitle className='text-base font-semibold'>Bookings by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-[300px] w-full'>
              {loading ? (
                <div className='w-full h-full flex items-center justify-center text-slate-500'>Loading chart...</div>
              ) : bookingsByStatusData.length === 0 ? (
                <div className='w-full h-full flex items-center justify-center text-slate-500'>No bookings recorded.</div>
              ) : (
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={bookingsByStatusData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#334155' vertical={false} />
                    <XAxis dataKey='name' stroke='#94a3b8' tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis stroke='#94a3b8' tick={{ fill: '#94a3b8', fontSize: 12 }} allowDecimals={false} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                      cursor={{ fill: '#1e293b' }}
                    />
                    <Bar dataKey='value' name='Bookings' radius={[4, 4, 0, 0]}>
                      {bookingsByStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

