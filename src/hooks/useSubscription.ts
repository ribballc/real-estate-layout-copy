import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface SubscriptionState {
  status: "none" | "trialing" | "active" | "past_due" | "canceled" | "paused";
  plan: string | null;
  trialEndsAt: string | null;
  subscriptionEndsAt: string | null;
  cancelAtPeriodEnd: boolean;
  loading: boolean;
}

export function useSubscription() {
  const { user } = useAuth();
  const [state, setState] = useState<SubscriptionState>({
    status: "none",
    plan: null,
    trialEndsAt: null,
    subscriptionEndsAt: null,
    cancelAtPeriodEnd: false,
    loading: true,
  });

  const refresh = useCallback(async () => {
    if (!user) {
      setState(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (!error && data) {
        setState({
          status: data.status || "none",
          plan: data.plan || null,
          trialEndsAt: data.trialEnd || null,
          subscriptionEndsAt: data.subscriptionEnd || null,
          cancelAtPeriodEnd: data.cancelAtPeriodEnd || false,
          loading: false,
        });
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }
    } catch {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  // Initial load
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Refresh on window focus (e.g. returning from Stripe portal)
  useEffect(() => {
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refresh]);

  const isTrialing = state.status === "trialing";
  const isActive = state.status === "active" || isTrialing;
  const isPastDue = state.status === "past_due";
  const isCanceled = state.status === "canceled";

  const trialDaysLeft = (() => {
    if (!isTrialing || !state.trialEndsAt) return 0;
    const diff = new Date(state.trialEndsAt).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  })();

  // past_due grace: 3 days after subscription_ends_at
  const isPastDueGracePeriodOver = (() => {
    if (!isPastDue || !state.subscriptionEndsAt) return false;
    const grace = new Date(state.subscriptionEndsAt).getTime() + 3 * 24 * 60 * 60 * 1000;
    return Date.now() > grace;
  })();

  const canAccessFeature = (_featureName?: string): boolean => {
    if (isActive) return true;
    if (isPastDue && !isPastDueGracePeriodOver) return true;
    return false;
  };

  return {
    ...state,
    isTrialing,
    isActive,
    isPastDue,
    isCanceled,
    trialDaysLeft,
    isPastDueGracePeriodOver,
    canAccessFeature,
    refresh,
  };
}
