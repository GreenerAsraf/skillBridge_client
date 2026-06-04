'use client'

import Link from 'next/link'
import type { ComponentProps } from 'react'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'

export const NavMenu = (props: ComponentProps<typeof NavigationMenu>) => (
  <NavigationMenu {...props}>
    <NavigationMenuList className='data-[orientation=vertical]:-ms-2 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start data-[orientation=vertical]:justify-start'>
      <NavigationMenuItem>
        <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), 'text-black hover:rounded-md hover:text-black hover:bg-white')}>
          <Link href='/'>Home</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), 'text-black hover:rounded-md hover:text-black hover:bg-white')}>
          <Link href='/tutors'>Browse Tutors</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), 'text-black')}>
          <Link href='/dashboard'>Dashboard</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), 'text-black')}>
          <Link href='/contact'>Contact Us</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
)
