'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Music,
  Calculator,
  Globe,
  Code2,
  BookOpen,
  Palette,
  Dumbbell,
  FlaskConical,
  Languages,
  BrainCircuit,
} from 'lucide-react'

type Category = {
  id: string
  name: string
  _count?: { tutorProfiles: number }
}

// Map category names (case-insensitive) to icons + gradient colors
const CATEGORY_META: Record<
  string,
  { icon: React.ElementType; gradient: string; bg: string }
> = {
  music: {
    icon: Music,
    gradient: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-500/10',
  },
  math: {
    icon: Calculator,
    gradient: 'from-blue-500 to-indigo-500',
    bg: 'bg-blue-500/10',
  },
  mathematics: {
    icon: Calculator,
    gradient: 'from-blue-500 to-indigo-500',
    bg: 'bg-blue-500/10',
  },
  language: {
    icon: Languages,
    gradient: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-500/10',
  },
  languages: {
    icon: Languages,
    gradient: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-500/10',
  },
  programming: {
    icon: Code2,
    gradient: 'from-violet-500 to-purple-500',
    bg: 'bg-violet-500/10',
  },
  coding: {
    icon: Code2,
    gradient: 'from-violet-500 to-purple-500',
    bg: 'bg-violet-500/10',
  },
  science: {
    icon: FlaskConical,
    gradient: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-500/10',
  },
  art: {
    icon: Palette,
    gradient: 'from-fuchsia-500 to-pink-500',
    bg: 'bg-fuchsia-500/10',
  },
  arts: {
    icon: Palette,
    gradient: 'from-fuchsia-500 to-pink-500',
    bg: 'bg-fuchsia-500/10',
  },
  fitness: {
    icon: Dumbbell,
    gradient: 'from-lime-500 to-green-500',
    bg: 'bg-lime-500/10',
  },
  english: {
    icon: Globe,
    gradient: 'from-sky-500 to-cyan-500',
    bg: 'bg-sky-500/10',
  },
  ai: {
    icon: BrainCircuit,
    gradient: 'from-indigo-500 to-blue-500',
    bg: 'bg-indigo-500/10',
  },
}

const DEFAULT_META = {
  icon: BookOpen,
  gradient: 'from-slate-500 to-slate-600',
  bg: 'bg-slate-500/10',
}

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, '') ?? ''
    fetch(`${apiBase}/api/categories`)
      .then((r) => r.json())
      .then((json) => setCategories(json?.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className='py-24 px-6 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950/80'>
      <div className='max-w-5xl mx-auto'>
        <div className='text-center max-w-2xl mx-auto mb-14'>
          <span className='inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full mb-4'>
            📚 Browse by Subject
          </span>
          <h2 className='text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight'>
            Explore Skill Categories
          </h2>
          <p className='text-slate-600 dark:text-slate-400 mt-3 font-light'>
            From music to mathematics — find experts in every domain.
          </p>
        </div>

        {loading ? (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className='h-28 rounded-2xl bg-muted animate-pulse'
              />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className='text-center text-slate-500'>No categories found.</p>
        ) : (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
            {categories.map((cat) => {
              const key = cat.name.toLowerCase()
              const meta = CATEGORY_META[key] ?? DEFAULT_META
              const Icon = meta.icon
              return (
                <Link
                  key={cat.id}
                  href={`/tutors?category=${encodeURIComponent(cat.name)}`}
                  className='group relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-border bg-card hover:border-border/60 hover:bg-muted/60 transition-all duration-300 hover:scale-[1.04] text-center overflow-hidden'
                >
                  {/* glow ring */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${meta.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}
                  />
                  <div
                    className={`h-12 w-12 rounded-xl ${meta.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon
                      className={`h-6 w-6 bg-gradient-to-br ${meta.gradient} bg-clip-text`}
                      strokeWidth={1.8}
                    />
                  </div>
                  <div>
                    <p className='font-semibold text-sm text-slate-900 dark:text-slate-100 group-hover:text-black dark:group-hover:text-white transition-colors'>
                      {cat.name}
                    </p>
                    {cat._count?.tutorProfiles != null && (
                      <p className='text-xs text-slate-500 mt-0.5'>
                        {cat._count.tutorProfiles} tutor
                        {cat._count.tutorProfiles !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        <div className='text-center mt-10'>
          <Link
            href='/tutors'
            className='inline-flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors group'
          >
            View all tutors
            <span className='transition-transform duration-200 group-hover:translate-x-1'>
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
