import { useState } from "react";
import { Paintbrush, Smartphone, Search, Globe, Clock, CreditCard, Wrench, Users, MessageSquare, RefreshCw, BarChart3, Star } from "lucide-react";
import FadeIn from "@/components/FadeIn";

const tabs = [
  {
    id: "website",
    label: "Website",
    headline: "Professional website that converts — built for you in 48 hours.",
    features: [
      { icon: Paintbrush, title: "Custom Design", desc: "Tailored to your brand with premium layouts" },
      { icon: Smartphone, title: "Mobile-First", desc: "Optimized for every screen size and device" },
      { icon: Search, title: "SEO Optimized", desc: "Rank higher on Google and get found locally" },
      { icon: Globe, title: "Free Domain", desc: "Your own .com domain included at no extra cost" },
    ],
  },
  {
    id: "booking",
    label: "Booking",
    headline: "Customers book, pay deposits, and confirm — 24/7 on autopilot.",
    features: [
      { icon: Clock, title: "Live Calendar", desc: "Real-time availability synced to your schedule" },
      { icon: CreditCard, title: "Deposit Collection", desc: "Collect payments upfront to reduce no-shows" },
      { icon: Wrench, title: "Custom Services", desc: "List your exact packages, pricing, and add-ons" },
      { icon: Users, title: "Client Management", desc: "Track every customer, booking, and vehicle" },
    ],
  },
  {
    id: "automations",
    label: "Automations",
    headline: "SMS reminders, follow-ups, and reviews — all handled automatically.",
    features: [
      { icon: MessageSquare, title: "SMS Reminders", desc: "Automated texts so clients never forget" },
      { icon: RefreshCw, title: "Auto Follow-Ups", desc: "Re-engage past customers on autopilot" },
      { icon: Star, title: "Review Requests", desc: "Get more 5-star reviews without asking" },
      { icon: BarChart3, title: "Smart Analytics", desc: "Track revenue, bookings, and growth trends" },
    ],
  },
];

const ManifestoSection = () => {
  const [activeTab, setActiveTab] = useState("website");
  const active = tabs.find((t) => t.id === activeTab)!;

  return (
    <section
      className="relative py-20 md:py-28 px-5 md:px-10 overflow-hidden"
      style={{ background: "hsl(0, 0%, 100%)" }}
    >
      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-12 md:mb-16">
            <h2
              className="font-heading text-[32px] md:text-[56px] lg:text-[72px] font-bold tracking-[-0.02em] leading-[1.2] mb-4"
              style={{ color: "hsl(222, 47%, 11%)" }}
            >
              What's Included
            </h2>
            <p className="text-lg md:text-xl" style={{ color: "hsl(215, 16%, 47%)" }}>
              Everything done for you — ready in 48 hours.
            </p>
          </div>
        </FadeIn>

        {/* Underline Tabs */}
        <FadeIn delay={100}>
          <div className="flex justify-center gap-8 md:gap-12 mb-12 md:mb-16 relative">
            <div
              className="absolute bottom-0 left-0 right-0 h-px"
              style={{ background: "hsl(214, 20%, 90%)" }}
            />
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative pb-4 text-base md:text-lg font-semibold transition-colors duration-300 min-h-[48px]"
                style={{
                  color: activeTab === tab.id ? "hsl(217, 71%, 53%)" : "hsl(215, 16%, 47%)",
                }}
              >
                {tab.label}
                <span
                  className="absolute bottom-0 left-0 right-0 h-[2px] transition-all duration-300"
                  style={{
                    background: activeTab === tab.id ? "hsl(217, 71%, 53%)" : "transparent",
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
              background: "hsl(0, 0%, 100%)",
              border: "1px solid hsl(214, 20%, 90%)",
              boxShadow: "0 4px 24px hsla(0, 0%, 0%, 0.06)",
            }}
          >
            <h3
              className="text-lg md:text-xl font-semibold text-center mb-10"
              style={{ color: "hsl(222, 47%, 11%)" }}
            >
              {active.headline}
            </h3>

            <div
              className="h-px mb-10 mx-auto max-w-lg"
              style={{
                background: "linear-gradient(90deg, transparent, hsl(214, 20%, 90%), transparent)",
              }}
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {active.features.map((feat) => {
                const Icon = feat.icon;
                return (
                  <div key={feat.title} className="text-center group">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1"
                      style={{
                        background: "hsla(217, 71%, 53%, 0.08)",
                        border: "1px solid hsla(217, 71%, 53%, 0.15)",
                      }}
                    >
                      <Icon className="w-7 h-7" style={{ color: "hsl(217, 71%, 53%)" }} />
                    </div>
                    <h4 className="text-sm md:text-base font-semibold mb-1.5" style={{ color: "hsl(222, 47%, 11%)" }}>
                      {feat.title}
                    </h4>
                    <p className="text-[12px] md:text-[13px] leading-relaxed" style={{ color: "hsl(215, 16%, 47%)" }}>
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
