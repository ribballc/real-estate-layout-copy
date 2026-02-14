import FadeIn from "@/components/FadeIn";
import { useCountUp } from "@/hooks/useCountUp";

const TestimonialSection = () => {
  const { count: noShowCount, ref: statRef } = useCountUp(47, 2000);

  return (
    <section className="relative py-16 md:py-24 px-5 md:px-8 overflow-hidden" style={{
      background: 'linear-gradient(135deg, hsl(160 50% 8%) 0%, hsl(160 40% 14%) 100%)',
    }}>
      {/* Radial glow */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(circle at 50% 30%, hsla(82, 65%, 55%, 0.06), transparent 60%)',
      }} />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <FadeIn>
          <span className="text-brass text-xs font-serif italic tracking-wider inline-block mb-4">
            ✦ SUCCESS STORY ✦
          </span>
          <h2 className="font-heading text-[26px] md:text-[54px] font-bold tracking-[-0.02em] leading-[1.1] text-primary-foreground text-center mb-3">
            Real Detailers.{" "}
            <span className="font-serif italic text-[30px] md:text-[60px] text-accent">Real Results.</span>
          </h2>
        </FadeIn>

        <FadeIn delay={100}>
          <div className="mb-12" ref={statRef}>
            <div
              className="font-mono text-8xl md:text-[180px] font-bold text-accent tabular-nums leading-none"
              style={{ textShadow: '0 0 60px hsla(82, 65%, 55%, 0.3)' }}
            >
              {noShowCount}%
            </div>
            <p className="text-xl text-primary-foreground font-medium mt-3">fewer no-shows</p>
            <p className="text-sm text-primary-foreground/50 mt-1">on average across all shops</p>
          </div>
        </FadeIn>

        <FadeIn delay={200} rotateX={6}>
          <div className="rounded-[24px] p-8 md:p-12 text-left relative" style={{
            background: 'hsla(0, 0%, 100%, 0.08)',
            border: '1px solid hsla(0, 0%, 100%, 0.15)',
            backdropFilter: 'blur(20px)',
          }}>
            <p className="text-primary-foreground text-lg md:text-2xl leading-relaxed font-serif italic mb-8">
              <span className="text-accent text-4xl">"</span>
              I went from chasing texts to having a calendar that fills itself. Got my website in 2 days flat — it looks way better than what I was paying someone $150/month for. The deposit thing alone paid for the subscription in the first week.
              <span className="text-accent text-4xl">"</span>
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold min-h-[48px]"
                style={{
                  background: 'linear-gradient(135deg, hsl(82 65% 55%) 0%, hsl(82 55% 45%) 100%)',
                  color: 'hsl(160 50% 8%)',
                }}
              >
                MT
              </div>
              <div className="flex-1">
                <div className="font-bold text-primary-foreground text-lg">Marcus Thompson</div>
                <div className="text-sm text-primary-foreground/60">Dallas Mobile Detailing</div>
                <div className="text-sm font-bold text-accent">+$3,400/month increase</div>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 text-brass text-[10px] font-serif italic tracking-wider border border-brass/30 px-3 py-1 rounded-full">
                ✦ VELARRIO PRO MEMBER
              </span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default TestimonialSection;
