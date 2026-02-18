/**
 * Unified Meta Pixel (browser) + Conversions API (server) tracking.
 * Every event fires both channels with a shared eventId for deduplication.
 */
import { supabase } from '@/integrations/supabase/client'

const PIXEL_ID = '686595997751957'

// ── Cookie helpers ──────────────────────────────────────────
function getCookie(name: string): string | undefined {
  return document.cookie
    .split(';')
    .find(c => c.trim().startsWith(`${name}=`))
    ?.split('=')[1]
}

// ── Event ID generator ──────────────────────────────────────
export function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// ── Types ───────────────────────────────────────────────────
interface TrackEventParams {
  eventName: string
  eventId?: string
  /** 'track' for standard events, 'trackCustom' for custom */
  type?: 'track' | 'trackCustom'
  userData?: {
    email?: string
    phone?: string
    firstName?: string
    lastName?: string
    externalId?: string // Supabase user.id
  }
  customData?: Record<string, unknown>
}

// ── Main tracking function ──────────────────────────────────
export async function trackEvent(params: TrackEventParams) {
  const eventId = params.eventId || generateEventId()
  const type = params.type || 'track'

  // 1. Browser-side Pixel fire
  try {
    if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
      ;(window as any).fbq(
        type,
        params.eventName,
        params.customData || {},
        { eventID: eventId }
      )
    }
  } catch {
    // Pixel blocked or not loaded — silent
  }

  // 2. Server-side CAPI fire
  try {
    const fbp = getCookie('_fbp')
    const fbc =
      getCookie('_fbc') ||
      (() => {
        const fbclid = new URLSearchParams(window.location.search).get('fbclid')
        return fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined
      })()

    await supabase.functions.invoke('meta-capi-event', {
      body: {
        eventName: params.eventName,
        eventId,
        eventTime: Math.floor(Date.now() / 1000),
        userData: {
          ...params.userData,
          clientUserAgent: navigator.userAgent,
          fbp,
          fbc,
        },
        customData: params.customData,
        eventSourceUrl: window.location.href,
      },
    })
  } catch {
    // CAPI failure is silent — browser pixel already fired
  }
}

// ── PageView convenience ────────────────────────────────────
export function trackPageView() {
  trackEvent({
    eventName: 'PageView',
    type: 'track',
  })
}

// ── Set user data on browser pixel for advanced matching ────
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
    if (user.email) (window as any).__darker_user_email = user.email
    if (user.firstName) (window as any).__darker_user_first_name = user.firstName
    if (user.phone) (window as any).__darker_user_phone = user.phone
  } catch {
    // fail silently
  }
}
