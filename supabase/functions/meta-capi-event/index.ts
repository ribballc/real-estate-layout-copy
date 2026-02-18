import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

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

    // Build user_data with hashed PII
    const user_data: Record<string, any> = {};
    if (userData.email) user_data.em = [await hashValue(userData.email)];
    if (userData.firstName) user_data.fn = [await hashValue(userData.firstName)];
    if (userData.phone) {
      const cleaned = userData.phone.replace(/\D/g, "");
      if (cleaned) user_data.ph = [await hashValue(cleaned)];
    }
    if (userData.clientIpAddress) user_data.client_ip_address = userData.clientIpAddress;
    if (userData.clientUserAgent) user_data.client_user_agent = userData.clientUserAgent;
    if (userData.fbp) user_data.fbp = userData.fbp;
    if (userData.fbc) user_data.fbc = userData.fbc;

    const payload = {
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
      // TODO: Uncomment during testing, remove for production
      // test_event_code: 'TEST12345',
    };

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
