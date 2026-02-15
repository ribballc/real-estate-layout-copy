import { useSurveyFunnel } from "@/components/SurveyFunnelContext";
import FadeIn from "@/components/FadeIn";
import darkerLogo from "@/assets/darker-logo.png";

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
        <div className="max-w-3xl mx-auto relative z-10">
          <FadeIn>
            <h2
              className="font-heading text-[24px] md:text-[42px] font-bold tracking-[-0.015em] leading-[1.2] text-center mb-4"
              style={{ color: "hsl(0, 0%, 100%)" }}
            >
              Ready to Stop Missing Jobs?
            </h2>
            <p className="text-base md:text-lg leading-relaxed max-w-[600px] mx-auto mb-8" style={{ color: "hsla(0, 0%, 100%, 0.8)" }}>
              Your website can be live in 48 hours. Join 200+ detailers already using Darker.
            </p>
          </FadeIn>
          <button
            onClick={openFunnel}
            className="inline-flex items-center gap-2 font-semibold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 px-12 py-5 text-lg min-h-[48px]"
            style={{
              background: "linear-gradient(135deg, hsl(160, 84%, 39%) 0%, hsl(160, 64%, 30%) 100%)",
              color: "hsl(0, 0%, 100%)",
              boxShadow: "0 8px 24px hsla(160, 84%, 39%, 0.35)",
            }}
          >
            Build My Website Free →
          </button>
          <p className="text-sm mt-4" style={{ color: "hsla(0, 0%, 100%, 0.6)" }}>
            Free for 14 days · Takes 60 seconds to start
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 md:py-16 px-5 md:px-8" style={{ background: "hsl(222, 47%, 11%)" }}>
        <div className="max-w-6xl mx-auto">
          {/* Trust badges */}
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
