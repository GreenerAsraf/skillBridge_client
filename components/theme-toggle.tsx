'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

/**
 * ThemeToggle – animates between sun (light) and moon (dark) icons.
 * Mounted guard prevents hydration mismatch on SSR.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    // Render a placeholder that matches the button size to prevent layout shift
    return (
      <button
        className='theme-toggle-btn'
        aria-label='Toggle theme'
        disabled
      >
        <span className='theme-toggle-icon-wrap'>
          <Sun className='h-4 w-4' />
        </span>
      </button>
    )
  }

  const isDark = theme === 'dark'

  return (
    <button
      id='theme-toggle'
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className='theme-toggle-btn'
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className='theme-toggle-track'>
        <span className={`theme-toggle-thumb ${isDark ? 'theme-toggle-thumb-dark' : 'theme-toggle-thumb-light'}`} />
        <span className='theme-toggle-sun'>
          <Sun className='h-3 w-3' />
        </span>
        <span className='theme-toggle-moon'>
          <Moon className='h-3 w-3' />
        </span>
      </span>
    </button>
  )
}
