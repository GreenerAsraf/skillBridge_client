'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { initiateBookingPayment } from '@/lib/booking-payment'
import { XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'

export function PaymentFailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookingId = searchParams.get('bookingId')
  const [retrying, setRetrying] = useState(false)

  async function handleRetryPayment() {
    if (!bookingId) return

    setRetrying(true)
    const toastId = toast.loading('Initiating payment…')
    try {
      const redirectUrl = await initiateBookingPayment(bookingId)
      toast.dismiss(toastId)
      if (redirectUrl) {
        window.location.href = redirectUrl
      } else {
        toast.error('Payment URL not found. Please try again from your bookings page.', { id: toastId })
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Payment initiation failed'
      toast.error(message, { id: toastId })
    } finally {
      setRetrying(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-950 dark:to-rose-900 px-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardContent className="p-8 flex flex-col items-center text-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-red-400 rounded-full blur-xl opacity-30 animate-pulse" />
            <XCircle className="relative h-20 w-20 text-red-500 drop-shadow-lg" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-foreground">Payment Failed</h1>
            <p className="text-muted-foreground mt-2">
              Unfortunately, your payment could not be processed. Your booking is still pending.
              You can try paying again or choose a different time slot.
            </p>
          </div>

          <div className="w-full bg-muted/50 rounded-xl p-4 text-sm text-left space-y-1.5">
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">What happened?</span> The payment
              gateway reported a failure. No money has been charged. Please check your card
              details or try a different payment method.
            </p>
          </div>

          <div className="flex gap-3 w-full">
            {bookingId && (
              <Button
                id="retry-payment-btn"
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white"
                disabled={retrying}
                onClick={handleRetryPayment}
              >
                {retrying ? 'Redirecting…' : 'Try Again'}
              </Button>
            )}
            <Button
              id="go-dashboard-from-fail-btn"
              variant="outline"
              className="flex-1"
              onClick={() => router.push('/dashboard/bookings')}
            >
              My Bookings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
