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
      background: 'linear-gradient(135deg, hsl(160 50% 8%) 0%, hsl(160 40% 14%) 50%, hsl(160 50% 8%) 100%)',
    }}>
      {/* Subtle dot texture */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(0 0% 100%) 1px, transparent 0)',
        backgroundSize: '32px 32px',
      }} />

      <div className="relative z-10 max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center mb-12 md:mb-16">
            <span className="text-brass text-xs font-serif italic tracking-wider inline-block mb-4">
              ✦ OUR PHILOSOPHY ✦
            </span>
            <h2 className="font-heading text-[28px] md:text-[48px] font-bold tracking-[-0.02em] leading-[1.1] text-primary-foreground mb-3">
              Built for Detailers Who
            </h2>
            <p className="font-serif italic text-[32px] md:text-[56px] text-accent leading-[1.1]">
              Take Their Craft Seriously
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <FadeIn key={pillar.title} delay={i * 150} rotateX={8}>
                <div className="group rounded-[20px] p-8 md:p-10 text-center transition-all duration-500 hover:-translate-y-2 min-h-[320px] flex flex-col items-center justify-center"
                  style={{
                    background: 'hsla(0, 0%, 100%, 0.06)',
                    border: '1px solid hsla(0, 0%, 100%, 0.12)',
                    backdropFilter: 'blur(20px)',
                    transformStyle: 'preserve-3d',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'hsla(0, 0%, 100%, 0.10)';
                    e.currentTarget.style.borderColor = 'hsl(82 65% 55%)';
                    e.currentTarget.style.boxShadow = '0 0 40px hsla(82, 65%, 55%, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'hsla(0, 0%, 100%, 0.06)';
                    e.currentTarget.style.borderColor = 'hsla(0, 0%, 100%, 0.12)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: 'hsla(82, 65%, 55%, 0.15)' }}
                  >
                    <Icon className="w-6 h-6 text-accent group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-primary-foreground mb-4">{pillar.title}</h3>
                  <p className="text-primary-foreground/70 leading-relaxed font-serif italic text-lg relative">
                    <span className="text-accent text-3xl absolute -top-4 -left-2">"</span>
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
