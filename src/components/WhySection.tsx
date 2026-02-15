import { Target, Sparkles, Zap, CreditCard } from "lucide-react";
import FadeIn from "@/components/FadeIn";

const features = [
  {
    icon: Target,
    title: "24/7 Smart Booking Calendar",
    description: "Customers book while you're detailing. Capture the <span style='color: hsl(217, 71%, 53%); font-weight: 700;'>$500-1,000/month</span> you're losing to missed calls.",
  },
  {
    icon: Sparkles,
    title: "No-Show Protection That Works",
    description: "Automated reminders + <span style='color: hsl(217, 71%, 53%); font-weight: 700;'>$100</span> deposits = <span style='color: hsl(217, 71%, 53%); font-weight: 700;'>40%</span> fewer no-shows.",
  },
  {
    icon: Zap,
    title: "Professional Website in 48 Hours",
    description: "Mobile-optimized website that looks like you paid <span style='color: hsl(217, 71%, 53%); font-weight: 700;'>$3,000</span>. Zero tech skills required.",
  },
  {
    icon: CreditCard,
    title: "Payment Processing Built-In",
    description: "Accept cards, collect deposits, get paid next day. <span style='color: hsl(217, 71%, 53%); font-weight: 700;'>2.9% + 30¢</span> per transaction.",
  },
];

const WhySection = () => {
  return (
    <section
      className="relative py-20 md:py-28 px-5 md:px-10 overflow-hidden"
      style={{ background: "hsl(0, 0%, 100%)" }}
    >
      <div className="max-w-[1200px] mx-auto relative z-10">
        <FadeIn>
          <div className="text-center mb-12 md:mb-16">
            <h2
              className="font-heading text-[32px] md:text-[56px] lg:text-[72px] font-bold tracking-[-0.02em] leading-[1.2] mb-4"
              style={{ color: "hsl(222, 47%, 11%)" }}
            >
              Built to Solve Your Problems
            </h2>
            <p className="text-lg md:text-xl" style={{ color: "hsl(215, 16%, 47%)" }}>
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
                  className="group relative rounded-3xl p-8 md:p-10 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-lg"
                  style={{
                    background: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(214, 20%, 90%)",
                    boxShadow: "0 4px 12px hsla(0, 0%, 0%, 0.06)",
                  }}
                >
                  {/* Icon */}
                  <div className="relative z-10 mb-6">
                    <div
                      className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center relative transition-all duration-500 group-hover:scale-110"
                      style={{
                        background: "hsla(217, 71%, 53%, 0.08)",
                        border: "1px solid hsla(217, 71%, 53%, 0.15)",
                      }}
                    >
                      <Icon
                        className="w-8 h-8 transition-all duration-500 relative z-10"
                        style={{ color: "hsl(217, 71%, 53%)" }}
                      />
                    </div>
                  </div>

                  <h3
                    className="text-[22px] font-semibold mb-3 relative z-10 transition-colors duration-300"
                    style={{ color: "hsl(222, 47%, 11%)" }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-[15px] leading-[1.7] relative z-10 transition-colors duration-300"
                    style={{ color: "hsl(215, 16%, 47%)" }}
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
