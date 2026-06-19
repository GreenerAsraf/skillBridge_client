import { apiFetch } from './api'
import {
  clearRecentBooking,
  getApiErrorMessage,
  isAccountRestrictedMessage,
  mergeRecentBooking,
  peekRecentBooking,
  type StoredBooking,
} from './recent-booking'

export async function fetchStudentBookings(): Promise<{
  bookings: StoredBooking[]
  warning?: string
}> {
  const recent = peekRecentBooking()

  try {
    const res = await apiFetch<{ data: StoredBooking[] }>('/api/bookings')
    return { bookings: mergeRecentBooking(res.data ?? [], recent) }
  } catch (error) {
    const message = getApiErrorMessage(error, 'Failed to load bookings')

    if (recent) {
      return {
        bookings: [recent],
        warning: 'Your latest booking was saved, but the server could not load your full booking history.',
      }
    }

    if (isAccountRestrictedMessage(message)) {
      throw new Error('Your account has been blocked. Please contact support or sign in with another account.')
    }

    throw new Error(message)
  }
}

export function buildStoredBooking(
  booking: StoredBooking,
  tutor?: { user?: { name: string }; hourlyPrice?: number }
): StoredBooking {
  return {
    ...booking,
    tutor: booking.tutor ?? (tutor ? { user: tutor.user, hourlyPrice: tutor.hourlyPrice } : undefined),
  }
}

export { clearRecentBooking, saveRecentBooking } from './recent-booking'
export type { StoredBooking } from './recent-booking'
