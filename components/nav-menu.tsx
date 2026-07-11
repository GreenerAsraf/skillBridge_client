'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ComponentProps } from 'react'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'
import { useAuth } from '@/components/auth-provider'

/**
 * NavLink – a single nav item that highlights when active.
 */
function NavLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))

  return (
    <NavigationMenuItem>
      <NavigationMenuLink
        asChild
        className={cn(
          navigationMenuTriggerStyle(),
          'relative text-white/90 hover:text-white hover:bg-white/15 transition-all duration-200',
          isActive && 'text-white font-semibold after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-0.5 after:w-4/5 after:rounded-full after:bg-white/70'
        )}
      >
        <Link href={href}>{children}</Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  )
}

/**
 * NavMenu – responsive nav links. Shows different routes based on auth state.
 * Logged-out: Home, Browse Tutors, About, Contact
 * Logged-in:  Home, Browse Tutors, Dashboard, About, Blog, Contact
 */
export const NavMenu = (props: ComponentProps<typeof NavigationMenu>) => {
  const { user } = useAuth()

  return (
    <NavigationMenu {...props}>
      <NavigationMenuList className='data-[orientation=vertical]:-ms-2 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start data-[orientation=vertical]:justify-start gap-0.5'>
        <NavLink href='/'>Home</NavLink>
        <NavLink href='/tutors'>Browse Tutors</NavLink>
        {user && <NavLink href={getDashboardHref(user.role)}>Dashboard</NavLink>}
        <NavLink href='/blog'>Blog</NavLink>
        <NavLink href='/about'>About</NavLink>
        <NavLink href='/contact'>Contact</NavLink>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function getDashboardHref(role: string): string {
  const r = role?.toUpperCase()
  if (r === 'ADMIN') return '/admin'
  if (r === 'TUTOR') return '/tutor/dashboard'
  return '/dashboard'
}
