import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Star, Users, BookOpen } from 'lucide-react'
import { FeaturedTutors } from '@/components/featured-tutors'
import HeroSearchForm from '@/components/hero-search-form'

export default function HomePage() {
  return (
    <div className='bg-slate-950 text-slate-100 min-h-screen'>
      {/* Hero */}
      <section className='relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950 via-slate-950 to-slate-950 text-white py-28 px-6 text-center overflow-hidden border-b border-white/5'>
        {/* Glow decoration */}
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none' />
        <div className='absolute top-1/4 left-1/3 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none' />

        <div className='max-w-4xl mx-auto space-y-6 relative z-10'>
          <span className='inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full animate-pulse'>
            ⚡ SkillBridge Platform
          </span>
          <h1 className='text-5xl md:text-6xl font-extrabold leading-tight tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent'>
            Connect with Expert Tutors,<br /><span className='bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent'>Learn Anything</span>
          </h1>
          <p className='text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed'>
            Browse hundreds of verified tutors, book instant sessions, and unlock your potential with custom learning schedules.
          </p>

          <HeroSearchForm />

          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center pt-2'>
            <Button asChild size='lg' className='text-base px-8 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.02] border-0'>
              <Link href='/tutors'>Browse Tutors</Link>
            </Button>
            <Button asChild size='lg' variant='outline' className='text-base px-8 border-slate-800 text-white bg-slate-900/50 hover:bg-slate-800/80 hover:text-white transition-all duration-300 hover:scale-[1.02]'>
              <Link href='/register'>Get Started Free</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className='bg-slate-900/40 border-b border-white/5 backdrop-blur-sm'>
        <div className='max-w-5xl mx-auto py-10 px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center'>
          {[
            { icon: <Users className='h-6 w-6 text-emerald-400 mx-auto mb-2' />, label: 'Expert Tutors', value: '500+' },
            { icon: <BookOpen className='h-6 w-6 text-cyan-400 mx-auto mb-2' />, label: 'Sessions Completed', value: '12,000+' },
            { icon: <Star className='h-6 w-6 text-amber-400 mx-auto mb-2' />, label: 'Average Rating', value: '4.8 ★' },
          ].map((s) => (
            <div key={s.label} className='p-6 rounded-2xl bg-slate-900/30 border border-white/5 hover:border-slate-850 transition-all hover:bg-slate-900/60 duration-300'>
              {s.icon}
              <p className='text-3xl font-extrabold text-white tracking-tight'>{s.value}</p>
              <p className='text-sm text-slate-450 mt-1 font-medium'>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Tutors section */}
      <FeaturedTutors />

      {/* How it works */}
      <section className='max-w-5xl mx-auto py-24 px-6'>
        <div className='text-center max-w-2xl mx-auto mb-16'>
          <h2 className='text-3xl md:text-4xl font-extrabold text-white tracking-tight'>How It Works</h2>
          <p className='text-slate-400 mt-3 font-light'>Start your learning journey in three simple steps.</p>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-8'>
          {[
            { step: '01', title: 'Browse Tutors', desc: 'Search by subject, price, and rating to find the perfect match.' },
            { step: '02', title: 'Book a Session', desc: 'Pick an available slot and confirm your booking instantly.' },
            { step: '03', title: 'Learn & Review', desc: 'Attend your session and leave a review to help others.' },
          ].map((item) => (
            <div key={item.step} className='group relative p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-white/5 hover:border-indigo-500/30 transition-all duration-300 hover:scale-[1.02]'>
              <div className='absolute top-4 right-4 text-3xl font-black text-slate-800/40 group-hover:text-indigo-500/20 transition-colors duration-300'>{item.step}</div>
              <div className='h-12 w-12 rounded-xl bg-indigo-500/10 text-indigo-300 font-bold text-lg flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 group-hover:text-indigo-200 transition-colors duration-300'>
                {parseInt(item.step)}
              </div>
              <h3 className='font-bold text-xl text-white mb-2 group-hover:text-indigo-300 transition-colors duration-300'>{item.title}</h3>
              <p className='text-sm text-slate-400 leading-relaxed font-light'>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className='relative bg-gradient-to-r from-emerald-600 to-cyan-600 text-slate-950 py-20 px-6 text-center overflow-hidden'>
        <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff0c_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0c_1px,transparent_1px)] bg-[size:24px_24px]' />
        <div className='relative z-10 max-w-2xl mx-auto space-y-6'>
          <h2 className='text-4xl font-black tracking-tight text-white'>Ready to start learning?</h2>
          <p className='text-emerald-100 max-w-md mx-auto text-lg font-light'>Join thousands of students already unlocking new skills on SkillBridge.</p>
          <Button asChild size='lg' className='bg-slate-950 hover:bg-slate-900 text-white font-bold px-8 py-6 rounded-xl transition-all duration-300 hover:scale-[1.03] shadow-xl shadow-slate-950/20 border-0'>
            <Link href='/register'>Create a Free Account</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
