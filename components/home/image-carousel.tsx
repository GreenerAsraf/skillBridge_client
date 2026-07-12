'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Star, Award } from 'lucide-react'
import { apiFetch } from '@/lib/api'

type Tutor = {
  id: string
  bio?: string
  hourlyPrice?: number
  subject?: string[]
  user?: { name: string; email: string; image?: string }
  category?: { name: string }
  _count?: { reviews: number }
  rating?: number
}

// Static fallback teachers
const FALLBACK: Tutor[] = [
  {
    id: 'f1',
    user: { name: 'Dr. Sarah Chen', email: '', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop&crop=faces' },
    subject: ['Mathematics', 'Calculus'],
    hourlyPrice: 45,
    rating: 4.9,
    _count: { reviews: 128 },
    category: { name: 'STEM' },
  },
  {
    id: 'f2',
    user: { name: 'Prof. James Liu', email: '', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop&crop=faces' },
    subject: ['Physics', 'Mechanics'],
    hourlyPrice: 55,
    rating: 4.8,
    _count: { reviews: 94 },
    category: { name: 'Science' },
  },
  {
    id: 'f3',
    user: { name: 'Emma Rodriguez', email: '', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop&crop=faces' },
    subject: ['English', 'Writing'],
    hourlyPrice: 35,
    rating: 5.0,
    _count: { reviews: 212 },
    category: { name: 'Languages' },
  },
  {
    id: 'f4',
    user: { name: 'Alex Thompson', email: '', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop&crop=faces' },
    subject: ['Python', 'Data Science'],
    hourlyPrice: 60,
    rating: 4.7,
    _count: { reviews: 76 },
    category: { name: 'Technology' },
  },
  {
    id: 'f5',
    user: { name: 'Priya Sharma', email: '', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300&auto=format&fit=crop&crop=faces' },
    subject: ['Chemistry', 'Biology'],
    hourlyPrice: 40,
    rating: 4.9,
    _count: { reviews: 155 },
    category: { name: 'Science' },
  },
  {
    id: 'f6',
    user: { name: 'Marcus Johnson', email: '', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop&crop=faces' },
    subject: ['Music Theory', 'Piano'],
    hourlyPrice: 50,
    rating: 4.8,
    _count: { reviews: 63 },
    category: { name: 'Arts' },
  },
]

// Hue offsets for each card so rings have different colors
const HUE_OFFSETS = [0, 60, 120, 180, 240, 300]

function TeacherCard({ tutor, index }: { tutor: Tutor; index: number }) {
  const hue = HUE_OFFSETS[index % HUE_OFFSETS.length]
  const animDelay = `${(index % 6) * -0.5}s`
  const isExternal = tutor.id.startsWith('f')

  const initials = (tutor.user?.name ?? 'T')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const inner = (
    <div
      className='teacher-card-outer shrink-0'
      style={{ '--hue': `${hue}deg`, animationDelay: animDelay } as React.CSSProperties}
    >
      <div className='teacher-card-ring' />
      <div className='teacher-card-body'>
        {/* Avatar */}
        <div className='relative mx-auto w-fit'>
          {tutor.user?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={tutor.user.image}
              alt={tutor.user.name}
              className='w-[72px] h-[72px] rounded-full object-cover ring-2 ring-white/10 shadow-lg'
            />
          ) : (
            <div
              className='w-[72px] h-[72px] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg'
              style={{ background: `hsl(${hue}, 70%, 55%)` }}
            >
              {initials}
            </div>
          )}
          <span className='absolute -bottom-1 -right-1 bg-amber-400 rounded-full p-[3px] shadow-md'>
            <Award className='h-[10px] w-[10px] text-slate-900' />
          </span>
        </div>

        {/* Name & category */}
        <div className='mt-3 text-center'>
          <p className='font-bold text-sm text-white leading-snug'>{tutor.user?.name ?? 'Tutor'}</p>
          {tutor.category?.name && (
            <p className='text-[10px] text-slate-400 mt-0.5 tracking-wide'>{tutor.category.name}</p>
          )}
        </div>

        {/* Subject chips */}
        {tutor.subject && tutor.subject.length > 0 && (
          <div className='flex flex-wrap gap-1 justify-center mt-3'>
            {tutor.subject.slice(0, 2).map((s) => (
              <span
                key={s}
                className='text-[9px] bg-white/5 border border-white/10 text-slate-300 rounded-full px-2 py-0.5'
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Rating + price */}
        <div className='flex items-center justify-between w-full mt-auto pt-3 border-t border-white/8 text-xs'>
          <span className='flex items-center gap-0.5 text-amber-400 font-semibold'>
            <Star className='h-3 w-3 fill-amber-400 stroke-amber-400' />
            {tutor.rating != null ? tutor.rating.toFixed(1) : 'New'}
            {tutor._count?.reviews != null && (
              <span className='text-slate-500 font-normal ml-0.5'>({tutor._count.reviews})</span>
            )}
          </span>
          <span className='text-slate-300 font-medium'>
            {tutor.hourlyPrice != null ? `$${tutor.hourlyPrice}/hr` : ''}
          </span>
        </div>
      </div>
    </div>
  )

  return isExternal ? inner : (
    <Link href={`/tutors/${tutor.id}`} className='contents'>
      {inner}
    </Link>
  )
}

export default function BestTeachersCarousel() {
  const [tutors, setTutors] = useState<Tutor[]>(FALLBACK)

  useEffect(() => {
    apiFetch<{ data: Tutor[] }>('/api/tutors?limit=12&sortBy=rating-desc')
      .then((res) => {
        if (res.data && res.data.length >= 4) setTutors(res.data)
      })
      .catch(() => {/* keep fallback */})
  }, [])

  // Duplicate for seamless loop
  const items = [...tutors, ...tutors]

  return (
    <section className='relative w-full overflow-hidden bg-slate-950 py-14 border-b border-white/5'>
      {/* Ambient blobs */}
      <div className='absolute top-0 left-1/4 w-80 h-80 bg-violet-600/8 rounded-full blur-3xl pointer-events-none' />
      <div className='absolute bottom-0 right-1/3 w-80 h-80 bg-cyan-600/8 rounded-full blur-3xl pointer-events-none' />

      {/* Heading */}
      <div className='text-center mb-10 px-6 relative z-10'>
        <span className='inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.15em] uppercase bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1 rounded-full mb-3'>
          <Award className='h-3 w-3' /> Top Rated Tutors
        </span>
        <h2 className='text-2xl sm:text-3xl font-extrabold text-white tracking-tight'>
          Learn from the{' '}
          <span className='bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent'>
            Best Teachers
          </span>
        </h2>
        <p className='text-slate-400 text-sm mt-2 font-light'>
          Highly rated tutors trusted by thousands of students worldwide.
        </p>
      </div>

      {/* Edge fade masks */}
      <div className='absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none' />
      <div className='absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none' />

      {/* Scrolling track */}
      <div className='marquee-outer'>
        <div className='marquee-inner'>
          {items.map((t, i) => (
            <TeacherCard key={`${t.id}-${i}`} tutor={t} index={i} />
          ))}
        </div>
      </div>

      <style>{`
        /* ─── Marquee ──────────────────────────────────────── */
        .marquee-outer {
          width: 100%;
          overflow: hidden;
          padding: 12px 0 16px;
        }
        .marquee-inner {
          display: flex;
          gap: 20px;
          padding: 0 20px;
          width: max-content;
          animation: best-marquee 38s linear infinite;
        }
        .marquee-outer:hover .marquee-inner {
          animation-play-state: paused;
        }
        @keyframes best-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* ─── Card outer (the ring container) ─────────────── */
        .teacher-card-outer {
          position: relative;
          width: 195px;
          height: 255px;
          border-radius: 20px;
          padding: 2px;
          flex-shrink: 0;
          cursor: pointer;
        }
        /* Hover lift */
        .teacher-card-outer:hover {
          transform: translateY(-4px) scale(1.02);
          transition: transform 0.3s ease;
        }

        /* ─── Spinning conic-gradient ring ─────────────────── */
        .teacher-card-ring {
          position: absolute;
          inset: 0;
          border-radius: 20px;
          z-index: 0;
          background: conic-gradient(
            from 0deg,
            hsl(var(--hue), 90%, 60%),
            hsl(calc(var(--hue) + 90deg), 90%, 60%),
            hsl(calc(var(--hue) + 180deg), 90%, 60%),
            hsl(calc(var(--hue) + 270deg), 90%, 60%),
            hsl(var(--hue), 90%, 60%)
          );
          animation: ring-spin 3s linear infinite;
          filter: blur(1px) brightness(1.15);
        }
        @keyframes ring-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        /* ─── Inner card body ────────────────────────────────── */
        .teacher-card-body {
          position: relative;
          z-index: 1;
          inset: 2px;
          margin: 2px;
          height: calc(100% - 4px);
          border-radius: 18px;
          background: #0f172a;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 18px 14px 14px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
          transition: background 0.3s;
        }
        .teacher-card-outer:hover .teacher-card-body {
          background: #1e293b;
        }
      `}</style>
    </section>
  )
}
