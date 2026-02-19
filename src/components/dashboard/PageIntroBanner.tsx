import { useState, useEffect } from "react";
import { Info, X } from "lucide-react";

const PAGE_INTRO_COPY: Record<string, string> = {
  "/dashboard":
    "This is your mission control. Bookings, revenue, and activity all live here — activate your trial to see real data.",
  "/dashboard/website":
    "Preview your website and booking page below. Everything you see is customizable — edit your info from Settings anytime.",
  "/dashboard/calendar":
    "Your booking calendar will appear here once your trial is active and your first customer books.",
  "/dashboard/customers":
    "Customer profiles and history show up here after your first booking comes in.",
  "/dashboard/services":
    "Set up your service menu with pricing here — these show up on your website and booking page automatically.",
  "/dashboard/business":
    "Update your shop name, services, hours, photos, and contact info here — changes reflect on your website instantly.",
  "/dashboard/jobs":
    "Track your active jobs and work orders here once bookings start coming in.",
  "/dashboard/estimates":
    "Create and send professional estimates to customers — they can approve and book right from the link.",
  "/dashboard/photos":
    "Upload your best work here — these photos appear in your website gallery automatically.",
  "/dashboard/testimonials":
    "Collect and display customer reviews — social proof helps convert more visitors into bookings.",
  "/dashboard/offer-lab":
    "Proven strategies and templates to help you 3x your bookings and revenue.",
  "/dashboard/account":
    "Manage your account, subscription, and login settings here.",
};

function getFlag(path: string) {
  const key = path.replace(/\//g, "_").replace(/^_/, "");
  return `darker_intro_${key}`;
}

interface PageIntroBannerProps {
  path: string;
}

const PageIntroBanner = ({ path }: PageIntroBannerProps) => {
  const flag = getFlag(path);
  const copy = PAGE_INTRO_COPY[path];
  const isDark = localStorage.getItem("dashboard-theme") !== "light";

  const textColor = isDark ? "white" : "hsl(215, 25%, 20%)";
  const dismissBase = isDark ? "hsla(0,0%,100%,0.3)" : "hsl(215, 16%, 55%)";
  const dismissHover = isDark ? "white" : "hsl(215, 25%, 12%)";

  const [visible, setVisible] = useState(false);
  const [dismissing, setDismissing] = useState(false);

  useEffect(() => {
    if (!copy) return;
    if (localStorage.getItem(flag)) return;
    // Small delay so it animates in after page renders
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, [flag, copy]);

  if (!copy || (!visible && !dismissing)) return null;

  const handleDismiss = () => {
    setDismissing(true);
    setTimeout(() => {
      setVisible(false);
      setDismissing(false);
      localStorage.setItem(flag, "1");
    }, 300);
  };

  return (
    <div
      className={dismissing ? "intro-banner-out" : "intro-banner-in"}
      style={{
        background: "hsla(217,91%,60%,0.08)",
        border: "1px solid hsla(217,91%,60%,0.2)",
        borderRadius: "10px",
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "16px",
      }}
    >
      <Info
        className="shrink-0"
        style={{ width: "16px", height: "16px", color: "hsl(217,91%,60%)" }}
        strokeWidth={1.5}
      />
      <span
        className="flex-1 font-medium"
        style={{ fontSize: "13px", color: textColor }}
      >
        {copy}
      </span>
      <button
        onClick={handleDismiss}
        className="shrink-0 w-6 h-6 rounded flex items-center justify-center transition-colors"
        style={{ color: dismissBase }}
        onMouseEnter={(e) => (e.currentTarget.style.color = dismissHover)}
        onMouseLeave={(e) => (e.currentTarget.style.color = dismissBase)}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default PageIntroBanner;
