import { Target, Sparkles, Zap, CreditCard } from "lucide-react";
import FadeIn from "@/components/FadeIn";

const features = [
  {
    icon: Target,
    title: "24/7 Smart Booking Calendar",
    description: "Customers book while you're detailing. Capture the <span style='color: #ffffff; font-weight: 600;'>$500-1,000/month</span> you're losing to missed calls.",
  },
  {
    icon: Sparkles,
    title: "No-Show Protection That Works",
    description: "Automated reminders + <span style='color: #ffffff; font-weight: 600;'>$100</span> deposits = <span style='color: #ffffff; font-weight: 600;'>40%</span> fewer no-shows.",
  },
  {
    icon: Zap,
    title: "Professional Website in 48 Hours",
    description: "Mobile-optimized website that looks like you paid <span style='color: #ffffff; font-weight: 600;'>$3,000</span>. Zero tech skills required.",
  },
  {
    icon: CreditCard,
    title: "Payment Processing Built-In",
    description: "Accept cards, collect deposits, get paid next day. <span style='color: #ffffff; font-weight: 600;'>2.9% + 30¢</span> per transaction.",
  },
];

const WhySection = () => {
  return (
    <section
      className="relative py-24 md:py-[100px] px-5 md:px-10 overflow-hidden"
      style={{ background: "#000000" }}
    >
      {/* Subtle dot grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, hsla(0, 0%, 100%, 1) 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }} />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <FadeIn>
          <div className="text-center mb-12 md:mb-16">
            <h2
              className="font-heading text-[32px] md:text-[40px] font-semibold leading-[1.15] mb-5"
              style={{ color: "#ffffff", letterSpacing: "-0.4px" }}
            >
              Built to Solve Your Problems
            </h2>
            <p className="text-[19px] md:text-[21px]" style={{ color: "#86868b", letterSpacing: "-0.2px" }}>
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
                  className="group relative rounded-3xl p-8 md:p-10 overflow-hidden transition-all duration-300 hover:bg-[hsla(0,0%,100%,0.08)]"
                  style={{
                    background: "hsla(0, 0%, 100%, 0.04)",
                    border: "1px solid hsla(0, 0%, 100%, 0.08)",
                    backdropFilter: "blur(20px)",
                  }}
                >
                  {/* Icon */}
                  <div className="relative z-10 mb-6">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center relative transition-all duration-300 group-hover:scale-105"
                      style={{
                        background: "hsla(0, 0%, 100%, 0.1)",
                      }}
                    >
                      <Icon
                        className="w-6 h-6 relative z-10"
                        style={{ color: "#ffffff" }}
                      />
                    </div>
                  </div>

                  <h3
                    className="text-[19px] md:text-[21px] font-semibold mb-3 relative z-10"
                    style={{ color: "#ffffff", letterSpacing: "-0.3px" }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-[15px] md:text-[17px] leading-[1.5] relative z-10"
                    style={{ color: "#86868b", letterSpacing: "-0.2px" }}
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
