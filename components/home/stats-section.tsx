'use client'

import { useEffect, useState, useRef } from 'react'
import { Star, Users, BookOpen } from 'lucide-react'

type Stats = {
  totalTutors: number
  totalBookings: number
  avgRating: number
}

function useCountUp(target: number, duration = 1800) {
  const [count, setCount] = useState(0)
  const startRef = useRef<number | null>(null)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    if (target === 0) return
    startRef.current = null

    const step = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp
      const progress = Math.min((timestamp - startRef.current) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setCount(Math.floor(eased * target))
      if (progress < 1) frameRef.current = requestAnimationFrame(step)
    }

    frameRef.current = requestAnimationFrame(step)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [target, duration])

  return count
}

function StatCard({
  icon,
  label,
  value,
  suffix,
}: {
  icon: React.ReactNode
  label: string
  value: number
  suffix?: string
}) {
  const animated = useCountUp(value)
  return (
    <div className='p-6 rounded-2xl bg-card border border-border hover:border-muted-foreground/30 transition-all hover:bg-card/80 duration-300 group'>
      <div className='flex justify-center mb-2 transition-transform duration-300 group-hover:scale-110'>
        {icon}
      </div>
      <p className='text-3xl font-extrabold text-foreground tracking-tight'>
        {animated}
        {suffix}
      </p>
      <p className='text-sm text-muted-foreground mt-1 font-medium'>{label}</p>
    </div>
  )
}

export default function StatsSection() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, '') ?? ''
    fetch(`${apiBase}/api/stats`)
      .then((r) => r.json())
      .then((json) => setStats(json?.data ?? null))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const tutors = stats?.totalTutors ?? 0
  const sessions = stats?.totalBookings ?? 0
  const rating = stats?.avgRating ?? 0

  return (
    <section
      ref={ref}
      className='bg-muted/20 border-b border-border backdrop-blur-sm'
    >
      <div className='max-w-5xl mx-auto py-10 px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center'>
        {visible ? (
          <>
            <StatCard
              icon={<Users className='h-6 w-6 text-emerald-400 mx-auto' />}
              label='Expert Tutors'
              value={tutors}
              suffix='+'
            />
            <StatCard
              icon={<BookOpen className='h-6 w-6 text-cyan-400 mx-auto' />}
              label='Sessions Completed'
              value={sessions}
              suffix='+'
            />
            <StatCard
              icon={<Star className='h-6 w-6 text-amber-400 mx-auto' />}
              label='Average Rating'
              value={parseFloat(rating.toFixed(1))}
              suffix=' ★'
            />
          </>
        ) : (
          // Skeleton until intersection
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className='p-6 rounded-2xl bg-muted border border-border animate-pulse h-32' />
          ))
        )}
      </div>
    </section>
  )
}
