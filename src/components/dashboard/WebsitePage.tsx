import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUpgradeModal } from "@/contexts/UpgradeModalContext";
import { useSubscription } from "@/hooks/useSubscription";
import {
  Lock, Copy, Check, Pencil, X, Globe, CalendarCheck,
  BarChart3, Palette, Search, Zap, Clock, Share2,
  Maximize2, Minimize2,
} from "lucide-react";
import CopyButton from "@/components/CopyButton";
import type { SupportChatbotHandle } from "./SupportChatbot";
import { useIsMobile } from "@/hooks/use-mobile";

interface WebsitePageProps {
  chatbotRef?: React.RefObject<SupportChatbotHandle>;
  isDark?: boolean;
}

const REVEAL_MESSAGES = [
  "Loading your site…",
  "Rendering pages…",
  "Almost ready…",
];

const LOCKED_FEATURES = [
  {
    icon: BarChart3,
    title: "Visitor Analytics",
    description: "See who's viewing your site, where they're coming from, and which services get the most clicks.",
  },
  {
    icon: Search,
    title: "SEO Optimization",
    description: "Rank higher on Google Maps and local search. Auto-generated meta tags, schema markup, and sitemap.",
  },
  {
    icon: Palette,
    title: "Custom Branding",
    description: "Upload your logo, pick your colors, and make the site feel 100% yours.",
  },
  {
    icon: Share2,
    title: "Custom Domain",
    description: "Connect your own domain (yourshop.com) for a fully branded online presence.",
  },
];

