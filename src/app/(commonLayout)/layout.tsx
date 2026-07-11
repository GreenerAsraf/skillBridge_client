import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import React from 'react'

export default function CommonLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='bg-background text-foreground min-h-screen flex flex-col transition-colors duration-300'>
      <Navbar />
      <main className='flex-1'>{children}</main>
      <Footer />
    </div>
  )
}
