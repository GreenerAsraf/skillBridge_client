'use client'

import { useRouter } from 'next/navigation'
import { Ban } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function PaymentCancelPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-900 px-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardContent className="p-8 flex flex-col items-center text-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-400 rounded-full blur-xl opacity-30 animate-pulse" />
            <Ban className="relative h-20 w-20 text-amber-500 drop-shadow-lg" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-foreground">Payment Cancelled</h1>
            <p className="text-muted-foreground mt-2">
              You cancelled the payment process. Your booking is still in a pending state —
              no charge has been made. You can complete the payment anytime from your bookings page.
            </p>
          </div>

          <div className="flex gap-3 w-full">
            <Button
              id="go-bookings-from-cancel-btn"
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
              onClick={() => router.push('/dashboard/bookings')}
            >
              My Bookings
            </Button>
            <Button
              id="browse-tutors-from-cancel-btn"
              variant="outline"
              className="flex-1"
              onClick={() => router.push('/tutors')}
            >
              Browse Tutors
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
