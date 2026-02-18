import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Unauthorized");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: authError } = await supabase.auth.getUser(token);
    if (authError || !userData.user) throw new Error("Unauthorized");

    const userId = userData.user.id;
    const deletedLabel = `deleted_user_${userId.slice(0, 8)}`;

    // 1. Cancel Stripe subscription if exists
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_subscription_id, stripe_customer_id")
      .eq("user_id", userId)
      .single();

    if (profile?.stripe_subscription_id) {
      const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
      if (stripeKey) {
        const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
        try {
          await stripe.subscriptions.cancel(profile.stripe_subscription_id);
        } catch (e) {
          console.log("Stripe cancel error (may already be canceled):", e.message);
        }
      }
    }

    // 2. Anonymize profile data
    await supabase
      .from("profiles")
      .update({
        business_name: deletedLabel,
        email: `${deletedLabel}@deleted.local`,
        phone: "",
        address: "",
        tagline: "",
        instagram: "",
        facebook: "",
        tiktok: "",
        youtube: "",
        google_business: "",
        logo_url: null,
        account_deleted: true,
        deleted_at: new Date().toISOString(),
        subscription_status: "canceled",
      })
      .eq("user_id", userId);

    // 3. Anonymize customer-facing data
    await supabase
      .from("bookings")
      .update({ customer_name: "Deleted", customer_email: "", customer_phone: "" })
      .eq("user_id", userId);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: e.message === "Unauthorized" ? 401 : 500,
    });
  }
});
