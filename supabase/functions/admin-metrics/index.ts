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
    // Verify admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Unauthorized");
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) throw new Error("Unauthorized");

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleData) throw new Error("Forbidden: not admin");

    // Get all users
    const { data: authUsers } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    const users = authUsers?.users ?? [];

    // Get all profiles
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, business_name, email, subscription_status, subscription_plan, trial_active, trial_ends_at, subscription_ends_at, onboarding_complete, created_at, stripe_customer_id, requested_domain, domain_requested_at, custom_domain");

    const profileMap = new Map<string, any>();
    for (const p of profiles ?? []) profileMap.set(p.user_id, p);

    // Calculate metrics
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const MONTHLY_PRICE = 79;
    const ANNUAL_MONTHLY = 54;

    let activeMonthly = 0;
    let activeAnnual = 0;
    let totalActive = 0;
    let totalTrialing = 0;
    let totalCanceled30d = 0;
    let signups30d = 0;
    let onboardingComplete = 0;
    let activated = 0;

    const userList: any[] = [];

    for (const u of users) {
      const p = profileMap.get(u.id);
      const createdAt = new Date(u.created_at);
      const isRecent = createdAt >= thirtyDaysAgo;

      if (isRecent) signups30d++;
      if (p?.onboarding_complete) onboardingComplete++;

      const status = p?.subscription_status || "none";
      const plan = p?.subscription_plan;

      if (status === "active" || status === "trialing") {
        totalActive++;
        if (status === "trialing") totalTrialing++;
        if (p?.trial_active) activated++;
        if (plan === "monthly") activeMonthly++;
        else if (plan === "annual") activeAnnual++;
      }

      if (status === "canceled" && p?.subscription_ends_at) {
        const cancelDate = new Date(p.subscription_ends_at);
        if (cancelDate >= thirtyDaysAgo) totalCanceled30d++;
      }

      userList.push({
        id: u.id,
        email: u.email || p?.email || "",
        name: p?.business_name || "",
        createdAt: u.created_at,
        status,
        plan: plan || null,
        trialEndsAt: p?.trial_ends_at || null,
        activated: p?.trial_active || false,
        onboardingComplete: p?.onboarding_complete || false,
        requestedDomain: p?.requested_domain || null,
        domainRequestedAt: p?.domain_requested_at || null,
        customDomain: p?.custom_domain || null,
      });
    }

    const mrrMonthly = activeMonthly * MONTHLY_PRICE;
    const mrrAnnual = activeAnnual * ANNUAL_MONTHLY;
    const mrr = mrrMonthly + mrrAnnual;

    // Build monthly MRR history (approximate from current data - simplified)
    // In production you'd query Stripe for historical data
    const mrrHistory: any[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      mrrHistory.push({
        month: d.toISOString().slice(0, 7),
        label: d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        monthly: i === 0 ? mrrMonthly : 0,
        annual: i === 0 ? mrrAnnual : 0,
        total: i === 0 ? mrr : 0,
      });
    }

    const totalUsers = users.length;
    const activeLastMonth = totalActive + totalCanceled30d;
    const churnRate = activeLastMonth > 0 ? (totalCanceled30d / activeLastMonth) * 100 : 0;
    const onboardingRate = signups30d > 0 ? (onboardingComplete / totalUsers) * 100 : 0;
    const activationRate = totalUsers > 0 ? (activated / totalUsers) * 100 : 0;
    const trialToPaidRate = (totalTrialing + totalActive) > 0
      ? ((totalActive - totalTrialing) / (totalTrialing + totalActive - totalTrialing || 1)) * 100
      : 0;

    // Sort users by created desc
    userList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return new Response(JSON.stringify({
      mrr,
      arr: mrr * 12,
      mrrMonthly,
      mrrAnnual,
      totalActive,
      totalUsers,
      signups30d,
      onboardingRate: Math.round(onboardingRate * 10) / 10,
      activationRate: Math.round(activationRate * 10) / 10,
      trialToPaidRate: Math.round(trialToPaidRate * 10) / 10,
      churnRate: Math.round(churnRate * 10) / 10,
      mrrHistory,
      users: userList.slice(0, 50),
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    const status = msg.includes("Unauthorized") || msg.includes("Forbidden") ? 403 : 500;
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status,
    });
  }
});
