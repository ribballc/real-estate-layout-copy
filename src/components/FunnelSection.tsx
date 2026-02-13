import { Eye, Search, MousePointerClick } from "lucide-react";

const stages = [
  {
    icon: Eye,
    title: "Awareness",
    subtitle: "Viewable Impressions",
    description: "Get your brand seen by the right people at scale",
    active: false,
  },
  {
    icon: Search,
    title: "Consideration",
    subtitle: "Intent Prospecting",
    description: "Discover & qualify high intent audiences based on their interactions with your ads or site",
    active: true,
  },
  {
    icon: MousePointerClick,
    title: "Action",
    subtitle: "Conversion Targeting",
    description: "Close the deal with qualified audiences",
    active: true,
  },
];

const FunnelSection = () => {
  return (
    <section className="bg-background py-20 md:py-28 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4 leading-[1.1]">
          Specialized Performance
        </h2>
        <p className="text-lg text-muted-foreground mb-16">
          Successful Performance Advertisers Focus on Conversion and Action Stages
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stages.map((stage) => (
            <div
              key={stage.title}
              className={`rounded-2xl p-8 transition-all ${
                stage.active
                  ? "bg-primary text-primary-foreground shadow-lg scale-105"
                  : "bg-card text-card-foreground border border-border"
              }`}
            >
              <stage.icon className={`w-10 h-10 mx-auto mb-4 ${stage.active ? "text-accent" : "text-muted-foreground"}`} />
              <h3 className="font-heading text-xl font-bold mb-2">{stage.title}</h3>
              <div className={`text-sm font-medium mb-3 ${stage.active ? "text-accent" : "text-muted-foreground"}`}>
                {stage.subtitle}
              </div>
              <p className={`text-sm leading-relaxed ${stage.active ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                {stage.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FunnelSection;
