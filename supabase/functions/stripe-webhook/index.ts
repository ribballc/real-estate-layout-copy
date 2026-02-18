import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const logStep = (step: string, details?: any) => {
  const d = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[STRIPE-WEBHOOK] ${step}${d}`);
};

serve(async (req) => {
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!stripeKey) {
    return new Response("STRIPE_SECRET_KEY not set", { status: 500 });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  let event: Stripe.Event;

  try {
    const body = await req.text();

    if (webhookSecret) {
      const signature = req.headers.get("stripe-signature");
      if (!signature) {
        return new Response("Missing stripe-signature header", { status: 400 });
      }
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // Dev mode: parse without verification
      event = JSON.parse(body);
      logStep("WARNING: No webhook secret set, skipping signature verification");
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logStep("Webhook signature verification failed", { message: msg });
    return new Response(`Webhook Error: ${msg}`, { status: 400 });
  }

  logStep("Event received", { type: event.type, id: event.id });

  // Helper: find Supabase user by Stripe customer ID or metadata
  async function findUserIdByCustomer(customerId: string, metadata?: Record<string, string>): Promise<string | null> {
    // First check metadata
    if (metadata?.supabase_user_id) {
      return metadata.supabase_user_id;
    }

    // Look up by stripe_customer_id in profiles
    const { data } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("stripe_customer_id", customerId)
      .maybeSingle();
    if (data?.user_id) return data.user_id;

    // Fallback: look up customer email in auth
    try {
      const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
      if (customer.email) {
        const { data: users } = await supabase.auth.admin.listUsers();
        const match = users?.users?.find(u => u.email === customer.email);
        if (match) {
          // Store the mapping for future lookups
          await supabase
            .from("profiles")
            .update({ stripe_customer_id: customerId })
            .eq("user_id", match.id);
          return match.id;
        }
      }
    } catch (e) {
      logStep("Customer lookup fallback failed", { error: String(e) });
    }

    return null;
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;
        const customerId = session.customer as string;

        if (userId && customerId) {
          await supabase
            .from("profiles")
            .update({ stripe_customer_id: customerId })
            .eq("user_id", userId);
          logStep("Linked Stripe customer to user", { userId, customerId });
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const userId = await findUserIdByCustomer(customerId, subscription.metadata);

        if (!userId) {
          logStep("No user found for subscription event", { customerId });
          break;
        }

        let plan: string | null = null;
        const priceId = subscription.items.data[0]?.price?.id;
        if (priceId === "price_1T1JeMP734Q0ltptDuj5K6Na") {
          plan = "annual";
        } else if (priceId === "price_1T1I5SP734Q0ltptMJmmSvok") {
          plan = "monthly";
        }

        const trialEnd = subscription.trial_end
          ? new Date(subscription.trial_end * 1000).toISOString()
          : null;
        const periodEnd = new Date(subscription.current_period_end * 1000).toISOString();

        const updates: Record<string, any> = {
          subscription_status: subscription.status,
          subscription_plan: plan,
          stripe_subscription_id: subscription.id,
          stripe_customer_id: customerId,
          trial_ends_at: trialEnd,
          subscription_ends_at: periodEnd,
          trial_active: ["active", "trialing"].includes(subscription.status),
        };

        await supabase.from("profiles").update(updates).eq("user_id", userId);
        logStep("Subscription updated", { userId, status: subscription.status, plan });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const userId = await findUserIdByCustomer(customerId, subscription.metadata);

        if (userId) {
          await supabase
            .from("profiles")
            .update({
              subscription_status: "canceled",
              trial_active: false,
              stripe_subscription_id: null,
            })
            .eq("user_id", userId);
          logStep("Subscription canceled", { userId });
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const userId = await findUserIdByCustomer(customerId);

        if (userId) {
          await supabase
            .from("profiles")
            .update({
              subscription_status: "active",
              trial_active: true,
            })
            .eq("user_id", userId);
          logStep("Payment succeeded, set active", { userId });
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const userId = await findUserIdByCustomer(customerId);

        if (userId) {
          await supabase
            .from("profiles")
            .update({ subscription_status: "past_due" })
            .eq("user_id", userId);
          logStep("Payment failed, set past_due", { userId });
        }
        break;
      }

      default:
        logStep("Unhandled event type", { type: event.type });
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logStep("Error processing event", { type: event.type, message: msg });
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});
