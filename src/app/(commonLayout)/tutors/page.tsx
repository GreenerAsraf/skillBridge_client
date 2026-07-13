'use client'

import { Suspense, useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { apiFetch } from '@/lib/api'
import { Star, Search, SlidersHorizontal, Filter, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type Tutor = {
  id: string
  bio?: string
  hourlyPrice?: number
  subject?: string[]
  user?: { name: string; email: string; image?: string }
  category?: { name: string }
  categories?: Array<{ name: string }>
  _count?: { reviews: number }
  rating?: number
}

type Category = { id: string; name: string }
type SortOption = 'default' | 'rating-desc' | 'price-asc' | 'price-desc'

const PAGE_SIZE = 9

/**
 * Inner component that reads URL search params — must be wrapped in <Suspense>.
 */
function BrowseTutorsInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Derive initial state from URL params
  const [tutors, setTutors] = useState<Tutor[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [debouncedSearch, setDebouncedSearch] = useState(search)
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') ?? 'ALL')
  const [sortBy, setSortBy] = useState<SortOption>((searchParams.get('sort') as SortOption) ?? 'default')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '')
  const [page, setPage] = useState(Number(searchParams.get('page') ?? '1'))

  // Debounce search input
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 400)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [search])

  // Load categories once
  useEffect(() => {
    apiFetch<{ data: Category[] }>('/api/categories')
      .then((r) => setCategories(r.data ?? []))
      .catch(() => {})
  }, [])

  // Fetch tutors whenever filters change
  const fetchTutors = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (debouncedSearch) params.set('searchTerm', debouncedSearch)
    if (selectedCategory !== 'ALL') params.set('categoryId', selectedCategory)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (sortBy !== 'default') params.set('sortBy', sortBy)
    params.set('page', String(page))
    params.set('limit', String(PAGE_SIZE))

    apiFetch<{ data: Tutor[]; meta?: { total: number } }>(`/api/tutors?${params.toString()}`)
      .then((r) => {
        setTutors(r.data ?? [])
        setTotal(r.meta?.total ?? r.data?.length ?? 0)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [debouncedSearch, selectedCategory, minPrice, maxPrice, sortBy, page])

  useEffect(() => { fetchTutors() }, [fetchTutors])

  // Sync URL without navigation
  useEffect(() => {
    const p = new URLSearchParams()
    if (debouncedSearch) p.set('search', debouncedSearch)
    if (selectedCategory !== 'ALL') p.set('category', selectedCategory)
    if (sortBy !== 'default') p.set('sort', sortBy)
    if (minPrice) p.set('minPrice', minPrice)
    if (maxPrice) p.set('maxPrice', maxPrice)
    if (page > 1) p.set('page', String(page))
    router.replace(`/tutors?${p.toString()}`, { scroll: false })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, selectedCategory, sortBy, minPrice, maxPrice, page])

  const totalPages = Math.ceil(total / PAGE_SIZE) || 1
  const hasFilters = debouncedSearch || selectedCategory !== 'ALL' || sortBy !== 'default' || minPrice || maxPrice

  function clearAll() {
    setSearch('')
    setDebouncedSearch('')
    setSelectedCategory('ALL')
    setSortBy('default')
    setMinPrice('')
    setMaxPrice('')
    setPage(1)
  }

  return (
    <div className='min-h-screen bg-background text-foreground transition-colors duration-300'>
      {/* Header banner */}
      <div className='border-b border-border bg-slate-100 dark:bg-muted/30 py-10 px-6'>
        <div className='max-w-5xl mx-auto'>
          <h1 className='text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight'>Browse Tutors</h1>
          <p className='text-slate-600 dark:text-slate-400 mt-1.5 text-sm font-light'>
            Find the perfect tutor by subject, category, or name.{' '}
            <span className='text-slate-500'>
              {!loading && `${total} tutor${total !== 1 ? 's' : ''} available`}
            </span>
          </p>
        </div>
      </div>

      <div className='max-w-5xl mx-auto py-8 px-6 space-y-6'>
        {/* Filters bar */}
        <div className='flex flex-col sm:flex-row gap-3 flex-wrap'>
          {/* Search */}
          <div className='relative flex-1 min-w-[200px]'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500' />
            <Input
              id='tutor-search'
              className='pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-indigo-500/30'
              placeholder='Search by name or subject…'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category filter */}
          <div className='relative'>
            <Filter className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none' />
            <select
              id='category-filter'
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setPage(1) }}
              className='flex h-9 w-full sm:w-48 rounded-md border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 pl-9 pr-8 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500/30 appearance-none cursor-pointer'
            >
              <option className='bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100' value='ALL'>All Categories</option>
              {categories.map((c) => (
                <option className='bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100' key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Price range */}
          <div className='flex gap-2 items-center'>
            <Input
              id='min-price'
              type='number'
              placeholder='Min $'
              value={minPrice}
              onChange={(e) => { setMinPrice(e.target.value); setPage(1) }}
              className='w-20 bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500'
            />
            <span className='text-slate-400 dark:text-slate-600 text-sm'>–</span>
            <Input
              id='max-price'
              type='number'
              placeholder='Max $'
              value={maxPrice}
              onChange={(e) => { setMaxPrice(e.target.value); setPage(1) }}
              className='w-20 bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500'
            />
          </div>

          {/* Sort */}
          <div className='relative'>
            <SlidersHorizontal className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none' />
            <select
              id='sort-filter'
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value as SortOption); setPage(1) }}
              className='flex h-9 w-full sm:w-52 rounded-md border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 pl-9 pr-8 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500/30 appearance-none cursor-pointer'
            >
              <option className='bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100' value='default'>Sort: Default</option>
              <option className='bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100' value='rating-desc'>Rating (High → Low)</option>
              <option className='bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100' value='price-asc'>Price (Low → High)</option>
              <option className='bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100' value='price-desc'>Price (High → Low)</option>
            </select>
          </div>
        </div>

        {/* Active filter chips */}
        {hasFilters && (
          <div className='flex flex-wrap gap-2 items-center'>
            <span className='text-xs text-slate-500'>Active filters:</span>
            {debouncedSearch && (
              <Chip label={`"${debouncedSearch}"`} onRemove={() => { setSearch(''); setDebouncedSearch('') }} />
            )}
            {selectedCategory !== 'ALL' && (
              <Chip
                label={categories.find((c) => c.id === selectedCategory)?.name ?? selectedCategory}
                onRemove={() => setSelectedCategory('ALL')}
                color='indigo'
              />
            )}
            {(minPrice || maxPrice) && (
              <Chip
                label={`$${minPrice || '0'} – $${maxPrice || '∞'}`}
                onRemove={() => { setMinPrice(''); setMaxPrice('') }}
                color='emerald'
              />
            )}
            {sortBy !== 'default' && (
              <Chip
                label={sortBy === 'rating-desc' ? 'Rating ↓' : sortBy === 'price-asc' ? 'Price ↑' : 'Price ↓'}
                onRemove={() => setSortBy('default')}
                color='purple'
              />
            )}
            <button
              onClick={clearAll}
              className='text-xs text-slate-500 underline hover:text-slate-300 transition-colors'
            >
              Clear all
            </button>
          </div>
        )}

        {/* Tutors Grid */}
        {loading ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div key={i} className='h-52 rounded-xl bg-slate-200 dark:bg-slate-900 animate-pulse' />
            ))}
          </div>
        ) : tutors.length === 0 ? (
          <div className='text-center py-24 space-y-3'>
            <p className='text-4xl'>🔍</p>
            <p className='text-slate-600 dark:text-slate-400 font-medium'>No tutors found for these filters.</p>
            <button onClick={clearAll} className='text-sm text-indigo-500 dark:text-indigo-400 underline hover:text-indigo-600 dark:hover:text-indigo-300'>
              Clear filters
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
            {tutors.map((t) => (
              <TutorCard key={t.id} tutor={t} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className='flex items-center justify-center gap-2 pt-4'>
            <Button
              id='prev-page'
              variant='outline'
              size='sm'
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className='border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 disabled:opacity-30'
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1
              const isActive = p === page
              if (totalPages > 7 && Math.abs(p - page) > 2 && p !== 1 && p !== totalPages) return null
              return (
                <Button
                  key={p}
                  id={`page-${p}`}
                  variant={isActive ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => setPage(p)}
                  className={
                    isActive
                      ? 'bg-indigo-600 hover:bg-indigo-500 border-indigo-600 text-white'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                  }
                >
                  {p}
                </Button>
              )
            })}

            <Button
              id='next-page'
              variant='outline'
              size='sm'
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className='border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 disabled:opacity-30'
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Page wrapper — useSearchParams() inside BrowseTutorsInner requires Suspense.
 * This satisfies the Next.js static prerender requirement.
 */
export default function BrowseTutorsPage() {
  return (
    <Suspense fallback={
      <div className='min-h-screen bg-background'>
        <div className='border-b border-border bg-slate-100 dark:bg-muted/30 py-10 px-6'>
          <div className='max-w-5xl mx-auto'>
            <div className='h-9 w-48 rounded-lg bg-muted animate-pulse mb-2' />
            <div className='h-4 w-72 rounded bg-muted animate-pulse' />
          </div>
        </div>
        <div className='max-w-5xl mx-auto py-8 px-6'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className='h-52 rounded-xl bg-muted animate-pulse' />
            ))}
          </div>
        </div>
      </div>
    }>
      <BrowseTutorsInner />
    </Suspense>
  )
}

