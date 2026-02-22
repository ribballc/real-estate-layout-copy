import FadeIn from "@/components/FadeIn";
import { useRef, useCallback } from "react";
import penguinCalendar from "@/assets/penguin-calendar.png";
import penguinPayment from "@/assets/penguin-payment.jpg";
import penguinNoshow from "@/assets/penguin-noshow.png";
import penguinWebsite from "@/assets/penguin-website.jpg";

const Highlight = ({ children }: { children: React.ReactNode }) => (
  <span style={{ color: "hsl(217, 71%, 53%)", fontWeight: 700 }}>{children}</span>
);

const ICE_ARM = "rgba(125, 211, 252, 0.7)";
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
    <img
      src={penguinNoshow}
      alt="Penguin mascot detailing a car"
      className="w-full h-full object-cover object-center"
      style={{ animation: "siteFadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both" }}
    />
  </div>
);

const WebsiteVisual = () => (
  <div className="w-full h-[180px] flex items-center justify-center overflow-hidden rounded-t-xl" style={{ background: "hsl(210, 40%, 98%)" }}>
    <img
      src={penguinWebsite}
      alt="Penguin mascot working on a professional website"
      className="w-full h-full object-cover object-center"
      style={{ animation: "siteFadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both" }}
    />
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
    src: penguinCalendar,
    alt: "Penguin mascot holding phone with booking calendar",
    title: "Clients Book While Your Hands Are Full",
    description: (
      <>
        Pulling a wrap seam. Laying PPF. Running a machine polish. Your phone isn't an option — but your booking page never stops working. Stop losing <Highlight>$500–$1,000/month</Highlight> to voicemails that go unanswered.
      </>
    ),
  },
  {
    src: penguinNoshow,
    alt: "Penguin mascot detailing a car",
    title: "No Skin in the Game? No Spot on the Calendar.",
    description: (
      <>
        A <Highlight>$50–$100 deposit</Highlight> at checkout self-selects the serious ones from the ghosts. Add automated SMS reminders and most shops cut no-shows by <Highlight>40%</Highlight> — and stop losing full days to people who were never going to show.
      </>
    ),
  },
  {
    src: penguinWebsite,
    alt: "Penguin mascot working on a professional website",
    title: "Your Professional Site. Live in 2 Minutes.",
    description: (
      <>
        No templates. No DIY. A stunning, mobile-ready website built for your shop and live in under <Highlight>2 minutes</Highlight> — clients who land on it expect to pay more. So charge more.
      </>
    ),
  },
  {
    src: penguinPayment,
    alt: "Penguin mascot holding Darker Digital gold card",
    title: "No More \"I'll Pay When I Pick Up.\"",
    description: (
      <>
        Deposits locked at booking. Balance collected before keys drop. Funds in your account next business day. Just <Highlight>2.9% + 30¢</Highlight> — less than the cost of chasing one ghost invoice.
      </>
    ),
  },
];

const FeatureCard = ({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) => {
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
    <FadeIn delay={100 + index * 120}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className="why-section-card group relative overflow-hidden cursor-pointer h-full rounded-[20px] transition-[border-color,box-shadow] duration-350"
        style={{
          background: "#ffffff",
          border: "1px solid hsl(214, 20%, 90%)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        {/* Spotlight follow — icier color */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), hsla(197, 85%, 65%, 0.06), transparent 40%)",
          }}
        />

        {/* Image area — 220px, rounded top, fade overlay at bottom */}
        <div
          className="relative w-full overflow-hidden"
          style={{
            height: 220,
            background: "hsl(210, 40%, 98%)",
            borderRadius: "20px 20px 0 0",
          }}
        >
          <img
            src={feature.src}
            alt={feature.alt}
            className="w-full h-full object-cover object-center"
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-[50px] pointer-events-none z-[1]"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(255,255,255,0.18))",
            }}
          />
        </div>

        {/* Text area */}
        <div className="relative z-10 p-6 pt-5">
          <h3
            className="mb-1.5"
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "hsl(222, 47%, 11%)",
              letterSpacing: "-0.01em",
              lineHeight: 1.25,
            }}
          >
            {feature.title}
          </h3>
          {/* Ice accent line */}
          <div
            className="rounded-full mb-3"
            style={{
              width: 28,
              height: 2.5,
              background:
                "linear-gradient(to right, rgba(125,211,252,0.9), rgba(186,230,255,0.4))",
            }}
          />
          <p
            style={{
              fontSize: 13.5,
              lineHeight: 1.75,
              color: "hsl(215, 16%, 47%)",
            }}
          >
            {feature.description}
          </p>
        </div>
      </div>
    </FadeIn>
  );
};

