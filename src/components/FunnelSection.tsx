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

const withDarker = [
  "Done-for-you website + booking calendar in one",
  "Customers book and pay deposits 24/7",
  "Auto SMS reminders cut no-shows by 40%",
  "Route optimization saves 45-90 min/day (Pro)",
  "Deposit protection filters out tire-kickers",
  "Live in 48 hours — zero tech skills needed",
];

const FunnelSection = () => {
  const { openFunnel } = useSurveyFunnel();

  return (
    <section className="bg-card py-16 md:py-24 px-5 md:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <FadeIn>
          <h2 className="font-heading text-[28px] md:text-[56px] lg:text-[72px] font-bold tracking-[-0.015em] leading-[1.2] text-foreground text-center mb-3">
            What Changes
          </h2>
          <p className="text-base md:text-lg text-muted-foreground text-center max-w-[600px] mx-auto mb-12 md:mb-16">
            Stop cobbling together apps. Get everything in one system.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <FadeIn delay={0} direction="left">
            <div className="bg-background rounded-2xl p-6 md:p-8 text-left h-full border" style={{
              borderColor: 'hsl(0 84% 90%)',
            }}>
              <h3 className="text-lg font-semibold mb-6" style={{ color: 'hsl(0 60% 35%)' }}>Without Darker</h3>
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
            <div className="rounded-2xl p-6 md:p-8 text-left h-full" style={{
              background: 'linear-gradient(135deg, hsl(215 50% 10%) 0%, hsl(217 33% 17%) 100%)',
              border: '1px solid hsla(217, 91%, 60%, 0.2)',
              boxShadow: '0 8px 32px hsla(217, 91%, 60%, 0.15)',
            }}>
              <h3 className="text-lg font-semibold text-sky mb-6">With Darker — from $35/mo</h3>
              <ul className="space-y-0">
                {withDarker.map((item, i) => (
                  <li key={i} className={`flex items-start gap-3 py-3 leading-relaxed ${i < withDarker.length - 1 ? "border-b border-primary-foreground/10" : ""}`}>
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
              className="group inline-flex items-center gap-2 font-semibold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 px-10 py-4 text-base min-h-[48px] text-primary-foreground"
              style={{
                background: 'linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)',
                boxShadow: '0 8px 24px hsla(217, 91%, 60%, 0.35)',
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
