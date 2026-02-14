import { useSurveyFunnel } from "@/components/SurveyFunnelContext";

const CtaFooter = () => {
  const { openFunnel } = useSurveyFunnel();

  return (
    <>
      {/* CTA */}
      <section className="bg-accent py-12 md:py-20 px-5 md:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-[22px] md:text-[32px] font-bold tracking-[-0.015em] text-accent-foreground text-center leading-[1.2] max-w-3xl mx-auto mb-8">
            Your Competitors Already Have Online Booking.
            <br />
            <span className="font-serif italic text-[24px] md:text-[36px]">You're Still Relying on Missed Calls and DMs.</span>
          </h2>
          <button
            onClick={openFunnel}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold rounded-full shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.98] transition-all duration-200 px-10 py-4 text-lg min-h-[48px]"
          >
            Start My 14-Day Free Trial →
          </button>
          <p className="text-sm text-accent-foreground/70 mt-3 text-center">
            No credit card required · Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary py-8 px-5 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <h2 className="text-xl font-heading font-bold text-primary-foreground tracking-tight">velarrio:</h2>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-primary-foreground/40">
            <a href="#" className="hover:text-primary-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-foreground transition-colors">Cookie Policy</a>
            <a href="#" className="hover:text-primary-foreground transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-primary-foreground transition-colors">Opt Out</a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default CtaFooter;
