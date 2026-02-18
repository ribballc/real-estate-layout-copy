/**
 * Unified Meta Pixel (browser) + Conversions API (server) tracking.
 * Every event fires both channels with a shared eventId for deduplication.
 * Automatically enriches events with logged-in user profile data for max EMQ.
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
  type?: 'track' | 'trackCustom'
  userData?: {
    email?: string
    phone?: string
    firstName?: string
    lastName?: string
    externalId?: string
  }
  customData?: Record<string, unknown>
}

// ── Enrichment cache (avoid repeated DB calls per page) ─────
let _enrichedCache: {
  data: TrackEventParams['userData'] & { fbc_override?: string; fbp_override?: string } | null
  ts: number
} = { data: null, ts: 0 }

const CACHE_TTL = 60_000 // 1 minute

export async function getEnrichedUserData(): Promise<
  (TrackEventParams['userData'] & { fbc_override?: string; fbp_override?: string }) | null
> {
  // Return cache if fresh
  if (_enrichedCache.data && Date.now() - _enrichedCache.ts < CACHE_TTL) {
    return _enrichedCache.data
  }

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase
      .from('profiles')
      .select('business_name, phone, fbc, fbp, user_id')
      .eq('user_id', user.id)
      .single()

    const nameParts = (profile?.business_name || '').trim().split(' ')

    const enriched = {
      email: user.email,
      phone: profile?.phone || undefined,
      firstName: nameParts[0] || undefined,
      lastName: nameParts.length > 1 ? nameParts[nameParts.length - 1] : undefined,
      externalId: user.id,
      fbc_override: profile?.fbc || undefined,
      fbp_override: profile?.fbp || undefined,
    }

    _enrichedCache = { data: enriched, ts: Date.now() }
    return enriched
  } catch {
    return null
  }
}

// ── Capture & store FB cookies on first touch ───────────────
export async function captureAndStoreFbCookies(userId: string) {
  const fbc = getCookie('_fbc')
  const fbp = getCookie('_fbp')

  if (!fbc && !fbp) return

  try {
    // Only set once — first touch (fbc IS NULL means not yet captured)
    await supabase
      .from('profiles')
      .update({
        ...(fbc ? { fbc } : {}),
        ...(fbp ? { fbp } : {}),
        acquisition_landing_url: window.location.href,
      })
      .eq('user_id', userId)
      .is('fbc', null)
  } catch {
    // silent
  }
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

  // 2. Enrich with profile data (merge: caller overrides enriched)
  let mergedUserData = { ...params.userData }
  try {
    const enriched = await getEnrichedUserData()
    if (enriched) {
      const { fbc_override, fbp_override, ...enrichedBase } = enriched
      // Enriched fills in blanks; caller's explicit values win
      mergedUserData = {
        ...enrichedBase,
        ...Object.fromEntries(
          Object.entries(params.userData || {}).filter(([, v]) => v !== undefined)
        ),
      }
      // Store overrides for CAPI below
      ;(mergedUserData as any)._fbc_override = fbc_override
      ;(mergedUserData as any)._fbp_override = fbp_override
    }
  } catch {
    // enrichment failure is non-blocking
  }

  // 3. Server-side CAPI fire
  try {
    const fbp = getCookie('_fbp') || (mergedUserData as any)?._fbp_override
    const fbc =
      getCookie('_fbc') ||
      (mergedUserData as any)?._fbc_override ||
      (() => {
        const fbclid = new URLSearchParams(window.location.search).get('fbclid')
        return fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined
      })()

    // Clean internal fields before sending
    const { _fbc_override, _fbp_override, ...cleanUserData } = mergedUserData as any

    await supabase.functions.invoke('meta-capi-event', {
      body: {
        eventName: params.eventName,
        eventId,
        eventTime: Math.floor(Date.now() / 1000),
        userData: {
          ...cleanUserData,
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
