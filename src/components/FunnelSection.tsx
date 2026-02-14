import FadeIn from "@/components/FadeIn";

const oldWay = [
  "Paying $50-150/mo for a basic website",
  "Booking through DMs and texts",
  "Chasing confirmations manually",
  "Losing $200+/week to no-shows",
  "Looking amateur next to bigger shops",
];

const realizeWay = [
  "Website + booking in one place",
  "Built for detailers, PPF & tint",
  "Auto reminders + deposit collection",
  "47% fewer no-shows on average",
  "Live in 48 hours, no tech skills",
];

const FunnelSection = () => {
  const scrollToForm = () => {
    const el = document.getElementById("form-funnel");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bg-background py-16 md:py-24 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <FadeIn>
          <h2 className="font-heading text-2xl md:text-4xl font-bold text-foreground mb-3 leading-[1.15]">
            Stop Overpaying for Tools That Don't Talk to Each Other
          </h2>
          <p className="text-base md:text-lg text-muted-foreground mb-10 md:mb-12">
            Most detailers duct-tape together 3-4 apps. We replace all of them.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FadeIn delay={0}>
            <div className="bg-card border border-destructive/20 rounded-2xl p-8 text-left h-full">
              <h3 className="font-heading text-xl font-bold text-card-foreground mb-6">The Old Way</h3>
              <ul className="space-y-0">
                {oldWay.map((item) => (
                  <li key={item} className="flex items-start gap-3 py-2 leading-relaxed text-card-foreground">
                    <span className="text-destructive/70 font-bold shrink-0">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="bg-primary text-primary-foreground rounded-2xl p-8 shadow-xl ring-2 ring-accent/30 text-left h-full">
              <h3 className="font-heading text-xl font-bold mb-6">The Realize Way</h3>
              <ul className="space-y-0">
                {realizeWay.map((item) => (
                  <li key={item} className="flex items-start gap-3 py-2 leading-relaxed">
                    <span className="text-accent font-bold shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>

        <div className="mt-10">
          <button
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-3 rounded-full text-lg font-medium hover:brightness-110 hover:shadow-xl transition-all min-h-[48px]"
          >
            Start Free for 14 Days
          </button>
        </div>
      </div>
    </section>
  );
};

export default FunnelSection;
