import { Rocket, ChevronRight, CheckCircle2 } from "lucide-react";
import { useUpgradeModal } from "@/contexts/UpgradeModalContext";

const PAGE_DESCRIPTIONS: Record<string, string> = {
  "/dashboard/calendar": "your online booking calendar and customer scheduling",
  "/dashboard/jobs": "your job tracking and work order management",
  "/dashboard/estimates": "professional estimate creation and delivery",
  "/dashboard/customers": "your full customer list, history, and notes",
  "/dashboard/services": "your service menu, pricing, and add-ons",
  "/dashboard/photos": "your portfolio gallery and before/after photos",
  "/dashboard/testimonials": "automated review collection and management",
  "/dashboard/the-lab": "proven revenue growth strategies and QR code tools",
  "/dashboard/website": "your live website and booking page customization",
};

const PAGE_BENEFITS: Record<string, string[]> = {
  "/dashboard/calendar": ["Online booking calendar", "Automated reminders", "Block off days"],
  "/dashboard/jobs": ["Kanban job board", "Drag-and-drop workflow"],
  "/dashboard/estimates": ["Professional estimates", "One-tap send to customer", "Convert to booking"],
  "/dashboard/customers": ["Full customer list", "Vehicle history", "Import from CSV"],
  "/dashboard/services": ["Service menu builder", "Custom pricing", "Add-ons & packages"],
  "/dashboard/photos": ["Before/after gallery", "Portfolio showcase", "Auto-display on site"],
  "/dashboard/testimonials": ["Automated review requests", "Display on your site", "Build customer trust"],
  "/dashboard/the-lab": ["Revenue growth strategies", "Proven templates", "QR code generator"],
  "/dashboard/website": ["Live website editor", "Custom branding", "SEO optimization"],
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
    "the-lab": "The Lab",
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
  const benefits = PAGE_BENEFITS[path] || ["Full access to this feature"];

  return (
    <div
      className="flex flex-col items-center justify-center text-center px-6 py-16 min-h-[60vh]"
      style={{
        background: isDark
          ? "linear-gradient(180deg, hsl(215,50%,10%) 0%, hsl(217,33%,12%) 100%)"
          : "hsl(210,40%,98%)",
      }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{
          background: "linear-gradient(135deg, hsl(217,91%,60%) 0%, hsl(230,80%,55%) 100%)",
          boxShadow: "0 8px 32px hsla(217,91%,60%,0.3)",
        }}
      >
        <Rocket className="w-7 h-7 text-white" strokeWidth={1.5} />
      </div>

      <h2
        className="font-bold tracking-tight"
        style={{
          fontSize: "22px",
          color: isDark ? "white" : "hsl(215,25%,12%)",
        }}
      >
        Activate your trial to use {pageName}
      </h2>

      <p
        className="mt-2 max-w-sm"
        style={{
          fontSize: "15px",
          lineHeight: 1.6,
          color: isDark ? "hsla(0,0%,100%,0.5)" : "hsl(215,16%,47%)",
        }}
      >
        Start your free 14-day trial to unlock {description}.
      </p>

      <div className="mt-6 flex flex-col items-start gap-2.5">
        {benefits.map((benefit) => (
          <div key={benefit} className="flex items-center gap-2.5">
            <CheckCircle2
              className="w-4 h-4 flex-shrink-0"
              style={{ color: "hsl(160,84%,39%)" }}
              strokeWidth={2}
            />
            <span
              className="text-sm"
              style={{ color: isDark ? "hsla(0,0%,100%,0.65)" : "hsl(215,16%,35%)" }}
            >
              {benefit}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={openUpgradeModal}
        className="mt-8 font-semibold inline-flex items-center gap-2 transition-all hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0"
        style={{
          height: "52px",
          borderRadius: "12px",
          padding: "0 32px",
          background: "linear-gradient(135deg, hsl(217,91%,60%) 0%, hsl(230,80%,55%) 100%)",
          color: "white",
          fontSize: "15px",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 8px 24px hsla(217,91%,60%,0.35)",
        }}
      >
        Start Free Trial
        <ChevronRight className="w-4 h-4" />
      </button>

      <p
        className="mt-3"
        style={{
          fontSize: "13px",
          color: isDark ? "hsla(0,0%,100%,0.3)" : "hsl(215,16%,65%)",
        }}
      >
        14 days free · Cancel anytime
      </p>
    </div>
  );
};

export default LockedPageOverlay;
