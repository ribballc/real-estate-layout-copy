import { TrendingUp } from "lucide-react";

const stats = [
  { value: "161%", label: "Native Sign-ups", brand: "Repsol" },
  { value: "8%", label: "Cost Per Impression", brand: "eToro" },
  { value: "6%", label: "Purchase Intent", brand: "AIG" },
  { value: "9%", label: "Click-through Rate", brand: "Whirlpool" },
  { value: "151%", label: "Return on Ad Spend", brand: "Lifeboost" },
];

const StatsSection = () => {
  return (
    <section className="bg-primary py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary-foreground text-center mb-14 leading-[1.1]">
          Advertisers Winning with Realize
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-primary-foreground/10 backdrop-blur rounded-2xl p-6 text-center">
              <TrendingUp className="w-6 h-6 text-accent mx-auto mb-3" />
              <div className="text-3xl md:text-4xl font-bold text-primary-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-primary-foreground/70 mb-3">{stat.label}</div>
              <div className="text-xs font-semibold text-primary-foreground/50 uppercase tracking-wider">{stat.brand}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
