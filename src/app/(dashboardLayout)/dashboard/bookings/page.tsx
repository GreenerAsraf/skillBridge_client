'use client'

import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Star } from 'lucide-react'
import { toast } from 'sonner'

type Review = { id: string }

type Booking = {
  id: string
  status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  date?: string
  startTime?: string
  endTime?: string
  scheduledAt?: string
  tutor?: { user?: { name: string }; hourlyPrice?: number }
  review?: Review | null
}

const statusStyle: Record<string, string> = {
  CONFIRMED: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

type ReviewModal = {
  bookingId: string
  tutorName: string
}

export default function StudentBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('ALL')

  // Review modal state
  const [reviewModal, setReviewModal] = useState<ReviewModal | null>(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    apiFetch<{ data: Booking[] }>('/api/bookings')
      .then((res) => setBookings(res.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'ALL' ? bookings : bookings.filter((b) => b.status === filter)

  // ─── Cancel booking ───────────────────────────────────────────────────────────
  async function handleCancel(id: string) {
    const toastId = toast.loading('Cancelling session…')
    try {
      await apiFetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'CANCELLED' }),
      })
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'CANCELLED' } : b)))
      toast.success('Session cancelled.', { id: toastId })
    } catch (err: any) {
      toast.error(err.message ?? 'Cancel failed', { id: toastId })
    }
  }

  // ─── Submit review ────────────────────────────────────────────────────────────
  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault()
    if (!reviewModal) return
    setSubmittingReview(true)
    const toastId = toast.loading('Submitting review…')
    try {
      await apiFetch('/api/reviews', {
        method: 'POST',
        body: JSON.stringify({ bookingId: reviewModal.bookingId, rating, comment }),
      })
      // Mark that booking as reviewed in local state
      setBookings((prev) =>
        prev.map((b) =>
          b.id === reviewModal.bookingId ? { ...b, review: { id: 'submitted' } } : b
        )
      )
      toast.success('Review submitted! Thank you.', { id: toastId })
      setReviewModal(null)
      setRating(5)
      setComment('')
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to submit review', { id: toastId })
    } finally {
      setSubmittingReview(false)
    }
  }

  const formatDateTime = (b: Booking) => {
    if (b.date) {
      const d = new Date(b.date).toLocaleDateString(undefined, { dateStyle: 'medium' })
      return b.startTime ? `${d} · ${b.startTime}–${b.endTime ?? ''}` : d
    }
    if (b.scheduledAt) return new Date(b.scheduledAt).toLocaleString()
    return '—'
  }

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>My Bookings</h1>

      {/* Filter tabs */}
      <div className='flex gap-2 flex-wrap'>
        {['ALL', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              filter === s
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border text-muted-foreground hover:bg-accent'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Booking History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className='text-sm text-muted-foreground'>Loading…</p>
          ) : filtered.length === 0 ? (
            <p className='text-sm text-muted-foreground'>No bookings found.</p>
          ) : (
            <ul className='divide-y'>
              {filtered.map((b) => (
                <li key={b.id} className='py-3 flex items-start justify-between gap-4'>
                  <div className='min-w-0'>
                    <p className='text-sm font-medium'>{b.tutor?.user?.name ?? 'Tutor'}</p>
                    <p className='text-xs text-muted-foreground flex items-center gap-1 mt-0.5'>
                      <Clock className='h-3 w-3 shrink-0' />
                      {formatDateTime(b)}
                    </p>
                  </div>
                  <div className='flex items-center gap-2 shrink-0'>
                    <span className={`text-xs rounded-full px-2.5 py-0.5 font-medium ${statusStyle[b.status]}`}>
                      {b.status}
                    </span>

                    {/* Cancel button for CONFIRMED */}
                    {b.status === 'CONFIRMED' && (
                      <Button
                        size='sm'
                        variant='outline'
                        className='text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 text-[11px] h-7 px-2.5 shadow-none'
                        onClick={() => handleCancel(b.id)}
                      >
                        Cancel
                      </Button>
                    )}

                    {/* Leave Review button for COMPLETED with no review yet */}
                    {b.status === 'COMPLETED' && !b.review && (
                      <Button
                        size='sm'
                        className='bg-yellow-500 hover:bg-yellow-600 text-white text-[11px] h-7 px-2.5 shadow-none'
                        onClick={() =>
                          setReviewModal({
                            bookingId: b.id,
                            tutorName: b.tutor?.user?.name ?? 'Tutor',
                          })
                        }
                      >
                        <Star className='h-3 w-3 mr-1' />
                        Review
                      </Button>
                    )}

                    {/* Reviewed badge */}
                    {b.status === 'COMPLETED' && b.review && (
                      <span className='text-xs text-green-600 font-medium flex items-center gap-1'>
                        <Star className='h-3 w-3 fill-green-400 stroke-green-400' />
                        Reviewed
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* ─── Review Modal ───────────────────────────────────────────────────── */}
      {reviewModal && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4'
          onClick={(e) => {
            if (e.target === e.currentTarget) setReviewModal(null)
          }}
        >
          <div className='bg-background rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5'>
            <div>
              <h2 className='text-lg font-bold'>Leave a Review</h2>
              <p className='text-sm text-muted-foreground mt-0.5'>
                How was your session with <span className='font-medium'>{reviewModal.tutorName}</span>?
              </p>
            </div>

            <form onSubmit={handleSubmitReview} className='space-y-4'>
              {/* Star rating */}
              <div className='space-y-1.5'>
                <label className='text-sm font-medium'>Rating</label>
                <div className='flex gap-1.5'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type='button'
                      onClick={() => setRating(star)}
                      className='focus:outline-none transition-transform hover:scale-110'
                    >
                      <Star
                        className={`h-7 w-7 ${
                          star <= rating
                            ? 'fill-yellow-400 stroke-yellow-400'
                            : 'fill-muted stroke-muted-foreground'
                        }`}
                      />
                    </button>
                  ))}
                  <span className='ml-2 text-sm text-muted-foreground self-center'>
                    {rating}/5
                  </span>
                </div>
              </div>

              {/* Comment */}
              <div className='space-y-1.5'>
                <label className='text-sm font-medium'>Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  rows={4}
                  placeholder='Share your experience with this tutor…'
                  className='w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring placeholder:text-muted-foreground'
                />
              </div>

              <div className='flex gap-3 pt-1'>
                <Button type='submit' className='flex-1' disabled={submittingReview}>
                  {submittingReview ? 'Submitting…' : 'Submit Review'}
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  className='flex-1'
                  onClick={() => setReviewModal(null)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
