'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Clock, ArrowRight, Tag } from 'lucide-react'

type BlogPost = {
  id: string
  title: string
  slug: string
  content: string
  coverImage?: string
  authorName: string
  createdAt: string
  category?: string
}

// Fallback static articles when DB has no blog posts
const STATIC_POSTS: BlogPost[] = [
  {
    id: '1',
    title: '10 Proven Study Techniques Backed by Science',
    slug: 'study-techniques-science',
    content:
      'From spaced repetition to the Feynman Technique, discover evidence-based methods that top students use to retain information faster and longer.',
    authorName: 'Dr. Sarah Kim',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Learning Tips',
  },
  {
    id: '2',
    title: 'How to Choose the Right Tutor for Your Learning Style',
    slug: 'choose-right-tutor',
    content:
      'Are you a visual learner or prefer hands-on practice? This guide helps you match your cognitive style with the perfect tutoring approach.',
    authorName: 'James O\'Brien',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Guides',
  },
  {
    id: '3',
    title: 'The Rise of Online Tutoring: Trends in 2026',
    slug: 'online-tutoring-trends-2026',
    content:
      'AI-assisted learning, asynchronous sessions, and global access — the tutoring landscape is evolving rapidly. Here\'s what to expect.',
    authorName: 'SkillBridge Team',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Industry',
  },
  {
    id: '4',
    title: 'From Beginner to Fluent: A Roadmap for Language Learning',
    slug: 'language-learning-roadmap',
    content:
      'Language acquisition doesn\'t have to take years. With structured practice and the right tutor, you can achieve conversational fluency in months.',
    authorName: 'Sofia Martinez',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Languages',
  },
  {
    id: '5',
    title: 'Why Every Student Needs a Personal Tutor in 2026',
    slug: 'personal-tutor-2026',
    content:
      'Personalized education is no longer a luxury — it\'s the most efficient way to learn. Discover how 1-on-1 tutoring shortens the path to mastery.',
    authorName: 'Prof. David Lee',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Opinion',
  },
]

const CATEGORY_COLORS: Record<string, string> = {
  'Learning Tips': 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
  Guides: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  Industry: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  Languages: 'bg-pink-500/10 text-pink-300 border-pink-500/20',
  Opinion: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function readTime(content: string) {
  const words = content.trim().split(/\s+/).length
  return `${Math.max(1, Math.ceil(words / 200))} min read`
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, '') ?? ''
    fetch(`${apiBase}/api/blog`)
      .then((r) => r.json())
      .then((json) => {
        const data = json?.data ?? []
        setPosts(data.length > 0 ? data : STATIC_POSTS)
      })
      .catch(() => setPosts(STATIC_POSTS))
      .finally(() => setLoading(false))
  }, [])

  const [featured, ...rest] = posts

  return (
    <div className='min-h-screen bg-background text-foreground transition-colors duration-300'>
      {/* Hero banner */}
      <div className='border-b border-border bg-gradient-to-b from-indigo-950/40 to-transparent py-16 px-6 text-center'>
        <div className='max-w-3xl mx-auto'>
          <span className='inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full mb-5'>
            ✍️ SkillBridge Blog
          </span>
          <h1 className='text-4xl md:text-5xl font-extrabold text-white tracking-tight'>
            Insights for Smarter Learning
          </h1>
          <p className='text-slate-400 mt-4 text-lg font-light max-w-xl mx-auto'>
            Tips, trends, and stories from educators and learners around the world.
          </p>
        </div>
      </div>

      <div className='max-w-5xl mx-auto py-14 px-6 space-y-12'>
        {loading ? (
          <div className='space-y-6'>
            <div className='h-64 rounded-2xl bg-slate-900 animate-pulse' />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className='h-44 rounded-2xl bg-slate-900 animate-pulse' />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Featured post */}
            {featured && (
              <div>
                <h2 className='text-xs font-semibold tracking-widest uppercase text-slate-500 mb-5'>
                  Featured Article
                </h2>
                <div className='group relative rounded-3xl border border-white/5 bg-gradient-to-br from-slate-900 to-slate-950 hover:border-indigo-500/30 transition-all duration-300 overflow-hidden p-8 md:p-10'>
                  <div className='absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none' />
                  <div className='relative'>
                    {featured.category && (
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold border rounded-full px-2.5 py-0.5 mb-4 ${
                          CATEGORY_COLORS[featured.category] ?? 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        <Tag className='h-3 w-3' />
                        {featured.category}
                      </span>
                    )}
                    <h3 className='text-2xl md:text-3xl font-extrabold text-white group-hover:text-indigo-200 transition-colors duration-200 leading-snug mb-3'>
                      {featured.title}
                    </h3>
                    <p className='text-slate-400 text-base font-light leading-relaxed max-w-2xl mb-6'>
                      {featured.content.slice(0, 200)}…
                    </p>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-3 text-xs text-slate-500'>
                        <div className='h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-[10px]'>
                          {featured.authorName[0]}
                        </div>
                        <span>{featured.authorName}</span>
                        <span>·</span>
                        <Clock className='h-3.5 w-3.5' />
                        <span>{readTime(featured.content)}</span>
                        <span>·</span>
                        <span>{formatDate(featured.createdAt)}</span>
                      </div>
                      <span className='flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors'>
                        Read more <ArrowRight className='h-3.5 w-3.5 group-hover:translate-x-1 transition-transform' />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Rest of posts */}
            {rest.length > 0 && (
              <div>
                <h2 className='text-xs font-semibold tracking-widest uppercase text-slate-500 mb-5'>
                  More Articles
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                  {rest.map((post) => (
                    <article
                      key={post.id}
                      className='group flex flex-col rounded-2xl border border-white/5 bg-slate-900/40 hover:border-white/10 hover:bg-slate-900/70 transition-all duration-300 p-6 space-y-3 cursor-pointer'
                    >
                      {post.category && (
                        <span
                          className={`self-start inline-flex items-center gap-1 text-[10px] font-semibold border rounded-full px-2.5 py-0.5 ${
                            CATEGORY_COLORS[post.category] ?? 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          <Tag className='h-2.5 w-2.5' />
                          {post.category}
                        </span>
                      )}
                      <h3 className='font-bold text-base text-slate-100 group-hover:text-white transition-colors leading-snug'>
                        {post.title}
                      </h3>
                      <p className='text-xs text-slate-500 leading-relaxed line-clamp-2'>
                        {post.content}
                      </p>
                      <div className='flex items-center gap-2 text-xs text-slate-600 pt-1 border-t border-white/5'>
                        <div className='h-5 w-5 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white font-bold text-[8px]'>
                          {post.authorName[0]}
                        </div>
                        <span>{post.authorName}</span>
                        <span>·</span>
                        <Clock className='h-3 w-3' />
                        <span>{readTime(post.content)}</span>
                        <span className='ml-auto'>{formatDate(post.createdAt)}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
