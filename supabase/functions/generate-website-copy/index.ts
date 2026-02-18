import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsErr } = await supabase.auth.getClaims(token);
    if (claimsErr || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }
    const userId = claimsData.claims.sub as string;

    const body = await req.json();
    const { businessName, ownerFirstName, city, services, businessType, regenerateField } = body;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // If regenerating a single field
    if (regenerateField) {
      const fieldPrompts: Record<string, string> = {
        hero_headline: `Write a 6-10 word headline for ${businessName} in ${city} that communicates professional auto detailing. Focus on quality and results, not features.`,
        hero_subheadline: `Write a 1-2 sentence subheadline for ${businessName}, a ${businessType} detailing business in ${city} offering ${services?.join(", ")}. Mention 24/7 online booking naturally.`,
        about_paragraph: `Write a 3-sentence 'About Us' paragraph for ${businessName} run by ${ownerFirstName} in ${city}. Services: ${services?.join(", ")}. Sounds personal, local, and trustworthy. No clichés.`,
        seo_meta_description: `Write a 155-character SEO meta description for ${businessName}, a detailing shop in ${city} offering ${services?.join(", ")}. Include 'book online'.`,
        cta_tagline: `Write a 4-6 word action phrase for booking a detail at ${businessName}. Not 'Book Now'. Something more specific and confident.`,
      };

      const prompt = fieldPrompts[regenerateField];
      if (!prompt) {
        return new Response(JSON.stringify({ error: "Invalid field" }), { status: 400, headers: corsHeaders });
      }

      const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-lite",
          messages: [
            { role: "system", content: "You are a professional copywriter specializing in automotive detailing businesses. Write direct-response marketing copy that sounds human, confident, and local — not corporate or generic. Never use exclamation marks. Never use the word 'transform'. Write like the business owner is proud of their craft. Return ONLY the copy text, no quotes, no labels." },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (!aiRes.ok) {
        const status = aiRes.status;
        if (status === 429) return new Response(JSON.stringify({ error: "Rate limited, try again shortly." }), { status: 429, headers: corsHeaders });
        if (status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: corsHeaders });
        throw new Error(`AI gateway error: ${status}`);
      }

      const aiData = await aiRes.json();
      const text = aiData.choices?.[0]?.message?.content?.trim() || "";
      return new Response(JSON.stringify({ field: regenerateField, value: text }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Full generation using tool calling for structured output
    const servicesList = (services || []).join(", ");
    const typeLabel = businessType === "mobile" ? "mobile" : businessType === "both" ? "shop and mobile" : "shop";

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are a professional copywriter specializing in automotive detailing businesses. Write direct-response marketing copy that sounds human, confident, and local — not corporate or generic. Never use exclamation marks. Never use the word 'transform'. Write like the business owner is proud of their craft.",
          },
          {
            role: "user",
            content: `Generate website copy for ${businessName}, a ${typeLabel} auto detailing business in ${city} run by ${ownerFirstName}. They offer: ${servicesList}.

Generate ALL of these:
1. hero_headline: A 6-10 word headline that communicates professional auto detailing. Focus on quality and results.
2. hero_subheadline: A 1-2 sentence subheadline mentioning 24/7 online booking naturally.
3. about_paragraph: A 3-sentence About Us paragraph that sounds personal, local, and trustworthy.
4. services_descriptions: One confident 1-sentence description for EACH of these services: ${servicesList}. Focus on the result the customer gets.
5. seo_meta_description: A 155-character SEO meta description including 'book online'.
6. cta_tagline: A 4-6 word action phrase for booking. Not 'Book Now'. Something specific and confident.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "save_website_copy",
              description: "Save the generated website copy blocks",
              parameters: {
                type: "object",
                properties: {
                  hero_headline: { type: "string", description: "6-10 word headline" },
                  hero_subheadline: { type: "string", description: "1-2 sentence subheadline" },
                  about_paragraph: { type: "string", description: "3-sentence about paragraph" },
                  services_descriptions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        service: { type: "string" },
                        description: { type: "string" },
                      },
                      required: ["service", "description"],
                    },
                    description: "One description per service",
                  },
                  seo_meta_description: { type: "string", description: "155-char SEO description" },
                  cta_tagline: { type: "string", description: "4-6 word CTA phrase" },
                },
                required: ["hero_headline", "hero_subheadline", "about_paragraph", "services_descriptions", "seo_meta_description", "cta_tagline"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "save_website_copy" } },
      }),
    });

    if (!aiRes.ok) {
      const status = aiRes.status;
      if (status === 429) return new Response(JSON.stringify({ error: "Rate limited, try again shortly." }), { status: 429, headers: corsHeaders });
      if (status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: corsHeaders });
      const t = await aiRes.text();
      console.error("AI gateway error:", status, t);
      throw new Error(`AI gateway error: ${status}`);
    }

    const aiData = await aiRes.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call returned from AI");

    const copy = JSON.parse(toolCall.function.arguments);

    // Save to database
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error: upsertErr } = await adminClient
      .from("website_copy")
      .upsert({
        user_id: userId,
        hero_headline: copy.hero_headline || "",
        hero_subheadline: copy.hero_subheadline || "",
        about_paragraph: copy.about_paragraph || "",
        services_descriptions: copy.services_descriptions || [],
        seo_meta_description: copy.seo_meta_description || "",
        cta_tagline: copy.cta_tagline || "",
        generated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

    if (upsertErr) {
      console.error("DB upsert error:", upsertErr);
      // Still return the copy even if save fails
    }

    return new Response(JSON.stringify({ copy }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-website-copy error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
