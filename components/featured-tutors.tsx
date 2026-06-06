import Link from 'next/link'
import { Star, CheckCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const FEATURED_TUTORS = [
  {
    id: 'tutor-1',
    name: 'Dr. Sarah Jenkins',
    image: '/tutor1.png',
    subject: 'Computer Science & AI',
    rating: '4.9',
    reviews: '142',
    price: '$45',
    bio: 'Former senior software engineer at Google, specializing in React, Next.js, and machine learning foundations.',
    tags: ['JavaScript', 'Python', 'Machine Learning']
  },
  {
    id: 'tutor-2',
    name: 'Prof. David Miller',
    image: '/tutor2.png',
    subject: 'Advanced Mathematics & Physics',
    rating: '4.8',
    reviews: '98',
    price: '$50',
    bio: '10+ years teaching university physics. Passionate about making complex calculus and mechanics easy to grasp.',
    tags: ['Calculus', 'Linear Algebra', 'Quantum Physics']
  }
]

/**
 * FeaturedTutors displays top-rated educators on the landing page.
 */
export function FeaturedTutors() {
  return (
    <section className='border-t border-white/5 bg-slate-950 py-24 px-6 relative overflow-hidden'>
      {/* Background glow decoration */}
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

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {FEATURED_TUTORS.map((tutor) => (
            <div
              key={tutor.id}
              className='group relative flex flex-col sm:flex-row gap-6 p-6 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-slate-800 transition-all duration-300 hover:bg-slate-900/70'
            >
              {/* Image container */}
              <div className='relative w-full sm:w-36 h-48 sm:h-36 rounded-xl overflow-hidden shrink-0 border border-white/10'>
                <img
                  src={tutor.image}
                  alt={tutor.name}
                  className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                />
                <span className='absolute bottom-2 right-2 bg-slate-950/85 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-white border border-white/5'>
                  {tutor.price}/hr
                </span>
              </div>

              {/* Tutor info */}
              <div className='flex-1 flex flex-col justify-between space-y-4 sm:space-y-0'>
                <div>
                  <div className='flex items-start justify-between'>
                    <div>
                      <h3 className='font-bold text-lg text-white group-hover:text-emerald-400 transition-colors duration-300 flex items-center gap-1.5'>
                        {tutor.name}
                        <CheckCircle className='h-4 w-4 text-emerald-400 fill-emerald-500/10' />
                      </h3>
                      <p className='text-xs text-indigo-300 font-semibold mt-0.5'>{tutor.subject}</p>
                    </div>
                    <div className='flex items-center gap-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-lg text-xs font-semibold'>
                      <Star className='h-3 w-3 fill-amber-300 text-amber-300' />
                      <span>{tutor.rating}</span>
                    </div>
                  </div>
                  <p className='text-xs text-slate-400 font-light mt-3 leading-relaxed'>
                    {tutor.bio}
                  </p>
                </div>

                <div className='flex flex-wrap gap-1.5 pt-3 sm:pt-0'>
                  {tutor.tags.map((tag) => (
                    <span
                      key={tag}
                      className='text-[10px] px-2 py-0.5 rounded-md bg-slate-800/60 text-slate-350 border border-white/5'
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
