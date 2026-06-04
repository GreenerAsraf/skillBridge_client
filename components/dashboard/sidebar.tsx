'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  CalendarCheck,
  User,
  Clock,
  Users,
  BookOpen,
  Tag,
  BarChart3,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/components/auth-provider'

type NavItem = { label: string; href: string; icon: React.ReactNode }

const studentNav: NavItem[] = [
  { label: 'Overview', href: '/dashboard', icon: <LayoutDashboard className='h-4 w-4' /> },
  { label: 'My Bookings', href: '/dashboard/bookings', icon: <CalendarCheck className='h-4 w-4' /> },
  { label: 'Profile', href: '/dashboard/profile', icon: <User className='h-4 w-4' /> },
]

const tutorNav: NavItem[] = [
  { label: 'Dashboard', href: '/tutor/dashboard', icon: <LayoutDashboard className='h-4 w-4' /> },
  { label: 'Availability', href: '/tutor/availability', icon: <Clock className='h-4 w-4' /> },
  { label: 'Profile', href: '/tutor/profile', icon: <User className='h-4 w-4' /> },
]

const adminNav: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: <BarChart3 className='h-4 w-4' /> },
  { label: 'Users', href: '/admin/users', icon: <Users className='h-4 w-4' /> },
  { label: 'Bookings', href: '/admin/bookings', icon: <BookOpen className='h-4 w-4' /> },
  { label: 'Categories', href: '/admin/categories', icon: <Tag className='h-4 w-4' /> },
]

const navByRole: Record<string, NavItem[]> = {
  STUDENT: studentNav,
  TUTOR: tutorNav,
  ADMIN: adminNav,
}

export function DashboardSidebar() {
  const { user } = useAuth()
  const pathname = usePathname()
  const navItems = navByRole[user?.role ?? ''] ?? studentNav

  return (
    <aside className='w-56 shrink-0 border-r bg-muted/30 min-h-screen flex flex-col'>
      {/* Brand / role badge */}
      <div className='px-4 py-5 border-b'>
        <p className='text-xs font-semibold uppercase tracking-widest text-muted-foreground'>
          {user?.role ?? 'Dashboard'}
        </p>
        <p className='mt-0.5 text-sm font-medium truncate'>{user?.name ?? user?.email}</p>
      </div>

      {/* Nav links */}
      <nav className='flex-1 p-3 space-y-1'>
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== '/admin' && item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Back to site */}
      <div className='p-3 border-t'>
        <Link
          href='/'
          className='flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-2'
        >
          ← Back to site
        </Link>
      </div>
    </aside>
  )
}
