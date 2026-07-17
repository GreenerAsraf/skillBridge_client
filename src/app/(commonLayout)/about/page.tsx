import {
  BookOpen,
  Shield,
  Globe,
  Award,
  Users,
  Star,
  Zap,
  Target,
  Heart,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About NexaMentor - Our Mission & Story',
  description:
    'Learn how NexaMentor pairs ambitious learners with trusted mentors for focused, personalized progress.',
}

/* ── Static data ─────────────────────────────────────────── */

const stats = [
  { icon: Users,     value: '500+',    label: 'Expert Tutors' },
  { icon: BookOpen,  value: '12,000+', label: 'Sessions Completed' },
  { icon: Star,      value: '4.8 ★',   label: 'Average Rating' },
  { icon: Globe,     value: '40+',     label: 'Countries Reached' },
]

const values = [
  {
    icon: BookOpen,
    color: 'text-emerald-500 dark:text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    title: 'Curiosity First',
    desc: 'We believe the best learning starts with genuine curiosity. Our platform nurtures exploration and lifelong growth.',
  },
  {
    icon: Shield,
    color: 'text-cyan-500 dark:text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    title: 'Vetted Quality',
    desc: 'Every mentor on NexaMentor is reviewed for subject strength, communication, and reliability before meeting learners.',
  },
  {
    icon: Globe,
    color: 'text-indigo-500 dark:text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    title: 'Global Reach',
    desc: 'Students and tutors from every continent — no borders, no barriers, just world-class knowledge-sharing.',
  },
  {
    icon: Award,
    color: 'text-amber-500 dark:text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    title: 'Trust & Safety',
    desc: 'Secure payments, authenticated reviews, and encrypted sessions put safety at the heart of everything.',
  },
]

const team = [
  { name: 'Asraf Hossain',   role: 'Founder & CEO',          avatar: 'AH', grad: 'from-indigo-500 to-purple-600' },
  { name: 'Rima Khatun',     role: 'Head of Tutor Quality',  avatar: 'RK', grad: 'from-emerald-500 to-cyan-600'  },
  { name: 'Tanvir Ahmed',    role: 'Lead Engineer',           avatar: 'TA', grad: 'from-pink-500 to-rose-600'     },
  { name: 'Sadia Islam',     role: 'Design & UX',             avatar: 'SI', grad: 'from-amber-500 to-orange-600'  },
]

const timeline = [
  { year: '2022', event: 'NexaMentor founded to make personal mentorship easier to find and book.' },
  { year: '2023', event: 'Launched beta platform with 50 hand-picked tutors across 5 subjects.' },
  { year: '2024', event: 'Hit 5,000 sessions milestone and introduced live booking & payments.' },
  { year: '2025', event: 'Expanded to 40+ countries with 500+ verified expert tutors.' },
]

/* ── Page component ──────────────────────────────────────── */

