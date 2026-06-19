const RECENT_BOOKING_KEY = 'skillbridge_recent_booking'

export type StoredBooking = {
  id: string
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  date?: string
  startTime?: string
  endTime?: string
  scheduledAt?: string
  tutor?: { user?: { name: string }; hourlyPrice?: number }
  review?: { id: string } | null
}

export function saveRecentBooking(booking: StoredBooking) {
  if (typeof window === 'undefined' || !booking.id) return
  sessionStorage.setItem(RECENT_BOOKING_KEY, JSON.stringify(booking))
}

export function peekRecentBooking(): StoredBooking | null {
  if (typeof window === 'undefined') return null
  const raw = sessionStorage.getItem(RECENT_BOOKING_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as StoredBooking
  } catch {
    return null
  }
}

export function clearRecentBooking() {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(RECENT_BOOKING_KEY)
}

export function mergeRecentBooking(
  bookings: StoredBooking[],
  recent: StoredBooking | null
): StoredBooking[] {
  if (!recent?.id) return bookings
  if (bookings.some((booking) => booking.id === recent.id)) {
    clearRecentBooking()
    return bookings
  }
  return [recent, ...bookings]
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message
  return fallback
}

export function isAccountRestrictedMessage(message: string): boolean {
  const normalized = message.toLowerCase()
  return normalized.includes('blocked') || normalized.includes('banned')
}
