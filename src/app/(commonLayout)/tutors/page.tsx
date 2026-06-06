'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { apiFetch } from '@/lib/api'
import { Star, Search, SlidersHorizontal, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type Tutor = {
  id: string
  bio?: string
  hourlyPrice?: number
  subject?: string[]
  user?: { name: string; email: string }
  category?: { name: string }
  categories?: Array<{ name: string }>
  _count?: { reviews: number }
  rating?: number
}

type Category = { id: string; name: string }

type SortOption = 'default' | 'rating-desc' | 'price-asc' | 'price-desc'

export default function BrowseTutorsPage() {
  const [tutors, setTutors] = useState<Tutor[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [sortBy, setSortBy] = useState<SortOption>('default')

  useEffect(() => {
    Promise.all([
      apiFetch<{ data: Tutor[] }>('/api/tutors'),
      apiFetch<{ data: Category[] }>('/api/categories').catch(() => ({ data: [] as Category[] })),
    ])
      .then(([tutorRes, catRes]) => {
        setTutors(tutorRes.data ?? [])
        setCategories(catRes.data ?? [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Filter by search + category
  const filtered = tutors
    .filter((t) => {
      const name = t.user?.name?.toLowerCase() ?? ''
      const subjects = t.subject?.join(' ').toLowerCase() ?? ''
      const q = search.toLowerCase()
      const matchesSearch = name.includes(q) || subjects.includes(q)

      const tutorCategory = t.category?.name ?? t.categories?.[0]?.name ?? ''
      const matchesCategory =
        selectedCategory === 'ALL' || tutorCategory === selectedCategory

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating-desc':
          return (b.rating ?? 0) - (a.rating ?? 0)
        case 'price-asc':
          return (a.hourlyPrice ?? 0) - (b.hourlyPrice ?? 0)
        case 'price-desc':
          return (b.hourlyPrice ?? 0) - (a.hourlyPrice ?? 0)
        default:
          return 0
      }
    })

  return (
    <div className='max-w-5xl mx-auto py-10 px-4 space-y-8 bg-slate-950'>
      <div>
        <h1 className='text-3xl font-bold'>Browse Tutors</h1>
        <p className='text-muted-foreground mt-1 text-sm'>Find the perfect tutor by subject, category, or name.</p>
      </div>

      {/* Filters bar */}
      <div className='flex flex-col sm:flex-row gap-3'>
        {/* Search */}
        <div className='relative flex-1 max-w-md'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            className='pl-9'
            placeholder='Search by name or subject…'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category filter */}
        <div className='relative'>
          <Filter className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none' />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className='flex h-9 w-full sm:w-48 rounded-md border border-slate-850 bg-slate-900 text-slate-100 pl-9 pr-8 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring appearance-none cursor-pointer'
          >
            <option className='bg-slate-900 text-slate-100' value='ALL'>All Categories</option>
            {categories.map((c) => (
              <option className='bg-slate-900 text-slate-100' key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className='relative'>
          <SlidersHorizontal className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none' />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className='flex h-9 w-full sm:w-52 rounded-md border border-slate-850 bg-slate-900 text-slate-100 pl-9 pr-8 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring appearance-none cursor-pointer'
          >
            <option className='bg-slate-900 text-slate-100' value='default'>Sort: Default</option>
            <option className='bg-slate-900 text-slate-100' value='rating-desc'>Rating (High → Low)</option>
            <option className='bg-slate-900 text-slate-100' value='price-asc'>Price (Low → High)</option>
            <option className='bg-slate-900 text-slate-100' value='price-desc'>Price (High → Low)</option>
          </select>
        </div>
      </div>

      {/* Active filters */}
      {(selectedCategory !== 'ALL' || sortBy !== 'default' || search) && (
        <div className='flex flex-wrap gap-2 items-center'>
          <span className='text-xs text-muted-foreground'>Active filters:</span>
          {search && (
            <span className='inline-flex items-center gap-1 text-xs bg-slate-800 text-slate-200 rounded-full px-2.5 py-1 font-medium'>
              Search: "{search}"
              <button onClick={() => setSearch('')} className='hover:text-destructive ml-0.5'>×</button>
            </span>
          )}
          {selectedCategory !== 'ALL' && (
            <span className='inline-flex items-center gap-1 text-xs bg-indigo-950 text-indigo-300 border border-indigo-900/50 rounded-full px-2.5 py-1 font-medium'>
              {selectedCategory}
              <button onClick={() => setSelectedCategory('ALL')} className='hover:text-destructive ml-0.5'>×</button>
            </span>
          )}
          {sortBy !== 'default' && (
            <span className='inline-flex items-center gap-1 text-xs bg-purple-950 text-purple-300 border border-purple-900/50 rounded-full px-2.5 py-1 font-medium'>
              {sortBy === 'rating-desc' ? 'Rating ↓' : sortBy === 'price-asc' ? 'Price ↑' : 'Price ↓'}
              <button onClick={() => setSortBy('default')} className='hover:text-destructive ml-0.5'>×</button>
            </span>
          )}
          <button
            onClick={() => { setSearch(''); setSelectedCategory('ALL'); setSortBy('default') }}
            className='text-xs text-muted-foreground underline hover:text-foreground'
          >
            Clear all
          </button>
        </div>
      )}

      {/* Results count */}
      <p className='text-xs text-muted-foreground'>
        {loading ? 'Loading…' : `${filtered.length} tutor${filtered.length !== 1 ? 's' : ''} found`}
      </p>

      {loading ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className='h-48 rounded-xl bg-slate-900 animate-pulse' />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className='text-muted-foreground'>No tutors found.</p>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          {filtered.map((t) => (
            <Link
              key={t.id}
              href={`/tutors/${t.id}`}
              className='block rounded-xl border border-slate-850 bg-slate-900/50 hover:bg-slate-900 hover:border-slate-700 hover:shadow-lg transition-all duration-300 p-5 space-y-3'
            >
              {/* Avatar */}
              <div className='flex items-center gap-3'>
                <div className='h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-md'>
                  {(t.user?.name ?? '?')[0].toUpperCase()}
                </div>
                <div>
                  <p className='font-semibold text-sm text-slate-100'>{t.user?.name ?? 'Tutor'}</p>
                  {(t.category || t.categories?.[0]) && (
                    <p className='text-xs text-slate-400'>{t.category?.name ?? t.categories?.[0]?.name}</p>
                  )}
                </div>
              </div>

              {/* Subjects */}
              {t.subject && t.subject.length > 0 && (
                <div className='flex flex-wrap gap-1'>
                  {t.subject.slice(0, 4).map((s) => (
                    <span key={s} className='text-[10px] bg-slate-800 text-slate-300 border border-white/5 rounded-full px-2.5 py-0.5'>{s}</span>
                  ))}
                </div>
              )}

              {/* Bio */}
              {t.bio && (
                <p className='text-xs text-slate-400 line-clamp-2 leading-relaxed'>{t.bio}</p>
              )}

              {/* Rate + rating */}
              <div className='flex items-center justify-between text-xs pt-1 border-t border-white/5'>
                <span className='font-semibold text-sm text-slate-200'>
                  {t.hourlyPrice != null ? `$${t.hourlyPrice}/hr` : 'Price N/A'}
                </span>
                <span className='flex items-center gap-1 text-amber-400'>
                  <Star className='h-3 w-3 fill-amber-400 stroke-amber-400' />
                  {t.rating != null ? t.rating.toFixed(1) : 'New'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
