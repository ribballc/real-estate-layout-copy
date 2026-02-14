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
          <h2 className="font-heading text-[26px] md:text-[42px] font-bold tracking-[-0.015em] leading-[1.2] text-foreground text-center mb-3">
            What You're Paying Now vs. <span className="font-serif italic text-[30px] md:text-[48px] text-accent">What You Get</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-10 md:mb-14">
            Most detailers cobble together 3-4 apps and still lose money to no-shows.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <FadeIn delay={0}>
            <div className="bg-background border border-border rounded-2xl p-6 md:p-8 text-left h-full">
              <h3 className="text-lg font-bold text-foreground mb-6">Without velarrio</h3>
              <ul className="space-y-0">
                {without.map((item, i) => (
                  <li key={i} className={`flex items-start gap-3 py-2.5 leading-relaxed text-muted-foreground ${i < without.length - 1 ? "border-b border-border" : ""}`}>
                    <span className="text-destructive font-bold text-lg flex-shrink-0">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          <FadeIn delay={120}>
            <div className="bg-primary text-primary-foreground rounded-2xl p-6 md:p-8 shadow-xl text-left h-full">
              <h3 className="text-lg font-bold mb-6">With velarrio — from $49/mo</h3>
              <ul className="space-y-0">
                {withRealize.map((item, i) => (
                  <li key={i} className={`flex items-start gap-3 py-2.5 leading-relaxed ${i < withRealize.length - 1 ? "border-b border-primary-foreground/10" : ""}`}>
                    <span className="text-accent font-bold text-lg flex-shrink-0">✓</span>
                    <span className="text-primary-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>

        <div className="mt-10">
          <button
            onClick={openFunnel}
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-bold rounded-full shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.98] transition-all duration-200 px-8 py-3 text-lg min-h-[48px]"
          >
            Start My Free Trial →
          </button>
        </div>
      </div>
    </section>
  );
};

export default FunnelSection;
