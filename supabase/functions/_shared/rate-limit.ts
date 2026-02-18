// Shared rate-limiting helper for edge functions
// Import: import { checkRateLimit } from "../_shared/rate-limit.ts";

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const MAX_REQUESTS = 10;
const WINDOW_MS = 60_000; // 1 minute

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

export async function checkRateLimit(
  req: Request,
  endpoint: string
): Promise<{ allowed: boolean; response?: Response }> {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown";

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const windowStart = new Date(Date.now() - WINDOW_MS).toISOString();

    const { count } = await supabase
      .from("rate_limits")
      .select("id", { count: "exact", head: true })
      .eq("ip_address", ip)
      .eq("endpoint", endpoint)
      .gte("window_start", windowStart);

    if ((count || 0) >= MAX_REQUESTS) {
      return {
        allowed: false,
        response: new Response(
          JSON.stringify({ error: "Too many requests. Please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json", "Retry-After": "60" },
          }
        ),
      };
    }

    await supabase.from("rate_limits").insert({
      ip_address: ip,
      endpoint,
      window_start: new Date().toISOString(),
    });

    return { allowed: true };
  } catch (err) {
    console.error("Rate limit check failed:", err);
    return { allowed: true }; // Fail open
  }
}
