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
      className="relative py-20 md:py-28 px-5 md:px-10 overflow-hidden"
      style={{ background: "hsl(210, 40%, 98%)" }}
    >
      <div className="max-w-[800px] mx-auto relative z-10">
        <FadeIn>
          <div className="text-center mb-12 md:mb-16">
            <h2
              className="font-heading text-[32px] md:text-[56px] lg:text-[72px] font-bold tracking-[-0.02em] leading-[1.2] mb-4"
              style={{ color: "hsl(222, 47%, 11%)" }}
            >
              What "Free Website" Means
            </h2>
            <p className="text-lg md:text-xl" style={{ color: "hsl(215, 16%, 47%)" }}>
              Yeah.. it's that good.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={150}>
          <div
            className="rounded-3xl p-8 md:p-10 mb-8"
            style={{
              background: "hsl(0, 0%, 100%)",
              border: "1px solid hsl(214, 20%, 90%)",
              boxShadow: "0 4px 24px hsla(0, 0%, 0%, 0.06)",
            }}
          >
            {valueItems.map((item, i) => (
              <div
                key={item.text}
                className="flex items-center justify-between py-4"
                style={{
                  borderBottom:
                    i < valueItems.length - 1
                      ? "1px solid hsl(214, 20%, 93%)"
                      : "none",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "hsla(217, 91%, 60%, 0.1)" }}
                  >
                    <Check className="w-4 h-4" style={{ color: "hsl(217, 91%, 60%)" }} />
                  </div>
                  <span
                    className="text-base md:text-lg font-medium"
                    style={{ color: "hsl(222, 47%, 11%)" }}
                  >
                    {item.text}
                  </span>
                </div>
                <span
                  className="text-sm md:text-base font-semibold whitespace-nowrap ml-4"
                  style={{ color: "hsl(215, 16%, 47%)" }}
                >
                  {item.worth}
                </span>
              </div>
            ))}

            {/* Total bar — pricing comparison */}
            <div
              className="rounded-[20px] p-8 md:p-10 pb-6 md:pb-8 mt-4"
              style={{
                background: "linear-gradient(135deg, hsla(217, 91%, 60%, 0.1) 0%, hsla(217, 91%, 60%, 0.05) 100%)",
                border: "1px solid hsla(217, 91%, 60%, 0.2)",
              }}
            >
              <div className="flex flex-col md:flex-row items-center justify-center gap-5 md:gap-8 mb-6">
                {/* Total Value side */}
                <div className="flex flex-col items-center gap-2">
                  <span
                    className="text-[14px] font-semibold uppercase tracking-[1.2px]"
                    style={{ color: "hsl(215, 16%, 55%)" }}
                  >
                    Total Value
                  </span>
                  <span
                    className="font-mono text-4xl md:text-[40px] font-semibold line-through decoration-[3px]"
                    style={{
                      color: "hsl(215, 16%, 55%)",
                      textDecorationColor: "hsl(0, 84%, 60%)",
                      opacity: 0.7,
                      letterSpacing: "-1px",
                    }}
                  >
                    $5,000
                  </span>
                </div>

                {/* Arrow */}
                <span
                  className="text-4xl md:text-[36px] font-bold md:rotate-0 rotate-90"
                  style={{
                    color: "hsl(217, 91%, 60%)",
                    animation: "pulseArrow 2s ease-in-out infinite",
                  }}
                >
                  →
                </span>

                {/* Free side */}
                <div className="flex flex-col items-center gap-2">
                  <span
                    className="text-[14px] font-semibold uppercase tracking-[1.2px]"
                    style={{ color: "hsl(215, 16%, 55%)" }}
                  >
                    Your Price Today
                  </span>
                  <span
                    className="font-bold text-[48px] md:text-[56px] leading-none"
                    style={{
                      color: "hsl(160, 84%, 39%)",
                      letterSpacing: "-2px",
                      textShadow: "0 0 24px hsla(160, 84%, 39%, 0.3)",
                    }}
                  >
                    FREE
                  </span>
                </div>
              </div>

              {/* Trial details */}
              <div className="text-center pt-5" style={{ borderTop: "1px solid hsla(0, 0%, 100%, 0.1)" }}>
                <p className="text-[15px] md:text-base leading-relaxed" style={{ color: "hsl(210, 40%, 96%)" }}>
                  <strong className="font-semibold" style={{ color: "hsl(222, 47%, 11%)" }}>14-day free trial. Zero risk. No card needed.</strong>
                  <br />
                  <span style={{ color: "hsl(215, 16%, 47%)" }}>Then $74/month for hosting + automation.</span>
                </p>
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={300}>
          <div className="text-center">
            <button
              onClick={openFunnel}
              className="group relative inline-flex items-center gap-2 font-semibold rounded-xl px-12 py-5 text-lg min-h-[48px] overflow-hidden transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 w-full md:w-auto justify-center"
              style={{
                color: "hsl(0, 0%, 100%)",
                background: "linear-gradient(135deg, hsl(217, 71%, 53%) 0%, hsl(217, 71%, 43%) 100%)",
                boxShadow: "0 4px 16px hsla(217, 71%, 53%, 0.3)",
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Claim Now
                <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </span>
              <span
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, hsla(0, 0%, 100%, 0.2) 50%, transparent 100%)",
                }}
              />
            </button>
            <p className="text-sm mt-4" style={{ color: "hsl(215, 16%, 47%)" }}>
              Free for 14 days · No credit card required
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default ValueBreakdown;
