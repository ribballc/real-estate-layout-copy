import FadeIn from "@/components/FadeIn";
import { useCountUp } from "@/hooks/useCountUp";

const reviews = [
  { initials: "TB", name: "Trev B.", role: "@trevbdetail", quote: "I was using Square and a notes app to manage bookings. Switched to Darker and booked $4,200 my first month using the online booking link alone. Game changer.", metric: "+$4,200/mo" },
  { initials: "MV", name: "Marco V.", role: "@marcovdetailing", quote: "Customers used to ghost me after quotes. Now they pay a deposit to hold the spot. I haven't had a no-show in 3 months.", metric: "0 no-shows" },
  { initials: "JC", name: "Jordan C.", role: "@jcautofilm", quote: "I get DMs asking how my website looks so clean. I just send them the Darker link 😂 Easiest $54/mo I spend.", metric: "+$2,200/mo" },
  { initials: "RG", name: "Ray G.", role: "@rayg_detail", quote: "Set it up in one afternoon. Now I get bookings while I'm under a car. My wife thought I hired someone.", metric: "+$1,800/mo" },
  { initials: "SK", name: "Sam K.", role: "@samkprecision", quote: "I charged $175 for full details before Darker. After seeing how legit my site looked, I raised prices to $275. Clients didn't even blink.", metric: "+$100/job" },
  { initials: "DM", name: "Dani M.", role: "@danimpro", quote: "The automated reminder texts cut my no-shows in half. I used to lose $300+ a week to last-minute ghosts. That alone pays for the tool 10x over.", metric: "+$1,200/mo" },
];

const row1 = reviews.slice(0, 3);
const row2 = reviews.slice(3);

const ReviewCard = ({ review }: { review: typeof reviews[0] }) => (
  <div
    className="flex-shrink-0 w-[260px] md:w-[280px] rounded-xl p-4 md:p-5 text-left"
    style={{
      background: 'hsla(0, 0%, 100%, 0.12)',
      border: '1px solid hsla(0, 0%, 100%, 0.2)',
      backdropFilter: 'blur(20px)',
    }}
  >
    <div className="flex items-center gap-2.5 mb-3">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
        style={{ background: 'hsl(0, 0%, 100%)', color: 'hsl(217, 71%, 53%)' }}
      >
        {review.initials}
      </div>
      <div>
        <div className="font-semibold text-xs" style={{ color: 'hsl(0, 0%, 100%)' }}>{review.name}</div>
        <div className="text-[10px]" style={{ color: 'hsla(0, 0%, 100%, 0.6)' }}>{review.role}</div>
      </div>
    </div>
    <p className="text-xs leading-relaxed mb-3 line-clamp-3" style={{ color: 'hsla(0, 0%, 100%, 0.85)' }}>
      "{review.quote}"
    </p>
    <div className="text-[10px] font-bold" style={{ color: 'hsla(0, 0%, 100%, 0.9)' }}>{review.metric}</div>
  </div>
);

const ScrollRow = ({ items, direction }: { items: typeof reviews; direction: "left" | "right" }) => {
  const doubled = [...items, ...items, ...items, ...items];
  const animClass = direction === "left"
    ? "animate-scroll-left-mobile md:animate-scroll-left"
    : "animate-scroll-right-mobile md:animate-scroll-right";
  return (
    <div className="relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, hsl(217, 71%, 43%), transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, hsl(217, 71%, 48%), transparent)' }} />
      <div className={`flex gap-4 ${animClass}`} style={{ width: 'max-content' }}>
        {doubled.map((review, i) => (
          <ReviewCard key={`${review.initials}-${i}`} review={review} />
        ))}
      </div>
    </div>
  );
};

const TestimonialSection = () => {
  const { count: noShowCount, ref: statRef } = useCountUp(47, 2000);

  return (
    <section
      className="relative py-10 md:py-14 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, hsl(224, 64%, 33%) 0%, hsl(217, 71%, 53%) 100%)',
      }}
    >
      <div className="relative z-10 max-w-6xl mx-auto text-center px-5 md:px-8">
        <FadeIn>
          <h2
            className="font-heading text-[28px] md:text-[40px] lg:text-[48px] font-bold tracking-[-0.015em] leading-[1.2] text-center mb-3"
            style={{ color: 'hsl(0, 0%, 100%)' }}
          >
            Real Results
          </h2>
          <span
            className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full mb-4"
            style={{
              background: 'hsla(0, 0%, 100%, 0.15)',
              border: '1px solid hsla(0, 0%, 100%, 0.25)',
              color: 'hsl(0, 0%, 100%)',
            }}
          >
            From Real Detailers
          </span>
        </FadeIn>

        <FadeIn delay={100}>
          <div className="mb-8" ref={statRef}>
            <div
              className="font-mono text-6xl md:text-[100px] font-bold tabular-nums leading-none"
              style={{ color: 'hsl(0, 0%, 100%)', textShadow: '0 0 40px hsla(0, 0%, 100%, 0.3)' }}
            >
              {noShowCount}%
            </div>
            <p className="text-base md:text-lg font-medium mt-2" style={{ color: 'hsla(0, 0%, 100%, 0.85)' }}>fewer no-shows on average</p>
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={200}>
        <div className="space-y-4">
          <ScrollRow items={row1} direction="left" />
          <ScrollRow items={row2} direction="right" />
        </div>
      </FadeIn>
    </section>
  );
};

export default TestimonialSection;
