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
      className="relative py-20 md:py-[120px] px-5 md:px-10 overflow-hidden"
      style={{ background: "#000000" }}
    >
      <div className="max-w-[720px] mx-auto text-center relative z-10">
        {/* Header */}
        <FadeIn>
          <div className="flex items-center justify-center gap-3 mb-5 opacity-60">
            <span className="text-xl" style={{ animation: 'subtlePulse 3s ease-in-out infinite' }}>⚡</span>
            <span
              className="text-xs font-semibold tracking-[2px] uppercase"
              style={{ color: "#ffffff" }}
            >
              In Case You Missed It Up There
            </span>
            <span className="text-xl" style={{ animation: 'subtlePulse 3s ease-in-out infinite' }}>⚡</span>
          </div>
        </FadeIn>

        <FadeIn delay={100}>
          <h2
            className="font-heading text-[32px] md:text-[56px] font-semibold leading-[1.1] mb-12 md:mb-16"
            style={{ color: "#ffffff", letterSpacing: "-0.5px" }}
          >
            What "Free Website" Means:
          </h2>
        </FadeIn>

        {/* Value Items Card */}
        <FadeIn delay={200}>
          <div
            className="rounded-3xl p-2 mb-8"
            style={{
              background: "hsla(0, 0%, 100%, 0.03)",
              border: "1px solid hsla(0, 0%, 100%, 0.08)",
              backdropFilter: "blur(20px)",
            }}
          >
            {valueItems.map((item) => (
              <div
                key={item.text}
                className="flex items-center justify-between py-5 md:py-6 px-5 md:px-7 rounded-[18px] transition-all duration-300 hover:bg-[hsla(0,0%,100%,0.05)]"
              >
                <div className="flex items-center gap-4">
                  <Check
                    className="w-[18px] h-[18px] flex-shrink-0"
                    style={{ color: "#0071e3", opacity: 0.9 }}
                  />
                  <span
                    className="text-[17px] md:text-[19px] font-normal text-left"
                    style={{ color: "#f5f5f7", letterSpacing: "-0.2px" }}
                  >
                    {item.text}
                  </span>
                </div>
                <span
                  className="text-[15px] md:text-[17px] font-medium whitespace-nowrap ml-4"
                  style={{ color: "#86868b" }}
                >
                  Worth: {item.worth}
                </span>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Total Value Bar */}
        <FadeIn delay={350}>
          <div
            className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4 rounded-[20px] px-8 py-7 mb-12"
            style={{
              background: "linear-gradient(135deg, hsla(210, 100%, 45%, 0.1) 0%, hsla(210, 100%, 47%, 0.05) 100%)",
              border: "1px solid hsla(210, 100%, 45%, 0.2)",
            }}
          >
            <span
              className="text-[19px] md:text-[21px] font-medium"
              style={{ color: "#f5f5f7", letterSpacing: "-0.3px" }}
            >
              Total Value:
            </span>
            <span
              className="text-[36px] md:text-[40px] font-semibold"
              style={{ color: "#ffffff", letterSpacing: "-1px" }}
            >
              $5,000
            </span>
          </div>
        </FadeIn>

        {/* CTA Message */}
        <FadeIn delay={450}>
          <p
            className="text-[19px] md:text-[21px] leading-[1.4] mb-8"
            style={{ color: "#f5f5f7", letterSpacing: "-0.2px" }}
          >
            Your cost: <strong style={{ color: '#ffffff' }}>$0 upfront</strong> + $64/month hosting.
            <br className="hidden md:block" />
            Yeah, we're serious.
          </p>
        </FadeIn>

        {/* CTA Button */}
        <FadeIn delay={500}>
          <button
            onClick={openFunnel}
            className="inline-flex items-center gap-2 font-medium rounded-full px-8 py-[17px] text-[17px] min-h-[48px] active:scale-[0.98] transition-all duration-300 hover:scale-[1.02] w-full md:w-auto justify-center min-w-[240px]"
            style={{
              background: "#0071e3",
              color: "#ffffff",
              letterSpacing: "-0.2px",
            }}
          >
            Get My Free Website
            <ChevronRight className="w-5 h-5" />
          </button>
        </FadeIn>
      </div>
    </section>
  );
};

export default ValueBreakdown;
