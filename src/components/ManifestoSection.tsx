import { Shield, Zap, TrendingUp } from "lucide-react";
import FadeIn from "@/components/FadeIn";

const pillars = [
  {
    icon: Shield,
    title: "Demand Excellence",
    copy: "Your work is flawless. Your tools should be too. No compromises.",
  },
  {
    icon: Zap,
    title: "Value Their Time",
    copy: "Every minute detailing is money earned. Every minute chasing bookings is money lost.",
  },
  {
    icon: TrendingUp,
    title: "Build Businesses, Not Just Jobs",
    copy: "You're not a side hustle. You're a professional building something real.",
  },
];

const ManifestoSection = () => {
  return (
    <section className="relative py-16 md:py-24 px-5 md:px-8 overflow-hidden" style={{
      background: 'linear-gradient(180deg, hsl(160, 40%, 8%) 0%, hsl(160, 35%, 12%) 100%)',
    }}>
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(0 0% 100%) 1px, transparent 0)',
        backgroundSize: '32px 32px',
      }} />

      <div className="relative z-10 max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center mb-12 md:mb-16">
            <span className="text-brass text-sm font-serif italic tracking-wide inline-block mb-4">
              ✦ OUR PHILOSOPHY ✦
            </span>
            <h2 className="font-heading text-[28px] md:text-[42px] font-bold tracking-[-0.015em] leading-[1.2] text-primary-foreground mb-4">
              Built for Detailers Who
            </h2>
            <p className="font-serif italic text-[32px] md:text-[52px] text-accent leading-[1.1]">
              Take Their Craft Seriously
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <FadeIn key={pillar.title} delay={i * 150} rotateX={8}>
                <div className="group rounded-2xl p-6 md:p-8 text-center border border-primary-foreground/10 bg-primary-foreground/5 backdrop-blur-sm hover:bg-primary-foreground/10 hover:-translate-y-2 hover:shadow-[0_24px_48px_rgba(0,0,0,0.3)] transition-all duration-500"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Icon className="w-10 h-10 text-accent mx-auto mb-5 group-hover:scale-110 transition-transform duration-500" />
                  <h3 className="text-xl font-bold text-primary-foreground mb-3">{pillar.title}</h3>
                  <p className="text-primary-foreground/60 leading-relaxed font-serif italic text-[15px]">
                    "{pillar.copy}"
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ManifestoSection;
