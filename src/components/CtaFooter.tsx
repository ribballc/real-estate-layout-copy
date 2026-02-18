import { useSurveyFunnel } from "@/components/SurveyFunnelContext";
import FadeIn from "@/components/FadeIn";
import darkerLogo from "@/assets/darker-logo.png";


const PhoneRingIcon = () => (
  <div className="relative inline-flex items-center justify-center mb-8" style={{ animation: "ctaFloat 3s ease-in-out infinite" }}>
    <div className="absolute w-20 h-20 rounded-full" style={{ border: "2px solid hsla(0, 0%, 100%, 0.2)", animation: "ctaRing 3s ease-out infinite" }} />
    <div className="absolute w-20 h-20 rounded-full" style={{ border: "2px solid hsla(0, 0%, 100%, 0.15)", animation: "ctaRing 3s ease-out infinite 1s" }} />
    <div className="absolute w-20 h-20 rounded-full" style={{ border: "2px solid hsla(0, 0%, 100%, 0.1)", animation: "ctaRing 3s ease-out infinite 2s" }} />
    <div
      className="w-16 h-16 rounded-2xl flex items-center justify-center relative z-10"
      style={{ background: "hsla(0, 0%, 100%, 0.1)", border: "1px solid hsla(0, 0%, 100%, 0.2)", backdropFilter: "blur(8px)" }}
    >
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ animation: "ctaBell 4s ease-in-out infinite" }}>
        <path d="M7 4 C7 4, 10 4, 11 7 L12 11 C12 12, 11 13, 10 13 L9 14 C9 14, 11 19, 18 23 L19 22 C20 21, 21 21, 22 22 L25 24 C27 25, 27 28, 25 28 L23 28 C15 28, 4 17, 4 9 L4 7 C4 5, 5 4, 7 4Z"
          stroke="hsl(0, 0%, 100%)" strokeWidth="2" fill="hsla(0, 0%, 100%, 0.1)" strokeLinejoin="round" />
        <path d="M20 4 C23 4, 26 7, 26 10" stroke="hsla(0, 0%, 100%, 0.6)" strokeWidth="1.5" strokeLinecap="round" fill="none">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
        </path>
        <path d="M20 8 C21.5 8, 23 9, 23 10.5" stroke="hsla(0, 0%, 100%, 0.4)" strokeWidth="1.5" strokeLinecap="round" fill="none">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite" begin="0.5s" />
        </path>
        <circle cx="24" cy="6" r="3" fill="hsl(160, 84%, 39%)">
          <animate attributeName="r" values="2.5;3.5;2.5" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  </div>
);

const CtaFooter = () => {
  const { openFunnel } = useSurveyFunnel();

  return (
    <>
      {/* CTA */}
      <section
        className="relative py-20 md:py-28 px-5 md:px-8 text-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, hsl(224, 64%, 33%) 0%, hsl(217, 71%, 53%) 100%)",
        }}
      >
        {/* Glow orbs */}
        <div className="absolute rounded-full pointer-events-none" style={{
          width: 400, height: 400, top: "10%", left: "-5%",
          background: "radial-gradient(circle, hsla(217, 91%, 60%, 0.06), transparent)",
          filter: "blur(120px)", animation: "orbDrift 25s ease-in-out infinite alternate",
        }} />
        <div className="absolute rounded-full pointer-events-none" style={{
          width: 350, height: 350, bottom: "5%", right: "-5%",
          background: "radial-gradient(circle, hsla(160, 84%, 39%, 0.04), transparent)",
          filter: "blur(120px)", animation: "orbDrift2 25s ease-in-out infinite alternate",
        }} />

        <div className="max-w-3xl mx-auto relative z-10">
          <FadeIn>
            <div className="flex justify-center">
              <PhoneRingIcon />
            </div>
            <h2
              className="font-heading text-[24px] md:text-[42px] font-bold tracking-[-0.015em] leading-[1.2] text-center mb-4"
              style={{ color: "hsl(0, 0%, 100%)" }}
            >
              Get Your Shop Online in 48 Hours.
            </h2>
            <p className="text-base md:text-lg leading-[1.7] max-w-[600px] mx-auto mb-8" style={{ color: "hsla(0, 0%, 100%, 0.8)" }}>
              See your live website and booking page in the dashboard the same day — no card needed to get started. 200+ detailing shops already on Darker.
            </p>
          </FadeIn>
          <button
            onClick={openFunnel}
            className="group relative inline-flex items-center gap-2 font-extrabold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 px-10 py-4 text-base min-h-[48px] overflow-hidden"
            style={{
              background: "linear-gradient(135deg, hsl(160, 84%, 39%) 0%, hsl(160, 64%, 30%) 100%)",
              color: "hsl(0, 0%, 100%)",
              boxShadow: "0 0 40px hsla(160, 84%, 39%, 0.45), 0 8px 24px hsla(160, 84%, 39%, 0.35)",
            }}
          >
            <span className="relative z-10">Get Started Free →</span>
            <span
              className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"
              style={{ background: "linear-gradient(90deg, transparent 0%, hsla(0, 0%, 100%, 0.2) 50%, transparent 100%)" }}
            />
          </button>
           <p className="text-sm mt-4" style={{ color: "hsla(0, 0%, 100%, 0.6)" }}>
             No card to get started · 14-day trial to go live · Cancel anytime
           </p>
           <div className="text-sm mt-6" style={{ color: "hsla(0, 0%, 100%, 0.5)" }}>
             Questions?{" "}
             {/* TODO: replace with your phone number */}
             <a
               href="tel:+1XXXXXXXXXX"
               className="font-semibold underline transition-colors hover:text-white"
               style={{ color: "hsla(0, 0%, 100%, 0.75)" }}
             >
               Call us →
             </a>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 md:py-16 px-5 md:px-8" style={{ background: "hsl(222, 47%, 11%)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-4 md:gap-6 mb-8 text-xs flex-wrap" style={{ color: "hsl(215, 20%, 65%)" }}>
            <span>🔒 Bank-level encryption</span>
            <span>·</span>
            <span>Secured by Stripe</span>
            <span>·</span>
            <span>SOC 2 compliant</span>
            <span>·</span>
            <span>99.9% uptime</span>
          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6" style={{ borderTop: "1px solid hsla(0, 0%, 100%, 0.1)" }}>
            <div className="flex flex-col items-center md:items-start gap-1">
              <img src={darkerLogo} alt="Darker" className="h-7" />
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm" style={{ color: "hsl(215, 20%, 65%)" }}>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
            </div>
            <p className="text-xs" style={{ color: "hsla(0, 0%, 100%, 0.4)" }}>© 2026 Darker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default CtaFooter;
