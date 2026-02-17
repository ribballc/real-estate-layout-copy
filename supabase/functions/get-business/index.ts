import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("user_id");

    if (!userId) {
      return new Response(JSON.stringify({ error: "user_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const [profileRes, servicesRes, hoursRes, testimonialsRes, photosRes, addOnsRes] =
      await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", userId).single(),
        supabase.from("services").select("*").eq("user_id", userId).order("sort_order"),
        supabase.from("business_hours").select("*").eq("user_id", userId).order("day_of_week"),
        supabase.from("testimonials").select("*").eq("user_id", userId).order("created_at"),
        supabase.from("photos").select("*").eq("user_id", userId).order("sort_order"),
        supabase.from("add_ons").select("*").eq("user_id", userId).order("sort_order"),
      ]);

    if (profileRes.error || !profileRes.data) {
      return new Response(JSON.stringify({ error: "Business not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        profile: profileRes.data,
        services: servicesRes.data ?? [],
        hours: hoursRes.data ?? [],
        testimonials: testimonialsRes.data ?? [],
        photos: photosRes.data ?? [],
        addOns: addOnsRes.data ?? [],
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
