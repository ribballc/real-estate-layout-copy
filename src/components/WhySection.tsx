import { Target, Sparkles, Zap, CreditCard } from "lucide-react";
import FadeIn from "@/components/FadeIn";

const features = [
  {
    icon: Target,
    title: "24/7 Smart Booking Calendar",
    description: "Customers book while you're detailing. Capture the <span class='text-sky font-bold'>$500-1,000/month</span> you're losing to missed calls.",
  },
  {
    icon: Sparkles,
    title: "No-Show Protection That Works",
    description: "Automated reminders + <span class='text-sky font-bold'>$100</span> deposits = <span class='text-sky font-bold'>40%</span> fewer no-shows.",
  },
  {
    icon: Zap,
    title: "Professional Website in 48 Hours",
    description: "Mobile-optimized website that looks like you paid <span class='text-sky font-bold'>$3,000</span>. Zero tech skills required.",
  },
  {
    icon: CreditCard,
    title: "Payment Processing Built-In",
    description: "Accept cards, collect deposits, get paid next day. <span class='text-sky font-bold'>2.9% + 30¢</span> per transaction.",
  },
];

const WhySection = () => {
  return (
    <section
      className="relative py-20 md:py-28 px-5 md:px-10 overflow-hidden"
      style={{
        background: "hsl(215, 50%, 8%)",
        backgroundImage:
          "radial-gradient(ellipse at 30% 20%, hsla(217, 91%, 60%, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, hsla(213, 94%, 68%, 0.06) 0%, transparent 50%)",
      }}
    >
      {/* Glow Orbs */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 400, height: 400, top: "-8%", left: "-5%",
          background: "radial-gradient(circle, hsla(217, 91%, 60%, 0.4), transparent)",
          filter: "blur(80px)", opacity: 0.12,
          animation: "orbFloat1 25s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 500, height: 500, bottom: "-12%", right: "-8%",
          background: "radial-gradient(circle, hsla(213, 94%, 68%, 0.3), transparent)",
          filter: "blur(80px)", opacity: 0.1,
          animation: "orbFloat2 30s ease-in-out infinite 5s",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 250, height: 250, top: "45%", left: "50%",
          background: "radial-gradient(circle, hsla(217, 91%, 60%, 0.25), transparent)",
          filter: "blur(80px)", opacity: 0.08,
          animation: "orbFloat3 35s ease-in-out infinite 10s",
        }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, hsla(213, 94%, 68%, 1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating particles */}
      {[
        { top: "10%", left: "15%", dur: "25s", del: "0s" },
        { top: "25%", left: "65%", dur: "30s", del: "5s" },
        { top: "55%", left: "25%", dur: "35s", del: "10s" },
        { top: "75%", left: "80%", dur: "28s", del: "3s" },
        { top: "40%", left: "90%", dur: "32s", del: "8s" },
        { top: "85%", left: "40%", dur: "27s", del: "12s" },
      ].map((p, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full pointer-events-none"
          style={{
            top: p.top, left: p.left,
            background: "radial-gradient(circle, hsla(213, 94%, 68%, 0.6), transparent)",
            animation: `particleFloat ${p.dur} ease-in-out infinite ${p.del}`,
          }}
        />
      ))}

      <div className="max-w-[1200px] mx-auto relative z-10">
        <FadeIn>
          <div className="text-center mb-12 md:mb-16">
            <h2
              className="font-heading text-[32px] md:text-[56px] lg:text-[72px] font-bold tracking-[-0.02em] leading-[1.2] mb-4"
              style={{
                background: "linear-gradient(135deg, hsl(0, 0%, 100%) 0%, hsla(0, 0%, 100%, 0.85) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Built to Solve Your Problems
            </h2>
            <p className="text-lg md:text-xl" style={{ color: "hsla(0, 0%, 100%, 0.6)" }}>
              Stop cobbling together apps. Get everything in one system.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <FadeIn key={feature.title} delay={100 + i * 100}>
                <div
                  className="why-card group relative rounded-3xl p-8 md:p-10 overflow-hidden transition-all duration-500 hover:-translate-y-2"
                  style={{
                    background: "hsla(215, 50%, 12%, 0.6)",
                    border: "1px solid hsla(0, 0%, 100%, 0.08)",
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 0 0 1px hsla(0, 0%, 100%, 0.02) inset, 0 20px 60px hsla(0, 0%, 0%, 0.3)",
                  }}
                >
                  {/* Rotating gradient on hover */}
                  <div
                    className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] opacity-0 group-hover:opacity-100 transition-opacity duration-600 pointer-events-none z-0"
                    style={{
                      background: "radial-gradient(circle at center, hsla(217, 91%, 60%, 0.08) 0%, transparent 70%)",
                      animation: "sectionRotate 20s linear infinite",
                    }}
                  />

                  {/* Icon with pulsing rings */}
                  <div className="relative z-10 mb-6">
                    <div
                      className="why-icon-box w-[72px] h-[72px] rounded-2xl flex items-center justify-center relative transition-all duration-500"
                      style={{
                        background: "linear-gradient(135deg, hsla(217, 91%, 60%, 0.15) 0%, hsla(213, 94%, 68%, 0.1) 100%)",
                        border: "1px solid hsla(217, 91%, 60%, 0.2)",
                        animation: "pulseRings 4s ease-in-out infinite",
                      }}
                    >
                      <Icon
                        className="w-8 h-8 transition-all duration-500 relative z-10"
                        style={{
                          color: "hsl(213, 94%, 68%)",
                          filter: "drop-shadow(0 0 8px hsla(213, 94%, 68%, 0.4))",
                        }}
                      />
                    </div>
                  </div>

                  <h3
                    className="text-[22px] font-semibold mb-3 relative z-10 transition-colors duration-300"
                    style={{ color: "hsl(0, 0%, 100%)" }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-[15px] leading-[1.7] relative z-10 transition-colors duration-300 group-hover:text-primary-foreground/80"
                    style={{ color: "hsla(0, 0%, 100%, 0.65)" }}
                    dangerouslySetInnerHTML={{ __html: feature.description }}
                  />
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhySection;
