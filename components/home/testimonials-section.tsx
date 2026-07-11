'use client'

import { useEffect, useState, useRef } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

type Review = {
  id: string
  rating: number
  comment?: string
  createdAt?: string
  student?: { name: string }
  tutor?: { user?: { name: string } }
}

// Fallback static testimonials for when DB is empty
const FALLBACK: Review[] = [
  {
    id: '1',
    rating: 5,
    comment:
      'SkillBridge completely changed how I learn. My math tutor made calculus click in just 3 sessions. Highly recommend!',
    student: { name: 'Aisha Rahman' },
    tutor: { user: { name: 'Prof. David Lee' } },
  },
  {
    id: '2',
    rating: 5,
    comment:
      'Found a guitar tutor within minutes. The booking system is seamless and my tutor is incredibly patient and talented.',
    student: { name: 'Marcus Chen' },
    tutor: { user: { name: 'Sofia Martinez' } },
  },
  {
    id: '3',
    rating: 5,
    comment:
      'I passed my IELTS exam with a 7.5 band score after just 2 months of sessions. Best investment in my education!',
    student: { name: 'Priya Sharma' },
    tutor: { user: { name: 'James O\'Brien' } },
  },
  {
    id: '4',
    rating: 5,
    comment:
      'The coding tutor I found here helped me land my first dev job. The personalized approach is simply unmatched.',
    student: { name: 'Tyler Brooks' },
    tutor: { user: { name: 'Dr. Mei Tanaka' } },
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className='flex gap-0.5'>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? 'fill-amber-400 stroke-amber-400' : 'stroke-slate-600'}`}
        />
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, '') ?? ''
    // Fetch top-rated reviews
    fetch(`${apiBase}/api/reviews?limit=6&sort=rating-desc`)
      .then((r) => r.json())
      .then((json) => {
        const data = json?.data ?? []
        setReviews(data.length >= 3 ? data : FALLBACK)
      })
      .catch(() => setReviews(FALLBACK))
      .finally(() => setLoading(false))
  }, [])

  // Auto-rotate every 5s
  useEffect(() => {
    if (reviews.length <= 1) return
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length)
    }, 5000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [reviews])

  function prev() {
    setActiveIndex((i) => (i - 1 + reviews.length) % reviews.length)
  }
  function next() {
    setActiveIndex((i) => (i + 1) % reviews.length)
  }

  const displayed = reviews.slice(0, 6)

  return (
    <section className='py-24 px-6 bg-muted/20 border-y border-border'>
      <div className='max-w-5xl mx-auto'>
        <div className='text-center max-w-2xl mx-auto mb-14'>
          <span className='inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase bg-amber-500/10 border border-amber-500/20 text-amber-300 px-3 py-1 rounded-full mb-4'>
            ⭐ Student Stories
          </span>
          <h2 className='text-3xl md:text-4xl font-extrabold text-foreground tracking-tight'>
            What Our Students Say
          </h2>
          <p className='text-muted-foreground mt-3 font-light'>
            Real results from real learners — see why thousands trust SkillBridge.
          </p>
        </div>

        {loading ? (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className='h-48 rounded-2xl bg-muted animate-pulse'
              />
            ))}
          </div>
        ) : (
          <>
            {/* Desktop: 3-column grid */}
            <div className='hidden md:grid grid-cols-3 gap-6'>
              {displayed.slice(0, 3).map((r) => (
                <TestimonialCard key={r.id} review={r} />
              ))}
            </div>

            {/* Mobile: carousel */}
            <div className='md:hidden relative'>
              <div className='overflow-hidden rounded-2xl'>
                <div
                  className='flex transition-transform duration-500 ease-out'
                  style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                >
                  {displayed.map((r) => (
                    <div key={r.id} className='w-full flex-shrink-0'>
                      <TestimonialCard review={r} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className='flex items-center justify-center gap-4 mt-6'>
                <button
                  onClick={prev}
                  className='p-2 rounded-full border border-border bg-card hover:bg-muted text-muted-foreground transition-colors'
                >
                  <ChevronLeft className='h-4 w-4' />
                </button>
                <div className='flex gap-1.5'>
                  {displayed.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === activeIndex
                          ? 'w-5 bg-emerald-400'
                          : 'w-1.5 bg-slate-600'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={next}
                  className='p-2 rounded-full border border-border bg-card hover:bg-muted text-muted-foreground transition-colors'
                >
                  <ChevronRight className='h-4 w-4' />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function TestimonialCard({ review }: { review: Review }) {
  const initials = review.student?.name
    ? review.student.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?'

  // Generate a stable color from name
  const colors = [
    'from-indigo-500 to-purple-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-pink-500 to-rose-500',
    'from-sky-500 to-cyan-500',
  ]
  const colorIndex =
    (review.student?.name?.charCodeAt(0) ?? 0) % colors.length

  return (
    <div className='relative flex flex-col gap-4 p-6 rounded-2xl border border-border bg-card hover:border-border/70 transition-all duration-300 hover:shadow-lg'>
      <Quote className='absolute top-5 right-5 h-8 w-8 text-white/5' />
      <StarRating rating={review.rating} />
      <p className='text-sm text-muted-foreground leading-relaxed font-light flex-1'>
        &ldquo;{review.comment || 'Great session! Highly recommend this tutor.'}&rdquo;
      </p>
      <div className='flex items-center gap-3 pt-2 border-t border-white/5'>
        <div
          className={`h-9 w-9 rounded-full bg-gradient-to-br ${colors[colorIndex]} flex items-center justify-center text-white text-xs font-bold shrink-0`}
        >
          {initials}
        </div>
        <div>
          <p className='text-sm font-medium text-slate-100'>
            {review.student?.name ?? 'Anonymous'}
          </p>
          {review.tutor?.user?.name && (
            <p className='text-xs text-slate-500'>
              Tutored by {review.tutor.user.name}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
