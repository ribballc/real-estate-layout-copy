import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const tools = [
  {
    type: "function",
    function: {
      name: "add_service_area",
      description: "Add a service area/location to the business profile. Use when the user wants to add a city, town, or area they serve.",
      parameters: {
        type: "object",
        properties: {
          area: { type: "string", description: "The service area to add, e.g. 'Dallas, TX'" },
        },
        required: ["area"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "remove_service_area",
      description: "Remove a service area from the business profile.",
      parameters: {
        type: "object",
        properties: {
          area: { type: "string", description: "The service area to remove" },
        },
        required: ["area"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "update_business_info",
      description: "Update business profile fields like business_name, tagline, phone, email, address.",
      parameters: {
        type: "object",
        properties: {
          field: { type: "string", enum: ["business_name", "tagline", "phone", "email", "address"], description: "Which field to update" },
          value: { type: "string", description: "The new value" },
        },
        required: ["field", "value"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "update_social_media",
      description: "Update a social media handle. Supports instagram, facebook, tiktok, youtube, google_business.",
      parameters: {
        type: "object",
        properties: {
          platform: { type: "string", enum: ["instagram", "facebook", "tiktok", "youtube", "google_business"] },
          handle: { type: "string", description: "The handle or URL" },
        },
        required: ["platform", "handle"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "add_service",
      description: "Add a new service to the business. Use when the user wants to create a new service offering.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "Service name" },
          description: { type: "string", description: "Service description" },
          price: { type: "number", description: "Starting price" },
        },
        required: ["title", "description", "price"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "add_testimonial",
      description: "Add a customer testimonial/review.",
      parameters: {
        type: "object",
        properties: {
          author: { type: "string" },
          content: { type: "string" },
          rating: { type: "number", description: "1-5 star rating" },
        },
        required: ["author", "content", "rating"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "update_logo",
      description: "Flag that the user wants to update their logo. The frontend will handle the file upload.",
      parameters: {
        type: "object",
        properties: {
          action: { type: "string", enum: ["request_upload"], description: "Always 'request_upload'" },
        },
        required: ["action"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "add_photos",
      description: "Flag that the user wants to add photos. The frontend will handle the file upload.",
      parameters: {
        type: "object",
        properties: {
          action: { type: "string", enum: ["request_upload"], description: "Always 'request_upload'" },
        },
        required: ["action"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_business_summary",
      description: "Get a summary of the current business profile data so the AI can reference it.",
      parameters: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
    },
  },
];

async function executeTool(
  toolName: string,
  args: Record<string, unknown>,
  userId: string,
  supabase: ReturnType<typeof createClient>
): Promise<string> {
  switch (toolName) {
    case "add_service_area": {
      const { data: profile } = await supabase
        .from("profiles")
        .select("service_areas")
        .eq("user_id", userId)
        .single();
      const current: string[] = profile?.service_areas || [];
      const area = args.area as string;
      if (current.some((a: string) => a.toLowerCase() === area.toLowerCase())) {
        return `"${area}" is already in your service areas.`;
      }
      const updated = [...current, area];
      const { error } = await supabase
        .from("profiles")
        .update({ service_areas: updated })
        .eq("user_id", userId);
      if (error) return `Error: ${error.message}`;
      return `✅ Added "${area}" to your service areas. You now serve ${updated.length} area(s).`;
    }

    case "remove_service_area": {
      const { data: profile } = await supabase
        .from("profiles")
        .select("service_areas")
        .eq("user_id", userId)
        .single();
      const current: string[] = profile?.service_areas || [];
      const area = args.area as string;
      const filtered = current.filter((a: string) => a.toLowerCase() !== area.toLowerCase());
      if (filtered.length === current.length) {
        return `"${area}" wasn't found in your service areas.`;
      }
      const { error } = await supabase
        .from("profiles")
        .update({ service_areas: filtered })
        .eq("user_id", userId);
      if (error) return `Error: ${error.message}`;
      return `✅ Removed "${area}" from your service areas.`;
    }

    case "update_business_info": {
      const field = args.field as string;
      const value = args.value as string;
      const { error } = await supabase
        .from("profiles")
        .update({ [field]: value })
        .eq("user_id", userId);
      if (error) return `Error: ${error.message}`;
      return `✅ Updated your ${field.replace("_", " ")} to "${value}".`;
    }

    case "update_social_media": {
      const platform = args.platform as string;
      const handle = args.handle as string;
      const { error } = await supabase
        .from("profiles")
        .update({ [platform]: handle })
        .eq("user_id", userId);
      if (error) return `Error: ${error.message}`;
      return `✅ Updated your ${platform} to "${handle}".`;
    }

    case "add_service": {
      const { data: existing } = await supabase
        .from("services")
        .select("sort_order")
        .eq("user_id", userId)
        .order("sort_order", { ascending: false })
        .limit(1);
      const nextOrder = (existing?.[0]?.sort_order ?? -1) + 1;
      const { error } = await supabase.from("services").insert({
        user_id: userId,
        title: args.title as string,
        description: args.description as string,
        price: args.price as number,
        sort_order: nextOrder,
      });
      if (error) return `Error: ${error.message}`;
      return `✅ Added new service "${args.title}" at $${args.price}.`;
    }

    case "add_testimonial": {
      const { error } = await supabase.from("testimonials").insert({
        user_id: userId,
        author: args.author as string,
        content: args.content as string,
        rating: Math.min(5, Math.max(1, args.rating as number)),
      });
      if (error) return `Error: ${error.message}`;
      return `✅ Added testimonial from "${args.author}".`;
    }

    case "update_logo": {
      return "ACTION:UPLOAD_LOGO";
    }

    case "add_photos": {
      return "ACTION:UPLOAD_PHOTOS";
    }

    case "get_business_summary": {
      const { data: profile } = await supabase
        .from("profiles")
        .select("business_name, tagline, email, phone, address, service_areas, instagram, facebook, tiktok, youtube, google_business")
        .eq("user_id", userId)
        .single();
      const { count: serviceCount } = await supabase
        .from("services")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId);
      const { count: photoCount } = await supabase
        .from("photos")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId);
      const { count: testimonialCount } = await supabase
        .from("testimonials")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId);
      return JSON.stringify({
        ...profile,
        services_count: serviceCount ?? 0,
        photos_count: photoCount ?? 0,
        testimonials_count: testimonialCount ?? 0,
      });
    }

    default:
      return `Unknown tool: ${toolName}`;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";

    const supabaseUser = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use service role for tool execution
    const supabaseAdmin = createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an elite AI business assistant built specifically for auto detailers, paint protection film (PPF) installers, ceramic coating specialists, window tint shops, and vinyl wrap artists. You have deep expertise in every aspect of running a detail or install shop.

Your knowledge covers:

SERVICES & TECHNICAL:
- Full detailing: paint decontamination, clay bar, machine polishing, paint correction stages (1-stage, 2-stage, 3-stage), hand wax, sealant, LSP selection
- Ceramic coatings: surface prep, IPA wipe-down, application techniques, curing times, maintenance, coating layering (base + top coat), brand comparisons (Gtechniq, IGL, Ceramic Pro, System X, CarPro)
- Paint Protection Film: wet vs dry install, slip solution ratios, pre-cut kits vs bulk film, squeegee technique, edge tucking, post-heat treatment, XPEL, SunTek, STEK, Avery comparisons
- Window tint: VLT percentages, ceramic vs dyed vs carbon vs metalized, state tint laws (you know the general rules — always advise confirming locally), back glass installs, LTAC technique, liner removal
- Vinyl wrap: cast vs calendered film, full wraps, partial wraps, color changes, chrome delete, 3M, Avery, KPMF, Hexis comparisons, heat gun temps, knifeless tape technique
- Interior details: APC dilution ratios, leather care (clean/condition/protect), steam cleaning, odor elimination (ozone, enzyme, hydroxyl), carpet extraction

PRICING & BUSINESS:
- How to price services (market rates, time-based vs flat pricing, vehicle size tiers, correction level pricing)
- Creating service packages (good/better/best tiers)
- Upselling techniques (maintenance plans, add-ons at checkout)
- How to handle price shoppers without discounting your worth
- Calculating cost of goods and profit margins
- When to raise prices

CUSTOMERS & BOOKINGS:
- How to follow up with leads who ghost
- How to handle difficult customers or complaints
- Writing professional responses to negative reviews
- How to ask for 5-star reviews without being pushy
- Rebooking strategies and maintenance reminders
- Building a loyal VIP customer base

MARKETING & GROWTH:
- What to post on Instagram, TikTok, Facebook for a detail shop (before/after content, process videos, car features)
- How to get more Google reviews
- Local SEO basics for a detail shop
- Running promotions without devaluing your services
- Referral programs

OPERATIONS & PLATFORM:
- How to use every feature in this dashboard: bookings, customers, services, calendar, photos, testimonials, estimates, invoices
- Troubleshooting booking or website issues
- How to set up services and pricing for their booking page
- General business systems and workflow advice

COMMUNICATION STYLE:
- Talk like a sharp, experienced industry insider — not corporate
- Be direct and practical — give the actual answer, not a vague overview
- Use bullet points and short paragraphs for readability
- When giving prices, give real ranges (e.g. "ceramic coatings typically run $800–$2,500 depending on package and size")
- If asked something outside your expertise, say so clearly and briefly
- Keep responses tight — no filler sentences
- Use relevant emojis naturally throughout your responses to make them engaging and easy to scan (e.g. 🔥 for emphasis, 💰 for pricing, ✅ for confirmations, 📸 for photos, 🎯 for tips, 💡 for ideas, 🚀 for growth)
- Start each response with a relevant emoji
- Keep a friendly, helpful, and confident tone — like a knowledgeable friend in the industry

You also help with: reporting platform bugs (acknowledge and note for the team), requesting dashboard features (confirm and note for review), and explaining how to use any part of the Darker platform.

CAPABILITIES (use tools for these):
- Add/remove service areas
- Update business info (name, tagline, phone, email, address)
- Update social media handles
- Add new services with pricing
- Add customer testimonials
- Change logo or add photos (triggers upload UI)
- View a summary of the business profile

IMPORTANT:
- Always use the tools to make changes — never just describe what to do
- If the user asks to add photos or change their logo, use the appropriate tool to trigger the upload UI
- If the user mentions a service area, use add_service_area — don't just acknowledge it`;

    // Initial AI call with tools
    let aiMessages = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    let response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: aiMessages,
        tools,
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI service error");
    }

    let result = await response.json();
    let choice = result.choices?.[0];
    let toolResults: { name: string; result: string }[] = [];

    // Process tool calls in a loop (up to 5 iterations)
    let iterations = 0;
    while (choice?.message?.tool_calls && iterations < 5) {
      iterations++;
      const toolCalls = choice.message.tool_calls;

      // Execute all tool calls
      const toolMessages = [];
      for (const tc of toolCalls) {
        const fnName = tc.function.name;
        let fnArgs: Record<string, unknown> = {};
        try {
          fnArgs = JSON.parse(tc.function.arguments || "{}");
        } catch {}

        const toolResult = await executeTool(fnName, fnArgs, user.id, supabaseAdmin);
        toolResults.push({ name: fnName, result: toolResult });
        toolMessages.push({
          role: "tool",
          tool_call_id: tc.id,
          content: toolResult,
        });
      }

      // Send tool results back to AI for final response
      aiMessages = [
        ...aiMessages,
        choice.message,
        ...toolMessages,
      ];

      response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: aiMessages,
          tools,
          stream: false,
        }),
      });

      if (!response.ok) {
        const t = await response.text();
        console.error("AI gateway follow-up error:", response.status, t);
        break;
      }

      result = await response.json();
      choice = result.choices?.[0];
    }

    const assistantContent = choice?.message?.content || "Done! Is there anything else you'd like to change?";

    // Return structured response with actions performed
    return new Response(
      JSON.stringify({
        content: assistantContent,
        actions: toolResults,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    console.error("support-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
