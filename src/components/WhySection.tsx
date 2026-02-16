import FadeIn from "@/components/FadeIn";
import { useRef, useCallback } from "react";


/* 24/7 Smart Booking Calendar */
const CalendarBookingIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ animation: "whyIconFloat 3s ease-in-out infinite" }}>
    <rect x="6" y="10" width="28" height="24" rx="4" stroke="hsl(213, 94%, 68%)" strokeWidth="2" fill="hsla(217, 91%, 60%, 0.06)" />
    <rect x="6" y="10" width="28" height="8" rx="4" fill="hsl(217, 91%, 60%)" opacity="0.9" />
    <line x1="14" y1="6" x2="14" y2="14" stroke="hsl(213, 94%, 68%)" strokeWidth="2" strokeLinecap="round" />
    <line x1="26" y1="6" x2="26" y2="14" stroke="hsl(213, 94%, 68%)" strokeWidth="2" strokeLinecap="round" />
    {/* Filling cells */}
    {[0,1,2].map(r => [0,1,2].map(c => (
      <rect key={`${r}-${c}`} x={11 + c * 8} y={22 + r * 4} width="5" height="2.5" rx="0.5"
        fill="hsl(217, 91%, 60%)" style={{ animation: "whyFillIn 2.5s ease-out infinite", animationDelay: `${(r*3+c)*0.2}s`, transformOrigin: `${13.5+c*8}px ${23.25+r*4}px` }} />
    )))}
    {/* Pulse dot */}
    <circle cx="33" cy="11" r="3" fill="hsl(160, 84%, 39%)">
      <animate attributeName="r" values="3;4;3" dur="2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="1;0.6;1" dur="2s" repeatCount="indefinite" />
    </circle>
  </svg>
);

/* No-Show Protection */
const ShieldIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ animation: "whyIconFloat 3s ease-in-out infinite", animationDelay: "0.4s" }}>
    <path d="M20 4 L34 12 V22 C34 30 28 36 20 38 C12 36 6 30 6 22 V12 L20 4Z"
      stroke="hsl(213, 94%, 68%)" strokeWidth="2" fill="hsla(217, 91%, 60%, 0.06)" />
    {/* Checkmark */}
    <path d="M14 20 L18 24 L26 16" stroke="hsl(217, 91%, 60%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      strokeDasharray="20" style={{ animation: "whyDrawLine 2s ease-out infinite" }} />
    {/* Pulse ring */}
    <circle cx="20" cy="20" r="5" fill="none" stroke="hsl(217, 91%, 60%)" strokeWidth="1" opacity="0.3">
      <animate attributeName="r" values="12;16;12" dur="3s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite" />
    </circle>
  </svg>
);

/* Professional Website */
const WebsiteIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ animation: "whyIconFloat 3s ease-in-out infinite", animationDelay: "0.8s" }}>
    <rect x="4" y="8" width="32" height="24" rx="4" stroke="hsl(213, 94%, 68%)" strokeWidth="2" fill="hsla(217, 91%, 60%, 0.06)" />
    <rect x="4" y="8" width="32" height="8" rx="4" stroke="hsl(213, 94%, 68%)" strokeWidth="2" fill="hsla(217, 91%, 60%, 0.1)" />
    <circle cx="10" cy="12" r="1.5" fill="hsl(0, 84%, 60%)" />
    <circle cx="15" cy="12" r="1.5" fill="hsl(45, 93%, 60%)" />
    <circle cx="20" cy="12" r="1.5" fill="hsl(142, 71%, 45%)" />
    {/* Building blocks */}
    <rect x="8" y="20" width="10" height="4" rx="1" fill="hsl(217, 91%, 60%)" opacity="0.7"
      style={{ animation: "whyFillIn 2s ease-out infinite", transformOrigin: "13px 22px", animationDelay: "0s" }} />
    <rect x="8" y="26" width="24" height="2" rx="1" fill="hsl(213, 94%, 68%)" opacity="0.4"
      style={{ animation: "whyFillIn 2s ease-out infinite", transformOrigin: "20px 27px", animationDelay: "0.3s" }} />
    <rect x="22" y="20" width="10" height="4" rx="1" fill="hsl(213, 94%, 68%)" opacity="0.5"
      style={{ animation: "whyFillIn 2s ease-out infinite", transformOrigin: "27px 22px", animationDelay: "0.6s" }} />
    {/* Cursor */}
    <rect x="10" y="29" width="1.5" height="2" fill="hsl(217, 91%, 60%)" style={{ animation: "whyBlink 1s step-end infinite" }} />
  </svg>
);

