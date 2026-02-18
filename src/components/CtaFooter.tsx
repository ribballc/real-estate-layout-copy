import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import darkerLogo from "@/assets/darker-logo.png";

const CtaFooter = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* CTA */}
      <section
        className="relative py-24 md:py-32 px-5 md:px-8 text-center overflow-hidden"
        style={{
          background: "linear-gradient(180deg, hsl(215 50% 10%) 0%, hsl(217 33% 17%) 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto relative z-10">
          <h2
            className="font-heading font-bold text-[28px] md:text-[42px] text-center mb-5"
            style={{
              color: "hsl(0, 0%, 100%)",
              letterSpacing: "-0.02em",
              lineHeight: "1.1",
              opacity: 0,
              animation: "fadeSlideUp 0.5s ease-out 0.3s forwards",
            }}
          >
            Stop Missing Jobs.
          </h2>
          <p
            className="text-base md:text-lg max-w-[560px] mx-auto mb-10"
            style={{
              lineHeight: "1.7",
              color: "hsla(0, 0%, 100%, 0.7)",
              opacity: 0,
              animation: "fadeSlideUp 0.5s ease-out 0.45s forwards",
            }}
          >
            Someone in your area just Googled "detailing near me." Is your shop showing up? Get live in 48 hours — free.
          </p>
          <div style={{ opacity: 0, animation: "fadeSlideUp 0.5s ease-out 0.6s forwards" }}>
            <button
              onClick={() => navigate('/signup')}
              className="group relative inline-flex items-center gap-2 font-semibold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 px-12 py-5 text-lg min-h-[48px] overflow-hidden"
              style={{
                background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)",
                color: "hsl(0, 0%, 100%)",
                boxShadow: "0 8px 24px hsla(217, 91%, 60%, 0.35)",
              }}
            >
              <span className="relative z-10">Claim My Free Website — Takes 60 Seconds</span>
              <ChevronRight className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-[3px]" />
              <span
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"
                style={{ background: "linear-gradient(90deg, transparent 0%, hsla(0, 0%, 100%, 0.2) 50%, transparent 100%)" }}
              />
            </button>
            <p className="text-sm mt-4" style={{ color: "hsla(0, 0%, 100%, 0.5)" }}>
              Free for 14 days · No credit card · Live in 48 hours
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 md:py-16 px-5 md:px-8" style={{ background: "hsl(222, 47%, 11%)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-6 mb-8 text-xs" style={{ color: "hsl(215, 20%, 65%)" }}>
            <span>🔒 Bank-level encryption</span>
            <span>·</span>
            <span>Secured by Stripe</span>
          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6" style={{ borderTop: "1px solid hsla(0, 0%, 100%, 0.1)" }}>
            <div className="flex flex-col items-center md:items-start gap-1">
              <img src={darkerLogo} alt="Darker" className="h-7" />
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm" style={{ color: "hsl(215, 20%, 65%)" }}>
              <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="/cookies" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
            <p className="text-xs" style={{ color: "hsla(0, 0%, 100%, 0.4)" }}>© 2026 Darker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default CtaFooter;
