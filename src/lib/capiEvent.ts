import { supabase } from '@/integrations/supabase/client'

/**
 * Send a server-side Conversions API event via edge function.
 * Fires and forgets — browser pixel already handles the primary tracking.
 */
export async function sendCapiEvent(params: {
  eventName: string
  eventId: string
  userData?: {
    email?: string
    firstName?: string
    phone?: string
  }
  customData?: Record<string, unknown>
}) {
  try {
    // Get browser fingerprint cookies for matching quality
    const fbp = document.cookie
      .split(';')
      .find(c => c.trim().startsWith('_fbp='))
      ?.split('=')[1]

    const fbc = document.cookie
      .split(';')
      .find(c => c.trim().startsWith('_fbc='))
      ?.split('=')[1] ||
      // Check URL for fbclid param (first-click attribution)
      (new URLSearchParams(window.location.search).get('fbclid')
        ? `fb.1.${Date.now()}.${new URLSearchParams(window.location.search).get('fbclid')}`
        : undefined)

    await supabase.functions.invoke('meta-capi-event', {
      body: {
        eventName: params.eventName,
        eventId: params.eventId,
        eventTime: Math.floor(Date.now() / 1000),
        userData: {
          ...params.userData,
          clientUserAgent: navigator.userAgent,
          fbp,
          fbc,
        },
        customData: params.customData,
        eventSourceUrl: window.location.href,
      }
    })
  } catch (e) {
    // CAPI failure is silent — browser pixel already fired
    console.debug('[CAPI] Event failed:', params.eventName, e)
  }
}
