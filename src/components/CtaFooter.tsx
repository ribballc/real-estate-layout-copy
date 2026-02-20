import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import darkerLogo from "@/assets/darker-logo.png";
import mascotPenguin from "@/assets/mascot-penguin.png";

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
            Your competitors are already on Darker.
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
            Every day without an online booking page is money left on the table. Setup takes 5 minutes. Your first 14 days are free.
          </p>
          <div style={{ opacity: 0, animation: "fadeSlideUp 0.5s ease-out 0.6s forwards" }}>
            <button
              onClick={() => navigate('/signup')}
              className="group relative inline-flex items-center justify-center font-semibold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 h-14 px-8 text-base min-h-[48px] overflow-hidden"
              style={{
                background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)",
                color: "hsl(0, 0%, 100%)",
                boxShadow: "0 8px 24px hsla(217, 91%, 60%, 0.35)",
              }}
            >
              <span className="relative z-10">Claim My Free 14 Days</span>
              <span
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"
                style={{ background: "linear-gradient(90deg, transparent 0%, hsla(0, 0%, 100%, 0.2) 50%, transparent 100%)" }}
              />
            </button>
            <div className="flex flex-wrap justify-center gap-5 mt-4 text-[12px]" style={{ color: "hsla(0, 0%, 100%, 0.4)" }}>
              <span>🔒 No credit card required</span>
              <span>⚡ Live in 5 minutes</span>
              <span>↩ Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 md:py-16 px-5 md:px-8" style={{ background: "hsl(222, 47%, 11%)" }}>
        {/* Mascot penguin – mobile only, bottom-left corner */}
        <img
          src={mascotPenguin}
          alt=""
          aria-hidden="true"
          className="block md:hidden absolute bottom-0 left-0 pointer-events-none select-none"
          style={{ width: 90, height: "auto", zIndex: 1 }}
        />
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
