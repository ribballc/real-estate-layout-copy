import howItWorks1 from "@/assets/how-it-works-1.png";
import howItWorks2 from "@/assets/how-it-works-2.png";
import howItWorks3 from "@/assets/how-it-works-3.png";
import FadeIn from "@/components/FadeIn";

const steps = [
  {
    image: howItWorks1,
    step: 1,
    title: "Tell Us About Your Business",
    description: "Answer a few quick questions about your services, area, and hours. Under 2 minutes.",
  },
  {
    image: howItWorks2,
    step: 2,
    title: "We Build Everything For You",
    description: "Our team creates your custom website with online booking, automated reminders, and deposit collection.",
  },
  {
    image: howItWorks3,
    step: 3,
    title: "Start Getting Bookings",
    description: "Go live and watch bookings roll in. Clients book online, pay deposits, and show up — no more chasing people via text.",
  },
];

const HowItWorksSection = () => {
  const scrollToForm = () => {
    const el = document.getElementById("form-funnel");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bg-background py-16 md:py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <h2 className="font-heading text-2xl md:text-4xl font-bold text-foreground text-center mb-10 md:mb-12 leading-[1.15]">
            Up and Running in 48 Hours
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <FadeIn key={step.step} delay={i * 100}>
              <div className="flex flex-col items-center text-center">
                <div className="rounded-2xl overflow-hidden mb-6 shadow-lg">
                  <img src={step.image} alt={step.title} className="w-full h-48 object-cover" />
                </div>
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mb-4 min-h-[48px]">
                  {step.step}
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-3 rounded-full text-lg font-medium hover:brightness-110 hover:shadow-xl transition-all min-h-[48px]"
          >
            Get Started Free
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
