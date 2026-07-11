import Link from 'next/link'
import { Star, CheckCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Tutor = {
  id: string
  bio?: string
  hourlyPrice?: number
  subject?: string[]
  user?: { name: string }
  category?: { name: string }
  categories?: Array<{ name: string }>
  rating?: number
  _count?: { reviews: number }
}

async function fetchFeaturedTutors(): Promise<Tutor[]> {
  const apiBase = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, '') ?? ''
  if (!apiBase) return []

  try {
    const res = await fetch(`${apiBase}/api/tutors`, { next: { revalidate: 60 } })
    if (!res.ok) return []

    const json = await res.json()
    const tutors: Tutor[] = json.data ?? []

    return [...tutors]
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      .slice(0, 2)
  } catch {
    return []
  }
}

/**
 * FeaturedTutors displays top-rated educators on the landing page.
 */
export async function FeaturedTutors() {
  const featuredTutors = await fetchFeaturedTutors()

  return (
    <section className='border-t border-white/5 bg-slate-950 py-24 px-6 relative overflow-hidden'>
      <div className='absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none' />

      <div className='max-w-5xl mx-auto'>
        <div className='flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4'>
          <div>
            <span className='text-xs font-bold tracking-widest uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full'>
              Top Rated Educators
            </span>
            <h2 className='text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-3'>
              Learn from the best minds
            </h2>
            <p className='text-slate-400 mt-2 font-light max-w-xl'>
              Our featured tutors are industry experts, university professors, and elite teachers verified for excellence.
            </p>
          </div>
          <Button asChild variant='ghost' className='text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/5 group text-sm self-start md:self-auto font-medium'>
            <Link href='/tutors' className='flex items-center gap-1.5'>
              See all tutors
              <ArrowRight className='h-4 w-4 group-hover:translate-x-1 transition-transform' />
            </Link>
          </Button>
        </div>

        {featuredTutors.length === 0 ? (
          <p className='text-sm text-slate-400 text-center py-8'>
            No tutors available yet.{' '}
            <Link href='/register' className='text-indigo-400 underline hover:text-indigo-300'>
              Become a tutor
            </Link>{' '}
            or check back soon.
          </p>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {featuredTutors.map((tutor) => {
              const name = tutor.user?.name ?? 'Tutor'
              const categoryName = tutor.category?.name ?? tutor.categories?.[0]?.name ?? 'General'
              const tags = tutor.subject?.slice(0, 3) ?? []
              const ratingLabel = tutor.rating != null ? tutor.rating.toFixed(1) : 'New'
              const priceLabel = tutor.hourlyPrice != null ? `$${tutor.hourlyPrice}` : 'N/A'

              return (
                <Link
                  key={tutor.id}
                  href={`/tutors/${tutor.id}`}
                  className='group relative flex flex-col sm:flex-row gap-6 p-6 rounded-2xl bg-card border border-border hover:border-border/70 transition-all duration-300 hover:bg-muted/30'
                >
                  <div className='relative w-full sm:w-36 h-48 sm:h-36 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center'>
                    <span className='text-4xl font-bold text-white'>
                      {name[0]?.toUpperCase() ?? '?'}
                    </span>
                    <span className='absolute bottom-2 right-2 bg-slate-950/85 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-white border border-white/5'>
                      {priceLabel}/hr
                    </span>
                  </div>

                  <div className='flex-1 flex flex-col justify-between space-y-4 sm:space-y-0'>
                    <div>
                      <div className='flex items-start justify-between'>
                        <div>
                          <h3 className='font-bold text-lg text-white group-hover:text-emerald-400 transition-colors duration-300 flex items-center gap-1.5'>
                            {name}
                            <CheckCircle className='h-4 w-4 text-emerald-400 fill-emerald-500/10' />
                          </h3>
                          <p className='text-xs text-indigo-300 font-semibold mt-0.5'>{categoryName}</p>
                        </div>
                        <div className='flex items-center gap-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-lg text-xs font-semibold'>
                          <Star className='h-3 w-3 fill-amber-300 text-amber-300' />
                          <span>{ratingLabel}</span>
                        </div>
                      </div>
                      <p className='text-xs text-slate-400 font-light mt-3 leading-relaxed line-clamp-3'>
                        {tutor.bio ?? 'Experienced tutor ready to help you learn.'}
                      </p>
                    </div>

                    {tags.length > 0 && (
                      <div className='flex flex-wrap gap-1.5 pt-3 sm:pt-0'>
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className='text-[10px] px-2 py-0.5 rounded-md bg-slate-800/60 text-slate-350 border border-white/5'
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
