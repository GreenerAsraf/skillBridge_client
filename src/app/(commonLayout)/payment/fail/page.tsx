import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { PaymentFailContent } from './payment-fail-content'

function PaymentFailFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-950 dark:to-rose-900 px-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardContent className="p-8 flex flex-col items-center text-center gap-6">
          <Loader2 className="h-16 w-16 text-red-500 animate-spin" />
          <p className="text-muted-foreground">Loading…</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={<PaymentFailFallback />}>
      <PaymentFailContent />
    </Suspense>
  )
}
