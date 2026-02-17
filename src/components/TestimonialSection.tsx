import FadeIn from "@/components/FadeIn";
import { useCountUp } from "@/hooks/useCountUp";
import SectionPill from "@/components/SectionPill";
import { Star } from "lucide-react";

const reviews = [
  { initials: "MT", name: "Marcus Thompson", role: "Dallas Mobile Detailing", quote: "I went from chasing texts to having a calendar that fills itself. Got my website in 2 days flat — the deposit thing alone paid for the subscription in the first week.", metric: "+$3,400/mo" },
  { initials: "JR", name: "Jake Rivera", role: "Rivera's Auto Spa", quote: "No-shows used to cost me $600+ a week. Since adding deposits and SMS reminders, I've maybe had 2 cancellations in the last month.", metric: "+$2,800/mo" },
  { initials: "DW", name: "DeShawn Williams", role: "Pristine Detail Co.", quote: "My old website was embarrassing. Darker gave me something that looks like I paid $5K for it, and customers can actually book from it.", metric: "+$1,900/mo" },
  { initials: "KP", name: "Kyle Patterson", role: "KP Mobile Detail", quote: "I used to lose 2 hours a day just texting people back and forth. Now they book themselves and I just show up and work.", metric: "90 min saved/day" },
  { initials: "AM", name: "Andre Mitchell", role: "Gloss Boss Detailing", quote: "The route optimization alone is worth the Pro plan. I'm fitting in 2 extra jobs a day because I'm not driving all over the city.", metric: "+$4,100/mo" },
  { initials: "SL", name: "Sarah Langston", role: "Luxe Auto Care", quote: "Customers tell me all the time how professional my booking page looks. It's night and day from the old 'DM me to book' setup.", metric: "+$2,200/mo" },
  { initials: "CB", name: "Chris Brooks", role: "Brooks Detail Studio", quote: "I was skeptical about the 48-hour setup but they actually delivered. Had my first online booking before the weekend was over.", metric: "+$1,600/mo" },
  { initials: "TN", name: "Tony Nguyen", role: "Shine Pro Mobile", quote: "Big thanks to Darker for making my small operation look like a real business. The booking system is smooth and clients love it.", metric: "+$2,500/mo" },
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
          <SectionPill icon={<Star className="w-4 h-4" />} label="Testimonials" highlight="PROOF" />
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
