import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/** SHA-256 hash for PII normalization (Meta requires lowercase, trimmed, hashed) */
async function hashValue(value: string): Promise<string> {
  const normalized = value.toLowerCase().trim();
  const msgBuffer = new TextEncoder().encode(normalized);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Normalize phone to E.164 digits-only format before hashing */
function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  // US 10-digit → prepend country code
  if (digits.length === 10) return "1" + digits;
  // Already 11 digits starting with 1 (US with country code)
  if (digits.length === 11 && digits.startsWith("1")) return digits;
  // International — return as-is
  return digits;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const META_PIXEL_ID = Deno.env.get("META_PIXEL_ID");
  const META_CAPI_ACCESS_TOKEN = Deno.env.get("META_CAPI_ACCESS_TOKEN");

  if (!META_PIXEL_ID || !META_CAPI_ACCESS_TOKEN) {
    console.warn("[META-CAPI] Missing META_PIXEL_ID or META_CAPI_ACCESS_TOKEN — event dropped");
    return new Response(JSON.stringify({ warning: "Meta CAPI not configured" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const {
      eventName,
      eventId,
      eventTime,
      userData = {},
      customData = {},
      eventSourceUrl,
    } = await req.json();

    if (!eventName || !eventId) {
      return new Response(JSON.stringify({ error: "eventName and eventId required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Extract client IP from request headers
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-real-ip") ||
      undefined;

    // Build user_data with hashed PII
    const user_data: Record<string, any> = {};

    // em — email (critical, highest EMQ weight)
    if (userData.email) user_data.em = [await hashValue(userData.email)];

    // fn — first name
    if (userData.firstName) user_data.fn = [await hashValue(userData.firstName)];

    // ln — last name
    if (userData.lastName) user_data.ln = [await hashValue(userData.lastName)];

    // ph — phone (normalize to E.164 before hashing)
    if (userData.phone) {
      const normalized = normalizePhone(userData.phone);
      if (normalized) user_data.ph = [await hashValue(normalized)];
    }

    // external_id — Supabase user ID
    if (userData.externalId) user_data.external_id = [await hashValue(userData.externalId)];

    // Non-hashed fields
    if (clientIp) user_data.client_ip_address = clientIp;
    if (userData.clientUserAgent) user_data.client_user_agent = userData.clientUserAgent;
    if (userData.fbp) user_data.fbp = userData.fbp;
    if (userData.fbc) user_data.fbc = userData.fbc;

    const payload: Record<string, any> = {
      data: [
        {
          event_name: eventName,
          event_time: eventTime || Math.floor(Date.now() / 1000),
          event_id: eventId,
          event_source_url: eventSourceUrl || "https://darkerdigital.com",
          action_source: "website",
          user_data,
          custom_data: customData,
        },
      ],
    };

    // Include test event code if set (remove for production)
    const testCode = Deno.env.get("META_TEST_EVENT_CODE");
    if (testCode) {
      payload.test_event_code = testCode;
    }

    const response = await fetch(
      `https://graph.facebook.com/v19.0/${META_PIXEL_ID}/events?access_token=${META_CAPI_ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    console.log("[META-CAPI] Event sent:", eventName, "eventId:", eventId, "response:", JSON.stringify(result));

    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[META-CAPI] Error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
