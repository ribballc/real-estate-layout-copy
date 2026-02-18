import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

serve(async (req) => {
  const url = new URL(req.url);
  const uid = url.searchParams.get("uid");

  if (!uid) {
    return new Response("Missing user ID", { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  await supabase
    .from("profiles")
    .update({ unsubscribed_from_emails: true })
    .eq("user_id", uid);

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:60px 24px;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;text-align:center;">
  <div style="max-width:400px;margin:0 auto;">
    <h1 style="color:#111827;font-size:24px;margin:0 0 12px;">Unsubscribed</h1>
    <p style="color:#6b7280;font-size:15px;line-height:1.6;">
      You've been unsubscribed from Darker emails. You won't receive any more automated messages from us.
    </p>
  </div>
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
});
