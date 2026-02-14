import { useSurveyFunnel } from "@/components/SurveyFunnelContext";
import FadeIn from "@/components/FadeIn";

const CtaFooter = () => {
  const { openFunnel } = useSurveyFunnel();

  return (
    <>
      {/* CTA */}
      <section className="bg-accent py-12 md:py-20 px-5 md:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <h2 className="font-heading text-[22px] md:text-[32px] font-bold tracking-[-0.015em] text-accent-foreground text-center leading-[1.2] max-w-3xl mx-auto mb-8">
              Your Competitors Already Have Online Booking.
              <br />
              <span className="font-serif italic text-[24px] md:text-[36px]">You're Still Relying on Missed Calls and DMs.</span>
            </h2>
          </FadeIn>
          <button
            onClick={openFunnel}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold rounded-full shadow-md hover:shadow-lg hover:brightness-105 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 px-10 py-4 text-lg min-h-[48px]"
          >
            Start My 14-Day Free Trial →
          </button>
          <p className="text-sm text-accent-foreground/70 mt-3 text-center">
            No credit card required · Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 md:py-16 px-5 md:px-8" style={{
        background: 'linear-gradient(180deg, hsl(160, 40%, 8%) 0%, hsl(160, 35%, 6%) 100%)',
      }}>
        <div className="max-w-6xl mx-auto">
          {/* Brand statement */}
          <div className="text-center mb-10">
            <p className="text-primary-foreground/50 text-sm leading-relaxed max-w-md mx-auto">
              <span className="font-serif italic text-primary-foreground/70 text-base">Velarrio isn't just software.</span>
              <br />
              It's the system that turns your detailing craft into a thriving business.
            </p>
          </div>

          <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start gap-1">
              <h2 className="text-xl font-heading font-bold text-primary-foreground tracking-tight">velarrio:</h2>
              <p className="text-xs text-primary-foreground/30 font-serif italic">Built for professionals.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-primary-foreground/40">
              <a href="#" className="hover:text-primary-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary-foreground transition-colors">Cookie Policy</a>
              <a href="#" className="hover:text-primary-foreground transition-colors">Terms of Use</a>
              <a href="#" className="hover:text-primary-foreground transition-colors">Opt Out</a>
            </div>
            <p className="text-xs text-primary-foreground/25">© 2026 Velarrio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default CtaFooter;
