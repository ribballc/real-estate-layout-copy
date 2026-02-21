import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: any) => {
  const d = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[RETENTION-SMS] ${step}${d}`);
};

// ━━━ CONFIG ━━━
// Centralised config — tweak days and copy here without editing core logic.
const RETENTION_CONFIG = {
  enabled: true,
  // Days since trial start when each step fires
  dayOffsets: { step1: 9, step2: 11, step3: 13 } as Record<string, number>,
  // SMS templates — {{first_name}} and {{activation_link}} are interpolated at send time
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

// ━━━ TWILIO HELPER ━━━
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
    const data = await res.json();
    logStep("SMS sent", { sid: data.sid, to });
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

function interpolateTemplate(
  template: string,
  firstName: string,
): string {
  return template
    .replace(/\{\{first_name\}\}/g, firstName || "there")
    .replace(/\{\{activation_link\}\}/g, ACTIVATION_LINK);
}

// ━━━ MAIN HANDLER (called by daily cron) ━━━
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Job started");

    if (!RETENTION_CONFIG.enabled) {
      logStep("Feature disabled, skipping");
      return new Response(JSON.stringify({ skipped: true, reason: "disabled" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );

    const now = new Date();

    // Query trial users who:
    // - trial_active = true AND trial_ends_at in the future
    // - NOT activated: onboarding_complete = false OR slug IS NULL
    // - Have a phone number
    // - sms_consent = true
    const { data: eligibleUsers, error: queryErr } = await supabase
      .from("profiles")
      .select("user_id, business_name, phone, trial_ends_at, onboarding_complete, slug, sms_consent")
      .eq("trial_active", true)
      .eq("sms_consent", true)
      .not("trial_ends_at", "is", null)
      .not("phone", "eq", "")
      .gte("trial_ends_at", now.toISOString());

    if (queryErr) throw queryErr;

    // Filter in code: NOT activated = onboarding_complete false OR slug null
    const targetUsers = (eligibleUsers || []).filter(
      (u) => !u.onboarding_complete || !u.slug,
    );

    logStep("Eligible users found", { total: eligibleUsers?.length, targeted: targetUsers.length });

    let sent = 0;
    let errors = 0;

    for (const user of targetUsers) {
      try {
        // Compute days since trial start (trial is 14 days)
        const trialEnd = new Date(user.trial_ends_at);
        const trialStart = new Date(trialEnd.getTime() - 14 * 24 * 60 * 60 * 1000);
        const daysSinceStart = Math.floor(
          (now.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24),
        );

        // Get already-sent steps for this user
        const { data: sentSteps } = await supabase
          .from("trial_retention_sms")
          .select("step")
          .eq("user_id", user.user_id);

        const sentStepNumbers = new Set((sentSteps || []).map((s) => s.step));

        // Determine which step to send
        let stepToSend: number | null = null;
        if (!sentStepNumbers.has(1) && daysSinceStart >= RETENTION_CONFIG.dayOffsets.step1) {
          stepToSend = 1;
        } else if (!sentStepNumbers.has(2) && daysSinceStart >= RETENTION_CONFIG.dayOffsets.step2) {
          stepToSend = 2;
        } else if (!sentStepNumbers.has(3) && daysSinceStart >= RETENTION_CONFIG.dayOffsets.step3) {
          stepToSend = 3;
        }

        if (!stepToSend) continue;

        const firstName = (user.business_name || "").split(" ")[0] || "there";
        const templateKey = `step${stepToSend}`;
        const template = RETENTION_CONFIG.templates[templateKey];
        const body = interpolateTemplate(template, firstName);

        logStep("Sending SMS", { userId: user.user_id, step: stepToSend, daysSinceStart });

        const result = await sendTwilioSms(user.phone, body);

        // Record the event
        await supabase.from("trial_retention_sms").insert({
          user_id: user.user_id,
          step: stepToSend,
          phone: user.phone,
          is_test: false,
          error: result.success ? null : result.error,
        });

        if (result.success) {
          sent++;
        } else {
          errors++;
          logStep("Send error", { userId: user.user_id, step: stepToSend, error: result.error });
        }
      } catch (userErr: any) {
        errors++;
        logStep("User processing error", { userId: user.user_id, error: userErr.message });
      }
    }

    logStep("Job complete", { processed: targetUsers.length, sent, errors });

    return new Response(
      JSON.stringify({ processed: targetUsers.length, sent, errors }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err: any) {
    logStep("FATAL ERROR", { message: err.message });
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
