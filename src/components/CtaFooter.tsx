import { useSurveyFunnel } from "@/components/SurveyFunnelContext";
import FadeIn from "@/components/FadeIn";

const CtaFooter = () => {
  const { openFunnel } = useSurveyFunnel();

  return (
    <>
      {/* CTA */}
      <section className="py-16 md:py-24 px-5 md:px-8 text-center" style={{
        background: 'linear-gradient(135deg, hsl(82 65% 55%) 0%, hsl(82 55% 45%) 100%)',
      }}>
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <h2 className="font-heading text-[22px] md:text-[42px] font-bold tracking-[-0.02em] leading-[1.1] text-center max-w-3xl mx-auto mb-4" style={{ color: 'hsl(160 50% 8%)' }}>
              Your Competitors Already Have Online Booking.
            </h2>
            <p className="font-serif italic text-[24px] md:text-[48px] leading-[1.1] mb-8" style={{ color: 'hsl(160 50% 8%)' }}>
              You're Still Relying on Missed Calls and DMs.
            </p>
          </FadeIn>
          <button
            onClick={openFunnel}
            className="inline-flex items-center gap-2 font-bold rounded-[14px] hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-400 px-10 py-4 text-lg min-h-[48px]"
            style={{
              background: 'hsl(160 50% 8%)',
              color: 'hsl(0 0% 100%)',
              boxShadow: '0 8px 24px hsla(160, 50%, 8%, 0.4)',
            }}
          >
            Start My 14-Day Free Trial →
          </button>
          <p className="text-sm mt-3" style={{ color: 'hsla(160, 50%, 8%, 0.6)' }}>
            No credit card required · Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 md:py-16 px-5 md:px-8" style={{
        background: 'hsl(160 50% 6%)',
      }}>
        <div className="max-w-6xl mx-auto">
          {/* Brand statement */}
          <div className="text-center mb-10">
            <p className="text-primary-foreground/40 text-sm leading-relaxed max-w-md mx-auto">
              <span className="font-serif italic text-primary-foreground/60 text-base">Velarrio isn't just software.</span>
              <br />
              It's the system that turns your detailing craft into a thriving business.
            </p>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 mb-8 text-primary-foreground/20 text-xs">
            <span>🔒 Bank-level encryption</span>
            <span>·</span>
            <span>Secured by Stripe</span>
          </div>

          <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start gap-1">
              <h2 className="text-xl font-heading font-bold text-primary-foreground tracking-tight">velarrio:</h2>
              <p className="text-xs text-primary-foreground/25 font-serif italic">Built for professionals.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-primary-foreground/35">
              <a href="#" className="hover:text-primary-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary-foreground transition-colors">Cookie Policy</a>
              <a href="#" className="hover:text-primary-foreground transition-colors">Terms of Use</a>
              <a href="#" className="hover:text-primary-foreground transition-colors">Opt Out</a>
            </div>
            <p className="text-xs text-primary-foreground/20">© 2026 Velarrio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default CtaFooter;
