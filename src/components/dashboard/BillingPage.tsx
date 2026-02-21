import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  ArrowLeft,
  Loader2,
  ExternalLink,
  Receipt,
  RefreshCw,
  Shield,
  ChevronRight,
} from "lucide-react";

const BillingPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const sub = useSubscription();
  const [openingPortal, setOpeningPortal] = useState(false);
  const [portalAction, setPortalAction] = useState<string | null>(null);

  const openPortal = async (flow?: string) => {
    setOpeningPortal(true);
    setPortalAction(flow ?? null);
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
      else throw new Error("No portal URL returned");
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.message || "Could not open billing portal.",
        variant: "destructive",
      });
    } finally {
      setOpeningPortal(false);
      setPortalAction(null);
    }
  };

  const statusLabel = (() => {
    if (sub.isTrialing) return "Free Trial";
    if (sub.isActive) return "Active";
    if (sub.isPastDue) return "Past Due";
    if (sub.isCanceled) return "Canceled";
    return "No Plan";
  })();

  const statusColor = (() => {
    if (sub.isTrialing) return "hsl(217,91%,60%)";
    if (sub.isActive) return "hsl(142,71%,45%)";
    if (sub.isPastDue) return "hsl(25,95%,53%)";
    if (sub.isCanceled) return "hsl(0,84%,60%)";
    return "hsla(0,0%,100%,0.4)";
  })();

  const planLabel = sub.plan === "annual" ? "Annual Plan" : sub.plan === "monthly" ? "Monthly Plan" : "—";

  const endDate = sub.subscriptionEndsAt
    ? new Date(sub.subscriptionEndsAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const trialEnd = sub.trialEndsAt
    ? new Date(sub.trialEndsAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="max-w-lg">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/dashboard/account")}
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
          style={{ background: "hsla(0,0%,100%,0.06)" }}
        >
          <ArrowLeft className="w-4 h-4 text-white/60" />
        </button>
        <div>
          <h2 className="dash-page-title text-white">Billing</h2>
          <p className="text-white/40 text-sm">Manage your payment info and invoices</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Current Plan Card */}
        <div className="dash-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="dash-card-title text-white">Current Plan</h3>
            <span
              className="px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ background: `${statusColor}20`, color: statusColor }}
            >
              {statusLabel}
            </span>
          </div>

          {sub.loading ? (
            <div className="flex items-center gap-2 py-4">
              <Loader2 className="w-4 h-4 animate-spin text-white/30" />
              <span className="text-sm text-white/40">Loading subscription…</span>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/50">Plan</span>
                <span className="text-sm text-white/80 font-medium">{planLabel}</span>
              </div>
              {sub.isTrialing && trialEnd && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/50">Trial ends</span>
                  <span className="text-sm text-white/80 font-medium">
                    {trialEnd} ({sub.trialDaysLeft}d left)
                  </span>
                </div>
              )}
              {endDate && !sub.isTrialing && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/50">
                    {sub.cancelAtPeriodEnd ? "Access until" : "Next billing"}
                  </span>
                  <span className="text-sm text-white/80 font-medium">{endDate}</span>
                </div>
              )}
              {sub.cancelAtPeriodEnd && (
                <div
                  className="mt-2 px-3 py-2 rounded-lg text-xs font-medium"
                  style={{
                    background: "hsla(25,95%,53%,0.1)",
                    color: "hsl(25,95%,53%)",
                    border: "1px solid hsla(25,95%,53%,0.2)",
                  }}
                >
                  Your subscription is set to cancel at the end of the current period.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Payment Method */}
        <div className="dash-card">
          <h3 className="dash-card-title text-white mb-3">Payment Method</h3>
          <p className="text-white/40 text-sm mb-4">
            Add or update the card on file for your subscription.
          </p>
          <button
            onClick={() => openPortal("payment_method_update")}
            disabled={openingPortal}
            className="w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all hover:brightness-110"
            style={{
              background: "linear-gradient(135deg, hsl(217,91%,60%) 0%, hsl(224,91%,50%) 100%)",
              color: "white",
              boxShadow: "0 4px 16px hsla(217,91%,55%,0.25)",
            }}
          >
            <div className="flex items-center gap-3">
              {openingPortal && portalAction === "payment_method_update" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CreditCard className="w-5 h-5" />
              )}
              <span>Update Payment Method</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-60" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="dash-card">
          <h3 className="dash-card-title text-white mb-3">Quick Actions</h3>
          <div className="space-y-1">
            {[
              {
                icon: Receipt,
                label: "View Invoices & Receipts",
                desc: "Download past invoices",
                action: () => openPortal("invoices"),
                key: "invoices",
              },
              {
                icon: RefreshCw,
                label: "Change Plan",
                desc: "Switch between monthly and annual",
                action: () => openPortal("subscription_update"),
                key: "subscription_update",
              },
              {
                icon: Shield,
                label: "Full Billing Portal",
                desc: "Manage all billing settings",
                action: () => openPortal(),
                key: "portal",
              },
            ].map(({ icon: Icon, label, desc, action, key }) => (
              <button
                key={key}
                onClick={action}
                disabled={openingPortal}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors group"
                style={{ background: "transparent" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "hsla(0,0%,100%,0.04)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "hsla(0,0%,100%,0.06)" }}
                >
                  {openingPortal && portalAction === key ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white/40" />
                  ) : (
                    <Icon className="w-4 h-4 text-white/50" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/80 font-medium">{label}</p>
                  <p className="text-xs text-white/35">{desc}</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-white/20 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Security note */}
        <div
          className="flex items-start gap-2.5 px-4 py-3 rounded-lg text-xs"
          style={{
            background: "hsla(0,0%,100%,0.03)",
            border: "1px solid hsla(0,0%,100%,0.06)",
            color: "hsla(0,0%,100%,0.35)",
          }}
        >
          <Shield className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-50" />
          <span>
            Your payment details are securely handled by Stripe. We never store your card
            information.
          </span>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
