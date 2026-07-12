'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { apiFetch } from '@/lib/api'
import { resolveBookingPayment, type ApiPayload } from '@/lib/booking-payment'
import { buildStoredBooking, saveRecentBooking, type StoredBooking } from '@/lib/student-bookings'
import { useAuth } from '@/components/auth-provider'
import { Star, Clock, BookOpen, User, CheckCircle, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type Review = {
  id: string
  rating: number
  comment?: string
  createdAt?: string
  student?: { name: string }
}

type TutorProfile = {
  id: string
  bio?: string
  hourlyPrice?: number
  subject?: string[]
  user?: { name: string; email: string }
  categories?: Array<{ name: string }>
  category?: { name: string }
  rating?: number
  reviews?: Review[]
  availability?: Array<{
    id: string
    tutorProfileId: string
    day: 'SAT' | 'SUN' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI'
    startTime: string
    endTime: string
  }>
}

type Slot = { day: string; time: string }

export default function TutorProfilePage() {
  const { id } = useParams()
  const { user } = useAuth()
  const router = useRouter()
  const [tutor, setTutor] = useState<TutorProfile | null>(null)
  const [relatedTutors, setRelatedTutors] = useState<TutorProfile[]>([])
  const [availability, setAvailability] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)

  useEffect(() => {
    Promise.all([
      apiFetch<{ data: TutorProfile }>(`/api/tutors/${id}`),
      apiFetch<{ data: TutorProfile[] }>(`/api/tutors/${id}/related`).catch(() => ({ data: [] }))
    ])
      .then(([tutorRes, relatedRes]) => {
        const tutorData = tutorRes.data
        setTutor(tutorData)
        setRelatedTutors(relatedRes.data ?? [])

        // Parse backend availability to Slot format
        const dayMap: Record<string, string> = {
          MON: 'Monday', TUE: 'Tuesday', WED: 'Wednesday', THU: 'Thursday', FRI: 'Friday', SAT: 'Saturday', SUN: 'Sunday'
        }
        
        const slots: Slot[] = (tutorData.availability ?? []).map((av) => {
          const start = new Date(av.startTime)
          const h = start.getUTCHours().toString().padStart(2, '0')
          const m = start.getUTCMinutes().toString().padStart(2, '0')
          return {
            day: dayMap[av.day] || av.day,
            time: `${h}:${m}`
          }
        })
        setAvailability(slots)
      })
      .catch(() => toast.error('Failed to load tutor details'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleBook(day: string, time: string) {
    if (!user) {
      toast.error('Please sign in to book a session')
      return
    }
    if (user.role !== 'STUDENT') {
      toast.error('Only students can book sessions')
      return
    }

    setBooking(true)
    const toastId = toast.loading('Creating booking…')
    try {
      // Calculate target date (YYYY-MM-DD)
      const date = new Date()
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const targetDayIndex = days.indexOf(day)
      const currentDayIndex = date.getDay()
      let daysUntilTarget = targetDayIndex - currentDayIndex
      
      const [hours, minutes] = time.split(':')
      const slotTime = new Date()
      slotTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0)

      // If the day passed, or it's today but the time has passed, book for next week
      if (daysUntilTarget < 0 || (daysUntilTarget === 0 && slotTime < new Date())) {
        daysUntilTarget += 7
      }
      
      date.setDate(date.getDate() + daysUntilTarget)
      const yyyy = date.getFullYear()
      const mm = (date.getMonth() + 1).toString().padStart(2, '0')
      const dd = date.getDate().toString().padStart(2, '0')
      const dateStr = `${yyyy}-${mm}-${dd}`

      const startHour = parseInt(hours, 10)
      const endHour = (startHour + 1).toString().padStart(2, '0')
      const endTimeStr = `${endHour}:${minutes}`

      const bookingRes = await apiFetch<ApiPayload>('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({
          tutorId: tutor?.id,
          date: dateStr,
          startTime: time,
          endTime: endTimeStr
        }),
      })

      toast.dismiss(toastId)
      const outcome = await resolveBookingPayment(bookingRes)

      if (outcome?.type === 'redirect') {
        window.location.href = outcome.url
        return
      }

      if (outcome?.type === 'confirmed') {
        const created = bookingRes.data
        if (created?.id) {
          saveRecentBooking(
            buildStoredBooking(
              {
                id: created.id,
                status: (created.status as StoredBooking['status']) ?? 'CONFIRMED',
                date: typeof created.date === 'string' ? created.date : undefined,
                startTime: typeof created.startTime === 'string' ? created.startTime : undefined,
                endTime: typeof created.endTime === 'string' ? created.endTime : undefined,
              },
              tutor ?? undefined
            )
          )
        }
        toast.success('Session booked successfully!', { id: toastId })
        router.push('/dashboard/bookings')
        return
      }

      toast.error('Could not start payment. Check My Bookings to pay or try again.', { id: toastId })
      console.error('Unhandled booking response:', JSON.stringify(bookingRes, null, 2))
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Booking failed'
      toast.error(message, { id: toastId })
    } finally {
      setBooking(false)
    }
  }

  if (loading) {
    return (
      <div className='max-w-4xl mx-auto py-10 px-4 space-y-6 animate-pulse'>
        <div className='h-32 bg-muted rounded-xl'></div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='md:col-span-2 h-64 bg-muted rounded-xl'></div>
          <div className='h-64 bg-muted rounded-xl'></div>
        </div>
      </div>
    )
  }

  if (!tutor) {
    return (
      <div className='max-w-4xl mx-auto py-10 px-4 text-center'>
        <p className='text-muted-foreground'>Tutor not found.</p>
      </div>
    )
  }

  const reviews = tutor.reviews ?? []
  const categoryName = tutor.category?.name ?? tutor.categories?.[0]?.name ?? 'General'

  return (
    <div className='max-w-4xl mx-auto py-10 px-4 space-y-6'>
      {/* Banner / Gallery Header */}
      <div className='relative h-48 w-full rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 overflow-hidden shadow-lg border border-white/10'>
        <div className='absolute inset-0 bg-black/20 mix-blend-multiply'></div>
      </div>

      {/* Header Profile Card */}
      <Card className='-mt-16 relative z-10 mx-4 border-white/10 bg-slate-900/80 backdrop-blur-md'>
        <CardContent className='p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center'>
          <div className='h-24 w-24 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-3xl shrink-0'>
            {(tutor.user?.name ?? '?')[0].toUpperCase()}
          </div>
          <div className='flex-1 space-y-2'>
            <div>
              <h1 className='text-2xl font-bold'>{tutor.user?.name ?? 'Tutor'}</h1>
              <p className='text-muted-foreground font-medium'>{categoryName}</p>
            </div>
            {tutor.subject && tutor.subject.length > 0 && (
              <div className='flex flex-wrap gap-2 pt-1'>
                {tutor.subject.map(s => (
                  <span key={s} className='text-xs bg-muted px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5'>
                    <BookOpen className='h-3 w-3' />
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className='bg-muted/50 rounded-xl p-4 flex gap-6 shrink-0'>
            <div>
              <p className='text-xs text-muted-foreground uppercase font-semibold tracking-wider'>Rate</p>
              <p className='text-lg font-bold'>${tutor.hourlyPrice ?? 0}<span className='text-sm font-normal text-muted-foreground'>/hr</span></p>
            </div>
            <div>
              <p className='text-xs text-muted-foreground uppercase font-semibold tracking-wider'>Rating</p>
              <p className='text-lg font-bold flex items-center gap-1 text-yellow-600'>
                <Star className='h-4 w-4 fill-yellow-400 stroke-yellow-400' />
                {tutor.rating?.toFixed(1) ?? 'New'}
              </p>
            </div>
            <div>
              <p className='text-xs text-muted-foreground uppercase font-semibold tracking-wider'>Reviews</p>
              <p className='text-lg font-bold'>{reviews.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Left Column: Bio & Reviews */}
        <div className='md:col-span-2 space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <User className='h-5 w-5 text-blue-500' />
                About Me
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground whitespace-pre-wrap leading-relaxed'>
                {tutor.bio ?? 'This tutor has not added a bio yet.'}
              </p>
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <MessageSquare className='h-5 w-5 text-amber-500' />
                Student Reviews
              </CardTitle>
              <CardDescription>
                {reviews.length > 0
                  ? `${reviews.length} review${reviews.length !== 1 ? 's' : ''} from students`
                  : 'No reviews yet'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reviews.length === 0 ? (
                <p className='text-sm text-muted-foreground'>This tutor hasn't received any reviews yet. Be the first to book and review!</p>
              ) : (
                <ul className='space-y-4'>
                  {reviews.map((review) => (
                    <li key={review.id} className='border rounded-lg p-4 space-y-2'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <div className='h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs'>
                            {(review.student?.name ?? '?')[0].toUpperCase()}
                          </div>
                          <div>
                            <p className='text-sm font-medium'>{review.student?.name ?? 'Student'}</p>
                            {review.createdAt && (
                              <p className='text-xs text-muted-foreground'>
                                {new Date(review.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className='flex items-center gap-1'>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < review.rating
                                  ? 'fill-yellow-400 stroke-yellow-400'
                                  : 'fill-muted stroke-muted-foreground'
                              }`}
                            />
                          ))}
                          <span className='text-xs text-muted-foreground ml-1'>{review.rating}/5</span>
                        </div>
                      </div>
                      {review.comment && (
                        <p className='text-sm text-muted-foreground leading-relaxed'>{review.comment}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Availability / Booking */}
        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Clock className='h-5 w-5 text-green-500' />
                Available Slots
              </CardTitle>
              <CardDescription>Click a slot to book a session.</CardDescription>
            </CardHeader>
            <CardContent>
              {availability.length === 0 ? (
                <p className='text-sm text-muted-foreground'>No availability set.</p>
              ) : (
                <div className='space-y-4'>
                  {Object.entries(
                    availability.reduce((acc, slot) => {
                      if (!acc[slot.day]) acc[slot.day] = []
                      acc[slot.day].push(slot.time)
                      return acc
                    }, {} as Record<string, string[]>)
                  ).map(([day, times]) => (
                    <div key={day} className='space-y-2'>
                      <p className='text-sm font-semibold'>{day}</p>
                      <div className='flex flex-wrap gap-2'>
                        {times.map(time => (
                          <Button 
                            key={time} 
                            variant='outline' 
                            size='sm'
                            disabled={booking}
                            onClick={() => handleBook(day, time)}
                            className='hover:bg-primary hover:text-primary-foreground'
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related Tutors */}
      {relatedTutors.length > 0 && (
        <div className='pt-10'>
          <h2 className='text-2xl font-bold mb-6'>Similar Tutors</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
            {relatedTutors.map((rt) => (
              <Card key={rt.id} className='bg-slate-900/60 border-white/10 hover:border-white/20 transition-all cursor-pointer' onClick={() => router.push(`/tutors/${rt.id}`)}>
                <CardContent className='p-5 flex flex-col items-center text-center'>
                  <div className='h-16 w-16 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xl mb-3'>
                    {(rt.user?.name ?? '?')[0].toUpperCase()}
                  </div>
                  <h3 className='font-bold'>{rt.user?.name ?? 'Tutor'}</h3>
                  <p className='text-xs text-muted-foreground mt-1'>
                    {rt.category?.name ?? rt.categories?.[0]?.name ?? 'General'}
                  </p>
                  <div className='flex items-center gap-1 mt-3 text-sm'>
                    <Star className='h-3.5 w-3.5 fill-yellow-400 stroke-yellow-400' />
                    {rt.rating?.toFixed(1) ?? 'New'}
                    <span className='mx-2 text-muted-foreground'>•</span>
                    <span className='font-semibold'>${rt.hourlyPrice ?? 0}/hr</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
