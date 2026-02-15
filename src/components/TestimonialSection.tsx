import FadeIn from "@/components/FadeIn";
import { useCountUp } from "@/hooks/useCountUp";

const TestimonialSection = () => {
  const { count: noShowCount, ref: statRef } = useCountUp(47, 2000);

  return (
    <section className="relative py-16 md:py-24 px-5 md:px-8 overflow-hidden" style={{
      background: 'linear-gradient(135deg, hsl(215 50% 10%) 0%, hsl(217 33% 17%) 100%)',
    }}>
      <div className="relative z-10 max-w-4xl mx-auto">
        <FadeIn>
          <h2 className="font-heading text-[28px] md:text-[48px] font-bold tracking-[-0.015em] leading-[1.2] text-primary-foreground text-center mb-8">
            Real Results
          </h2>
        </FadeIn>

        <FadeIn delay={100}>
          <div className="mb-12 text-center" ref={statRef}>
            <div
              className="font-mono text-8xl md:text-[160px] font-bold text-accent tabular-nums leading-none"
              style={{ textShadow: '0 0 40px hsla(217, 91%, 60%, 0.4)' }}
            >
              {noShowCount}%
            </div>
            <p className="text-xl text-primary-foreground font-medium mt-3">fewer no-shows on average</p>
          </div>
        </FadeIn>

        {/* Main testimonial */}
        <FadeIn delay={200}>
          <div className="rounded-2xl p-8 md:p-10 text-left relative mb-6" style={{
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

        {/* Additional testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FadeIn delay={300}>
            <div className="rounded-2xl p-6 md:p-8 text-left" style={{
              background: 'hsla(0, 0%, 100%, 0.05)',
              border: '1px solid hsla(0, 0%, 100%, 0.1)',
              backdropFilter: 'blur(20px)',
            }}>
              <p className="text-primary-foreground text-base md:text-lg leading-relaxed mb-6">
                <span className="text-accent text-3xl">"</span>
                No more no-shows. The reminders and deposits cut my cancellations by half. Made $8k extra last month.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-accent/20 text-accent">
                  JR
                </div>
                <div>
                  <div className="font-semibold text-primary-foreground">Jason Rodriguez</div>
                  <div className="text-xs text-primary-foreground/50">Austin, TX</div>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={400}>
            <div className="rounded-2xl p-6 md:p-8 text-left" style={{
              background: 'hsla(0, 0%, 100%, 0.05)',
              border: '1px solid hsla(0, 0%, 100%, 0.1)',
              backdropFilter: 'blur(20px)',
            }}>
              <p className="text-primary-foreground text-base md:text-lg leading-relaxed mb-6">
                <span className="text-accent text-3xl">"</span>
                Setup took 5 minutes. First booking came in while I was still detailing. This thing pays for itself.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-accent/20 text-accent">
                  MC
                </div>
                <div>
                  <div className="font-semibold text-primary-foreground">Mike Chen</div>
                  <div className="text-xs text-primary-foreground/50">Houston, TX</div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
