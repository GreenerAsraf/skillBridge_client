/**
 * API Fetch Helper Utility
 * Handles HTTP requests, JWT token authorization headers, and cookies.
 */
import { getToken } from './auth-client'

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, '') ?? ''


export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include', // sends cookies if any
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  let json: any = null
  const contentType = res.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    const text = await res.text()
    if (text) {
      try {
        json = JSON.parse(text)
      } catch {
        // ignore parsing error
      }
    }
  }

  if (!res.ok) {
    throw new Error(json?.message || `Request failed with status ${res.status}`)
  }
  return json as T
}
