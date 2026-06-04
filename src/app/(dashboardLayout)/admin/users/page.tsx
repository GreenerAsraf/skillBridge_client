'use client'

import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type User = {
  id: string
  name: string
  email: string
  role: string
  status?: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch<{ data: User[] }>('/api/admin/users')
      .then((r) => setUsers(r.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function toggleBan(id: string, currentStatus: string | undefined) {
    const newStatus = currentStatus === 'BANNED' ? 'ACTIVE' : 'BANNED'
    try {
      await apiFetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      })
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: newStatus } : u))
      toast.success(`User ${newStatus === 'BANNED' ? 'banned' : 'unbanned'}`)
    } catch (err: any) {
      toast.error(err.message ?? 'Action failed')
    }
  }

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Manage Users</h1>

      <Card>
        <CardHeader>
          <CardTitle className='text-base'>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className='text-sm text-muted-foreground'>Loading…</p>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b text-muted-foreground text-xs'>
                    <th className='text-left py-2 pr-4'>Name</th>
                    <th className='text-left py-2 pr-4'>Email</th>
                    <th className='text-left py-2 pr-4'>Role</th>
                    <th className='text-left py-2 pr-4'>Status</th>
                    <th className='text-left py-2'>Action</th>
                  </tr>
                </thead>
                <tbody className='divide-y'>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className='py-2.5 pr-4 font-medium'>{u.name}</td>
                      <td className='py-2.5 pr-4 text-muted-foreground'>{u.email}</td>
                      <td className='py-2.5 pr-4'>
                        <span className='text-xs rounded-full bg-muted px-2 py-0.5'>{u.role}</span>
                      </td>
                      <td className='py-2.5 pr-4'>
                        <span className={`text-xs rounded-full px-2 py-0.5 ${u.status === 'BANNED' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {u.status ?? 'ACTIVE'}
                        </span>
                      </td>
                      <td className='py-2.5'>
                        <Button
                          size='sm'
                          variant={u.status === 'BANNED' ? 'outline' : 'destructive'}
                          onClick={() => toggleBan(u.id, u.status)}
                        >
                          {u.status === 'BANNED' ? 'Unban' : 'Ban'}
                        </Button>
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
