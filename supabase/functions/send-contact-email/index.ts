import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { checkRateLimit } from "../_shared/rate-limit.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
const TWILIO_PHONE_NUMBER = Deno.env.get("TWILIO_PHONE_NUMBER");
const NOTIFICATION_PHONE_NUMBER = Deno.env.get("NOTIFICATION_PHONE_NUMBER");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  phone: string;
  vehicleType: string;
  address: string;
  services: string[];
  addons: string[];
  message: string;
}

async function sendSMS(body: string): Promise<{ success: boolean; error?: string }> {
  try {
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    const formData = new URLSearchParams();
    formData.append("To", NOTIFICATION_PHONE_NUMBER!);
    formData.append("From", TWILIO_PHONE_NUMBER!);
    formData.append("Body", body);

    const response = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Twilio SMS error:", error);
      return { success: false, error };
    }

    const data = await response.json();
    console.log("SMS sent successfully:", data.sid);
    return { success: true };
  } catch (error: any) {
    console.error("SMS sending failed:", error.message);
    return { success: false, error: error.message };
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting: max 10 requests/minute per IP
  const rateCheck = await checkRateLimit(req, "send-contact-email");
  if (!rateCheck.allowed) return rateCheck.response!;

  try {
    const { name, email, phone, vehicleType, address, services, addons, message }: ContactEmailRequest = await req.json();

    const servicesText = services.length > 0 ? services.join(", ") : "None selected";
    const addonsText = addons.length > 0 ? addons.join(", ") : "None selected";

    const smsBody = `NEW BOOKING REQUEST

Name: ${name}
Phone: ${phone}
Email: ${email}
Vehicle: ${vehicleType}
Address: ${address || "Not provided"}

Services: ${servicesText}
Add-ons: ${addonsText}

Message: ${message || "No message"}`;

    const smsResult = await sendSMS(smsBody);

    let emailResult = { success: false, error: "" };
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Deluxe Detailing <onboarding@resend.dev>",
          to: ["jake@darkerdigital.com"],
          subject: "Website Form Submission",
          html: `
            <p><strong>Name:</strong> ${name}</p><br/>
            <p><strong>Email:</strong> ${email}</p><br/>
            <p><strong>Phone:</strong> ${phone}</p><br/>
            <p><strong>Vehicle Type:</strong> ${vehicleType}</p><br/>
            <p><strong>Address:</strong> ${address || "Not provided"}</p><br/>
            <p><strong>Services:</strong> ${servicesText}</p><br/>
            <p><strong>Add-ons:</strong> ${addonsText}</p><br/>
            <p><strong>Message:</strong> ${message || "No message"}</p>
          `,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Email sent successfully:", data);
        emailResult = { success: true, error: "" };
      } else {
        const error = await res.text();
        console.error("Email error:", error);
        emailResult = { success: false, error };
      }
    } catch (error: any) {
      console.error("Email sending failed:", error.message);
      emailResult = { success: false, error: error.message };
    }

    if (smsResult.success || emailResult.success) {
      return new Response(
        JSON.stringify({ success: true, sms: smsResult.success, email: emailResult.success }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    throw new Error(`SMS: ${smsResult.error}, Email: ${emailResult.error}`);
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
