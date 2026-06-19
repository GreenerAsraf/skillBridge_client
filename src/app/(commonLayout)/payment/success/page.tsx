import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { PaymentSuccessContent } from './payment-success-content'

function PaymentSuccessFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 px-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardContent className="p-8 flex flex-col items-center text-center gap-6">
          <Loader2 className="h-16 w-16 text-emerald-500 animate-spin" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Verifying Payment…</h1>
            <p className="text-muted-foreground mt-2">Please wait while we confirm your booking.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentSuccessFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  )
}
