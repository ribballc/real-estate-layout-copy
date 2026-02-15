import { useRef, useCallback, useEffect, useState } from "react";
import FadeIn from "@/components/FadeIn";
import { useSurveyFunnel } from "@/components/SurveyFunnelContext";
import { ChevronRight } from "lucide-react";
import Lottie from "lottie-react";

const lottieFiles = [
  "/lottie/form-filling.json",
  "/lottie/website-build.json",
  "/lottie/calendar.json",
];

const steps = [
  {
    step: 1,
    title: "Tell Us About Your Shop",
    description: "Name, services, hours, location. Takes 60 seconds.",
  },
  {
    step: 2,
    title: "We Build Everything",
    description: "Custom website + booking system with SMS reminders and deposits. Done for you automatically.",
  },
  {
    step: 3,
    title: "Bookings on Autopilot",
    description: "Customers find you, book online, pay deposits, and get reminders. You detail.",
  },
];

const ProcessCard = ({ step, index, animationData }: { step: typeof steps[0]; index: number; animationData: any }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mouse-x", `${x}%`);
    card.style.setProperty("--mouse-y", `${y}%`);
  }, []);

  return (
    <FadeIn delay={index * 150}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className="group relative rounded-3xl p-10 md:p-12 text-center overflow-hidden z-10 cursor-pointer"
        style={{
          background: "hsl(0, 0%, 100%)",
          border: "1px solid hsl(214, 20%, 90%)",
          boxShadow: "0 4px 24px hsla(0, 0%, 0%, 0.06)",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Spotlight follow effect */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), hsla(217, 71%, 53%, 0.06), transparent 40%)",
          }}
        />

        {/* Step number badge */}
        <span
          className="absolute top-5 right-5 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-300 group-hover:scale-105"
          style={{
            background: "hsl(217, 71%, 53%)",
            color: "hsl(0, 0%, 100%)",
          }}
        >
          <span className="relative z-10">{step.step}</span>
        </span>

        {/* Animated Lottie */}
        <div className="flex justify-center mb-7 relative z-10">
          <div className="w-[90px] h-[90px] transition-transform duration-300 group-hover:scale-110">
            {animationData ? (
              <Lottie animationData={animationData} loop autoplay style={{ width: 90, height: 90 }} />
            ) : (
              <div className="w-[90px] h-[90px] rounded-2xl bg-blue-50 animate-pulse" />
            )}
          </div>
        </div>

        <h3
          className="text-[22px] font-semibold mb-3 relative z-10 transition-colors duration-300"
          style={{ color: "hsl(222, 47%, 11%)" }}
        >
          {step.title}
        </h3>
        <p
          className="text-[15px] leading-relaxed relative z-10 transition-colors duration-300"
          style={{ color: "hsl(215, 16%, 47%)" }}
        >
          {step.description}
        </p>
      </div>
    </FadeIn>
  );
};

const HowItWorksSection = () => {
  const { openFunnel } = useSurveyFunnel();
  const [animations, setAnimations] = useState<any[]>([null, null, null]);

  useEffect(() => {
    lottieFiles.forEach((url, i) => {
      fetch(url)
        .then(res => res.json())
        .then(data => {
          setAnimations(prev => {
            const next = [...prev];
            next[i] = data;
            return next;
          });
        })
        .catch(() => {});
    });
  }, []);

  return (
    <section
      className="relative py-20 md:py-28 px-5 md:px-10 overflow-hidden"
      style={{ background: "hsl(210, 40%, 98%)" }}
    >
      <div className="max-w-[1400px] mx-auto relative z-10">
        <FadeIn>
          <div className="text-center mb-16 md:mb-20">
            <h2
              className="font-heading text-[32px] md:text-[56px] lg:text-[72px] font-bold tracking-[-0.02em] leading-[1.2] mb-4"
              style={{ color: "hsl(222, 47%, 11%)" }}
            >
              As easy as 1, 2, 3
            </h2>
            <p className="text-lg md:text-xl" style={{ color: "hsl(215, 16%, 47%)" }}>
              Three steps. Zero headaches.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-20 relative">
          {/* Connecting lines (desktop) */}
          <div
            className="hidden md:block absolute top-[100px] left-[18%] w-[18%] h-[2px] z-0"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, hsla(217, 71%, 53%, 0.3) 20%, hsla(217, 71%, 53%, 0.5) 50%, hsla(217, 71%, 53%, 0.3) 80%, transparent 100%)",
            }}
          />
          <div
            className="hidden md:block absolute top-[100px] right-[18%] w-[18%] h-[2px] z-0"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, hsla(217, 71%, 53%, 0.3) 20%, hsla(217, 71%, 53%, 0.5) 50%, hsla(217, 71%, 53%, 0.3) 80%, transparent 100%)",
            }}
          />

          {steps.map((step, i) => (
            <ProcessCard key={step.step} step={step} index={i} animationData={animations[i]} />
          ))}
        </div>

        <FadeIn delay={500}>
          <div className="text-center">
            <button
              onClick={openFunnel}
              className="group relative inline-flex items-center gap-2 font-semibold rounded-xl px-12 py-5 text-lg min-h-[48px] overflow-hidden transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
              style={{
                color: "hsl(0, 0%, 100%)",
                background: "linear-gradient(135deg, hsl(217, 71%, 53%) 0%, hsl(217, 71%, 43%) 100%)",
                boxShadow: "0 4px 16px hsla(217, 71%, 53%, 0.3)",
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started Free →
              </span>
              <span
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, hsla(0, 0%, 100%, 0.2) 50%, transparent 100%)",
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

export default HowItWorksSection;
