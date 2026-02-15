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
      className="relative py-24 md:py-[100px] px-5 md:px-10 overflow-hidden"
      style={{ background: "#ffffff" }}
    >
      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-12 md:mb-16">
            <h2
              className="font-heading text-[32px] md:text-[40px] font-semibold leading-[1.15] mb-5"
              style={{ color: "#1d1d1f", letterSpacing: "-0.4px" }}
            >
              What's Included
            </h2>
            <p className="text-[19px] md:text-[21px]" style={{ color: "#86868b", letterSpacing: "-0.2px" }}>
              Everything done for you — ready in 48 hours.
            </p>
          </div>
        </FadeIn>

        {/* Underline Tabs */}
        <FadeIn delay={100}>
          <div className="flex justify-center gap-8 md:gap-12 mb-12 md:mb-16 relative">
            <div
              className="absolute bottom-0 left-0 right-0 h-px"
              style={{ background: "rgba(0, 0, 0, 0.08)" }}
            />
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative pb-4 text-[15px] md:text-[17px] font-medium transition-all duration-300 min-h-[48px]"
                style={{
                  color: activeTab === tab.id ? "#0071e3" : "#86868b",
                  letterSpacing: "-0.2px",
                }}
              >
                {tab.label}
                <span
                  className="absolute bottom-0 left-0 right-0 h-[2px] transition-all duration-300"
                  style={{
                    background: activeTab === tab.id ? "#0071e3" : "transparent",
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
              background: "#ffffff",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
            }}
          >
            <h3
              className="text-[17px] md:text-[19px] font-medium text-center mb-10"
              style={{ color: "#1d1d1f", letterSpacing: "-0.2px" }}
            >
              {active.headline}
            </h3>

            <div
              className="h-px mb-10 mx-auto max-w-lg"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.08), transparent)",
              }}
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {active.features.map((feat) => {
                const Icon = feat.icon;
                return (
                  <div key={feat.title} className="text-center group">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-105"
                      style={{
                        background: "hsla(210, 100%, 45%, 0.08)",
                      }}
                    >
                      <Icon className="w-6 h-6" style={{ color: "#0071e3" }} />
                    </div>
                    <h4 className="text-[15px] md:text-[17px] font-medium" style={{ color: "#1d1d1f", letterSpacing: "-0.2px" }}>
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
