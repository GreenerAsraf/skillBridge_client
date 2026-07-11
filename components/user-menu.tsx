'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LogOut,
  User,
  LayoutDashboard,
  Settings,
  ChevronDown,
  Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth-provider'
import { useState, useRef, useEffect } from 'react'

/**
 * UserMenu – shows an advanced profile dropdown when logged in,
 * or Sign In / Register buttons when logged out.
 */
export function UserMenu() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function handleLogout() {
    logout()
    toast.success('Signed out successfully')
    router.push('/login')
    setOpen(false)
  }

  function getDashboardHref(role: string): string {
    const r = role?.toUpperCase()
    if (r === 'ADMIN') return '/admin'
    if (r === 'TUTOR') return '/tutor/dashboard'
    return '/dashboard'
  }

  function getRoleBadgeColor(role: string): string {
    const r = role?.toUpperCase()
    if (r === 'ADMIN') return 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    if (r === 'TUTOR') return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
    return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
  }

  if (user) {
    const initials = user.name
      ? user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
      : user.email.slice(0, 2).toUpperCase()

    return (
      <div className='relative' ref={menuRef}>
        {/* Trigger */}
        <button
          id='user-menu-trigger'
          onClick={() => setOpen((v) => !v)}
          className='flex items-center gap-2 rounded-full pl-1 pr-2.5 py-1 border border-white/20 bg-white/10 hover:bg-white/20 transition-all duration-200 group'
          aria-haspopup='true'
          aria-expanded={open}
        >
          {/* Avatar circle */}
          <span className='flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-pink-500 text-[11px] font-bold text-white shadow-inner'>
            {initials}
          </span>
          <span className='hidden sm:block max-w-[110px] truncate text-sm font-medium text-white/90 group-hover:text-white transition-colors'>
            {user.name || user.email}
          </span>
          <ChevronDown
            className={`h-3.5 w-3.5 text-white/60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown panel */}
        <div
          className={`user-dropdown ${open ? 'user-dropdown-open' : 'user-dropdown-closed'}`}
        >
          {/* User info header */}
          <div className='px-4 pt-4 pb-3 border-b border-white/10'>
            <div className='flex items-center gap-3'>
              <span className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-pink-500 text-sm font-bold text-white shadow'>
                {initials}
              </span>
              <div className='min-w-0'>
                <p className='text-sm font-semibold text-white truncate'>{user.name || 'SkillBridge User'}</p>
                <p className='text-xs text-slate-400 truncate'>{user.email}</p>
              </div>
            </div>
            <span className={`mt-2.5 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${getRoleBadgeColor(user.role)}`}>
              <Sparkles className='h-2.5 w-2.5' />
              {user.role}
            </span>
          </div>

          {/* Menu items */}
          <div className='py-1.5'>
            <DropdownItem
              href={getDashboardHref(user.role)}
              icon={<LayoutDashboard className='h-3.5 w-3.5' />}
              label='Dashboard'
              onClick={() => setOpen(false)}
            />
            <DropdownItem
              href={user.role?.toUpperCase() === 'TUTOR' ? '/tutor/profile' : '/dashboard/profile'}
              icon={<User className='h-3.5 w-3.5' />}
              label='My Profile'
              onClick={() => setOpen(false)}
            />
            <DropdownItem
              href='/settings'
              icon={<Settings className='h-3.5 w-3.5' />}
              label='Settings'
              onClick={() => setOpen(false)}
            />
          </div>

          {/* Sign Out */}
          <div className='border-t border-white/10 py-1.5'>
            <button
              onClick={handleLogout}
              className='flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-150'
            >
              <LogOut className='h-3.5 w-3.5' />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex items-center gap-2'>
      <Button
        asChild
        variant='ghost'
        size='sm'
        className='hidden sm:inline-flex text-white/90 hover:text-white hover:bg-white/15 border border-white/20'
      >
        <Link href='/login'>Sign In</Link>
      </Button>
      <Button
        asChild
        size='sm'
        className='bg-white text-indigo-700 hover:bg-white/90 font-semibold shadow-lg shadow-white/10 transition-all duration-200 hover:scale-[1.02]'
      >
        <Link href='/register'>Get Started</Link>
      </Button>
    </div>
  )
}

function DropdownItem({
  href,
  icon,
  label,
  onClick,
}: {
  href: string
  icon: React.ReactNode
  label: string
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className='flex items-center gap-2.5 px-4 py-2 text-sm text-slate-300 hover:bg-white/8 hover:text-white transition-colors duration-150'
    >
      <span className='text-slate-400'>{icon}</span>
      {label}
    </Link>
  )
}