/* Payment Processing */
const PaymentIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ animation: "whyIconFloat 3s ease-in-out infinite", animationDelay: "1.2s" }}>
    <rect x="4" y="10" width="32" height="20" rx="4" stroke="hsl(213, 94%, 68%)" strokeWidth="2" fill="hsla(217, 91%, 60%, 0.06)" />
    {/* Stripe */}
    <rect x="4" y="16" width="32" height="4" fill="hsl(217, 91%, 60%)" opacity="0.3" />
    {/* Card chip */}
    <rect x="9" y="22" width="6" height="4" rx="1" stroke="hsl(213, 94%, 68%)" strokeWidth="1.5" fill="hsla(45, 93%, 56%, 0.2)" />
    {/* Sliding payment indicator */}
    <circle cx="30" cy="24" r="2" fill="hsl(160, 84%, 39%)">
      <animate attributeName="cx" values="26;30;26" dur="2.5s" repeatCount="indefinite" />
    </circle>
    {/* Signal arcs */}
    <path d="M30 8 C32 6, 34 6, 36 8" stroke="hsl(217, 91%, 60%)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5"
      style={{ animation: "whyFillIn 2s ease-out infinite", transformOrigin: "33px 7px", animationDelay: "0s" }} />
    <path d="M28 6 C31 3, 35 3, 38 6" stroke="hsl(217, 91%, 60%)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.3"
      style={{ animation: "whyFillIn 2s ease-out infinite", transformOrigin: "33px 4.5px", animationDelay: "0.3s" }} />
  </svg>
);

const Highlight = ({ children }: { children: React.ReactNode }) => (
  <span style={{ color: "hsl(217, 71%, 53%)", fontWeight: 700 }}>{children}</span>
);

const features = [
  {
    Icon: CalendarBookingIcon,
    title: "24/7 Smart Booking Calendar",
    description: <>Customers book while you're detailing. Capture the <Highlight>$500-1,000/month</Highlight> you're losing to missed calls.</>,
  },
  {
    Icon: ShieldIcon,
    title: "No-Show Protection That Works",
    description: <>Automated reminders + <Highlight>$100</Highlight> deposits = <Highlight>40%</Highlight> fewer no-shows.</>,
  },
  {
    Icon: WebsiteIcon,
    title: "Professional Website in 48 Hours",
    description: <>Mobile-optimized website that looks like you paid <Highlight>$3,000</Highlight>. Zero tech skills required.</>,
  },
  {
    Icon: PaymentIcon,
    title: "Payment Processing Built-In",
    description: <>Accept cards, collect deposits, get paid next day. <Highlight>2.9% + 30¢</Highlight> per transaction.</>,
  },
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { Icon } = feature;

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
    <FadeIn delay={100 + index * 100}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className="group relative rounded-3xl p-8 md:p-10 overflow-hidden transition-all duration-500 hover:-translate-y-2 cursor-pointer"
        style={{
          background: "hsl(0, 0%, 100%)",
          border: "1px solid hsl(214, 20%, 90%)",
          boxShadow: "0 4px 24px hsla(0, 0%, 0%, 0.06)",
        }}
      >
        {/* Spotlight follow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
          style={{
            background: "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), hsla(217, 71%, 53%, 0.06), transparent 40%)",
          }}
        />

        <div className="relative z-10 mb-6">
          <div
            className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110"
            style={{
              background: "hsla(217, 71%, 53%, 0.08)",
              border: "1px solid hsla(217, 71%, 53%, 0.15)",
            }}
          >
            <Icon />
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
        >
          {feature.description}
        </p>
      </div>
    </FadeIn>
  );
};

const WhySection = () => {
  return (
    <>
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
                Why It Works
              </h2>
              <p className="text-lg md:text-xl" style={{ color: "hsl(215, 16%, 47%)" }}>
                Why hundreds of detailers, installers, and shop owners swear by it.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <FeatureCard key={feature.title} feature={feature} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default WhySection;
