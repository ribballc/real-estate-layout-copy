import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const logStep = (step: string, details?: any) => {
  const d = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[EMAIL-CRON] ${step}${d}`);
};

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  const PROJECT_URL = "https://darker-digital.lovable.app";
  const FUNCTION_URL = `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-drip-email`;
  const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

  try {
    logStep("Cron started");
    const now = new Date();
    let totalSent = 0;

    // Helper: check if email already sent
    async function alreadySent(userId: string, emailType: string): Promise<boolean> {
      const { data } = await supabase
        .from("user_emails_sent")
        .select("id")
        .eq("user_id", userId)
        .eq("email_type", emailType)
        .limit(1);
      return (data?.length ?? 0) > 0;
    }

    // Helper: record sent email
    async function recordSent(userId: string, emailType: string) {
      await supabase.from("user_emails_sent").insert({
        user_id: userId,
        email_type: emailType,
      });
    }

    // Helper: send an email via the drip function
    async function sendEmail(to: string, firstName: string, emailType: string, userId: string) {
      if (await alreadySent(userId, emailType)) {
        return false;
      }

      const res = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ANON_KEY}`,
        },
        body: JSON.stringify({ to, firstName, emailType, userId, projectUrl: PROJECT_URL }),
      });

      if (res.ok) {
        await recordSent(userId, emailType);
        totalSent++;
        logStep("Sent", { to, emailType });
        return true;
      } else {
        const error = await res.text();
        logStep("Send failed", { to, emailType, error });
        return false;
      }
    }

    // ━━━ GET ALL USERS WITH PROFILES ━━━
    // Use auth.admin to get user metadata (created_at)
    const { data: allUsers } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    if (!allUsers?.users?.length) {
      logStep("No users found");
      return new Response(JSON.stringify({ sent: 0 }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get all profiles
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, business_name, email, subscription_status, trial_active, trial_ends_at, subscription_ends_at, onboarding_complete, unsubscribed_from_emails");

    const profileMap = new Map<string, any>();
    for (const p of profiles ?? []) {
      profileMap.set(p.user_id, p);
    }

    for (const user of allUsers.users) {
      const profile = profileMap.get(user.id);
      if (!profile) continue;
      if (profile.unsubscribed_from_emails) continue;

      const email = profile.email || user.email;
      if (!email) continue;

      const firstName = (profile.business_name || "").split(" ")[0] || "there";
      const createdAt = new Date(user.created_at);
      const hoursSinceSignup = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
      const daysSinceSignup = hoursSinceSignup / 24;
      const status = profile.subscription_status || "none";
      const isActivated = profile.trial_active === true;

      // ━━━ SEQUENCE 1: ONBOARDING DRIP (not activated) ━━━
      if (!isActivated && status === "none") {
        // Email A: 1 hour after signup
        if (hoursSinceSignup >= 1 && hoursSinceSignup < 24) {
          await sendEmail(email, firstName, "onboarding_welcome", user.id);
        }
        // Email B: Day 1
        if (daysSinceSignup >= 1 && daysSinceSignup < 3) {
          await sendEmail(email, firstName, "onboarding_demo_ready", user.id);
        }
        // Email C: Day 3
        if (daysSinceSignup >= 3 && daysSinceSignup < 7) {
          await sendEmail(email, firstName, "onboarding_social_proof", user.id);
        }
        // Email D: Day 7
        if (daysSinceSignup >= 7 && daysSinceSignup < 10) {
          await sendEmail(email, firstName, "onboarding_urgency", user.id);
        }
      }

      // ━━━ SEQUENCE 2: TRIAL CONVERSION (trialing, not paid) ━━━
      if (status === "trialing" && profile.trial_ends_at) {
        const trialEnd = new Date(profile.trial_ends_at);
        const daysUntilTrialEnd = (trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

        // Email A: Trial Day 3 (11 days left)
        if (daysUntilTrialEnd <= 11 && daysUntilTrialEnd > 10) {
          await sendEmail(email, firstName, "trial_checkin", user.id);
        }
        // Email B: Trial Day 10 (4 days left)
        if (daysUntilTrialEnd <= 4 && daysUntilTrialEnd > 3) {
          await sendEmail(email, firstName, "trial_ending_soon", user.id);
        }
        // Email C: Trial Day 13 (1 day left)
        if (daysUntilTrialEnd <= 1 && daysUntilTrialEnd > 0) {
          await sendEmail(email, firstName, "trial_last_day", user.id);
        }
      }

      // ━━━ SEQUENCE 3: WIN-BACK (canceled) ━━━
      if (status === "canceled" && profile.subscription_ends_at) {
        const cancelDate = new Date(profile.subscription_ends_at);
        const daysSinceCancel = (now.getTime() - cancelDate.getTime()) / (1000 * 60 * 60 * 24);

        // Email A: 1 day after cancel
        if (daysSinceCancel >= 1 && daysSinceCancel < 7) {
          await sendEmail(email, firstName, "winback_notice", user.id);
        }
        // Email B: 7 days after cancel
        if (daysSinceCancel >= 7 && daysSinceCancel < 14) {
          await sendEmail(email, firstName, "winback_offer", user.id);
        }
      }
    }

    logStep("Cron complete", { totalSent });

    return new Response(JSON.stringify({ sent: totalSent }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: msg });
    return new Response(JSON.stringify({ error: msg }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
