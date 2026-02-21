import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: any) => {
  const d = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[ADMIN-RETENTION] ${step}${d}`);
};

// ━━━ Same config as process-retention-sms ━━━
const RETENTION_CONFIG = {
  dayOffsets: { step1: 9, step2: 11, step3: 13 } as Record<string, number>,
  templates: {
    step1:
      "Hey {{first_name}}, your free Darker Digital site is almost ready to go live. Turn it on now so you can start taking bookings before your trial ends.",
    step2:
      "Detailers using Darker Digital are booking more jobs without touching their phones. Your site is 90% done – flip it live and start capturing leads.",
    step3:
      "Last day before your Darker Digital trial ends. Turn your site on now to keep it and start taking bookings: {{activation_link}}",
  } as Record<string, string>,
};

const ACTIVATION_LINK = "https://darker-digital.lovable.app/dashboard/website";

async function sendTwilioSms(
  to: string,
  body: string,
): Promise<{ success: boolean; error?: string }> {
  const sid = Deno.env.get("TWILIO_ACCOUNT_SID");
  const token = Deno.env.get("TWILIO_AUTH_TOKEN");
  const from = Deno.env.get("TWILIO_PHONE_NUMBER");

  if (!sid || !token || !from) {
    return { success: false, error: "Twilio credentials not configured" };
  }

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
    const formData = new URLSearchParams();
    formData.append("To", to);
    formData.append("From", from);
    formData.append("Body", body);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${sid}:${token}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, error: errText };
    }
    await res.json();
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

function interpolateTemplate(template: string, firstName: string): string {
  return template
    .replace(/\{\{first_name\}\}/g, firstName || "there")
    .replace(/\{\{activation_link\}\}/g, ACTIVATION_LINK);
}

// ━━━ ADMIN HANDLER ━━━
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth: verify caller is admin
    const authHeader = req.headers.get("authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );

    // Verify user
    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      {
        auth: { persistSession: false },
        global: { headers: { Authorization: `Bearer ${token}` } },
      },
    );
    const { data: { user }, error: authErr } = await supabaseUser.auth.getUser();
    if (authErr || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check admin role
    const { data: role } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!role) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { action } = body;

    logStep("Action requested", { action, by: user.id });

    // ━━━ ACTION: LIST ━━━
    if (action === "list") {
      const now = new Date();

      // Get all trial users
      const { data: profiles } = await supabaseAdmin
        .from("profiles")
        .select("user_id, business_name, email, phone, trial_active, trial_ends_at, onboarding_complete, slug, sms_consent, created_at")
        .eq("trial_active", true)
        .not("trial_ends_at", "is", null);

      // Get all retention events
      const { data: allEvents } = await supabaseAdmin
        .from("trial_retention_sms")
        .select("user_id, step, sent_at, is_test, error");

      const eventsMap = new Map<string, any[]>();
      for (const e of allEvents || []) {
        const arr = eventsMap.get(e.user_id) || [];
        arr.push(e);
        eventsMap.set(e.user_id, arr);
      }

      const users = (profiles || [])
        .filter((p) => !p.onboarding_complete || !p.slug) // NOT activated
        .map((p) => {
          const trialEnd = new Date(p.trial_ends_at);
          const trialStart = new Date(trialEnd.getTime() - 14 * 24 * 60 * 60 * 1000);
          const daysSinceStart = Math.floor(
            (now.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24),
          );
          const events = eventsMap.get(p.user_id) || [];
          const maxStep = events.length > 0 ? Math.max(...events.map((e) => e.step)) : 0;
          const lastSentAt = events.length > 0
            ? events.sort((a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime())[0].sent_at
            : null;

          return {
            user_id: p.user_id,
            business_name: p.business_name,
            email: p.email,
            phone: p.phone,
            trial_start: trialStart.toISOString(),
            trial_ends_at: p.trial_ends_at,
            days_in_trial: daysSinceStart,
            onboarding_complete: p.onboarding_complete,
            slug: p.slug,
            sms_consent: p.sms_consent,
            retention_step: maxStep,
            last_sent_at: lastSentAt,
            events,
          };
        });

      return new Response(JSON.stringify({ users }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ━━━ ACTION: SEND ━━━
    if (action === "send") {
      const { user_id: targetUserId, step } = body;
      if (!targetUserId || !step || step < 1 || step > 3) {
        return new Response(JSON.stringify({ error: "Invalid user_id or step (1-3)" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Get user profile
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("user_id, business_name, phone")
        .eq("user_id", targetUserId)
        .single();

      if (!profile || !profile.phone) {
        return new Response(JSON.stringify({ error: "User not found or no phone number" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const firstName = (profile.business_name || "").split(" ")[0] || "there";
      const templateKey = `step${step}`;
      const template = RETENTION_CONFIG.templates[templateKey];
      const smsBody = interpolateTemplate(template, firstName);

      logStep("Sending test SMS", { targetUserId, step, phone: profile.phone });

      const result = await sendTwilioSms(profile.phone, smsBody);

      // Record event
      await supabaseAdmin.from("trial_retention_sms").insert({
        user_id: targetUserId,
        step,
        phone: profile.phone,
        is_test: true,
        error: result.success ? null : result.error,
      });

      return new Response(
        JSON.stringify({ success: result.success, error: result.error }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ━━━ ACTION: SEND_NEXT ━━━
    if (action === "send_next") {
      const { user_id: targetUserId } = body;
      if (!targetUserId) {
        return new Response(JSON.stringify({ error: "Missing user_id" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("user_id, business_name, phone")
        .eq("user_id", targetUserId)
        .single();

      if (!profile || !profile.phone) {
        return new Response(JSON.stringify({ error: "User not found or no phone" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Get sent steps
      const { data: sentSteps } = await supabaseAdmin
        .from("trial_retention_sms")
        .select("step")
        .eq("user_id", targetUserId);

      const sentSet = new Set((sentSteps || []).map((s) => s.step));
      let nextStep: number | null = null;
      if (!sentSet.has(1)) nextStep = 1;
      else if (!sentSet.has(2)) nextStep = 2;
      else if (!sentSet.has(3)) nextStep = 3;

      if (!nextStep) {
        return new Response(JSON.stringify({ error: "All 3 steps already sent" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const firstName = (profile.business_name || "").split(" ")[0] || "there";
      const template = RETENTION_CONFIG.templates[`step${nextStep}`];
      const smsBody = interpolateTemplate(template, firstName);

      const result = await sendTwilioSms(profile.phone, smsBody);

      await supabaseAdmin.from("trial_retention_sms").insert({
        user_id: targetUserId,
        step: nextStep,
        phone: profile.phone,
        is_test: true,
        error: result.success ? null : result.error,
      });

      return new Response(
        JSON.stringify({ success: result.success, step: nextStep, error: result.error }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ━━━ ACTION: RESET ━━━
    if (action === "reset") {
      const { user_id: targetUserId } = body;
      if (!targetUserId) {
        return new Response(JSON.stringify({ error: "Missing user_id" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error: delErr } = await supabaseAdmin
        .from("trial_retention_sms")
        .delete()
        .eq("user_id", targetUserId);

      if (delErr) throw delErr;

      logStep("Reset retention for user", { targetUserId });

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    logStep("ERROR", { message: err.message });
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
