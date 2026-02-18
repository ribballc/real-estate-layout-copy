import { Lock, ChevronRight } from "lucide-react";
import { useUpgradeModal } from "@/contexts/UpgradeModalContext";

const PAGE_DESCRIPTIONS: Record<string, string> = {
  "/dashboard/calendar": "your online booking calendar and customer scheduling",
  "/dashboard/jobs": "your job tracking and work order management",
  "/dashboard/estimates": "professional estimate creation and delivery",
  "/dashboard/customers": "your full customer list, history, and notes",
  "/dashboard/services": "your service menu, pricing, and add-ons",
  "/dashboard/photos": "your portfolio gallery and before/after photos",
  "/dashboard/testimonials": "automated review collection and management",
  "/dashboard/offer-lab": "proven revenue growth strategies and templates",
  "/dashboard/website": "your live website and booking page customization",
};

function getPageName(path: string): string {
  const seg = path.split("/").pop() || "";
  const names: Record<string, string> = {
    calendar: "Calendar",
    jobs: "Jobs",
    estimates: "Estimates",
    customers: "Customers",
    services: "Services",
    photos: "Photos",
    testimonials: "Testimonials",
    "offer-lab": "Offer Lab",
    website: "Website",
  };
  return names[seg] || "This page";
}

interface LockedPageOverlayProps {
  path: string;
  isDark: boolean;
}

const LockedPageOverlay = ({ path, isDark }: LockedPageOverlayProps) => {
  const { openUpgradeModal } = useUpgradeModal();

  const pageName = getPageName(path);
  const description = PAGE_DESCRIPTIONS[path] || "this feature";

  return (
    <div className="relative">
      {/* Blurred background content placeholder */}
      <div
        style={{
          opacity: 0.25,
          filter: "blur(3px)",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {/* Skeleton content to fill space behind the overlay */}
        <div className="space-y-4 p-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl h-32"
              style={{
                background: isDark
                  ? "hsla(217,91%,60%,0.04)"
                  : "hsla(215,20%,93%,0.5)",
              }}
            />
          ))}
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl h-24"
                style={{
                  background: isDark
                    ? "hsla(217,91%,60%,0.03)"
                    : "hsla(215,20%,93%,0.4)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center"
        style={{
          padding: "40px 24px",
          background: isDark
            ? "linear-gradient(to bottom, transparent 0%, hsla(215,50%,10%,0.6) 30%, hsl(215,50%,10%) 70%)"
            : "linear-gradient(to bottom, transparent 0%, hsla(210,40%,98%,0.6) 30%, hsl(210,40%,98%) 70%)",
        }}
      >
        {/* Lock icon with pulse */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            background: "hsla(217,91%,60%,0.1)",
            border: "1px solid hsla(217,91%,60%,0.25)",
            animation: "lockedPulse 3s ease-in-out infinite",
          }}
        >
          <Lock
            className="w-7 h-7"
            style={{ color: "hsl(217,91%,60%)" }}
            strokeWidth={1.5}
          />
        </div>

        {/* Heading */}
        <h2
          className="mt-5 font-bold tracking-tight"
          style={{
            fontSize: "20px",
            color: isDark ? "white" : "hsl(215,25%,12%)",
          }}
        >
          {pageName} is locked
        </h2>

        {/* Subtext */}
        <p
          className="mt-2"
          style={{
            fontSize: "14px",
            color: isDark ? "hsla(0,0%,100%,0.5)" : "hsl(215,16%,55%)",
            maxWidth: "320px",
          }}
        >
          Activate your 14-day free trial to unlock this page and start
          using {description}.
        </p>

        {/* CTA */}
        <button
          onClick={openUpgradeModal}
          className="mt-6 font-semibold inline-flex items-center gap-2 transition-all hover:brightness-110"
          style={{
            height: "48px",
            borderRadius: "10px",
            padding: "0 28px",
            background:
              "linear-gradient(135deg, hsl(217,91%,60%) 0%, hsl(230,80%,55%) 100%)",
            color: "white",
            fontSize: "15px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 20px hsla(217,91%,60%,0.3)",
          }}
        >
          Activate Free Trial
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Fine print */}
        <p
          className="mt-2.5"
          style={{
            fontSize: "12px",
            color: isDark ? "hsla(0,0%,100%,0.3)" : "hsl(215,16%,65%)",
          }}
        >
          14-day free trial · Card required · Cancel anytime
        </p>
      </div>
    </div>
  );
};

export default LockedPageOverlay;
