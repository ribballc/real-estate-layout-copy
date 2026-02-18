import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "Darker <onboarding@resend.dev>";
const REPLY_TO = Deno.env.get("REPLY_TO_EMAIL") || "support@darker.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: any) => {
  const d = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[SEND-DRIP-EMAIL] ${step}${d}`);
};

// ━━━ EMAIL TEMPLATES ━━━

interface EmailTemplate {
  subject: string;
  html: string;
}

function unsubscribeBlock(userId: string, projectUrl: string): string {
  const link = `${projectUrl}/api/unsubscribe?uid=${userId}`;
  return `
    <div style="margin-top:40px;padding-top:20px;border-top:1px solid #e5e7eb;text-align:center;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">
        You're receiving this because you signed up for Darker.<br/>
        <a href="${link}" style="color:#6b7280;text-decoration:underline;">Unsubscribe from emails</a>
      </p>
    </div>
  `;
}

function wrapHtml(body: string, userId: string, projectUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    ${body}
    ${unsubscribeBlock(userId, projectUrl)}
  </div>
</body>
</html>`;
}

const templates: Record<string, (firstName: string, userId: string, projectUrl: string) => EmailTemplate> = {

  // ━━━ ONBOARDING DRIP ━━━

  onboarding_welcome: (firstName, userId, projectUrl) => ({
    subject: `Your Darker site is being set up, ${firstName}`,
    html: wrapHtml(`
      <h2 style="color:#111827;font-size:22px;margin:0 0 16px;">Hey ${firstName} 👋</h2>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 12px;">
        Welcome to Darker! We're getting your auto detailing website ready.
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 12px;">
        In a few minutes, you'll have a professional booking site that works on any phone — 
        complete with online scheduling, deposits, and SMS reminders.
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 24px;">
        If you haven't finished setting up yet, pick up right where you left off:
      </p>
      <a href="${projectUrl}/dashboard" style="display:inline-block;background:#3b82f6;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">
        Continue Setup →
      </a>
      <p style="color:#6b7280;font-size:13px;margin:20px 0 0;">
        Just reply to this email if you have any questions — a real person will get back to you.
      </p>
    `, userId, projectUrl),
  }),

  onboarding_demo_ready: (firstName, userId, projectUrl) => ({
    subject: `${firstName}, your demo is waiting`,
    html: wrapHtml(`
      <h2 style="color:#111827;font-size:22px;margin:0 0 16px;">Your website is ready, ${firstName}</h2>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 12px;">
        Your demo website has been built — you just haven't seen it yet.
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 12px;">
        It's got your business name, services, and a booking calendar already set up. 
        Take a look and customize anything you want.
      </p>
      <a href="${projectUrl}/dashboard" style="display:inline-block;background:#3b82f6;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;margin:12px 0 0;">
        See My Demo Website →
      </a>
    `, userId, projectUrl),
  }),

  onboarding_social_proof: (firstName, userId, projectUrl) => ({
    subject: "Most detailers see their first booking in week 1",
    html: wrapHtml(`
      <h2 style="color:#111827;font-size:22px;margin:0 0 16px;">Hey ${firstName},</h2>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 12px;">
        Detailers who go live with Darker typically see their first booking within 7 days. 
        Here's what one of them said:
      </p>
      <div style="background:#f3f4f6;border-radius:12px;padding:20px;margin:16px 0;">
        <p style="color:#374151;font-size:14px;line-height:1.6;margin:0;font-style:italic;">
          "I set up my site on Monday and had my first $300 detail booked by Thursday. 
          The client found me on Google and booked directly — no phone calls."
        </p>
        <p style="color:#6b7280;font-size:13px;margin:8px 0 0;">— Alex M., Mobile Detailer</p>
      </div>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 20px;">
        Every day you wait is a day you could be taking bookings. Activate now and see what happens:
      </p>
      <a href="${projectUrl}/dashboard" style="display:inline-block;background:#3b82f6;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">
        Activate My Site →
      </a>
    `, userId, projectUrl),
  }),

  onboarding_urgency: (firstName, userId, projectUrl) => ({
    subject: "We'll delete your demo in 48 hours",
    html: wrapHtml(`
      <h2 style="color:#111827;font-size:22px;margin:0 0 16px;">${firstName}, quick heads-up</h2>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 12px;">
        Your Darker demo site has been sitting idle for a week. To keep things running smooth, 
        we remove inactive demos after 7 days.
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 12px;">
        <strong>Your demo will be deleted in 48 hours</strong> if you don't activate your free trial.
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 20px;">
        If you still want your site, just tap below. It takes 30 seconds and there's no charge today.
      </p>
      <a href="${projectUrl}/dashboard" style="display:inline-block;background:#dc2626;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">
        Keep My Site →
      </a>
      <p style="color:#9ca3af;font-size:13px;margin:16px 0 0;">
        No hard feelings if it's not the right time — we'll save your info in case you come back.
      </p>
    `, userId, projectUrl),
  }),

  // ━━━ TRIAL CONVERSION ━━━

  trial_checkin: (firstName, userId, projectUrl) => ({
    subject: `How's the trial going, ${firstName}?`,
    html: wrapHtml(`
      <h2 style="color:#111827;font-size:22px;margin:0 0 16px;">Hey ${firstName},</h2>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 12px;">
        Just checking in — you've been on Darker for a few days now. How's everything going?
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 12px;">
        If you're stuck on anything or have questions about setting up your services, 
        just reply to this email. I'm happy to help.
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 12px;">
        Want to hop on a quick call? Reply with a time that works and I'll set it up.
      </p>
      <p style="color:#6b7280;font-size:14px;margin:20px 0 0;">— Jake, Darker</p>
    `, userId, projectUrl),
  }),

  trial_ending_soon: (firstName, userId, projectUrl) => ({
    subject: "4 days left on your trial",
    html: wrapHtml(`
      <h2 style="color:#111827;font-size:22px;margin:0 0 16px;">${firstName}, your trial ends in 4 days</h2>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 12px;">
        Here's what you've built so far — and what goes away if you don't activate:
      </p>
      <ul style="color:#374151;font-size:15px;line-height:1.8;margin:0 0 12px;padding-left:20px;">
        <li>Your custom booking website</li>
        <li>Your online calendar & scheduling</li>
        <li>Your customer database</li>
        <li>Automated SMS reminders</li>
      </ul>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 20px;">
        Keep everything for just <strong>$54/month</strong> (billed annually) — that's less than one detail.
      </p>
      <a href="${projectUrl}/dashboard" style="display:inline-block;background:#3b82f6;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">
        Activate Now →
      </a>
    `, userId, projectUrl),
  }),

  trial_last_day: (firstName, userId, projectUrl) => ({
    subject: `Tomorrow's the last day, ${firstName}`,
    html: wrapHtml(`
      <h2 style="color:#111827;font-size:22px;margin:0 0 16px;">Your trial ends tomorrow</h2>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 12px;">
        ${firstName}, after tomorrow your Darker site goes dark. Your booking link will stop working, 
        and customers won't be able to find or book you.
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 20px;">
        Lock in your spot for <strong>$54/mo</strong> — cancel anytime, no contracts.
      </p>
      <a href="${projectUrl}/dashboard" style="display:inline-block;background:#dc2626;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">
        Activate for $54/mo →
      </a>
    `, userId, projectUrl),
  }),

  // ━━━ WIN-BACK ━━━

  winback_notice: (firstName, userId, projectUrl) => ({
    subject: "Your site will go offline soon",
    html: wrapHtml(`
      <h2 style="color:#111827;font-size:22px;margin:0 0 16px;">Hey ${firstName},</h2>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 12px;">
        Just a heads-up — since you canceled, your Darker site will go offline soon. 
        Your booking link will stop accepting new appointments.
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 12px;">
        Your data is safe — we'll keep it for 30 days in case you change your mind.
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 0;">
        Changed your mind? Just reply to this email and we'll get you back up and running.
      </p>
    `, userId, projectUrl),
  }),

  winback_offer: (firstName, userId, projectUrl) => ({
    subject: "Was there something we could've done better?",
    html: wrapHtml(`
      <h2 style="color:#111827;font-size:22px;margin:0 0 16px;">${firstName}, honest question</h2>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 12px;">
        Was there something we could have done better? I'd genuinely love to know. 
        Just hit reply — even one sentence helps.
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 12px;">
        If you want to give it another shot, here's something to make it easier:
      </p>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin:16px 0;text-align:center;">
        <p style="color:#166534;font-size:18px;font-weight:700;margin:0 0 4px;">30% off your first 3 months</p>
        <p style="color:#15803d;font-size:14px;margin:0;">No pressure — just an option if you want to come back.</p>
      </div>
      <a href="${projectUrl}/dashboard" style="display:inline-block;background:#16a34a;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">
        Reactivate with 30% Off →
      </a>
    `, userId, projectUrl),
  }),
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, firstName, emailType, userId, projectUrl } = await req.json();

    if (!to || !emailType || !userId) {
      throw new Error("Missing required fields: to, emailType, userId");
    }

    const templateFn = templates[emailType];
    if (!templateFn) {
      throw new Error(`Unknown email type: ${emailType}`);
    }

    const name = firstName || "there";
    const url = projectUrl || "https://darker-digital.lovable.app";
    const { subject, html } = templateFn(name, userId, url);

    logStep("Sending email", { to, emailType, subject });

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        reply_to: REPLY_TO,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      logStep("Resend API error", { status: res.status, error });
      throw new Error(`Resend error: ${error}`);
    }

    const data = await res.json();
    logStep("Email sent successfully", { id: data.id, emailType });

    return new Response(JSON.stringify({ success: true, id: data.id }), {
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
