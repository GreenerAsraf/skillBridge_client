import { apiFetch } from './api'

type BookingLike = {
  id?: string
  status?: string
  paymentUrl?: string
  booking?: { id?: string; status?: string }
}

type ApiPayload = {
  data?: BookingLike
  paymentUrl?: string
}

export type { ApiPayload }

export function extractPaymentUrl(payload: ApiPayload | null | undefined): string | null {
  if (!payload) return null
  return payload.data?.paymentUrl ?? payload.paymentUrl ?? null
}

export function extractBookingMeta(payload: ApiPayload | null | undefined): {
  bookingId: string | null
  status: string | null
  paymentUrl: string | null
} {
  const data = payload?.data
  if (!data) {
    return { bookingId: null, status: null, paymentUrl: extractPaymentUrl(payload) }
  }

  const bookingId = data.booking?.id ?? data.id ?? null
  const status = data.booking?.status ?? data.status ?? null
  const paymentUrl = extractPaymentUrl(payload)

  return { bookingId, status, paymentUrl }
}

export type BookingPaymentOutcome =
  | { type: 'redirect'; url: string }
  | { type: 'confirmed'; bookingId: string }

/** Handle booking create responses whether or not the backend embeds a payment URL. */
export async function resolveBookingPayment(
  bookingRes: ApiPayload
): Promise<BookingPaymentOutcome | null> {
  const { bookingId, status, paymentUrl } = extractBookingMeta(bookingRes)

  if (paymentUrl) {
    return { type: 'redirect', url: paymentUrl }
  }

  if (!bookingId) return null

  if (status === 'CONFIRMED') {
    return { type: 'confirmed', bookingId }
  }

  if (status === 'PENDING') {
    const initRes = await apiFetch<ApiPayload>(`/api/payment/initiate/${bookingId}`, {
      method: 'POST',
    })
    const url = extractPaymentUrl(initRes)
    if (url) return { type: 'redirect', url }
  }

  return null
}

/** Initiate payment for an existing pending booking. */
export async function initiateBookingPayment(bookingId: string): Promise<string | null> {
  const res = await apiFetch<ApiPayload>(`/api/payment/initiate/${bookingId}`, {
    method: 'POST',
  })
  return extractPaymentUrl(res)
}