const WebsitePage = ({ chatbotRef, isDark = false }: WebsitePageProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { openUpgradeModal } = useUpgradeModal();
  const { isActive, isTrialing, trialDaysLeft, canAccessFeature } = useSubscription();
  const [slug, setSlug] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"website" | "booking">("website");
  const [iframeLoading, setIframeLoading] = useState(false);

  // Iframe reveal animation state
  const [iframeReady, setIframeReady] = useState(false);
  const [revealPhase, setRevealPhase] = useState<"loading" | "revealing" | "done">("loading");
  const [revealMsg, setRevealMsg] = useState(0);
  const [revealProgress, setRevealProgress] = useState(0);
  const revealStartRef = useRef(Date.now());

  // Welcome banner (session-only, first arrival from /generating)
  const [showWelcome, setShowWelcome] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const showTrialCTAs = !canAccessFeature();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("slug, business_name")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        setSlug(data?.slug ?? null);
        const meta = (user as any)?.user_metadata;
        const name = meta?.first_name || meta?.full_name?.split(" ")[0] || "";
        setFirstName(name);
        setLoading(false);
      });
  }, [user]);

  // Iframe reveal animation — cycle messages + progress bar
  useEffect(() => {
    if (revealPhase !== "loading") return;
    revealStartRef.current = Date.now();
    const msgInterval = setInterval(() => {
      setRevealMsg(i => (i + 1) % REVEAL_MESSAGES.length);
    }, 900);
    const progressRaf = () => {
      const elapsed = Date.now() - revealStartRef.current;
      const pct = Math.min((elapsed / 2000) * 85, 85);
      setRevealProgress(pct);
      if (pct < 85) requestAnimationFrame(progressRaf);
    };
    requestAnimationFrame(progressRaf);
    return () => clearInterval(msgInterval);
  }, [revealPhase]);

  // When iframe loads, trigger reveal
  const handleIframeLoad = useCallback(() => {
    setIframeReady(true);
    setRevealProgress(100);
    setRevealPhase("revealing");
    setTimeout(() => setRevealPhase("done"), 600);
  }, []);

  // Show welcome banner once per session
  useEffect(() => {
    if (!loading && slug) {
      const seen = sessionStorage.getItem("seenWebsiteIntro");
      if (!seen) {
        setShowWelcome(true);
        sessionStorage.setItem("seenWebsiteIntro", "1");
      }
    }
  }, [loading, slug]);

  const publishedOrigin = "https://darker-digital.lovable.app";
  const websiteUrl = slug ? `${publishedOrigin}/site/${slug}` : "";
  const bookingUrl = slug ? `${publishedOrigin}/site/${slug}/book` : "";
  const displayUrl = activeTab === "booking" ? bookingUrl : websiteUrl;
  const websiteIframeSrc = slug ? `${window.location.origin}/site/${slug}` : null;
  const bookingIframeSrc = slug ? `${window.location.origin}/site/${slug}/book` : null;
  const iframeSrc = activeTab === "booking" ? bookingIframeSrc : websiteIframeSrc;

  const handleTabSwitch = useCallback((tab: "website" | "booking") => {
    if (tab === activeTab) return;
    setIframeLoading(true);
    setIframeReady(false);
    setRevealPhase("loading");
    setRevealProgress(0);
    setRevealMsg(0);
    setActiveTab(tab);
    setTimeout(() => {
      setIframeLoading(false);
      setRevealPhase("done");
    }, 3000);
  }, [activeTab]);

  // Listen for "Book Now" clicks inside the website iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data === 'dd-book-now' && activeTab !== 'booking') {
        handleTabSwitch('booking');
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [activeTab, handleTabSwitch]);

  /* ─── Shared style helpers ─── */
  const cardBg = isDark ? "hsla(0,0%,100%,0.04)" : "hsl(0,0%,98%)";
  const cardBorder = isDark ? "hsla(0,0%,100%,0.08)" : "hsl(214,20%,88%)";
  const mutedText = isDark ? "hsla(0,0%,100%,0.5)" : "hsl(215,16%,47%)";
  const headingText = isDark ? "white" : "hsl(222,47%,11%)";
  const subtleText = isDark ? "hsla(0,0%,100%,0.35)" : "hsl(215,16%,60%)";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!iframeSrc) {
    return (
      <div className="rounded-2xl border border-border p-12 text-center space-y-3">
        <p className="text-muted-foreground">Complete your business info to generate your website.</p>
        <button
          onClick={() => navigate("/dashboard/business")}
          className="mt-2 px-5 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg, hsl(217,91%,60%) 0%, hsl(224,91%,54%) 100%)" }}
        >
          Set Up Business Info
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">


      {/* ═══ Welcome Banner — Grand Reveal (first visit only) ═══ */}
      {showWelcome && (
        <div
          className="relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{
            background: isDark ? "hsla(142,71%,45%,0.08)" : "hsla(142,71%,45%,0.06)",
            border: `1px solid hsla(142,71%,45%,0.2)`,
            padding: "24px 24px",
            borderRadius: 14,
            animation: "welcomeReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Shimmer sweep */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'linear-gradient(105deg, transparent 40%, hsla(142,71%,45%,0.08) 45%, hsla(142,71%,45%,0.15) 50%, hsla(142,71%,45%,0.08) 55%, transparent 60%)',
            animation: 'welcomeShimmer 2s ease-in-out 0.4s both',
            backgroundSize: '200% 100%',
          }} />
          <div className="relative z-10">
            <p className="font-bold flex items-center gap-2" style={{ color: headingText, fontSize: 18 }}>
              <span style={{ fontSize: 22 }}>🎉</span>
              Your website is ready{firstName ? `, ${firstName}` : ""}!
            </p>
            <p style={{ color: mutedText, fontSize: 14, marginTop: 4 }}>
              Everything below is your live site. Share it with customers or customize it from your dashboard.
            </p>
          </div>
          <button
            onClick={() => setShowWelcome(false)}
            className="absolute top-3 right-3 transition-colors"
            style={{ color: mutedText }}
            onMouseEnter={(e) => { e.currentTarget.style.color = headingText; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = mutedText; }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ═══ Tab Toggle Bar ═══ */}
      <div
        className="inline-flex"
        style={{
          background: isDark ? "hsla(0,0%,100%,0.06)" : "hsl(210,40%,94%)",
          border: `1px solid ${cardBorder}`,
          borderRadius: 10,
          padding: 4,
          gap: 2,
        }}
      >
        {([
          { key: "website" as const, label: "Website", icon: Globe },
          { key: "booking" as const, label: "Booking Page", icon: CalendarCheck },
        ]).map(({ key, label, icon: Icon }) => {
          const isActiveTab = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => handleTabSwitch(key)}
              className="inline-flex items-center gap-1.5 transition-all duration-200"
              style={{
                padding: "8px 18px",
                borderRadius: 7,
                fontSize: 14,
                fontWeight: isActiveTab ? 600 : 500,
                background: isActiveTab
                  ? isDark ? "hsla(217,91%,60%,0.15)" : "white"
                  : "transparent",
                color: isActiveTab
                  ? isDark ? "white" : "hsl(222,47%,11%)"
                  : isDark ? "hsla(0,0%,100%,0.5)" : "hsl(215,16%,47%)",
                boxShadow: isActiveTab
                  ? isDark ? "0 1px 4px hsla(0,0%,0%,0.3)" : "0 1px 4px hsla(0,0%,0%,0.1)"
                  : "none",
                cursor: isActiveTab ? "default" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (!isActiveTab) e.currentTarget.style.background = isDark ? "hsla(0,0%,100%,0.06)" : "hsl(210,40%,90%)";
              }}
              onMouseLeave={(e) => {
                if (!isActiveTab) e.currentTarget.style.background = "transparent";
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          );
        })}
      </div>

      {/* ═══ Address Bar ═══ */}
      <div
        className="flex items-center gap-2.5"
        style={{
          background: cardBg,
          border: `1px solid ${cardBorder}`,
          borderRadius: 10,
          padding: "9px 14px",
          height: 42,
        }}
      >
        <Lock className="w-3.5 h-3.5 shrink-0" style={{ color: "hsl(142,71%,45%)" }} />
        <span
          className="font-mono truncate flex-1 transition-all duration-200"
          style={{ fontSize: 13, color: mutedText }}
        >
          {displayUrl}
        </span>
        <CopyButton
          text={displayUrl}
          label="Copy"
          copiedLabel="Copied!"
          variant="inline"
          className="shrink-0 px-2 py-1 rounded-md"
          toastMessage={{ title: "Link copied", description: `${displayUrl} is on your clipboard.` }}
        />
        <div style={{ width: 1, height: 18, background: cardBorder, margin: "0 2px" }} />
        <button
          onClick={() => setIsFullscreen(true)}
          className="shrink-0 inline-flex items-center gap-1.5 font-semibold transition-all duration-150 rounded-md px-2.5 py-1"
          style={{
            fontSize: 13,
            color: isDark ? "hsla(0,0%,100%,0.7)" : "hsl(222,47%,11%)",
            background: isDark ? "hsla(0,0%,100%,0.06)" : "hsl(210,40%,92%)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = isDark ? "hsla(0,0%,100%,0.12)" : "hsl(210,40%,88%)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = isDark ? "hsla(0,0%,100%,0.06)" : "hsl(210,40%,92%)";
          }}
        >
          <Maximize2 className="w-3.5 h-3.5" />
          View
        </button>
      </div>

      {/* ═══ Iframe wrapper ═══ */}
      <div
        className="relative"
        style={{
          borderRadius: 12,
          overflow: "hidden",
          border: `1px solid ${cardBorder}`,
          boxShadow: isDark ? "0 8px 48px hsla(0,0%,0%,0.4)" : "0 4px 24px hsla(0,0%,0%,0.08)",
        }}
      >
        {/* DEMO BADGE */}
        <div
          className="absolute z-10 transition-opacity duration-500"
          style={{
            top: 12, left: 12,
            background: isActive ? "hsla(142,71%,45%,0.15)" : "hsla(40,100%,50%,0.15)",
            border: `1px solid ${isActive ? "hsla(142,71%,45%,0.35)" : "hsla(40,100%,50%,0.35)"}`,
            color: isActive ? "hsl(142,71%,45%)" : "hsl(40,100%,62%)",
            fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
            padding: "4px 10px", borderRadius: 99,
            opacity: revealPhase === "done" ? 1 : 0,
          }}
        >
          {isActive ? "LIVE" : "DEMO PREVIEW"}
        </div>

        {/* Generation-style loading overlay */}
        {revealPhase !== "done" && (
          <div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center"
            style={{
              background: isDark
                ? "linear-gradient(135deg, hsl(215,50%,10%) 0%, hsl(217,33%,14%) 100%)"
                : "linear-gradient(135deg, hsl(210,40%,98%) 0%, hsl(210,40%,94%) 100%)",
              opacity: revealPhase === "revealing" ? 0 : 1,
              transition: "opacity 0.5s ease-out",
            }}
          >
            <div style={{ width: 64, height: 64, filter: "drop-shadow(0 0 8px hsla(217,91%,60%,0.5))" }}>
              <svg width="64" height="64" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="26" fill="none" stroke={isDark ? "hsla(0,0%,100%,0.07)" : "hsl(210,40%,90%)"} strokeWidth="3" strokeLinecap="round" />
                <circle
                  cx="32" cy="32" r="26" fill="none"
                  stroke="hsl(217,91%,60%)" strokeWidth="3" strokeLinecap="round"
                  strokeDasharray="110 54"
                  style={{ transformOrigin: "center", animation: "generatingSpin 1s linear infinite" }}
                />
                <circle cx="32" cy="32" r="3" fill="hsl(217,91%,60%)"
                  style={{ animation: "generatingPulse 1.2s ease-in-out infinite" }}
                />
              </svg>
            </div>
            <p className="mt-4 font-medium text-sm transition-opacity duration-200" style={{ color: mutedText }}>
              {REVEAL_MESSAGES[revealMsg]}
            </p>
            <div className="mt-5" style={{ width: 180, height: 3, borderRadius: 2, background: isDark ? "hsla(0,0%,100%,0.08)" : "hsl(210,40%,90%)" }}>
              <div style={{ height: "100%", borderRadius: 2, background: "hsl(217,91%,60%)", width: `${revealProgress}%`, transition: revealProgress === 100 ? "width 0.3s ease" : "none" }} />
            </div>
          </div>
        )}

        <iframe
          src={iframeSrc}
          title={activeTab === "booking" ? "Booking Page" : "Your Website"}
          className="w-full border-0"
          style={{
            height: isMobile ? "50dvh" : "calc(100vh - 320px)",
            minHeight: isMobile ? 320 : 480,
            borderRadius: 12,
            opacity: revealPhase === "done" ? 1 : 0,
            transform: revealPhase === "done" ? "scale(1)" : "scale(0.98)",
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          }}
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          onLoad={handleIframeLoad}
        />
      </div>

      {/* ═══ Editable Info Callout ═══ */}
      <div
        className="flex items-center gap-3.5"
        style={{
          background: "hsla(217,91%,60%,0.06)",
          border: "1px solid hsla(217,91%,60%,0.15)",
          borderRadius: 12,
          padding: "18px 20px",
        }}
      >
        <Pencil className="w-[18px] h-[18px] shrink-0" style={{ color: "hsl(217,91%,60%)" }} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold" style={{ color: headingText, fontSize: 14 }}>Everything here is editable.</p>
          <p style={{ color: mutedText, fontSize: 13, marginTop: 2 }}>
            Shop name, services, location, hours, photos — change anything from your settings in seconds.
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/business")}
          className="shrink-0 font-medium hover:underline"
          style={{ color: "hsl(217,91%,60%)", fontSize: 13 }}
        >
          Edit Info →
        </button>
      </div>

      {/* ═══ Locked Premium Features Grid ═══ */}
      {showTrialCTAs && (
        <div className="space-y-3">
          <p className="font-bold" style={{ color: headingText, fontSize: 16 }}>
            Unlock premium features
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {LOCKED_FEATURES.map(({ icon: Icon, title, description }) => (
              <button
                key={title}
                onClick={openUpgradeModal}
                className="relative text-left overflow-hidden group transition-all duration-200"
                style={{
                  background: cardBg,
                  border: `1px solid ${cardBorder}`,
                  borderRadius: 12,
                  padding: "20px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "hsla(217,91%,60%,0.3)";
                  e.currentTarget.style.boxShadow = "0 4px 16px hsla(217,91%,60%,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = cardBorder;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Blur overlay */}
                <div
                  className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{
                    background: isDark ? "hsla(215,50%,10%,0.6)" : "hsla(0,0%,100%,0.7)",
                    backdropFilter: "blur(2px)",
                  }}
                >
                  <span className="flex items-center gap-1.5 font-semibold text-sm" style={{ color: "hsl(217,91%,60%)" }}>
                    <Lock className="w-3.5 h-3.5" />
                    Unlock with Trial
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className="shrink-0 flex items-center justify-center"
                    style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: "hsla(217,91%,60%,0.1)",
                    }}
                  >
                    <Icon className="w-4 h-4" style={{ color: "hsl(217,91%,60%)" }} />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: headingText, fontSize: 14 }}>{title}</p>
                    <p style={{ color: mutedText, fontSize: 13, marginTop: 3, lineHeight: 1.5 }}>{description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ═══ Bottom Activate CTA ═══ */}
      {showTrialCTAs && (
        <div className="text-center py-6">
          <p className="font-bold" style={{ color: headingText, fontSize: 18 }}>Ready to go live?</p>
          <p style={{ color: mutedText, fontSize: 14, marginTop: 6 }}>
            Publish your site, activate your booking calendar, and start getting paid. 14 days free.
          </p>
          <button
            onClick={openUpgradeModal}
            className="mx-auto mt-4 block font-semibold text-white transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, hsl(217,91%,60%) 0%, hsl(224,91%,54%) 100%)",
              maxWidth: 260, width: "100%", height: 48, borderRadius: 10, fontSize: 15,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = "brightness(1.08)";
              e.currentTarget.style.boxShadow = "0 4px 16px hsla(217,91%,60%,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "none";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Activate Free Trial →
          </button>
          <p style={{ color: subtleText, fontSize: 12, marginTop: 10 }}>
            Card required · Cancel anytime in 2 clicks
          </p>
        </div>
      )}

      {/* ═══ Active subscriber — show status instead ═══ */}
      {isActive && (
        <div
          className="flex items-center gap-3 justify-center"
          style={{
            background: "hsla(142,71%,45%,0.06)",
            border: "1px solid hsla(142,71%,45%,0.15)",
            borderRadius: 12,
            padding: "14px 20px",
          }}
        >
          <Check className="w-4 h-4" style={{ color: "hsl(142,71%,45%)" }} />
          <p className="font-medium" style={{ color: headingText, fontSize: 14 }}>
            {isTrialing
              ? `Your site is live — ${trialDaysLeft} day${trialDaysLeft !== 1 ? "s" : ""} left in trial`
              : "Your site is live and accepting bookings"
            }
          </p>
        </div>
      )}

      {/* ═══ Fullscreen Overlay ═══ */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col"
          style={{
            background: isDark ? "hsl(215,50%,8%)" : "hsl(0,0%,100%)",
            animation: "fullscreenRevealIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Fullscreen header */}
          <div
            className="flex items-center justify-between shrink-0"
            style={{
              height: 52,
              padding: "0 16px",
              borderBottom: `1px solid ${cardBorder}`,
              background: isDark ? "hsl(215,50%,10%)" : "hsl(0,0%,98%)",
            }}
          >
            <div className="flex items-center gap-2">
              {activeTab === "website" ? <Globe className="w-4 h-4" style={{ color: mutedText }} /> : <CalendarCheck className="w-4 h-4" style={{ color: mutedText }} />}
              <span className="font-medium truncate" style={{ fontSize: 14, color: headingText }}>
                {activeTab === "website" ? "Website Preview" : "Booking Page Preview"}
              </span>
            </div>
            <button
              onClick={() => setIsFullscreen(false)}
              className="inline-flex items-center gap-1.5 font-semibold transition-all duration-150 rounded-lg"
              style={{
                height: 36,
                padding: "0 14px",
                fontSize: 13,
                color: isDark ? "white" : "hsl(222,47%,11%)",
                background: isDark ? "hsla(0,0%,100%,0.1)" : "hsl(210,40%,92%)",
                border: `1px solid ${cardBorder}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isDark ? "hsla(0,0%,100%,0.16)" : "hsl(210,40%,86%)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isDark ? "hsla(0,0%,100%,0.1)" : "hsl(210,40%,92%)";
              }}
            >
              <X className="w-4 h-4" />
              Close
            </button>
          </div>

          {/* Fullscreen iframe */}
          <iframe
            src={iframeSrc!}
            title={activeTab === "booking" ? "Booking Page Fullscreen" : "Website Fullscreen"}
            className="flex-1 w-full border-0"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </div>
      )}

      <style>{`
        @keyframes fullscreenRevealIn {
          0% { opacity: 0; transform: scale(0.96); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes welcomeReveal {
          0% { opacity: 0; transform: translateY(8px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes welcomeShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

export default WebsitePage;
