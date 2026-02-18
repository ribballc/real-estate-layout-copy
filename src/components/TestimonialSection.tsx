import FadeIn from "@/components/FadeIn";
import { useCountUp } from "@/hooks/useCountUp";

const reviews = [
  { initials: "MT", name: "Marcus Thompson", role: "Dallas Mobile Detailing", quote: "I was working off a Google doc and word of mouth. First month with Darker I added $3,400. No exaggeration.", metric: "+$3,400/mo" },
  { initials: "JR", name: "Jake Rivera", role: "Rivera's Auto Spa", quote: "The deposit thing alone was a game changer. No-shows went from 4-5 a week to basically zero.", metric: "+$2,800/mo" },
  { initials: "DW", name: "DeShawn Williams", role: "Pristine Detail Co.", quote: "Customers book at midnight, I wake up to confirmed jobs with deposits already paid. It's wild.", metric: "+$1,900/mo" },
  { initials: "KP", name: "Kyle Patterson", role: "KP Mobile Detail", quote: "I used to spend 90 minutes a day just texting people back. That's all automated now. I just detail.", metric: "90 min saved/day" },
  { initials: "AM", name: "Andre Mitchell", role: "Gloss Boss Detailing", quote: "Went from $6k months to over $10k in 90 days. My site looks better than shops that have been open for 20 years. Worth every cent.", metric: "+$4,100/mo" },
  { initials: "SL", name: "Sarah Langston", role: "Luxe Auto Care", quote: "As a solo operator this was exactly what I needed. It's like having a receptionist and a web developer for $54/mo.", metric: "+$2,200/mo" },
  { initials: "CB", name: "Chris Brooks", role: "Brooks Detail Studio", quote: "Set it up on a Sunday afternoon. Had 3 online bookings by Monday morning. I've never looked back.", metric: "+$1,600/mo" },
  { initials: "TN", name: "Tony Nguyen", role: "Shine Pro Mobile", quote: "Automated review requests got me from 11 Google reviews to 94 in 4 months. My inbound calls literally doubled. Didn't have to do anything.", metric: "+$2,500/mo" },
];

const row1 = reviews.slice(0, 4);
const row2 = reviews.slice(4);

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

const StatCounter = ({ value, suffix, label }: { value: number; suffix: string; label: string }) => {
  const { count, ref } = useCountUp(value, 2000);
  return (
    <div ref={ref} className="flex flex-col items-center">
      <div
        className="font-mono text-4xl md:text-6xl font-black tabular-nums leading-none"
        style={{ color: 'hsl(0, 0%, 100%)', textShadow: '0 0 40px hsla(0, 0%, 100%, 0.3)' }}
      >
        {count}{suffix}
      </div>
      <p className="text-xs md:text-sm font-medium mt-2" style={{ color: 'hsla(0, 0%, 100%, 0.7)' }}>{label}</p>
    </div>
  );
};

const TestimonialSection = () => {
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
            className="font-heading text-[30px] md:text-[48px] lg:text-[56px] font-black tracking-[-0.015em] leading-[1.15] text-center mb-2"
            style={{ color: 'hsl(0, 0%, 100%)' }}
          >
            Real Shops.
          </h2>
          <h2
            className="font-heading text-[30px] md:text-[48px] lg:text-[56px] font-black tracking-[-0.015em] leading-[1.15] text-center mb-6"
            style={{ color: 'hsl(0, 0%, 100%)' }}
          >
            Real Revenue.
          </h2>
        </FadeIn>

        <FadeIn delay={100}>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0 mb-8">
            <StatCounter value={47} suffix="%" label="Fewer No-Shows" />
            <div className="hidden md:block w-px h-12 mx-8" style={{ background: 'hsla(0,0%,100%,0.2)' }} />
            <StatCounter value={2.4} suffix="M+" label="Bookings Captured" />
            <div className="hidden md:block w-px h-12 mx-8" style={{ background: 'hsla(0,0%,100%,0.2)' }} />
            <StatCounter value={200} suffix="+" label="Active Shops" />
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