export default function AboutPage() {
  return (
    <main className='bg-background text-foreground min-h-screen overflow-hidden page-fade-in transition-colors duration-300'>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className='relative py-28 px-6 text-center overflow-hidden border-b border-border'>
        {/* Glow blobs */}
        <div className='pointer-events-none absolute inset-0'>
          <div className='about-blob about-blob-1' />
          <div className='about-blob about-blob-2' />
          <div className='about-blob about-blob-3' />
        </div>
        {/* Grid */}
        <div className='pointer-events-none absolute inset-0 about-grid' />

        <div className='relative z-10 max-w-3xl mx-auto space-y-5'>
          <span className='about-badge'>
            ✦ Our Story
          </span>
          <h1 className='text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1]'>
            Bridging the gap between{' '}
            <span className='about-gradient-text'>Knowledge</span>
            {' & '}
            <span className='about-gradient-text-pink'>Learners</span>
          </h1>
          <p className='text-muted-foreground text-lg max-w-xl mx-auto font-light leading-relaxed'>
            NexaMentor was founded on a simple principle: learners move faster when expert guidance is easy to find, trust, and schedule.
          </p>
          <div className='flex flex-wrap gap-3 justify-center pt-2'>
            <Link href='/tutors' className='about-cta-primary'>
              <Zap className='h-4 w-4' /> Find a Tutor
            </Link>
            <Link href='/register' className='about-cta-secondary'>
              Join Free
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats strip ───────────────────────────────────── */}
      <section className='border-b border-border bg-muted/40 backdrop-blur-sm'>
        <div className='max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px'>
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className='about-stat-card group'>
              <Icon className='h-5 w-5 text-indigo-500 dark:text-indigo-400 mb-2 group-hover:scale-110 transition-transform duration-300' />
              <p className='text-2xl md:text-3xl font-black text-foreground'>{value}</p>
              <p className='text-xs text-muted-foreground mt-1 font-medium'>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission & Vision ──────────────────────────────── */}
      <section className='max-w-5xl mx-auto py-24 px-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Mission */}
          <div className='about-card about-card-emerald'>
            <span className='about-card-badge about-card-badge-emerald'>
              <Target className='h-3.5 w-3.5' /> Mission
            </span>
            <h2 className='text-xl font-bold text-foreground mt-4 mb-3'>
              Empower Every Learner
            </h2>
            <p className='text-sm text-muted-foreground font-light leading-relaxed'>
              To empower students by matching them with verified expert mentors who
              provide tailored 1-on-1 tutoring — helping them accelerate their
              understanding and reach their goals faster than they ever thought possible.
            </p>
            <ul className='mt-4 space-y-2'>
              {['Personalised learning paths', 'Instant session booking', 'Affordable pricing options'].map((item) => (
                <li key={item} className='flex items-center gap-2 text-xs text-muted-foreground'>
                  <CheckCircle2 className='h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400 flex-shrink-0' />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Vision */}
          <div className='about-card about-card-indigo'>
            <span className='about-card-badge about-card-badge-indigo'>
              <TrendingUp className='h-3.5 w-3.5' /> Vision
            </span>
            <h2 className='text-xl font-bold text-foreground mt-4 mb-3'>
              Education Without Borders
            </h2>
            <p className='text-sm text-muted-foreground font-light leading-relaxed'>
              A world where anyone can pick up a new skill, ace a tough exam, or master
              a programming language by instantly connecting with the perfect mentor who
              matches their learning style — regardless of where they live.
            </p>
            <ul className='mt-4 space-y-2'>
              {['40+ countries served', '500+ expert tutors', 'Multi-language support'].map((item) => (
                <li key={item} className='flex items-center gap-2 text-xs text-muted-foreground'>
                  <CheckCircle2 className='h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400 flex-shrink-0' />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Core Values ───────────────────────────────────── */}
      <section className='bg-muted/30 border-y border-border py-24 px-6'>
        <div className='max-w-5xl mx-auto'>
          <div className='text-center mb-14'>
            <span className='about-badge'>Core Values</span>
            <h2 className='mt-4 text-3xl md:text-4xl font-extrabold text-foreground tracking-tight'>
              What We Stand By
            </h2>
            <p className='text-muted-foreground mt-3 font-light max-w-xl mx-auto text-sm'>
              Every decision we make is guided by four principles that define the NexaMentor experience.
            </p>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
            {values.map(({ icon: Icon, color, bg, border, title, desc }) => (
              <div
                key={title}
                className={`about-value-card group border ${border}`}
              >
                <div className={`h-11 w-11 rounded-xl ${bg} ${border} border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <h3 className='font-semibold text-foreground text-sm mb-2'>{title}</h3>
                <p className='text-xs text-muted-foreground font-light leading-relaxed'>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ──────────────────────────────────────── */}
      <section className='max-w-3xl mx-auto py-24 px-6'>
        <div className='text-center mb-14'>
          <span className='about-badge'>Our Journey</span>
          <h2 className='mt-4 text-3xl md:text-4xl font-extrabold text-foreground tracking-tight'>
            How We Got Here
          </h2>
        </div>
        <ol className='relative border-l border-indigo-500/30 space-y-10 pl-6'>
          {timeline.map(({ year, event }) => (
            <li key={year} className='group'>
              <span className='absolute -left-[9px] flex h-4.5 w-4.5 items-center justify-center rounded-full bg-indigo-500/20 border border-indigo-500/40 ring-4 ring-background'>
                <span className='h-2 w-2 rounded-full bg-indigo-500 dark:bg-indigo-400' />
              </span>
              <time className='text-xs font-bold text-indigo-500 dark:text-indigo-400 tracking-widest uppercase'>{year}</time>
              <p className='mt-1 text-sm text-muted-foreground font-light leading-relaxed group-hover:text-foreground transition-colors duration-200'>
                {event}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Team ──────────────────────────────────────────── */}
      <section className='bg-muted/30 border-t border-border py-24 px-6'>
        <div className='max-w-5xl mx-auto'>
          <div className='text-center mb-14'>
            <span className='about-badge'>The People</span>
            <h2 className='mt-4 text-3xl md:text-4xl font-extrabold text-foreground tracking-tight'>
              Meet the Team
            </h2>
            <p className='text-muted-foreground mt-3 font-light max-w-lg mx-auto text-sm'>
              A small team with a big mission — passionate about reshaping how the world learns.
            </p>
          </div>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-5'>
            {team.map(({ name, role, avatar, grad }) => (
              <div key={name} className='about-team-card group'>
                <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center text-white text-xl font-bold shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {avatar}
                </div>
                <p className='font-semibold text-foreground text-sm'>{name}</p>
                <p className='text-xs text-muted-foreground mt-0.5'>{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className='relative py-24 px-6 overflow-hidden'>
        <div className='pointer-events-none absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-600/5 to-pink-600/10' />
        <div className='relative z-10 max-w-2xl mx-auto text-center space-y-5'>
          <Heart className='h-8 w-8 text-pink-500 dark:text-pink-400 mx-auto' />
          <h2 className='text-3xl md:text-4xl font-extrabold text-foreground tracking-tight'>
            Ready to start your journey?
          </h2>
          <p className='text-muted-foreground font-light'>
            Join learners already building confidence with NexaMentor.
          </p>
          <div className='flex flex-wrap gap-3 justify-center pt-2'>
            <Link href='/register' className='about-cta-primary'>
              <Zap className='h-4 w-4' /> Create Free Account
            </Link>
            <Link href='/tutors' className='about-cta-secondary'>
              Browse Tutors
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

