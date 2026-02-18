import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const d = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[CHURN-RISK] ${step}${d}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get all profiles that are active or trialing
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("user_id, trial_active, subscription_status, trial_ends_at, last_login_at, onboarding_complete")
      .in("subscription_status", ["trialing", "active"]);

    if (profilesError) throw profilesError;

    logStep("Fetched profiles", { count: profiles?.length });

    const now = new Date();
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    let flagged = 0;
    let cleared = 0;

    for (const profile of (profiles || [])) {
      let isChurnRisk = false;

      // Check 1: No bookings in last 14 days
      const { count: recentBookings } = await supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("user_id", profile.user_id)
        .gte("created_at", fourteenDaysAgo.toISOString());

      if ((recentBookings || 0) === 0) {
        isChurnRisk = true;
        logStep("No bookings in 14 days", { userId: profile.user_id });
      }

      // Check 2: Hasn't logged in in 7 days
      if (profile.last_login_at) {
        const lastLogin = new Date(profile.last_login_at);
        if (lastLogin < sevenDaysAgo) {
          isChurnRisk = true;
          logStep("No login in 7 days", { userId: profile.user_id });
        }
      }

      // Check 3: Trial ending in 3 days and not activated (no bookings at all)
      if (profile.subscription_status === "trialing" && profile.trial_ends_at) {
        const trialEnd = new Date(profile.trial_ends_at);
        if (trialEnd <= threeDaysFromNow && !profile.onboarding_complete) {
          isChurnRisk = true;
          logStep("Trial ending soon, not activated", { userId: profile.user_id });
        }
      }

      // Update the churn_risk flag
      await supabase
        .from("profiles")
        .update({ churn_risk: isChurnRisk })
        .eq("user_id", profile.user_id);

      if (isChurnRisk) flagged++;
      else cleared++;
    }

    logStep("Completed", { flagged, cleared, total: (profiles || []).length });

    return new Response(JSON.stringify({ flagged, cleared, total: (profiles || []).length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: msg });
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
