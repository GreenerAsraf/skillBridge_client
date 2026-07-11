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

  // Pagination & Sorting State
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'asc' | 'desc' } | null>(null)
  const itemsPerPage = 10

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

  // Sorting
  const handleSort = (key: keyof User) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortConfig) return 0
    const aValue = a[sortConfig.key] || ''
    const bValue = b[sortConfig.key] || ''
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  // Pagination
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage)
  const paginatedUsers = sortedUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Manage Users</h1>

      <Card className='border-white/10 bg-slate-900/60'>
        <CardHeader>
          <CardTitle className='text-base'>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className='text-sm text-muted-foreground'>Loading…</p>
          ) : (
            <div className='space-y-4'>
              <div className='overflow-x-auto rounded-lg border border-white/5'>
                <table className='w-full text-sm text-left'>
                  <thead className='bg-slate-900/80 text-muted-foreground text-xs uppercase tracking-wider border-b border-white/5'>
                    <tr>
                      <th className='px-4 py-3 cursor-pointer hover:text-white transition-colors' onClick={() => handleSort('name')}>
                        Name {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className='px-4 py-3 cursor-pointer hover:text-white transition-colors' onClick={() => handleSort('email')}>
                        Email {sortConfig?.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className='px-4 py-3 cursor-pointer hover:text-white transition-colors' onClick={() => handleSort('role')}>
                        Role {sortConfig?.key === 'role' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className='px-4 py-3 cursor-pointer hover:text-white transition-colors' onClick={() => handleSort('status')}>
                        Status {sortConfig?.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className='px-4 py-3'>Action</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-white/5 bg-slate-900/40'>
                    {paginatedUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className='px-4 py-8 text-center text-muted-foreground'>No users found.</td>
                      </tr>
                    ) : (
                      paginatedUsers.map((u) => (
                        <tr key={u.id} className='hover:bg-white/[0.02] transition-colors'>
                          <td className='px-4 py-3 font-medium'>{u.name}</td>
                          <td className='px-4 py-3 text-muted-foreground'>{u.email}</td>
                          <td className='px-4 py-3'>
                            <span className='text-[10px] font-semibold tracking-wider rounded-full bg-slate-800 text-slate-300 px-2 py-0.5 border border-white/10'>
                              {u.role}
                            </span>
                          </td>
                          <td className='px-4 py-3'>
                            <span className={`text-[10px] font-semibold tracking-wider rounded-full px-2 py-0.5 border ${
                              u.status === 'BANNED' 
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            }`}>
                              {u.status ?? 'ACTIVE'}
                            </span>
                          </td>
                          <td className='px-4 py-3'>
                            <Button
                              size='sm'
                              variant='ghost'
                              className={
                                u.status === 'BANNED' 
                                  ? 'h-8 text-xs bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' 
                                  : 'h-8 text-xs bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                              }
                              onClick={() => toggleBan(u.id, u.status)}
                            >
                              {u.status === 'BANNED' ? 'Unban' : 'Ban'}
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className='flex items-center justify-between pt-2'>
                  <p className='text-xs text-muted-foreground'>
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, users.length)} of {users.length} users
                  </p>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      className='h-8 border-white/10'
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    >
                      Previous
                    </Button>
                    <div className='text-sm font-medium px-2'>
                      {currentPage} / {totalPages}
                    </div>
                    <Button
                      variant='outline'
                      size='sm'
                      className='h-8 border-white/10'
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
