import FadeIn from "@/components/FadeIn";
import { useRef, useCallback } from "react";
import penguinCalendar from "@/assets/penguin-calendar.png";
import penguinPayment from "@/assets/penguin-payment.jpg";
import penguinNoshow from "@/assets/penguin-noshow.png";
import penguinWebsite from "@/assets/penguin-website.jpg";

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
    Visual: CalendarVisual,
    title: "Your Booking Page Never Clocks Out",
    description: <>While you're 3 hours deep into a ceramic coat, your calendar's out there locking in jobs. Capture the <Highlight>$500–$1,000/month</Highlight> you're losing every time a call goes to voicemail.</>,
  },
  {
    Visual: ShieldVisual,
    title: "They Paid to Book. They'll Show Up.",
    description: <>A <Highlight>$100 deposit</Highlight> at checkout turns tire-kickers into committed clients. Pair it with auto-reminders and you'll see <Highlight>40% fewer no-shows</Highlight> — starting week one.</>,
  },
  {
    Visual: WebsiteVisual,
    title: "A Site That Makes You Look Like the Premium Option",
    description: <>Done for you in <Highlight>48 hours</Highlight>. Clients see it, assume you charge more — so you can. No tech skills. No designer. Just a clean, mobile-ready site that converts.</>,
  },
  {
    Visual: PaymentVisual,
    title: "Get Paid. Fast. Every Time.",
    description: <>Cards, deposits, next-day payouts — all baked in. No Venmo chasing. No third-party apps. Just <Highlight>2.9% + 30¢</Highlight> and money in your account tomorrow.</>,
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
              Built to Run While You're Under a Car
            </h2>
            <p className="text-base md:text-lg max-w-lg mx-auto" style={{ color: "hsl(215, 16%, 47%)" }}>
              Four features doing the heavy lifting — so you stay focused on the detail.
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
