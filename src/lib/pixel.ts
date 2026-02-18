// Meta Pixel utility — safe wrapper for browser-side events
// TODO: Replace with your actual Meta Pixel ID
export const PIXEL_ID = 'PIXEL_ID_HERE'

/**
 * Safe fbq wrapper — never throws if pixel not loaded or blocked
 */
export function fbqEvent(
  type: 'track' | 'trackCustom',
  eventName: string,
  params?: Record<string, unknown>,
  eventId?: string
) {
  try {
    if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
      const options = eventId ? { eventID: eventId } : {}
      ;(window as any).fbq(type, eventName, params || {}, options)
    }
  } catch (e) {
    console.debug('[Meta Pixel] Event dropped:', eventName, e)
  }
}

/**
 * Generate a unique event ID for deduplication between
 * browser pixel and Conversions API
 */
export function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Set user data on the pixel for advanced matching
 */
export function setPixelUserData(user: {
  email?: string
  firstName?: string
  phone?: string
}) {
  try {
    if (typeof (window as any).fbq === 'function') {
      ;(window as any).fbq('init', PIXEL_ID, {
        em: user.email || '',
        fn: user.firstName || '',
        ph: user.phone || '',
      })
    }
    // Also set on window for the base pixel init
    if (user.email) (window as any).__darker_user_email = user.email
    if (user.firstName) (window as any).__darker_user_first_name = user.firstName
    if (user.phone) (window as any).__darker_user_phone = user.phone
  } catch (e) {
    // fail silently
  }
}
