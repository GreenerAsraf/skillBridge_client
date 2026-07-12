import { useState } from 'react'
import { Star, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { apiFetch } from '@/lib/api'

type ReviewModalProps = {
  bookingId: string
  tutorName: string
  onClose: () => void
  onSuccess: (review: any) => void
}

export function ReviewModal({ bookingId, tutorName, onClose, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setLoading(true)
    const toastId = toast.loading('Submitting review...')
    try {
      const res = await apiFetch<{ success: boolean; data?: any; message?: string }>('/api/reviews', {
        method: 'POST',
        body: JSON.stringify({ bookingId, rating, comment }),
      })
      if (res.success) {
        toast.success('Review submitted successfully!', { id: toastId })
        onSuccess(res.data)
      } else {
        toast.error(res.message || 'Failed to submit review', { id: toastId })
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800 pb-4">
          <CardTitle className="text-xl">Review {tutorName}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-3 flex flex-col items-center">
            <p className="text-sm font-medium text-slate-400">How was your session?</p>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-10 w-10 ${
                      star <= rating
                        ? 'fill-amber-400 stroke-amber-400'
                        : 'fill-slate-800 stroke-slate-700'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-amber-400 font-semibold">{rating} out of 5 stars</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Your Feedback (optional)</label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about your experience..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:outline-none focus:border-amber-500 transition-colors resize-none placeholder:text-slate-600"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
