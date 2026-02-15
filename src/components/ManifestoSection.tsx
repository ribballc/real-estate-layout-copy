import { Shield, Zap, TrendingUp } from "lucide-react";
import FadeIn from "@/components/FadeIn";

const pillars = [
  {
    icon: Shield,
    title: "Demand Excellence",
    copy: "Your work is flawless. Your tools should be too.",
  },
  {
    icon: Zap,
    title: "Value Your Time",
    copy: "Every minute detailing is money earned. Every minute chasing bookings is money lost.",
  },
  {
    icon: TrendingUp,
    title: "Build a Business",
    copy: "You're not a side hustle. You're a professional building something real.",
  },
];

const ManifestoSection = () => {
  return (
    <section className="relative py-16 md:py-24 px-5 md:px-8 overflow-hidden" style={{
      background: 'linear-gradient(135deg, hsl(215 50% 10%) 0%, hsl(217 33% 17%) 100%)',
    }}>
      <div className="relative z-10 max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-heading text-[28px] md:text-[56px] lg:text-[72px] font-bold tracking-[-0.015em] leading-[1.2] text-primary-foreground mb-3">
              Built for Detailers Who
            </h2>
            <p className="text-sky text-[28px] md:text-[56px] lg:text-[72px] font-bold leading-[1.2] tracking-[-0.015em]">
              Take Their Craft Seriously
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <FadeIn key={pillar.title} delay={i * 100}>
                <div className="group rounded-2xl p-8 md:p-10 text-center transition-all duration-300 hover:-translate-y-2 min-h-[280px] flex flex-col items-center justify-center hover:border-accent"
                  style={{
                    background: 'hsla(0, 0%, 100%, 0.05)',
                    border: '1px solid hsla(0, 0%, 100%, 0.1)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: 'hsla(217, 91%, 60%, 0.15)' }}
                  >
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary-foreground mb-3">{pillar.title}</h3>
                  <p className="text-primary-foreground/70 leading-relaxed text-base">
                    {pillar.copy}
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
