'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { UserMenu } from '@/components/user-menu'
import Link from 'next/link'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isPending } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isPending && user === null) {
      router.replace('/login')
    }
  }, [user, isPending, router])

  if (isPending || !user) {
    return (
      <div className='flex h-screen items-center justify-center text-muted-foreground text-sm'>
        Checking authentication…
      </div>
    )
  }

  return (
    <div className='flex min-h-screen'>
      <DashboardSidebar />
      <div className='flex-1 flex flex-col'>
        {/* Dashboard top bar */}
        <header className='h-14 border-b bg-background flex items-center justify-between px-6'>
          <Link href="/" className='text-xl font-semibold text-foreground bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent'>SkillBridge</Link>
          <UserMenu />
        </header>
        <main className='flex-1 p-6 bg-muted/10'>
          {children}
        </main>
      </div>
    </div>
  )
}
