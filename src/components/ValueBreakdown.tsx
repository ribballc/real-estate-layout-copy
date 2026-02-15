import { Check, ChevronRight } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import { useSurveyFunnel } from "@/components/SurveyFunnelContext";

const valueItems = [
  { text: "Custom professional website", worth: "$1,500" },
  { text: "Booking system with calendar", worth: "$1,000" },
  { text: "SMS automation & reminders", worth: "$800" },
  { text: "Payment processing setup", worth: "$500" },
  { text: "Built for you in 48 hours", worth: "$1,200" },
];

const ValueBreakdown = () => {
  const { openFunnel } = useSurveyFunnel();

  return (
    <section
      className="relative py-16 md:py-20 px-5 md:px-8 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, hsl(222, 47%, 11%) 0%, hsl(217, 33%, 17%) 100%)",
      }}
    >
      <div className="max-w-[700px] mx-auto text-center relative z-10">
        {/* Header */}
        <FadeIn>
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-2xl md:text-3xl animate-pulse">⚡</span>
            <span
              className="text-sm md:text-base font-bold tracking-[0.1em] uppercase"
              style={{ color: "hsl(45, 93%, 56%)" }}
            >
              In Case You Missed It Up There
            </span>
            <span className="text-2xl md:text-3xl animate-pulse">⚡</span>
          </div>
        </FadeIn>

        <FadeIn delay={100}>
          <h2
            className="font-heading text-2xl md:text-[32px] font-bold leading-[1.3] mb-10"
            style={{ color: "hsl(0, 0%, 100%)" }}
          >
            What "Free Website" Means:
          </h2>
        </FadeIn>

        {/* Value Items Card */}
        <FadeIn delay={200}>
          <div
            className="rounded-2xl p-6 md:p-8 mb-6"
            style={{
              background: "hsla(0, 0%, 100%, 0.05)",
              border: "1px solid hsla(0, 0%, 100%, 0.1)",
              backdropFilter: "blur(10px)",
            }}
          >
            {valueItems.map((item, i) => (
              <div
                key={item.text}
                className="flex items-center justify-between py-4"
                style={{
                  borderBottom:
                    i < valueItems.length - 1
                      ? "1px solid hsla(0, 0%, 100%, 0.08)"
                      : "none",
                }}
              >
                <div className="flex items-center gap-3">
                  <Check
                    className="w-5 h-5 flex-shrink-0"
                    style={{ color: "hsl(160, 84%, 39%)" }}
                  />
                  <span
                    className="text-base md:text-lg font-medium text-left"
                    style={{ color: "hsl(0, 0%, 100%)" }}
                  >
                    {item.text}
                  </span>
                </div>
                <span
                  className="text-sm md:text-base font-semibold whitespace-nowrap ml-4"
                  style={{ color: "hsl(215, 20%, 65%)" }}
                >
                  Worth: {item.worth}
                </span>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Gold Divider */}
        <FadeIn delay={300}>
          <div
            className="h-[2px] mx-auto mb-6"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, hsl(45, 93%, 56%) 50%, transparent 100%)",
            }}
          />
        </FadeIn>

        {/* Total Value */}
        <FadeIn delay={350}>
          <div className="flex items-center justify-center gap-4 mb-8">
            <span
              className="text-xl md:text-2xl font-semibold"
              style={{ color: "hsl(0, 0%, 100%)" }}
            >
              Total Value:
            </span>
            <span
              className="font-mono text-3xl md:text-4xl font-bold"
              style={{
                color: "hsl(160, 84%, 39%)",
                textShadow: "0 0 20px hsla(160, 84%, 39%, 0.3)",
              }}
            >
              $5,000
            </span>
          </div>
        </FadeIn>

        {/* CTA Message */}
        <FadeIn delay={400}>
          <p
            className="text-base md:text-lg leading-relaxed mb-8"
            style={{ color: "hsla(0, 0%, 100%, 0.9)" }}
          >
            Yeah.. it's that good.
          </p>
        </FadeIn>

        {/* CTA Button */}
        <FadeIn delay={450}>
          <button
            onClick={openFunnel}
            className="group inline-flex items-center gap-2 font-semibold rounded-xl px-12 py-4 text-base min-h-[48px] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 w-full md:w-auto justify-center"
            style={{
              background: "linear-gradient(135deg, hsl(217, 91%, 60%) 0%, hsl(217, 91%, 50%) 100%)",
              color: "hsl(0, 0%, 100%)",
              boxShadow: "0 4px 20px hsla(217, 91%, 60%, 0.3)",
            }}
          >
            Claim Now
            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </FadeIn>
      </div>
    </section>
  );
};

export default ValueBreakdown;
