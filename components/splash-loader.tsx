'use client'

import { useEffect, useState } from 'react'

/**
 * SplashLoader displays a full-screen branded loading screen
 * with an animated "Welcome to NexaMentor" message and logo.
 * It fades out once `show` becomes false.
 */
export function SplashLoader({ show }: { show: boolean }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!show) {
      // Wait for fade-out animation before removing from DOM
      const timer = setTimeout(() => setVisible(false), 600)
      return () => clearTimeout(timer)
    }
  }, [show])

  if (!visible) return null

  return (
    <div
      className='splash-loader'
      style={{ opacity: show ? 1 : 0 }}
      aria-label='Loading NexaMentor'
      role='status'
    >
      {/* Animated background blobs */}
      <div className='splash-blob splash-blob-1' />
      <div className='splash-blob splash-blob-2' />
      <div className='splash-blob splash-blob-3' />

      {/* Grid overlay */}
      <div className='splash-grid' />

      {/* Main content */}
      <div className='splash-content'>
        {/* Logo */}
        <div className='splash-logo-wrapper'>
          <img
            src='/nexamentor-logo.svg'
            alt='NexaMentor Logo'
            className='splash-logo'
          />
        </div>

        {/* Animated welcome text */}
        <div className='splash-text-group'>
          <p className='splash-welcome-label'>Welcome to</p>
          <h1 className='splash-title'>
            <span className='splash-title-skill'>Nexa</span>
            <span className='splash-title-bridge'>Mentor</span>
          </h1>
          <p className='splash-tagline'>Find mentors. Build momentum.</p>
        </div>

        {/* Skeleton shimmer bars */}
        <div className='splash-skeleton-group'>
          <div className='splash-skeleton splash-skeleton-lg' />
          <div className='splash-skeleton splash-skeleton-md' />
          <div className='splash-skeleton splash-skeleton-sm' />
        </div>

        {/* Pulsing dots loader */}
        <div className='splash-dots'>
          <span className='splash-dot' style={{ animationDelay: '0ms' }} />
          <span className='splash-dot' style={{ animationDelay: '160ms' }} />
          <span className='splash-dot' style={{ animationDelay: '320ms' }} />
        </div>
      </div>
    </div>
  )
}


