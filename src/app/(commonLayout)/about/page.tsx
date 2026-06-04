import { BookOpen, Shield, Globe, Award } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function AboutPage() {
  return (
    <div className='bg-slate-950 text-slate-100 min-h-screen py-20 px-6'>
      <div className='max-w-4xl mx-auto space-y-16'>
        {/* Header */}
        <div className='text-center space-y-4'>
          <span className='inline-block text-xs font-semibold tracking-widest uppercase bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full'>
            Our Journey
          </span>
          <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-450 bg-clip-text text-transparent'>
            Bridging the gap between<br />Knowledge & Learners
          </h1>
          <p className='text-slate-400 font-light max-w-xl mx-auto leading-relaxed text-sm md:text-base'>
            SkillBridge was founded on a simple principle: high-quality, personalized education should be accessible instantly, anywhere in the world.
          </p>
        </div>

        {/* Vision & Mission */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <Card className='border-slate-800 bg-slate-900/30 backdrop-blur-sm'>
            <CardContent className='p-8 space-y-3'>
              <h2 className='text-xl font-bold text-white flex items-center gap-2'>
                <span className='h-2 w-2 rounded-full bg-emerald-400' />
                Our Mission
              </h2>
              <p className='text-sm text-slate-400 font-light leading-relaxed'>
                To empower learners by matching them with verified expert mentors who can provide tailored 1-on-1 tutoring, helping students accelerate their understanding and reach their goals.
              </p>
            </CardContent>
          </Card>

          <Card className='border-slate-800 bg-slate-900/30 backdrop-blur-sm'>
            <CardContent className='p-8 space-y-3'>
              <h2 className='text-xl font-bold text-white flex items-center gap-2'>
                <span className='h-2 w-2 rounded-full bg-cyan-400' />
                Our Vision
              </h2>
              <p className='text-sm text-slate-400 font-light leading-relaxed'>
                A world where anybody can pick up a new skill, ace a tough exam, or master a programming language by instantly connecting with the perfect mentor who matches their learning style.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Core Values */}
        <div className='space-y-8'>
          <h2 className='text-2xl font-bold text-center text-white'>Core Values We Stand By</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6'>
            {[
              { icon: <BookOpen className='h-5 w-5 text-emerald-400' />, title: 'Curiosity First', desc: 'Encouraging lifelong learning and exploration.' },
              { icon: <Shield className='h-5 w-5 text-cyan-400' />, title: 'Vetted Quality', desc: 'All tutors undergo strict background and skill checks.' },
              { icon: <Globe className='h-5 w-5 text-indigo-400' />, title: 'Global Reach', desc: 'Connecting students and experts from all continents.' },
              { icon: <Award className='h-5 w-5 text-amber-400' />, title: 'Trust & Safety', desc: 'Secure booking systems and authenticated reviews.' }
            ].map((v, i) => (
              <div key={i} className='p-6 rounded-xl bg-slate-900/20 border border-white/5 space-y-3 text-center sm:text-left'>
                <div className='h-10 w-10 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center mx-auto sm:mx-0'>
                  {v.icon}
                </div>
                <h3 className='font-semibold text-white text-sm'>{v.title}</h3>
                <p className='text-xs text-slate-400 font-light leading-relaxed'>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
