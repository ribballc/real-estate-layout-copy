import FadeIn from "@/components/FadeIn";
import { useSurveyFunnel } from "@/components/SurveyFunnelContext";

const without = [
  "$50-150/mo for a basic website that doesn't book anything",
  "Booking through DMs, texts, and missed calls",
  "Manually chasing confirmations and reminders",
  "$200-600/week lost to no-shows and cancellations",
  "No deposits = no protection from tire-kickers",
  "Looking amateur while competitors look professional",
];

const withRealize = [
  "Done-for-you website + booking calendar in one",
  "Customers book and pay deposits 24/7",
  "Auto SMS reminders cut no-shows by 40%",
  "Route optimization saves 45-90 min/day (Pro)",
  "Auto review requests build your reputation",
  "Live in 48 hours — zero tech skills needed",
];

const FunnelSection = () => {
  const { openFunnel } = useSurveyFunnel();

  return (
    <section className="bg-background py-16 md:py-24 px-5 md:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <FadeIn>
          <h2 className="font-heading text-[26px] md:text-[54px] font-bold tracking-[-0.02em] leading-[1.1] text-foreground text-center mb-3">
            What You're Paying Now vs.{" "}
            <span className="font-serif italic text-[30px] md:text-[60px] text-accent">What You Get</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-12 md:mb-16">
            Most detailers cobble together 3-4 apps and still lose money to no-shows.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <FadeIn delay={0} direction="left">
            <div className="bg-background rounded-[24px] p-6 md:p-8 text-left h-full" style={{
              border: '1px solid hsla(12, 80%, 50%, 0.15)',
              background: 'hsla(12, 80%, 50%, 0.02)',
            }}>
              <h3 className="text-lg font-bold text-foreground mb-6">Without velarrio</h3>
              <ul className="space-y-0">
                {without.map((item, i) => (
                  <li key={i} className={`flex items-start gap-3 py-3 leading-relaxed text-muted-foreground ${i < without.length - 1 ? "border-b border-border" : ""}`}>
                    <span className="text-destructive font-bold text-lg flex-shrink-0">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          <FadeIn delay={120} direction="right">
            <div className="rounded-[24px] p-6 md:p-8 shadow-xl text-left h-full" style={{
              background: 'linear-gradient(135deg, hsl(160 50% 8%) 0%, hsl(160 40% 14%) 100%)',
              color: 'white',
            }}>
              <div className="flex items-center gap-3 mb-6">
                <h3 className="text-lg font-bold text-primary-foreground">With velarrio — from $49/mo</h3>
                <span className="text-brass text-[10px] font-serif italic tracking-wider border border-brass/30 px-2 py-0.5 rounded-full">
                  ✦ THE STANDARD
                </span>
              </div>
              <ul className="space-y-0">
                {withRealize.map((item, i) => (
                  <li key={i} className={`flex items-start gap-3 py-3 leading-relaxed ${i < withRealize.length - 1 ? "border-b border-primary-foreground/10" : ""}`}>
                    <span className="text-accent font-bold text-lg flex-shrink-0">✓</span>
                    <span className="text-primary-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={300}>
          <div className="mt-12">
            <button
              onClick={openFunnel}
              className="group inline-flex items-center gap-2 font-bold rounded-[14px] hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-400 px-10 py-4 text-lg min-h-[48px]"
              style={{
                background: 'linear-gradient(135deg, hsl(82 65% 55%) 0%, hsl(82 55% 45%) 100%)',
                color: 'hsl(160 50% 8%)',
                boxShadow: '0 8px 24px hsla(82, 65%, 55%, 0.35), inset 0 1px 0 hsla(0, 0%, 100%, 0.2)',
              }}
            >
              Start My Free Trial →
            </button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default FunnelSection;
