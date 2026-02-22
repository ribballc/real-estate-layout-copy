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
    title: "Clients Book While Your Hands Are Full",
    description: <>Pulling a wrap seam. Laying PPF. Running a machine polish. Your phone isn't an option — but your booking page never stops working. Stop losing <Highlight>$500–$1,000/month</Highlight> to voicemails that go unanswered.</>,
  },
  {
    Visual: ShieldVisual,
    title: "No Skin in the Game? No Spot on the Calendar.",
    description: <>A <Highlight>$50–$100 deposit</Highlight> at checkout self-selects the serious ones from the ghosts. Add automated SMS reminders and most shops cut no-shows by <Highlight>40%</Highlight> — and stop losing full days to people who were never going to show.</>,
  },
  {
    Visual: WebsiteVisual,
    title: "Your Work Is Premium. Your Site Should Say So.",
    description: <>Built for your shop in <Highlight>48 hours</Highlight> — no templates, no DIY. When a client lands on it, they form a price expectation before they ever reach out. Make sure that number is high.</>,
  },
  {
    Visual: PaymentVisual,
    title: 'No More "I\'ll Pay When I Pick Up."',
    description: <>Deposits locked at booking. Balance collected before keys drop. Funds in your account next business day. Just <Highlight>2.9% + 30¢</Highlight> — less than the cost of chasing one ghost invoice.</>,
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
              Built for the Craft. Runs the Business.
            </h2>
            <p className="text-base md:text-lg max-w-lg mx-auto" style={{ color: "hsl(215, 16%, 47%)" }}>
              Four systems working in the background — so every job is locked in, paid, and protected before you pick up a single tool.
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
