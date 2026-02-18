import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Lock, Copy, Check, Pencil, X, Globe, CalendarCheck } from "lucide-react";
import type { SupportChatbotHandle } from "./SupportChatbot";

interface WebsitePageProps {
  chatbotRef?: React.RefObject<SupportChatbotHandle>;
  isDark?: boolean;
}

const REVEAL_MESSAGES = [
  "Loading your site…",
  "Rendering pages…",
  "Almost ready…",
];

const WebsitePage = ({ chatbotRef, isDark = false }: WebsitePageProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [slug, setSlug] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
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

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("slug, business_name")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        setSlug(data?.slug ?? null);
        // Extract first name from business context or auth metadata
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

  const websiteUrl = slug ? `${slug}.darkerdigital.com` : "";
  const bookingUrl = slug ? `${slug}.darkerdigital.com/book` : "";
  const demoUrl = activeTab === "booking" ? bookingUrl : websiteUrl;
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
    // fallback clear after 3s in case onLoad doesn't fire
    setTimeout(() => {
      setIframeLoading(false);
      setRevealPhase("done");
    }, 3000);
  }, [activeTab]);

  const handleCopy = useCallback(() => {
    if (!demoUrl) return;
    navigator.clipboard.writeText(`https://${demoUrl}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [demoUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-[hsl(217,91%,60%)] border-t-transparent rounded-full animate-spin" />
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
      {/* ═══ Welcome Banner (first visit only) ═══ */}
      {showWelcome && (
        <div
          className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{
            background: "hsla(217,91%,60%,0.1)",
            borderBottom: "1px solid hsla(217,91%,60%,0.2)",
            padding: "20px 24px",
            borderRadius: 12,
          }}
        >
          <div>
            <p className="text-white font-bold" style={{ fontSize: 18 }}>
              Your website is ready{firstName ? `, ${firstName}` : ""}.
            </p>
            <p style={{ color: "hsla(0,0%,100%,0.6)", fontSize: 14, marginTop: 4 }}>
              This is a live demo. Activate your trial to publish it and start taking real bookings.
            </p>
          </div>
          <button
            className="shrink-0 font-semibold text-white"
            style={{
              background: "linear-gradient(135deg, hsl(217,91%,60%) 0%, hsl(224,91%,54%) 100%)",
              height: 40,
              borderRadius: 8,
              fontSize: 14,
              padding: "0 20px",
            }}
          >
            Activate Free Trial →
          </button>
          <button
            onClick={() => setShowWelcome(false)}
            className="absolute top-3 right-3 transition-colors"
            style={{ color: "hsla(0,0%,100%,0.4)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "white"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "hsla(0,0%,100%,0.4)"; }}
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
          border: `1px solid ${isDark ? "hsla(0,0%,100%,0.1)" : "hsl(210,40%,88%)"}`,
          borderRadius: 10,
          padding: 4,
          gap: 2,
        }}
      >
        {([
          { key: "website" as const, label: "Website", icon: Globe },
          { key: "booking" as const, label: "Booking Page", icon: CalendarCheck },
        ]).map(({ key, label, icon: Icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => handleTabSwitch(key)}
              className="inline-flex items-center gap-1.5 transition-all duration-200"
              style={{
                padding: "8px 18px",
                borderRadius: 7,
                fontSize: 14,
                fontWeight: isActive ? 600 : 500,
                background: isActive
                  ? isDark ? "hsla(217,91%,60%,0.15)" : "white"
                  : "transparent",
                color: isActive
                  ? isDark ? "white" : "hsl(222,47%,11%)"
                  : isDark ? "hsla(0,0%,100%,0.5)" : "hsl(215,16%,47%)",
                boxShadow: isActive
                  ? isDark ? "0 1px 4px hsla(0,0%,0%,0.3)" : "0 1px 4px hsla(0,0%,0%,0.1)"
                  : "none",
                cursor: isActive ? "default" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = isDark ? "hsla(0,0%,100%,0.06)" : "hsl(210,40%,90%)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                }
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
          background: isDark ? "hsla(0,0%,100%,0.04)" : "hsl(210,40%,96%)",
          border: `1px solid ${isDark ? "hsla(0,0%,100%,0.1)" : "hsl(210,40%,88%)"}`,
          borderRadius: 10,
          padding: "9px 14px",
          height: 42,
        }}
      >
        <Lock className="w-3.5 h-3.5 shrink-0" style={{ color: "hsl(142,71%,45%)" }} />
        <span
          className="font-mono truncate flex-1 transition-all duration-200"
          style={{ fontSize: 13, color: isDark ? "hsla(0,0%,100%,0.65)" : "hsl(215,16%,47%)" }}
        >
          {demoUrl}
        </span>
        <button
          onClick={handleCopy}
          className="ml-auto shrink-0 font-medium transition-colors"
          style={{
            color: copied ? "hsl(142,71%,45%)" : "hsl(217,91%,60%)",
            fontSize: 13,
            padding: "4px 10px",
            border: `1px solid ${copied ? "hsla(142,71%,45%,0.25)" : "hsla(217,91%,60%,0.25)"}`,
            borderRadius: 6,
            background: "transparent",
          }}
        >
          {copied ? (
            <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Copied ✓</span>
          ) : (
            <span className="flex items-center gap-1"><Copy className="w-3 h-3" /> Copy Link</span>
          )}
        </button>
      </div>

      {/* ═══ Iframe wrapper ═══ */}
      <div
        className="relative"
        style={{
          borderRadius: 12,
          overflow: "hidden",
          border: `1px solid ${isDark ? "hsla(0,0%,100%,0.08)" : "hsl(210,40%,88%)"}`,
          boxShadow: isDark ? "0 8px 48px hsla(0,0%,0%,0.4)" : "0 4px 24px hsla(0,0%,0%,0.08)",
        }}
      >
        {/* DEMO BADGE */}
        <div
          className="absolute z-10 transition-opacity duration-500"
          style={{
            top: 12,
            left: 12,
            background: "hsla(40,100%,50%,0.15)",
            border: "1px solid hsla(40,100%,50%,0.35)",
            color: "hsl(40,100%,62%)",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.1em",
            padding: "4px 10px",
            borderRadius: 99,
            opacity: revealPhase === "done" ? 1 : 0,
          }}
        >
          DEMO PREVIEW
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
            {/* Animated ring loader */}
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

            {/* Status message */}
            <p
              className="mt-4 font-medium text-sm transition-opacity duration-200"
              style={{ color: isDark ? "hsla(0,0%,100%,0.7)" : "hsl(215,16%,47%)" }}
            >
              {REVEAL_MESSAGES[revealMsg]}
            </p>

            {/* Progress bar */}
            <div
              className="mt-5"
              style={{
                width: 180,
                height: 3,
                borderRadius: 2,
                background: isDark ? "hsla(0,0%,100%,0.08)" : "hsl(210,40%,90%)",
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: 2,
                  background: "hsl(217,91%,60%)",
                  width: `${revealProgress}%`,
                  transition: revealProgress === 100 ? "width 0.3s ease" : "none",
                }}
              />
            </div>
          </div>
        )}

        <iframe
          src={iframeSrc}
          title={activeTab === "booking" ? "Booking Page" : "Your Website"}
          className="w-full border-0"
          style={{
            height: "calc(100vh - 320px)",
            minHeight: 480,
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
          <p className="text-white font-semibold" style={{ fontSize: 14 }}>Everything here is editable.</p>
          <p style={{ color: "hsla(0,0%,100%,0.5)", fontSize: 13, marginTop: 2 }}>
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

      {/* ═══ Activate CTA ═══ */}
      <div className="text-center py-6">
        <p className="text-white font-bold" style={{ fontSize: 18 }}>Ready to go live?</p>
        <p style={{ color: "hsla(0,0%,100%,0.5)", fontSize: 14, marginTop: 6 }}>
          Publish your site, activate your booking calendar, and start getting paid. 14-day free trial.
        </p>
        <button
          className="mx-auto mt-4 block font-semibold text-white"
          style={{
            background: "linear-gradient(135deg, hsl(217,91%,60%) 0%, hsl(224,91%,54%) 100%)",
            maxWidth: 260,
            width: "100%",
            height: 48,
            borderRadius: 10,
            fontSize: 15,
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
        <p style={{ color: "hsla(0,0%,100%,0.3)", fontSize: 12, marginTop: 10 }}>
          Card required · Cancel anytime in 2 clicks
        </p>
      </div>
    </div>
  );
};

export default WebsitePage;
