import { useSurveyFunnel } from "@/components/SurveyFunnelContext";
import FadeIn from "@/components/FadeIn";
import darkerLogo from "@/assets/darker-logo.png";

const CtaFooter = () => {
  const { openFunnel } = useSurveyFunnel();

  return (
    <>
      {/* CTA */}
      <section
        className="relative py-24 md:py-[120px] px-5 md:px-8 text-center overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #0071e3 0%, #0077ed 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto relative z-10">
          <FadeIn>
            <h2
              className="font-heading text-[28px] md:text-[40px] font-semibold leading-[1.15] text-center mb-5"
              style={{ color: "#ffffff", letterSpacing: "-0.4px" }}
            >
              Ready to Stop Missing Jobs?
            </h2>
            <p className="text-[17px] md:text-[21px] leading-[1.5] max-w-[600px] mx-auto mb-8" style={{ color: "hsla(0, 0%, 100%, 0.8)", letterSpacing: "-0.2px" }}>
              Your website can be live in 48 hours. Join 200+ detailers already using Darker.
            </p>
          </FadeIn>
          <button
            onClick={openFunnel}
            className="inline-flex items-center gap-2 font-medium rounded-full active:scale-[0.98] hover:scale-[1.02] transition-all duration-300 px-8 py-[17px] text-[17px] min-h-[48px]"
            style={{
              background: "#ffffff",
              color: "#0071e3",
              letterSpacing: "-0.2px",
            }}
          >
            Build My Website Free →
          </button>
          <p className="text-[15px] mt-4" style={{ color: "hsla(0, 0%, 100%, 0.6)" }}>
            Free for 14 days · Takes 60 seconds to start
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 md:py-16 px-5 md:px-8" style={{ background: "#000000" }}>
        <div className="max-w-6xl mx-auto">
          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 mb-8 text-[13px]" style={{ color: "#86868b" }}>
            <span>🔒 Bank-level encryption</span>
            <span>·</span>
            <span>Secured by Stripe</span>
          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6" style={{ borderTop: "1px solid hsla(0, 0%, 100%, 0.08)" }}>
            <div className="flex flex-col items-center md:items-start gap-1">
              <img src={darkerLogo} alt="Darker" className="h-7" />
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-[15px]" style={{ color: "#86868b" }}>
              <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors duration-300">Terms of Use</a>
            </div>
            <p className="text-[13px]" style={{ color: "hsla(0, 0%, 100%, 0.4)" }}>© 2026 Darker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default CtaFooter;
