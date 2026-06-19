'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

export default function HeroSearchForm() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/tutors?search=${encodeURIComponent(query.trim())}`)
    } else {
      router.push('/tutors')
    }
  }

  return (
    <div className='py-4'>
      <form onSubmit={handleSearch} className='max-w-lg mx-auto relative flex items-center bg-slate-900/60 border border-white/10 backdrop-blur-md rounded-full p-1.5 focus-within:border-emerald-550 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all duration-300 shadow-2xl'>
        <Search className='absolute left-4 h-5 w-5 text-slate-400' />
        <input
          type='text'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Search by name or subject (e.g. React, Math)...'
          className='w-full bg-transparent pl-12 pr-28 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none'
        />
        <Button type='submit' size='sm' className='absolute right-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold px-5 h-9 rounded-full border-0'>
          Search
        </Button>
      </form>
    </div>
  )
}
