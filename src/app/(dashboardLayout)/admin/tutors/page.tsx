'use client'

import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { CheckCircle2, XCircle, Clock, Star, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

type Tutor = {
  id: string
  bio?: string
  hourlyPrice?: number
  subject?: string[]
  isApproved: boolean
  rating?: number
  user?: { name: string; email: string }
  category?: { name: string }
  categories?: Array<{ name: string }>
  _count?: { reviews: number; bookings: number }
}

type Filter = 'all' | 'pending' | 'approved'

export default function AdminTutorsPage() {
  const [tutors, setTutors] = useState<Tutor[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')
  const [togglingId, setTogglingId] = useState<string | null>(null)

  useEffect(() => {
    apiFetch<{ data: Tutor[] }>('/api/admin/tutors')
      .then((r) => setTutors(r.data ?? []))
      .catch(() => {
        // Fallback: try /api/tutors
        apiFetch<{ data: Tutor[] }>('/api/tutors?limit=100')
          .then((r) => setTutors(r.data ?? []))
          .catch(() => {})
      })
      .finally(() => setLoading(false))
  }, [])

  async function toggleApproval(id: string, current: boolean) {
    setTogglingId(id)
    try {
      await apiFetch(`/api/admin/tutors/${id}/approve`, {
        method: 'PATCH',
        body: JSON.stringify({ isApproved: !current }),
      })
      setTutors((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isApproved: !current } : t))
      )
      toast.success(current ? 'Tutor profile deactivated' : 'Tutor profile approved!')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Action failed'
      toast.error(message)
    } finally {
      setTogglingId(null)
    }
  }

  const filtered = tutors
    .filter((t) => {
      if (filter === 'approved') return t.isApproved
      if (filter === 'pending') return !t.isApproved
      return true
    })
    .filter((t) => {
      if (!search) return true
      const q = search.toLowerCase()
      return (
        t.user?.name?.toLowerCase().includes(q) ||
        t.user?.email?.toLowerCase().includes(q) ||
        t.subject?.join(' ').toLowerCase().includes(q)
      )
    })

  const pending = tutors.filter((t) => !t.isApproved).length
  const approved = tutors.filter((t) => t.isApproved).length

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>Manage Tutors</h1>
        <p className='text-muted-foreground text-sm mt-1'>
          Review and approve tutor profiles before they go live.
        </p>
      </div>

      {/* Summary chips */}
      <div className='flex gap-3 flex-wrap'>
        {(
          [
            { label: 'All', value: 'all', count: tutors.length, color: 'slate' },
            { label: 'Pending', value: 'pending', count: pending, color: 'amber' },
            { label: 'Approved', value: 'approved', count: approved, color: 'emerald' },
          ] as const
        ).map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
              filter === f.value
                ? f.color === 'amber'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : f.color === 'emerald'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-800 border-white/10 text-slate-100'
                : 'bg-slate-900/40 border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-300'
            }`}
          >
            {f.label}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-md font-bold ${
                f.color === 'amber'
                  ? 'bg-amber-500/20 text-amber-400'
                  : f.color === 'emerald'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {f.count}
            </span>
          </button>
        ))}
      </div>

      <Card className='border-white/10 bg-slate-900/60'>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='text-base'>Tutor Profiles</CardTitle>
          <div className='relative w-56'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500' />
            <Input
              id='admin-tutor-search'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search tutors…'
              className='pl-8 h-8 text-xs bg-slate-900 border-white/10'
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='space-y-3'>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className='h-16 rounded-xl bg-slate-900 animate-pulse' />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className='text-sm text-muted-foreground py-8 text-center'>
              No tutor profiles found.
            </p>
          ) : (
            <div className='space-y-3'>
              {filtered.map((t) => (
                <div
                  key={t.id}
                  className='flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-slate-900/40 hover:border-white/10 transition-all'
                >
                  {/* Avatar */}
                  <div className='h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0'>
                    {(t.user?.name ?? '?')[0].toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2 flex-wrap'>
                      <p className='font-semibold text-sm text-slate-100'>{t.user?.name ?? 'Unknown'}</p>
                      {t.isApproved ? (
                        <span className='inline-flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-2 py-0.5 font-semibold'>
                          <CheckCircle2 className='h-3 w-3' /> Approved
                        </span>
                      ) : (
                        <span className='inline-flex items-center gap-1 text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full px-2 py-0.5 font-semibold'>
                          <Clock className='h-3 w-3' /> Pending
                        </span>
                      )}
                    </div>
                    <p className='text-xs text-slate-500 truncate'>{t.user?.email}</p>
                    <div className='flex items-center gap-3 mt-1 flex-wrap'>
                      {t.hourlyPrice != null && (
                        <span className='text-xs text-slate-400'>${t.hourlyPrice}/hr</span>
                      )}
                      {t.rating != null && (
                        <span className='flex items-center gap-0.5 text-xs text-amber-400'>
                          <Star className='h-3 w-3 fill-amber-400' />
                          {t.rating.toFixed(1)}
                        </span>
                      )}
                      {t.subject && t.subject.length > 0 && (
                        <span className='text-xs text-slate-500'>
                          {t.subject.slice(0, 3).join(', ')}
                          {t.subject.length > 3 ? ' …' : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <Button
                    id={`toggle-tutor-${t.id}`}
                    size='sm'
                    disabled={togglingId === t.id}
                    onClick={() => toggleApproval(t.id, t.isApproved)}
                    className={
                      t.isApproved
                        ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:border-rose-500/30'
                        : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/30'
                    }
                    variant='ghost'
                  >
                    {togglingId === t.id
                      ? '…'
                      : t.isApproved
                      ? <><XCircle className='h-3.5 w-3.5 mr-1.5 inline' />Deactivate</>
                      : <><CheckCircle2 className='h-3.5 w-3.5 mr-1.5 inline' />Approve</>
                    }
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
