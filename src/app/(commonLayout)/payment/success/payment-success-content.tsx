'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { apiFetch } from '@/lib/api'
import { CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

type Booking = {
  status: string
  date?: string
  startTime?: string
  endTime?: string
  tutor?: { user?: { name: string } }
}

const POLL_ATTEMPTS = 5
const POLL_INTERVAL_MS = 2000

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookingId = searchParams.get('bookingId')
  const [status, setStatus] = useState<'loading' | 'confirmed' | 'error'>(
    bookingId ? 'loading' : 'error'
  )
  const [booking, setBooking] = useState<Booking | null>(null)

  useEffect(() => {
    if (!bookingId) return

    let cancelled = false

    async function pollBooking() {
      for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt++) {
        try {
          const res = await apiFetch<{ data: Booking }>(`/api/bookings/${bookingId}`)
          if (cancelled) return

          if (res.data?.status === 'CONFIRMED') {
            setBooking(res.data)
            setStatus('confirmed')
            return
          }
        } catch {
          // keep polling — webhook may not have processed yet
        }

        if (attempt < POLL_ATTEMPTS - 1) {
          await sleep(POLL_INTERVAL_MS)
        }
      }

      if (!cancelled) setStatus('error')
    }

    pollBooking()
    return () => {
      cancelled = true
    }
  }, [bookingId])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 px-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardContent className="p-8 flex flex-col items-center text-center gap-6">
          {status === 'loading' && (
            <>
              <Loader2 className="h-16 w-16 text-emerald-500 animate-spin" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Verifying Payment…</h1>
                <p className="text-muted-foreground mt-2">Please wait while we confirm your booking.</p>
              </div>
            </>
          )}

          {status === 'confirmed' && (
            <>
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-400 rounded-full blur-xl opacity-30 animate-pulse" />
                <CheckCircle className="relative h-20 w-20 text-emerald-500 drop-shadow-lg" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Payment Successful!</h1>
                <p className="text-muted-foreground mt-2">
                  Your session has been confirmed. Check your dashboard for details.
                </p>
              </div>
              {booking && (
                <div className="w-full bg-muted/50 rounded-xl p-4 text-sm space-y-1.5 text-left">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tutor</span>
                    <span className="font-medium">{booking.tutor?.user?.name ?? '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">
                      {booking.date
                        ? new Date(booking.date).toLocaleDateString(undefined, { dateStyle: 'medium' })
                        : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-medium">{booking.startTime} – {booking.endTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium text-emerald-600">✓ Confirmed</span>
                  </div>
                </div>
              )}
              <Button
                id="go-to-dashboard-btn"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => router.push('/dashboard/bookings')}
              >
                Go to My Bookings
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-4xl">⚠️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Verification Failed</h1>
                <p className="text-muted-foreground mt-2">
                  We couldn&apos;t confirm your payment yet. If money was deducted, please contact support.
                </p>
              </div>
              <div className="flex gap-3 w-full">
                <Button variant="outline" className="flex-1" onClick={() => router.push('/dashboard/bookings')}>
                  My Bookings
                </Button>
                <Button className="flex-1" onClick={() => router.push('/contact')}>
                  Contact Support
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
