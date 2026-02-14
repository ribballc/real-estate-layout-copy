import FadeIn from "@/components/FadeIn";

const steps = [
  {
    step: 1,
    title: "Tell Us About Your Shop",
    description: "Name, services, hours, area. Takes 60 seconds — shorter than your morning coffee order.",
  },
  {
    step: 2,
    title: "We Build Everything",
    description: "Custom website + booking system with auto SMS reminders and deposit collection. Done in 48 hours.",
  },
  {
    step: 3,
    title: "Bookings Roll In",
    description: "Customers find you, book online, pay a deposit, and get reminders. You stop chasing. You start detailing.",
  },
];

const HowItWorksSection = () => {
  const scrollToForm = () => {
    const el = document.getElementById("form-funnel");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bg-muted py-16 md:py-24 px-5 md:px-8">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <h2 className="font-heading text-[26px] md:text-4xl font-extrabold tracking-tight leading-[1.15] text-foreground text-center mb-3">
            Live in 48 Hours. Not Kidding.
          </h2>
          <p className="text-base md:text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-10 md:mb-14">
            Three steps between you and a professional online presence that books jobs while you sleep.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <FadeIn key={step.step} delay={i * 100}>
              <div className="bg-background rounded-2xl p-6 md:p-8 text-center shadow-sm border border-border">
                <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-lg font-bold mx-auto mb-4 min-h-[48px]">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-bold rounded-full shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.98] transition-all duration-200 px-8 py-3 text-lg min-h-[48px]"
          >
            Start My Free Trial →
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
