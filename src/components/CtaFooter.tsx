import { useNavigate, Link } from "react-router-dom";
import { Lock, Zap } from "lucide-react";
import darkerLogo from "@/assets/darker-logo.png";

const footerBg = "hsl(222, 47%, 11%)";
const textMuted = "rgba(255,255,255,0.5)";
const textDim = "rgba(255,255,255,0.35)";
const accent = "rgba(125,211,252,0.9)";

const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "How it works", to: "/#how-it-works" },
      { label: "Pricing", to: "/signup" },
      { label: "Features", to: "/#value" },
      { label: "Updates", to: "/" },
    ],
  },
  {
    title: "About us",
    links: [
      { label: "Company", to: "/" },
      { label: "Careers", to: "/" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of service", to: "/terms" },
      { label: "Privacy", to: "/privacy" },
      { label: "Cookies", to: "/cookies" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact", to: "/signup" },
      { label: "Help", to: "/" },
    ],
  },
];

const CtaFooter = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* CTA section — unchanged */}
      <section
        className="relative py-32 md:py-40 px-5 md:px-8 text-center overflow-hidden"
        style={{
          background: "linear-gradient(180deg, hsl(215, 50%, 10%) 0%, hsl(217, 33%, 17%) 100%)",
        }}
      >
        <div className="absolute inset-0 pointer-events-none z-0" style={{ opacity: 0.025, backgroundImage: "radial-gradient(circle at 1px 1px, hsl(0 0% 100%) 1px, transparent 0)", backgroundSize: "50px 50px" }} />
        <div className="relative z-10 max-w-[680px] mx-auto">
          <div className="flex flex-row items-center justify-center gap-3 mb-5" style={{ opacity: 0, animation: "fadeSlideUp 0.5s ease-out 0.2s forwards" }}>
            <div style={{ width: 40, height: 1, background: "rgba(125,211,252,0.3)" }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(125, 211, 252, 0.8)" }}>DARKER DIGITAL</span>
            <div style={{ width: 40, height: 1, background: "rgba(125,211,252,0.3)" }} />
          </div>
          <h2 className="font-heading font-extrabold mb-5" style={{ fontSize: "clamp(32px, 5.5vw, 58px)", letterSpacing: "-0.02em", lineHeight: 1.1, color: "hsl(0, 0%, 100%)", opacity: 0, animation: "fadeSlideUp 0.5s ease-out 0.35s forwards" }}>
            The Moment You Sign Up,
            <br />Your Shop Runs Itself.
          </h2>
          <p className="text-[17px] md:text-[18px] max-w-[520px] mx-auto mb-10" style={{ lineHeight: 1.75, color: "rgba(255,255,255,0.62)", opacity: 0, animation: "fadeSlideUp 0.5s ease-out 0.5s forwards" }}>
            Your booking page live. Deposits flowing in. No-shows down. All done for you — in under 5 minutes.
          </p>
          <div style={{ opacity: 0, animation: "fadeSlideUp 0.5s ease-out 0.65s forwards" }}>
            <button
              onClick={() => navigate("/signup")}
              type="button"
              className="group relative inline-flex items-center justify-center overflow-hidden transition-all duration-300"
              style={{
                height: 56, paddingLeft: 40, paddingRight: 40, borderRadius: 14, fontWeight: 700, fontSize: 16,
                background: "linear-gradient(135deg, hsl(210, 95%, 58%) 0%, hsl(217, 91%, 50%) 100%)",
                color: "white",
                boxShadow: "0 0 0 1px rgba(125,211,252,0.2), 0 8px 32px rgba(56,189,248,0.35), 0 2px 8px rgba(0,0,0,0.2)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 0 1px rgba(125,211,252,0.4), 0 12px 48px rgba(56,189,248,0.5), 0 4px 16px rgba(0,0,0,0.25)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 0 0 1px rgba(125,211,252,0.2), 0 8px 32px rgba(56,189,248,0.35), 0 2px 8px rgba(0,0,0,0.2)"; }}
            >
              <span className="relative z-10">Start Free — No Card Needed</span>
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-5 mt-4 text-[12px]" style={{ color: "hsla(0, 0%, 100%, 0.4)" }}>
            <span>🔒 No credit card required</span>
            <span>⚡ Live in 5 minutes</span>
            <span>↩ Cancel anytime</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-5" style={{ opacity: 0, animation: "fadeSlideUp 0.5s ease-out 0.8s forwards" }}>
            <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(125,211,252,0.15)", color: "rgba(255,255,255,0.5)" }}>
              <Lock className="w-3.5 h-3.5" style={{ color: "rgba(125,211,252,0.7)" }} /> No credit card
            </span>
            <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(125,211,252,0.15)", color: "rgba(255,255,255,0.5)" }}>
              <Zap className="w-3.5 h-3.5" style={{ color: "rgba(125,211,252,0.7)" }} /> Live in 5 minutes
            </span>
          </div>
        </div>
      </section>

      {/* Footer — clean structure (no penguin, no icicles) */}
      <footer className="pt-14 pb-8 px-5 md:px-8" style={{ background: footerBg }}>
        <div className="max-w-[1100px] mx-auto">
          {/* Top: logo, tagline, single CTA — left aligned */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 lg:gap-12 pb-12 border-b border-white/10">
            <div className="text-left">
              <img src={darkerLogo} alt="Darker" className="h-8 w-auto mb-3" width={120} height={32} decoding="async" />
              <p className="text-sm max-w-[280px]" style={{ color: textMuted }}>
                Professional websites and 24/7 booking for auto detailers.
              </p>
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="mt-5 inline-flex items-center justify-center h-12 px-6 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:opacity-95"
                style={{
                  background: "linear-gradient(135deg, hsl(210, 95%, 58%) 0%, hsl(217, 91%, 50%) 100%)",
                  boxShadow: "0 4px 20px hsla(217, 91%, 60%, 0.35)",
                }}
              >
                Start Free
              </button>
            </div>

            {/* Four columns — grid on desktop, stacked on mobile */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-10 lg:flex-1 lg:max-w-[520px] lg:ml-auto">
              {FOOTER_COLUMNS.map((col) => (
                <div key={col.title}>
                  <h3 className="font-semibold text-sm mb-3" style={{ color: "white" }}>{col.title}</h3>
                  <ul className="space-y-2">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        {link.to.startsWith("http") ? (
                          <a href={link.to} target="_blank" rel="noopener noreferrer" className="text-[13px] hover:underline transition-colors" style={{ color: textMuted }} onMouseEnter={(e) => { e.currentTarget.style.color = accent; }} onMouseLeave={(e) => { e.currentTarget.style.color = textMuted; }}>{link.label}</a>
                        ) : link.to.startsWith("/#") ? (
                          <a href={link.to} className="text-[13px] hover:underline transition-colors" style={{ color: textMuted }} onMouseEnter={(e) => { e.currentTarget.style.color = accent; }} onMouseLeave={(e) => { e.currentTarget.style.color = textMuted; }}>{link.label}</a>
                        ) : (
                          <Link to={link.to} className="text-[13px] hover:underline transition-colors" style={{ color: textMuted }} onMouseEnter={(e) => { e.currentTarget.style.color = accent; }} onMouseLeave={(e) => { e.currentTarget.style.color = textMuted; }}>{link.label}</Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom: copyright + social */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
            <p className="text-[12px]" style={{ color: textDim }}>© {new Date().getFullYear()} Darker. All rights reserved.</p>
            <div className="flex items-center gap-6 text-[12px]">
              <a href="https://instagram.com/darkerdigital" target="_blank" rel="noopener noreferrer" className="hover:underline transition-colors" style={{ color: textDim }}>Instagram</a>
              <a href="https://twitter.com/darkerdigital" target="_blank" rel="noopener noreferrer" className="hover:underline transition-colors" style={{ color: textDim }}>X</a>
              <a href="https://facebook.com/darkerdigital" target="_blank" rel="noopener noreferrer" className="hover:underline transition-colors" style={{ color: textDim }}>Facebook</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default CtaFooter;
