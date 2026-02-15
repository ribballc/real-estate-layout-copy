import { useState } from "react";
import { Globe, CalendarCheck, BellRing, Paintbrush, Smartphone, Search, Clock, CreditCard, MessageSquare, Route, BarChart3, RefreshCw } from "lucide-react";
import FadeIn from "@/components/FadeIn";

const tabs = [
  {
    id: "website",
    label: "Website",
    headline: "A professional website, done for you",
    description: "Get a stunning, mobile-optimized website that converts visitors into paying customers — no design or coding skills needed.",
    features: [
      { icon: Paintbrush, title: "Custom Design", desc: "Tailored to your brand" },
      { icon: Smartphone, title: "Mobile-First", desc: "Looks great on every device" },
      { icon: Search, title: "SEO Optimized", desc: "Get found on Google" },
    ],
  },
  {
    id: "booking",
    label: "Booking",
    headline: "24/7 booking that never misses a lead",
    description: "Customers pick a service, choose a time, and pay a deposit — all while you're working. No more missed calls or back-and-forth texting.",
    features: [
      { icon: Clock, title: "Real-Time Calendar", desc: "Always up to date" },
      { icon: CreditCard, title: "Deposit Collection", desc: "Get paid upfront" },
      { icon: Route, title: "Route Optimization", desc: "Save 45-90 min/day" },
    ],
  },
  {
    id: "automations",
    label: "Automations",
    headline: "Set it and forget it",
    description: "Automated SMS reminders, follow-ups, and review requests run in the background so you can focus on detailing — not admin work.",
    features: [
      { icon: MessageSquare, title: "SMS Reminders", desc: "Cut no-shows by 40%" },
      { icon: RefreshCw, title: "Auto Follow-Ups", desc: "Win repeat business" },
      { icon: BarChart3, title: "Smart Analytics", desc: "Track what's working" },
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
      {/* Animated bg gradient */}
      <div
        className="absolute inset-0 pointer-events-none animate-pulse-slow"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, hsla(217, 91%, 60%, 0.08) 0%, transparent 50%)",
          opacity: 0.6,
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

        {/* Tabs */}
        <FadeIn delay={100}>
          <div className="flex justify-center gap-2 md:gap-3 mb-12 md:mb-16">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative px-6 md:px-8 py-3 rounded-xl text-sm md:text-base font-semibold transition-all duration-300 min-h-[48px]"
                style={{
                  color: activeTab === tab.id ? "hsl(0, 0%, 100%)" : "hsla(0, 0%, 100%, 0.5)",
                  background: activeTab === tab.id
                    ? "linear-gradient(135deg, hsla(217, 91%, 60%, 0.2) 0%, hsla(217, 91%, 70%, 0.1) 100%)"
                    : "transparent",
                  border: activeTab === tab.id
                    ? "1px solid hsla(217, 91%, 60%, 0.4)"
                    : "1px solid hsla(0, 0%, 100%, 0.08)",
                  boxShadow: activeTab === tab.id
                    ? "0 0 20px hsla(217, 91%, 60%, 0.15)"
                    : "none",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Active tab content */}
        <FadeIn delay={150}>
          <div
            className="rounded-3xl p-8 md:p-12 mb-10"
            style={{
              background: "hsla(215, 50%, 8%, 0.6)",
              border: "1px solid hsla(0, 0%, 100%, 0.08)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 0 0 1px hsla(0, 0%, 100%, 0.02) inset, 0 20px 60px hsla(0, 0%, 0%, 0.3)",
            }}
          >
            <div className="max-w-2xl mx-auto text-center mb-10">
              <h3
                className="text-xl md:text-2xl font-bold mb-3"
                style={{ color: "hsl(0, 0%, 100%)" }}
              >
                {active.headline}
              </h3>
              <p className="text-sm md:text-base leading-relaxed" style={{ color: "hsla(0, 0%, 100%, 0.6)" }}>
                {active.description}
              </p>
            </div>

            {/* Divider */}
            <div
              className="h-px mb-10 mx-auto max-w-lg"
              style={{
                background: "linear-gradient(90deg, transparent, hsla(217, 91%, 60%, 0.3), transparent)",
              }}
            />

            {/* Feature icons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {active.features.map((feat, i) => {
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
                    <h4 className="text-base font-semibold mb-1" style={{ color: "hsl(0, 0%, 100%)" }}>
                      {feat.title}
                    </h4>
                    <p className="text-sm" style={{ color: "hsla(0, 0%, 100%, 0.5)" }}>
                      {feat.desc}
                    </p>
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
