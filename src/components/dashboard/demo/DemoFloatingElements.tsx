import { useState, useEffect, useCallback } from "react";
import { Calendar, ChevronUp, MessageCircle, X } from "lucide-react";

interface FloatingElementsProps {
  accent: string;
  accentGrad: string;
  isDark: boolean;
  onBookNow: () => void;
  scrollContainer: HTMLDivElement | null;
}

const NAMES = ["Mike", "Sarah", "Jake", "Amanda", "Chris", "Jessica", "David", "Emily"];
const SERVICES = ["Full Detail", "Ceramic Coating", "Interior Detail", "Paint Correction", "Express Wash", "Premium Detail"];
const CITIES = ["Dallas", "Austin", "Houston", "Frisco", "Plano", "McKinney"];

const DemoFloatingElements = ({ accent, accentGrad, isDark, onBookNow, scrollContainer }: FloatingElementsProps) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [socialProof, setSocialProof] = useState<string | null>(null);

  useEffect(() => {
    if (!scrollContainer) return;
    const handleScroll = () => setShowScrollTop(scrollContainer.scrollTop > 400);
    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [scrollContainer]);

  // Social proof ticker
  useEffect(() => {
    const show = () => {
      const name = NAMES[Math.floor(Math.random() * NAMES.length)];
      const service = SERVICES[Math.floor(Math.random() * SERVICES.length)];
      const city = CITIES[Math.floor(Math.random() * CITIES.length)];
      const mins = Math.floor(Math.random() * 15) + 1;
      setSocialProof(`${name} in ${city} booked ${service} ${mins} min ago`);
      setTimeout(() => setSocialProof(null), 4000);
    };
    const interval = setInterval(show, 8000);
    const timeout = setTimeout(show, 3000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, []);

  const scrollToTop = useCallback(() => {
    scrollContainer?.scrollTo({ top: 0, behavior: "smooth" });
  }, [scrollContainer]);

  const goldIconColor = isDark ? "#000" : "#fff";

  return (
    <>
      {/* Social proof notification */}
      {socialProof && (
        <div
          className="fixed bottom-24 left-4 z-50 max-w-xs rounded-xl px-4 py-3 text-xs font-medium shadow-lg"
          style={{
            background: isDark ? "hsl(0 0% 10%)" : "hsl(0 0% 100%)",
            color: isDark ? "#fff" : "#111",
            border: `1px solid ${isDark ? "hsl(0 0% 20%)" : "hsl(0 0% 88%)"}`,
            animation: "demoFadeInUp 0.4s ease-out",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" style={{ animation: "demoPulse 2s infinite" }} />
            {socialProof}
          </div>
        </div>
      )}

      {/* Floating Book Now button */}
      <button
        onClick={onBookNow}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold shadow-xl transition-transform hover:scale-105 active:scale-95"
        style={{ background: accentGrad, color: goldIconColor, boxShadow: `0 8px 30px ${accent}40` }}
      >
        <Calendar className="w-4 h-4" />
        Book Now
      </button>

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 left-4 z-50 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
          style={{
            background: isDark ? "hsl(0 0% 15%)" : "hsl(0 0% 100%)",
            border: `1px solid ${isDark ? "hsl(0 0% 25%)" : "hsl(0 0% 85%)"}`,
            color: isDark ? "#fff" : "#111",
            animation: "demoFadeInUp 0.3s ease-out",
          }}
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      {/* Live chat widget */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-20 right-4 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
        style={{ background: accentGrad, color: goldIconColor }}
      >
        {chatOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>

      {chatOpen && (
        <div
          className="fixed bottom-36 right-4 z-50 w-72 rounded-2xl overflow-hidden shadow-2xl"
          style={{
            background: isDark ? "hsl(0 0% 8%)" : "hsl(0 0% 100%)",
            border: `1px solid ${isDark ? "hsl(0 0% 20%)" : "hsl(0 0% 85%)"}`,
            animation: "demoFadeInUp 0.3s ease-out",
          }}
        >
          <div className="px-4 py-3 text-sm font-bold" style={{ background: accentGrad, color: goldIconColor }}>
            💬 Live Chat
          </div>
          <div className="p-4 space-y-3">
            <div className="rounded-lg p-3 text-xs" style={{ background: isDark ? "hsl(0 0% 12%)" : "hsl(0 0% 95%)" }}>
              Hi! 👋 Welcome! How can we help you today? This is a demo chat widget.
            </div>
            <input
              type="text"
              placeholder="Type a message..."
              readOnly
              className="w-full px-3 py-2 rounded-lg text-xs"
              style={{
                background: isDark ? "hsl(0 0% 12%)" : "hsl(0 0% 95%)",
                border: `1px solid ${isDark ? "hsl(0 0% 20%)" : "hsl(0 0% 85%)"}`,
                color: isDark ? "#fff" : "#111",
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DemoFloatingElements;
