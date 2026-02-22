import FadeIn from "@/components/FadeIn";
import { useRef, useCallback } from "react";
import penguinCalendar from "@/assets/penguin-calendar.png";
import penguinPayment from "@/assets/penguin-payment.jpeg";

const Highlight = ({ children }: { children: React.ReactNode }) => (
  <span style={{ color: "hsl(217, 71%, 53%)", fontWeight: 700 }}>{children}</span>
);

/* ── Large Card Visual Animations ── */

const CalendarVisual = () => (
  <div className="w-full h-[180px] flex items-center justify-center overflow-hidden rounded-t-xl" style={{ background: "hsl(210, 40%, 98%)" }}>
    <img
      src={penguinCalendar}
      alt="Penguin mascot holding phone with booking calendar"
      className="w-full h-full object-cover object-center"
      style={{ animation: "siteFadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both" }}
    />
  </div>
);

const ShieldVisual = () => (
  <div className="w-full h-[180px] flex items-center justify-center overflow-hidden rounded-t-xl" style={{ background: "hsl(210, 40%, 98%)" }}>
    <svg width="200" height="160" viewBox="0 0 200 160" fill="none">
      {/* Large shield */}
      <path d="M100 12 L155 35 V80 C155 110 135 135 100 145 C65 135 45 110 45 80 V35 L100 12Z"
        fill="hsl(0,0%,100%)" stroke="hsl(217,91%,80%)" strokeWidth="2" />
      <path d="M100 22 L145 42 V78 C145 104 128 126 100 134 C72 126 55 104 55 78 V42 L100 22Z"
        fill="hsl(217,91%,97%)" />

      {/* Checkmark */}
      <path d="M80 78 L93 91 L120 64" stroke="hsl(217,91%,60%)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="60" strokeDashoffset="60">
        <animate attributeName="stroke-dashoffset" values="60;0" dur="1.5s" repeatCount="indefinite" />
      </path>

      {/* Pulse rings */}
      <circle cx="100" cy="78" r="25" fill="none" stroke="hsl(217,91%,60%)" strokeWidth="1" opacity="0.2">
        <animate attributeName="r" values="25;40;25" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0;0.2" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="100" cy="78" r="30" fill="none" stroke="hsl(217,91%,60%)" strokeWidth="0.5" opacity="0.1">
        <animate attributeName="r" values="30;50;30" dur="3s" begin="0.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.1;0;0.1" dur="3s" begin="0.5s" repeatCount="indefinite" />
      </circle>

      {/* Status dots */}
      <circle cx="38" cy="55" r="4" fill="hsl(160,84%,39%)">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="162" cy="55" r="4" fill="hsl(160,84%,39%)">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" begin="0.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  </div>
);

const WebsiteVisual = () => (
  <div className="w-full h-[180px] flex items-center justify-center overflow-hidden rounded-t-xl" style={{ background: "hsl(210, 40%, 98%)" }}>
    <svg width="220" height="160" viewBox="0 0 220 160" fill="none">
      {/* Browser */}
      <rect x="15" y="10" width="190" height="140" rx="10" fill="hsl(0,0%,100%)" stroke="hsl(214,20%,88%)" strokeWidth="1.5" />
      <rect x="15" y="10" width="190" height="24" rx="10" fill="hsl(214,20%,96%)" />
      <circle cx="30" cy="22" r="3.5" fill="hsl(0,84%,70%)" />
      <circle cx="42" cy="22" r="3.5" fill="hsl(45,93%,65%)" />
      <circle cx="54" cy="22" r="3.5" fill="hsl(142,71%,55%)" />
      <rect x="70" y="18" width="100" height="8" rx="4" fill="hsl(214,20%,90%)" />

      {/* Hero section — static */}
      <rect x="28" y="42" width="80" height="10" rx="3" fill="hsl(215,25%,12%)" opacity="0.8" />
      <rect x="28" y="56" width="55" height="6" rx="3" fill="hsl(214,20%,88%)" />

      {/* CTA button — flickers only */}
      <rect x="28" y="70" width="60" height="14" rx="7" fill="hsl(217,91%,60%)">
        <animate attributeName="opacity" values="1;0.35;1" dur="2.5s" repeatCount="indefinite" />
      </rect>
      <text x="58" y="80" textAnchor="middle" fontSize="7" fontWeight="600" fill="white">
        Book Now
        <animate attributeName="opacity" values="1;0.35;1" dur="2.5s" repeatCount="indefinite" />
      </text>

      {/* Image area — static */}
      <rect x="120" y="42" width="72" height="50" rx="6" fill="hsl(217,91%,96%)" />

      {/* Service cards — static */}
      {[0,1,2].map(i => (
        <rect key={i} x={28 + i * 58} y="100" width="50" height="38" rx="5" fill="hsl(214,20%,96%)" stroke="hsl(214,20%,92%)" strokeWidth="1" />
      ))}
    </svg>
  </div>
);

