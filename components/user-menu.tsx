'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogOut, User } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth-provider'

/**
 * UserMenu manages profile badges and authentication state buttons.
 */
export function UserMenu() {
  const router = useRouter()
  const { user, logout } = useAuth()

  function handleLogout() {
    logout()
    toast.success('Signed out successfully')
    router.push('/login')
  }

  if (user) {
    return (
      <div className='flex items-center gap-3'>
        {/* User badge */}
        <div className='hidden sm:flex items-center gap-2 rounded-full border border-white bg-muted/50 px-3 py-1.5 text-sm font-medium text-white'>
          <User className='h-3.5 w-3.5 text-muted-foreground' />
          <span className='max-w-[140px] truncate'>{user.email}</span>
        </div>

        {/* Sign Out button */}
        <Button
          variant='secondary'
          size='sm'
          onClick={handleLogout}
          className='flex items-center gap-1.5 text-white bg-white/10 hover:bg-white/20'
        >
          <LogOut className='h-3.5 w-3.5' />
          <span>Sign Out</span>
        </Button>
      </div>
    )
  }

  return (
    <div className='flex items-center gap-3'>
      <Button asChild variant='outline' className='hidden bg-black sm:inline-flex'>
        <Link href='/login'>Sign In</Link>
      </Button>
      <Button asChild>
        <Link href='/register'>Register</Link>
      </Button>
    </div>
  )
}
