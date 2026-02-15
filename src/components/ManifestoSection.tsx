import { useState } from "react";
import { Paintbrush, Smartphone, Search, Layout, Clock, CreditCard, Route, Users, MessageSquare, RefreshCw, BarChart3, Star } from "lucide-react";
import FadeIn from "@/components/FadeIn";

const tabs = [
  {
    id: "website",
    label: "Website",
    headline: "Professional website that converts — built for you in 48 hours.",
    features: [
      { icon: Paintbrush, title: "Custom Design" },
      { icon: Smartphone, title: "Mobile-First" },
      { icon: Search, title: "SEO Optimized" },
      { icon: Layout, title: "Service Pages" },
    ],
  },
  {
    id: "booking",
    label: "Booking",
    headline: "Customers book, pay deposits, and confirm — 24/7 on autopilot.",
    features: [
      { icon: Clock, title: "Live Calendar" },
      { icon: CreditCard, title: "Deposit Collection" },
      { icon: Route, title: "Route Optimization" },
      { icon: Users, title: "Client Management" },
    ],
  },
  {
    id: "automations",
    label: "Automations",
    headline: "SMS reminders, follow-ups, and reviews — all handled automatically.",
    features: [
      { icon: MessageSquare, title: "SMS Reminders" },
      { icon: RefreshCw, title: "Auto Follow-Ups" },
      { icon: Star, title: "Review Requests" },
      { icon: BarChart3, title: "Smart Analytics" },
    ],
  },
];

const ManifestoSection = () => {
  const [activeTab, setActiveTab] = useState("website");
  const active = tabs.find((t) => t.id === activeTab)!;

  return (
    <section
      className="relative py-20 md:py-28 px-5 md:px-10 overflow-hidden"
      style={{
        background: "hsl(215, 50%, 8%)",
        backgroundImage:
          "radial-gradient(circle at 20% 50%, hsla(217, 91%, 60%, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 80%, hsla(217, 91%, 70%, 0.03) 0%, transparent 50%)",
      }}
    >
      {/* Animated dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, hsla(213, 94%, 68%, 0.15) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.3,
          animation: "gridMove 40s linear infinite",
        }}
      />

      {/* Radial gradient mesh */}
      <div
        className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 20% 30%, hsla(217, 91%, 60%, 0.06) 0%, transparent 40%), radial-gradient(ellipse at 80% 70%, hsla(213, 94%, 68%, 0.04) 0%, transparent 40%)",
          animation: "meshMove 30s ease-in-out infinite",
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(hsla(0, 0%, 100%, 0.02) 1px, transparent 1px), linear-gradient(90deg, hsla(0, 0%, 100%, 0.02) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-12 md:mb-16">
            <h2
              className="font-heading text-[32px] md:text-[56px] lg:text-[72px] font-bold tracking-[-0.02em] leading-[1.2] mb-4"
              style={{
                background: "linear-gradient(135deg, hsl(0, 0%, 100%) 0%, hsla(0, 0%, 100%, 0.8) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              What's Included
            </h2>
            <p className="text-lg md:text-xl" style={{ color: "hsla(0, 0%, 100%, 0.6)" }}>
              Everything done for you — ready in 48 hours.
            </p>
          </div>
        </FadeIn>

        {/* Underline Tabs */}
        <FadeIn delay={100}>
          <div className="flex justify-center gap-8 md:gap-12 mb-12 md:mb-16 relative">
            <div
              className="absolute bottom-0 left-0 right-0 h-px"
              style={{ background: "hsla(0, 0%, 100%, 0.1)" }}
            />
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative pb-4 text-sm md:text-base font-semibold transition-colors duration-300 min-h-[48px]"
                style={{
                  color: activeTab === tab.id ? "hsl(0, 0%, 100%)" : "hsla(0, 0%, 100%, 0.4)",
                }}
              >
                {tab.label}
                <span
                  className="absolute bottom-0 left-0 right-0 h-[2px] transition-all duration-300"
                  style={{
                    background: activeTab === tab.id ? "hsl(217, 91%, 60%)" : "transparent",
                    boxShadow: activeTab === tab.id ? "0 0 8px hsla(217, 91%, 60%, 0.5)" : "none",
                  }}
                />
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Active tab content */}
        <FadeIn delay={150}>
          <div
            className="rounded-3xl p-8 md:p-12"
            style={{
              background: "hsla(215, 50%, 8%, 0.6)",
              border: "1px solid hsla(0, 0%, 100%, 0.08)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 0 0 1px hsla(0, 0%, 100%, 0.02) inset, 0 20px 60px hsla(0, 0%, 0%, 0.3)",
            }}
          >
            <h3
              className="text-lg md:text-xl font-semibold text-center mb-10"
              style={{ color: "hsl(0, 0%, 100%)" }}
            >
              {active.headline}
            </h3>

            <div
              className="h-px mb-10 mx-auto max-w-lg"
              style={{
                background: "linear-gradient(90deg, transparent, hsla(217, 91%, 60%, 0.3), transparent)",
              }}
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {active.features.map((feat) => {
                const Icon = feat.icon;
                return (
                  <div key={feat.title} className="text-center group">
                    <div
                      className="process-icon-container w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1"
                      style={{
                        background: "linear-gradient(135deg, hsla(217, 91%, 60%, 0.15) 0%, hsla(217, 91%, 70%, 0.1) 100%)",
                        border: "1px solid hsla(217, 91%, 60%, 0.2)",
                      }}
                    >
                      <Icon className="w-7 h-7" style={{ color: "hsl(217, 91%, 70%)" }} />
                    </div>
                    <h4 className="text-sm md:text-base font-semibold" style={{ color: "hsl(0, 0%, 100%)" }}>
                      {feat.title}
                    </h4>
                  </div>
                );
              })}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default ManifestoSection;
