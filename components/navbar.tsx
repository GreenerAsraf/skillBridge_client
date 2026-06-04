import { Logo } from '@/components/logo'
import { NavMenu } from '@/components/nav-menu'
import { NavigationSheet } from '@/components/navigation-sheet'
import { UserMenu } from '@/components/user-menu'
import Link from 'next/link'

const Navbar = () => {
  return (
    <nav className='sticky top-0 z-50 h-16 border-b border-slate-900 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 backdrop-blur-md text-white shadow-xl'>
      <div className='mx-auto flex h-full max-w-(--breakpoint-xl) items-center justify-between px-4 sm:px-6 lg:px-8'>
       <Link href="/"> <Logo /> </Link>

        {/* Desktop Menu */}
        <NavMenu className='hidden md:block' />

        <div className='flex items-center gap-3'>
          {/* Auth toggle: shows user info + sign-out OR sign-in + register */}
          <UserMenu />

          {/* Mobile Menu */}
          <div className='md:hidden'>
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
