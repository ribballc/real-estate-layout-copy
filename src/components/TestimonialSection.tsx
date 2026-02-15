import FadeIn from "@/components/FadeIn";
import { useCountUp } from "@/hooks/useCountUp";

const TestimonialSection = () => {
  const { count: noShowCount, ref: statRef } = useCountUp(47, 2000);

  return (
    <section className="relative py-16 md:py-24 px-5 md:px-8 overflow-hidden" style={{
      background: 'linear-gradient(135deg, hsl(215 50% 10%) 0%, hsl(217 33% 17%) 100%)',
    }}>
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <FadeIn>
          <h2 className="font-heading text-[28px] md:text-[56px] lg:text-[72px] font-bold tracking-[-0.015em] leading-[1.2] text-primary-foreground text-center mb-8">
            Real Results
          </h2>
        </FadeIn>

        <FadeIn delay={100}>
          <div className="mb-12" ref={statRef}>
            <div
              className="font-mono text-8xl md:text-[160px] font-bold text-accent tabular-nums leading-none"
              style={{ textShadow: '0 0 40px hsla(217, 91%, 60%, 0.4)' }}
            >
              {noShowCount}%
            </div>
            <p className="text-xl text-primary-foreground font-medium mt-3">fewer no-shows on average</p>
          </div>
        </FadeIn>

        <FadeIn delay={200}>
          <div className="rounded-2xl p-8 md:p-10 text-left relative" style={{
            background: 'hsla(0, 0%, 100%, 0.05)',
            border: '1px solid hsla(0, 0%, 100%, 0.1)',
            backdropFilter: 'blur(20px)',
          }}>
            <p className="text-primary-foreground text-lg md:text-xl leading-relaxed mb-8">
              <span className="text-accent text-4xl">"</span>
              I went from chasing texts to having a calendar that fills itself. Got my website in 2 days flat — it looks way better than what I was paying someone $150/month for. The deposit thing alone paid for the subscription in the first week.
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold min-h-[48px] bg-accent text-accent-foreground">
                MT
              </div>
              <div className="flex-1">
                <div className="font-semibold text-primary-foreground text-lg">Marcus Thompson</div>
                <div className="text-sm text-primary-foreground/60">Dallas Mobile Detailing</div>
                <div className="text-sm font-bold text-accent">+$3,400/month increase</div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default TestimonialSection;