/** Mobile-only: vertical connector between cards with small diamond */
const MobileConnector = () => (
  <div className="flex flex-col items-center w-full" style={{ margin: "0 auto" }}>
    <div
      className="relative"
      style={{
        width: 1,
        height: 32,
        background:
          "linear-gradient(to bottom, rgba(125,211,252,0.6), rgba(125,211,252,0.2))",
        boxShadow: "0 0 6px rgba(125,211,252,0.4)",
      }}
    >
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-sm"
        style={{
          width: 8,

          height: 8,
          background: "rgba(125,211,252,0.85)",
          transform: "translate(-50%, -50%) rotate(45deg)",
          boxShadow: "0 0 8px rgba(125,211,252,0.6)",
        }}
      />
    </div>
  </div>
);

const WhySection = () => {
  return (
    <section
      className="relative py-24 md:py-32 px-5 md:px-10 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 900px 500px at 50% -80px, rgba(186,230,255,0.16) 0%, transparent 68%), #ffffff",
      }}
    >
      {/* Header — centered, no pill */}
      <header className="text-center mb-16 md:mb-20">
        <h2
          className="font-heading font-extrabold tracking-[-0.03em] leading-[1.05]"
          style={{
            fontSize: "clamp(36px, 6vw, 64px)",
            color: "hsl(222, 47%, 11%)",
          }}
        >
          Why You Need It
        </h2>
        <p
          className="mt-3"
          style={{
            fontSize: 17,
            color: "hsl(215, 16%, 47%)",
          }}
        >
          Hundreds of detailers, installers, and shop owners swear by it.
        </p>
      </header>

      {/* Desktop: 2×2 grid + ice rod overlay */}
      <div className="relative max-w-[1100px] mx-auto hidden md:block">
        <div className="grid grid-cols-2 gap-6">
          {features.map((feature, i) => (

            <FeatureCard key={i} feature={feature} index={i} />
          ))}
        </div>
        {/* Ice rod connector overlay — desktop only */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          aria-hidden
        >
          {/* Vertical ice arm */}
          <div
            className="absolute top-0 w-px h-full"
            style={{
              left: "50%",
              background: `linear-gradient(to bottom, transparent 0%, ${ICE_ARM} 20%, ${ICE_ARM} 80%, transparent 100%)`,
              boxShadow:
                "0 0 10px rgba(125, 211, 252, 0.55), 0 0 22px rgba(125, 211, 252, 0.2)",
            }}
          />
          {/* Horizontal ice arm */}
          <div
            className="absolute left-0 h-px w-full"
            style={{
              top: "50%",
              background: `linear-gradient(to right, transparent 0%, ${ICE_ARM} 20%, ${ICE_ARM} 80%, transparent 100%)`,
              boxShadow:
                "0 0 10px rgba(125, 211, 252, 0.55), 0 0 22px rgba(125, 211, 252, 0.2)",
            }}
          />
          {/* Shimmer on horizontal arm */}
          <div
            className="absolute h-px"
            style={{
              top: "50%",
              left: 0,
              width: 60,
              background:
                "linear-gradient(to right, transparent, rgba(255,255,255,0.95), transparent)",
              animation: "shimmerH 4s ease-in-out 1.5s infinite",
            }}
          />
          {/* Shimmer on vertical arm */}
          <div
            className="absolute w-px"
            style={{
              left: "50%",
              top: 0,
              height: 60,
              background:
                "linear-gradient(to bottom, transparent, rgba(255,255,255,0.95), transparent)",
              animation: "shimmerV 4s ease-in-out 2.5s infinite",
            }}
          />
          {/* Center ice crystal node */}
          <div
            className="absolute w-[26px] h-[26px] rounded-[4px]"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%) rotate(45deg)",
              background:
                "radial-gradient(circle at center, #ffffff 25%, rgba(186, 230, 255, 0.9) 55%, rgba(125, 211, 252, 0.4) 100%)",
              boxShadow:
                "0 0 0 1px rgba(125,211,252,0.5), 0 0 14px rgba(125,211,252,0.85), 0 0 32px rgba(125,211,252,0.45), 0 0 70px rgba(125,211,252,0.2)",
              animation: "crystalPulse 2.8s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      {/* Mobile: single column with connectors between cards */}
      <div className="relative max-w-[1100px] mx-auto flex flex-col gap-0 md:hidden">
        {features.map((feature, i) => (
          <div key={i}>
            <FeatureCard feature={feature} index={i} />
            {i < features.length - 1 && (
              <div className="flex justify-center">
                <MobileConnector />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhySection;
