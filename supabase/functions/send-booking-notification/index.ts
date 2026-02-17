import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface BookingRequest {
  slug: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  service_title: string;
  service_price: number;
  booking_date: string;
  booking_time: string;
  vehicle: string;
  addons: string[];
  notes: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: BookingRequest = await req.json();
    const {
      slug,
      customer_name,
      customer_email,
      customer_phone,
      service_title,
      service_price,
      booking_date,
      booking_time,
      vehicle,
      addons,
      notes,
    } = body;

    if (!slug || !customer_name || !customer_email || !customer_phone || !booking_date || !booking_time) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // 1. Resolve user_id from slug
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("user_id, email, business_name, phone")
      .eq("slug", slug)
      .single();

    if (profileError || !profile) {
      return new Response(JSON.stringify({ error: "Business not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ownerUserId = profile.user_id;

    // 2. Insert booking
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        user_id: ownerUserId,
        customer_name,
        customer_email,
        customer_phone,
        service_title,
        service_price,
        booking_date,
        booking_time,
        notes: notes || "",
        status: "pending",
      })
      .select("id")
      .single();

    if (bookingError) {
      console.error("Booking insert error:", bookingError);
      return new Response(JSON.stringify({ error: "Failed to create booking" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Upsert customer
    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("id, total_bookings, total_spent")
      .eq("user_id", ownerUserId)
      .eq("email", customer_email)
      .maybeSingle();

    if (existingCustomer) {
      await supabase
        .from("customers")
        .update({
          name: customer_name,
          phone: customer_phone,
          vehicle: vehicle || existingCustomer.vehicle,
          total_bookings: (existingCustomer.total_bookings || 0) + 1,
          total_spent: (existingCustomer.total_spent || 0) + service_price,
          last_service_date: booking_date,
          status: "active",
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingCustomer.id);
    } else {
      await supabase.from("customers").insert({
        user_id: ownerUserId,
        name: customer_name,
        email: customer_email,
        phone: customer_phone,
        vehicle: vehicle || "",
        total_bookings: 1,
        total_spent: service_price,
        last_service_date: booking_date,
        status: "lead",
      });
    }

    // 4. Send email notification to business owner via Resend
    let emailSent = false;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (resendApiKey && profile.email) {
      try {
        const addonsText = addons && addons.length > 0 ? addons.join(", ") : "None";
        const emailHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1a1a2e;">🎉 New Booking Received!</h2>
            <p>You have a new booking from your website:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
              <tr><td style="padding: 8px; font-weight: 600; color: #555;">Customer</td><td style="padding: 8px;">${customer_name}</td></tr>
              <tr style="background: #f8f9fa;"><td style="padding: 8px; font-weight: 600; color: #555;">Email</td><td style="padding: 8px;"><a href="mailto:${customer_email}">${customer_email}</a></td></tr>
              <tr><td style="padding: 8px; font-weight: 600; color: #555;">Phone</td><td style="padding: 8px;"><a href="tel:${customer_phone}">${customer_phone}</a></td></tr>
              <tr style="background: #f8f9fa;"><td style="padding: 8px; font-weight: 600; color: #555;">Service</td><td style="padding: 8px;">${service_title}</td></tr>
              <tr><td style="padding: 8px; font-weight: 600; color: #555;">Price</td><td style="padding: 8px;">$${service_price}</td></tr>
              <tr style="background: #f8f9fa;"><td style="padding: 8px; font-weight: 600; color: #555;">Date & Time</td><td style="padding: 8px;">${booking_date} at ${booking_time}</td></tr>
              <tr><td style="padding: 8px; font-weight: 600; color: #555;">Vehicle</td><td style="padding: 8px;">${vehicle || "Not specified"}</td></tr>
              <tr style="background: #f8f9fa;"><td style="padding: 8px; font-weight: 600; color: #555;">Add-ons</td><td style="padding: 8px;">${addonsText}</td></tr>
              ${notes ? `<tr><td style="padding: 8px; font-weight: 600; color: #555;">Notes</td><td style="padding: 8px;">${notes}</td></tr>` : ""}
            </table>
            <p style="color: #888; font-size: 13px;">This booking is pending your confirmation. Log in to your dashboard to manage it.</p>
          </div>
        `;

        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Bookings <onboarding@resend.dev>",
            to: [profile.email],
            subject: `New Booking: ${customer_name} — ${service_title}`,
            html: emailHtml,
          }),
        });

        emailSent = emailRes.ok;
        if (!emailRes.ok) {
          const errText = await emailRes.text();
          console.error("Resend error:", errText);
        }
      } catch (emailErr) {
        console.error("Email send error:", emailErr);
      }
    }

    // 5. Optional SMS via Twilio
    let smsSent = false;
    const twilioSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const twilioToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioFrom = Deno.env.get("TWILIO_PHONE_NUMBER");
    const notifyPhone = Deno.env.get("NOTIFICATION_PHONE_NUMBER");

    if (twilioSid && twilioToken && twilioFrom && notifyPhone) {
      try {
        const smsBody = `New booking: ${customer_name} for ${service_title} on ${booking_date} at ${booking_time}. $${service_price}.`;
        const smsRes = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: "Basic " + btoa(`${twilioSid}:${twilioToken}`),
            },
            body: new URLSearchParams({
              To: notifyPhone,
              From: twilioFrom,
              Body: smsBody,
            }),
          }
        );
        smsSent = smsRes.ok;
        await smsRes.text();
      } catch (smsErr) {
        console.error("SMS send error:", smsErr);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        booking_id: booking.id,
        email_sent: emailSent,
        sms_sent: smsSent,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Handler error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
