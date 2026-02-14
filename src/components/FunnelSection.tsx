import FadeIn from "@/components/FadeIn";

const without = [
  "$50-150/mo for a basic website",
  "Booking through DMs and texts",
  "Manually chasing confirmations",
  "$200+/week lost to no-shows",
  "Looking amateur next to bigger shops",
];

const withRealize = [
  "Website + booking in one place",
  "Built for detailers, PPF & tint",
  "Auto reminders + deposit collection",
  "47% fewer no-shows on average",
  "Launch in 5 mins, no tech skills",
];

const FunnelSection = () => {
  const scrollToForm = () => {
    const el = document.getElementById("form-funnel");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bg-background py-16 md:py-24 px-5 md:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <FadeIn>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-foreground mb-3">
            Stop Overpaying for Tools That Don't Work Together
          </h2>
          <p className="text-lg text-muted-foreground mb-10 md:mb-12">
            Most detailers duct-tape 3-4 apps. We replace all of them.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FadeIn delay={0}>
            <div className="bg-background border border-border rounded-2xl p-6 md:p-8 text-left h-full">
              <h3 className="text-lg font-bold text-foreground mb-6">Without Realize</h3>
              <ul className="space-y-0">
                {without.map((item) => (
                  <li key={item} className="flex items-start gap-3 py-2 leading-relaxed text-muted-foreground">
                    <span className="text-destructive font-bold shrink-0">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          <FadeIn delay={150}>
            <div className="bg-primary text-primary-foreground rounded-2xl p-6 md:p-8 shadow-xl text-left h-full">
              <h3 className="text-lg font-bold mb-6">With Realize</h3>
              <ul className="space-y-0">
                {withRealize.map((item) => (
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
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-bold rounded-full shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.98] transition-all duration-200 px-8 py-3 text-lg min-h-[48px]"
          >
            Try It Free for 14 Days
          </button>
        </div>
      </div>
    </section>
  );
};

export default FunnelSection;
