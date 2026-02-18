import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: any) => {
  const d = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[CHECK-SUBSCRIPTION] ${step}${d}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    if (customers.data.length === 0) {
      logStep("No Stripe customer found");
      await supabaseClient
        .from("profiles")
        .update({
          trial_active: false,
          subscription_status: "none",
          subscription_plan: null,
          stripe_customer_id: null,
          stripe_subscription_id: null,
          trial_ends_at: null,
          subscription_ends_at: null,
        })
        .eq("user_id", user.id);
      return new Response(JSON.stringify({
        subscribed: false,
        status: "none",
        plan: null,
        trialEnd: null,
        cancelAtPeriodEnd: false,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    // Get all subscriptions (active, trialing, past_due)
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 10,
    });

    // Find the most relevant subscription
    const activeSub = subscriptions.data.find(s =>
      ["active", "trialing", "past_due"].includes(s.status)
    );

    let status = "none";
    let plan: string | null = null;
    let trialEnd: string | null = null;
    let subscriptionEnd: string | null = null;
    let subscriptionId: string | null = null;
    let cancelAtPeriodEnd = false;

    if (activeSub) {
      status = activeSub.status;
      subscriptionId = activeSub.id;
      cancelAtPeriodEnd = activeSub.cancel_at_period_end;

      if (activeSub.trial_end) {
        trialEnd = new Date(activeSub.trial_end * 1000).toISOString();
      }
      subscriptionEnd = new Date(activeSub.current_period_end * 1000).toISOString();

      // Determine plan from price
      const priceId = activeSub.items.data[0]?.price?.id;
      if (priceId === "price_1T1JeMP734Q0ltptDuj5K6Na") {
        plan = "annual";
      } else if (priceId === "price_1T1I5SP734Q0ltptMJmmSvok") {
        plan = "monthly";
      } else {
        plan = "monthly"; // fallback
      }

      logStep("Active subscription found", { status, plan, subscriptionId });
    } else {
      // Check for canceled
      const canceled = subscriptions.data.find(s => s.status === "canceled");
      if (canceled) status = "canceled";
      logStep("No active subscription", { status });
    }

    const isActive = ["active", "trialing"].includes(status);

    await supabaseClient
      .from("profiles")
      .update({
        trial_active: isActive,
        subscription_status: status,
        subscription_plan: plan,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        trial_ends_at: trialEnd,
        subscription_ends_at: subscriptionEnd,
      })
      .eq("user_id", user.id);

    logStep("Profile updated", { trial_active: isActive, status, plan });

    return new Response(JSON.stringify({
      subscribed: isActive,
      status,
      plan,
      trialEnd,
      subscriptionEnd,
      cancelAtPeriodEnd,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
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