const PaymentVisual = () => (
  <div className="w-full h-[180px] flex items-center justify-center overflow-hidden rounded-t-xl" style={{ background: "hsl(210, 40%, 98%)" }}>
    <img
      src={penguinPayment}
      alt="Penguin mascot holding Darker Digital gold card"
      className="w-full h-full object-cover object-center"
      style={{ animation: "siteFadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both" }}
    />
  </div>
);

const features = [
  {
    Visual: CalendarVisual,
    title: "24/7 Smart Booking Calendar",
    description: <>Customers book while you're detailing. Capture the <Highlight>$500-1,000/month</Highlight> you're losing to missed calls.</>,
  },
  {
    Visual: ShieldVisual,
    title: "No-Show Protection That Works",
    description: <>Automated reminders + <Highlight>$100</Highlight> deposits = <Highlight>40%</Highlight> fewer no-shows.</>,
  },
  {
    Visual: WebsiteVisual,
    title: "Professional Website in 48 Hours",
    description: <>Mobile-optimized website that looks like you paid <Highlight>$3,000</Highlight>. Zero tech skills required.</>,
  },
  {
    Visual: PaymentVisual,
    title: "Payment Processing Built-In",
    description: <>Accept cards, collect deposits, get paid next day. <Highlight>2.9% + 30¢</Highlight> per transaction.</>,
  },
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { Visual } = feature;

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
    <FadeIn delay={100 + index * 120}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 cursor-pointer h-full"
        style={{
          background: "hsl(0, 0%, 100%)",
          border: "1px solid hsl(214, 20%, 90%)",
          boxShadow: "0 1px 3px hsla(0, 0%, 0%, 0.04)",
        }}
      >
        {/* Spotlight follow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
          style={{
            background: "radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), hsla(217, 71%, 53%, 0.04), transparent 40%)",
          }}
        />

        {/* Visual at top */}
        <Visual />

        {/* Text content */}
        <div className="relative z-10 p-6 pt-5">
          <h3
            className="text-lg font-bold mb-2 transition-colors duration-300"
            style={{ color: "hsl(222, 47%, 11%)" }}
          >
            {feature.title}
          </h3>
          <p
            className="text-[13px] leading-[1.7] transition-colors duration-300"
            style={{ color: "hsl(215, 16%, 47%)" }}
          >
            {feature.description}
          </p>
        </div>
      </div>
    </FadeIn>
  );
};

const WhySection = () => {
  return (
    <section
      className="relative py-20 md:py-28 px-5 md:px-10 overflow-hidden"
      style={{ background: "hsl(0, 0%, 100%)" }}
    >
      <div className="max-w-[1100px] mx-auto relative z-10">
        <FadeIn>
          <div className="text-center mb-12 md:mb-16">
            {/* Blue pill tag */}
            <div className="flex justify-center mb-5">
              <span
                className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide"
                style={{
                  background: "hsl(217, 91%, 96%)",
                  color: "hsl(217, 91%, 50%)",
                  border: "1px solid hsl(217, 91%, 88%)",
                }}
              >
                Why It Works
              </span>
            </div>
            <h2
              className="font-heading text-[32px] md:text-[48px] lg:text-[56px] font-bold tracking-[-0.02em] leading-[1.15] mb-4"
              style={{ color: "hsl(222, 47%, 11%)" }}
            >
              Why It Works
            </h2>
            <p className="text-base md:text-lg max-w-lg mx-auto" style={{ color: "hsl(215, 16%, 47%)" }}>
              Why hundreds of detailers, installers, and shop owners swear by it.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySection;
