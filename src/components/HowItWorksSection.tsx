import howItWorks1 from "@/assets/how-it-works-1.png";
import howItWorks2 from "@/assets/how-it-works-2.png";
import howItWorks3 from "@/assets/how-it-works-3.png";

const steps = [
  {
    image: howItWorks1,
    step: 1,
    title: "Create Your Realize Ads",
    description: "Sign up, set your goals, and launch your first campaign in minutes — no experience needed.",
  },
  {
    image: howItWorks2,
    step: 2,
    title: "Run Your Ad on Premium Websites",
    description: "Discover and qualify high intent audiences based on their interactions with your ads or site.",
  },
  {
    image: howItWorks3,
    step: 3,
    title: "Watch Your Results Grow",
    description: "Track performance in real-time and let our smart bidding technology optimize your campaign for the best results.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="bg-background py-20 md:py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground text-center mb-16 leading-[1.1]">
          Start Advertising in Just a Few Clicks
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.step} className="flex flex-col items-center text-center">
              <div className="rounded-2xl overflow-hidden mb-6 shadow-lg">
                <img src={step.image} alt={step.title} className="w-full h-56 object-cover" />
              </div>
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mb-4">
                {step.step}
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full text-lg font-medium hover:opacity-90 transition-opacity">
            Create Account
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
