import { Zap, ChevronRight } from "lucide-react";
import { useUpgradeModal } from "@/contexts/UpgradeModalContext";

/**
 * Contextual FOMO / urgency nudge banners shown on dashboard pages
 * when the user has no active subscription.
 */

const PAGE_NUDGE_COPY: Record<string, { headline: string; sub: string }> = {
  "/dashboard": {
    headline: "Your competitors are already live",
    sub: "Shops on Darker are booking while you browse — start your 14-day trial before they take your leads.",
  },
  "/dashboard/calendar": {
    headline: "Spots are filling up",
    sub: "Every day without online booking is a missed customer. Activate now — your first week is on us.",
  },
  "/dashboard/jobs": {
    headline: "Don't let jobs slip through the cracks",
    sub: "Track every detail from quote to complete. Free for 14 days — no card needed.",
  },
  "/dashboard/estimates": {
    headline: "Close faster than texting prices",
    sub: "Pro estimates in 30 seconds. Your competitors already send these — don't fall behind.",
  },
  "/dashboard/customers": {
    headline: "Know your customers before they call",
    sub: "Vehicle history, spend, last visit — all at a glance. Start your trial before the next call.",
  },
  "/dashboard/services": {
    headline: "Your menu is invisible right now",
    sub: "Customers can't book what they can't see. Go live in under 2 minutes — free trial.",
  },
  "/dashboard/photos": {
    headline: "A picture is worth 1,000 bookings",
    sub: "Showcase your work and watch inquiries climb. 14 days free — no risk.",
  },
  "/dashboard/testimonials": {
    headline: "5-star reviews sell better than ads",
    sub: "Auto-collect and display reviews. Shops using this see 40% more bookings — try free.",
  },
  "/dashboard/the-lab": {
    headline: "Revenue hacks, unlocked",
    sub: "Proven strategies other shops are using right now. Don't get left behind — activate your trial.",
  },
  "/dashboard/website": {
    headline: "Your website is ready — go live",
    sub: "Everything's built. All that's left is pressing the button. 14 days free.",
  },
};

interface TrialNudgeBannerProps {
  path: string;
  isDark: boolean;
  isSubscribed: boolean;
}

const TrialNudgeBanner = ({ path, isDark, isSubscribed }: TrialNudgeBannerProps) => {
  const { openUpgradeModal } = useUpgradeModal();

  if (isSubscribed) return null;

  const copy = PAGE_NUDGE_COPY[path];
  if (!copy) return null;

  return (
    <div
      className="flex items-center gap-4 rounded-xl px-5 py-3.5 mb-4 group cursor-pointer transition-all hover:brightness-110"
      onClick={openUpgradeModal}
      style={{
        background: isDark
          ? "linear-gradient(135deg, hsla(30,100%,50%,0.10) 0%, hsla(15,100%,50%,0.06) 100%)"
          : "linear-gradient(135deg, hsla(30,100%,50%,0.08) 0%, hsla(15,100%,50%,0.04) 100%)",
        border: `1px solid ${isDark ? "hsla(30,100%,50%,0.20)" : "hsla(30,100%,50%,0.18)"}`,
      }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{
          background: "linear-gradient(135deg, hsl(30,100%,50%) 0%, hsl(15,100%,55%) 100%)",
          boxShadow: "0 2px 8px hsla(30,100%,50%,0.3)",
        }}
      >
        <Zap className="w-4 h-4 text-white" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="font-bold text-sm leading-tight"
          style={{ color: isDark ? "hsl(30,100%,65%)" : "hsl(25,90%,38%)" }}
        >
          {copy.headline}
        </p>
        <p
          className="text-xs mt-0.5 leading-snug"
          style={{ color: isDark ? "hsla(0,0%,100%,0.5)" : "hsl(215,16%,47%)" }}
        >
          {copy.sub}
        </p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <span
          className="text-xs font-semibold whitespace-nowrap hidden sm:inline"
          style={{ color: isDark ? "hsl(30,100%,65%)" : "hsl(25,90%,38%)" }}
        >
          Start Free Trial
        </span>
        <ChevronRight
          className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
          style={{ color: isDark ? "hsl(30,100%,65%)" : "hsl(25,90%,38%)" }}
        />
      </div>
    </div>
  );
};

export default TrialNudgeBanner;
