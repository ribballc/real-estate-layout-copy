import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Globe, Pencil, Mail, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const TABS = [
  { id: "website", label: "Website" },
  { id: "booking", label: "Booking Page" },
] as const;
type TabId = (typeof TABS)[number]["id"];

const WebsitePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [slug, setSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("website");
  const [showTutorial, setShowTutorial] = useState(false);
  const bookingTabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("slug")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        setSlug(data?.slug ?? null);
        setLoading(false);
      });
  }, [user]);

  // Show tutorial on first visit
  useEffect(() => {
    if (!loading && slug) {
      const seen = localStorage.getItem("dd_booking_tab_tutorial");
      if (!seen) {
        const timer = setTimeout(() => setShowTutorial(true), 800);
        return () => clearTimeout(timer);
      }
    }
  }, [loading, slug]);

  const dismissTutorial = useCallback(() => {
    setShowTutorial(false);
    localStorage.setItem("dd_booking_tab_tutorial", "1");
  }, []);

  const switchToBooking = useCallback(() => {
    setActiveTab("booking");
    dismissTutorial();
  }, [dismissTutorial]);

  // Listen for "book-now" messages from the iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data === "dd-book-now") {
        switchToBooking();
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [switchToBooking]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const siteUrl = slug ? `${window.location.origin}/site/${slug}` : null;
  const bookUrl = slug ? `${window.location.origin}/site/${slug}/book` : null;
  const iframeSrc = activeTab === "website" ? siteUrl : bookUrl;

  return (
    <div className="space-y-6">
      {/* ─── Tab bar ─── */}
      <div className="relative flex gap-8 border-b border-border">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              ref={tab.id === "booking" ? bookingTabRef : undefined}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === "booking") dismissTutorial();
              }}
              className={`
                relative pb-3 text-lg font-bold transition-colors
                ${isActive
                  ? "text-[hsl(217,91%,60%)]"
                  : "text-muted-foreground hover:text-foreground"
                }
              `}
            >
              {tab.label}
              {/* Active underline */}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-[hsl(217,91%,60%)]" />
              )}
            </button>
          );
        })}

        {/* ─── Tutorial tooltip ─── */}
        {showTutorial && (
          <div className="absolute top-full left-[calc(50%+40px)] -translate-x-1/2 mt-3 z-50 animate-fade-in-up">
            {/* Arrow */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-[hsl(217,91%,60%)]" />
            <div className="bg-[hsl(217,91%,60%)] text-white rounded-xl px-5 py-4 shadow-lg shadow-[hsl(217,91%,60%)]/20 max-w-xs">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 mt-0.5 shrink-0" />
                <div className="space-y-2">
                  <p className="font-semibold text-sm">Check Out Your Booking Page!</p>
                  <p className="text-xs text-white/80">
                    Click here to preview your booking page, or tap "Book Now" on your website to switch automatically.
                  </p>
                  <button
                    onClick={switchToBooking}
                    className="text-xs font-bold underline underline-offset-2 hover:text-white/90"
                  >
                    View Booking Page →
                  </button>
                </div>
                <button onClick={dismissTutorial} className="shrink-0 hover:text-white/80">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── Preview embed ─── */}
      {iframeSrc ? (
        <div
          className="rounded-2xl overflow-hidden border border-border relative"
          style={{ boxShadow: "0 0 40px rgba(0,0,0,0.08)" }}
        >
          {/* Browser bar */}
          <div className="flex items-center gap-3 px-4 py-3 bg-muted/30 border-b border-border">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[hsl(0,80%,60%)]" />
              <div className="w-3 h-3 rounded-full bg-[hsl(40,90%,55%)]" />
              <div className="w-3 h-3 rounded-full bg-[hsl(140,60%,45%)]" />
            </div>
            <div className="flex-1 h-8 rounded-lg flex items-center px-3 text-xs font-mono bg-muted/50 text-muted-foreground">
              <Globe className="w-3 h-3 mr-2 text-primary" />
              {slug}.darkerdigital.com{activeTab === "booking" ? "/book" : ""}
            </div>
          </div>

          <iframe
            src={iframeSrc}
            title={activeTab === "website" ? "Your Website" : "Your Booking Page"}
            className="w-full border-0"
            style={{ height: "80vh" }}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />

          {/* Action buttons at bottom */}
          <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-t border-border bg-muted/20">
            <Button
              onClick={() => navigate("/dashboard/business")}
              className="gap-2 bg-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,50%)] text-white"
            >
              <Pencil className="w-4 h-4" />
              Make Changes
            </Button>
            <Button
              variant="outline"
              className="gap-2 border-border bg-card text-foreground hover:bg-muted"
              asChild
            >
              <a href="mailto:info@darkerdigital.com">
                <Mail className="w-4 h-4" />
                Request Changes
              </a>
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-border p-12 text-center space-y-3">
          <Globe className="w-10 h-10 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">
            Complete your business info to generate your website.
          </p>
          <Button onClick={() => navigate("/dashboard/business")} size="sm">
            Set Up Business Info
          </Button>
        </div>
      )}
    </div>
  );
};

export default WebsitePage;
