// Health check endpoint for uptime monitoring
// TODO: Set up Better Uptime or similar to ping /health every 60s
// and alert you via SMS if it goes down

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  let dbStatus = "disconnected";

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Simple connectivity check — count profiles (fast, always exists)
    const { error } = await supabase.from("profiles").select("id", { count: "exact", head: true }).limit(1);
    dbStatus = error ? "error" : "connected";
  } catch {
    dbStatus = "error";
  }

  return new Response(
    JSON.stringify({
      status: dbStatus === "connected" ? "ok" : "degraded",
      timestamp: Date.now(),
      db: dbStatus,
    }),
    {
      status: dbStatus === "connected" ? 200 : 503,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
});
