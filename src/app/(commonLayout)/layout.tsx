import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import React from 'react'

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='bg-slate-950 text-slate-100 min-h-screen flex flex-col'>
      <Navbar />
      <div className='flex-grow'>
        {children}
      </div>
      <Footer />
    </div>
  )
}

export default CommonLayout
