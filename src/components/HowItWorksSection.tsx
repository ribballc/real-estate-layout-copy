import FadeIn from "@/components/FadeIn";

const steps = [
  {
    step: 1,
    title: "Tell Us About Your Business",
    description: "Answer a few quick questions — services, hours, area. Under 2 minutes.",
  },
  {
    step: 2,
    title: "We Build Everything",
    description: "Custom website + booking system with auto reminders and deposit collection.",
  },
  {
    step: 3,
    title: "Get Bookings on Autopilot",
    description: "Go live and watch jobs roll in. Clients book, pay, and show up.",
  },
];

const HowItWorksSection = () => {
  const scrollToForm = () => {
    const el = document.getElementById("form-funnel");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bg-background py-16 md:py-24 px-5 md:px-8">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-center text-foreground mb-3">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg text-center mb-10 md:mb-12">
            From signup to live site in 48 hours.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <FadeIn key={step.step} delay={i * 120}>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-lg font-bold mb-5 min-h-[48px]">
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
            Get Started Free
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
