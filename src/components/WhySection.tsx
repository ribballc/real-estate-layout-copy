import { Target, Sparkles, Brain, Settings } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "1st Party Audience Targeting Solutions",
    description: "Use first-party data, AI, and privacy-safe tech to reach the right audiences and improve performance.",
  },
  {
    icon: Sparkles,
    title: "Ad Experiences that Drive Performance",
    description: "Custom creatives, asset tools, and brand safety features optimize campaigns and boost results across the funnel.",
  },
  {
    icon: Brain,
    title: "Powerful Performance AI",
    description: "Our AI uses 17 years of data to deliver targeted, scalable ads that drive ROI and growth.",
  },
  {
    icon: Settings,
    title: "Smart, Simple Campaign Management",
    description: "Simple, transparent tools give full control for smooth campaign setup, optimization, and performance tracking.",
  },
];

const WhySection = () => {
  return (
    <section className="bg-background py-20 md:py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-foreground text-center mb-16">
          Why Realize?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <feature.icon className="w-10 h-10 text-accent mb-5" />
              <h3 className="text-xl font-bold text-card-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
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

export default WhySection;