function Chip({
  label,
  onRemove,
  color = 'slate',
}: {
  label: string
  onRemove: () => void
  color?: 'slate' | 'indigo' | 'purple' | 'emerald'
}) {
  const colorMap = {
    slate: 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
    indigo: 'bg-indigo-100 text-indigo-800 border border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-900/50',
    purple: 'bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-900/50',
    emerald: 'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900/50',
  }
  return (
    <span className={`inline-flex items-center gap-1 text-xs rounded-full px-2.5 py-1 font-medium ${colorMap[color]}`}>
      {label}
      <button onClick={onRemove} className='hover:text-red-400 ml-0.5 transition-colors'>
        <X className='h-3 w-3' />
      </button>
    </span>
  )
}

function TutorCard({ tutor: t }: { tutor: Tutor }) {
  return (
    <Link
      href={`/tutors/${t.id}`}
      className='block rounded-xl border border-slate-200 bg-white hover:bg-slate-50 dark:border-white/5 dark:bg-slate-900/50 dark:hover:bg-slate-900 dark:hover:border-slate-700 hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-black/20 transition-all duration-300 p-5 space-y-3 group'
    >
      {/* Avatar + name */}
      <div className='flex items-center gap-3'>
        {t.user?.image ? (
          <Image
            src={t.user.image}
            alt={t.user?.name ?? 'Tutor'}
            width={40}
            height={40}
            loading='lazy'
            className='h-10 w-10 rounded-full object-cover shadow-md group-hover:scale-110 transition-transform duration-300'
          />
        ) : (
          <div className='h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-md group-hover:scale-110 transition-transform duration-300'>
            {(t.user?.name ?? '?')[0].toUpperCase()}
          </div>
        )}
        <div>
          <p className='font-semibold text-sm text-slate-900 dark:text-slate-100 group-hover:text-black dark:group-hover:text-white'>{t.user?.name ?? 'Tutor'}</p>
          {(t.category || t.categories?.[0]) && (
            <p className='text-xs text-slate-500 dark:text-slate-400'>{t.category?.name ?? t.categories?.[0]?.name}</p>
          )}
        </div>
      </div>

      {/* Subjects */}
      {t.subject && t.subject.length > 0 && (
        <div className='flex flex-wrap gap-1'>
          {t.subject.slice(0, 4).map((s) => (
            <span key={s} className='text-[10px] bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-white/5 rounded-full px-2.5 py-0.5'>
              {s}
            </span>
          ))}
          {t.subject.length > 4 && (
            <span className='text-[10px] text-slate-500'>+{t.subject.length - 4} more</span>
          )}
        </div>
      )}

      {/* Bio */}
      {t.bio && (
        <p className='text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed'>{t.bio}</p>
      )}

      {/* Rate + rating */}
      <div className='flex items-center justify-between text-xs pt-1 border-t border-slate-200 dark:border-white/5'>
        <span className='font-semibold text-sm text-slate-800 dark:text-slate-200'>
          {t.hourlyPrice != null ? `$${t.hourlyPrice}/hr` : 'Price N/A'}
        </span>
        <span className='flex items-center gap-1 text-amber-400'>
          <Star className='h-3 w-3 fill-amber-400 stroke-amber-400' />
          {t.rating != null ? t.rating.toFixed(1) : 'New'}
          {t._count?.reviews != null && (
            <span className='text-slate-500'>({t._count.reviews})</span>
          )}
        </span>
      </div>
    </Link>
  )
}
