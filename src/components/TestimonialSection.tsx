import FadeIn from "@/components/FadeIn";

const TestimonialSection = () => {
  return (
    <section className="bg-muted py-16 md:py-24 px-5 md:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <FadeIn>
          <span className="text-brass text-xs font-serif italic tracking-wider inline-block mb-4">
            ✦ SUCCESS STORY ✦
          </span>
          <h2 className="font-heading text-[26px] md:text-[42px] font-bold tracking-[-0.015em] leading-[1.2] text-foreground text-center mb-10 md:mb-14">
            Real Detailers. <span className="font-serif italic text-[30px] md:text-[48px] text-accent">Real Results.</span>
          </h2>
        </FadeIn>

        <FadeIn delay={100}>
          <div className="mb-10">
            <div className="text-7xl md:text-8xl font-serif italic font-bold text-accent tabular-nums">47%</div>
            <p className="text-xl text-foreground font-medium mt-2">fewer no-shows</p>
            <p className="text-sm text-muted-foreground mt-1">on average across all shops</p>
          </div>
        </FadeIn>

        <FadeIn delay={200} rotateX={6}>
          <div className="bg-background rounded-2xl p-6 md:p-10 mt-10 border border-border shadow-sm text-left hover:shadow-[0_24px_48px_rgba(0,0,0,0.08)] transition-all duration-500 relative">
            <p className="text-foreground text-lg md:text-xl leading-relaxed font-serif italic mb-6">
              "I went from chasing texts to having a calendar that fills itself. Got my website in 2 days flat — it looks way better than what I was paying someone $150/month for. The deposit thing alone paid for the subscription in the first week."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-lg min-h-[48px]">
                MT
              </div>
              <div className="flex-1">
                <div className="font-bold text-foreground">Marcus Thompson</div>
                <div className="text-sm text-muted-foreground">Dallas Mobile Detailing</div>
                <div className="text-sm font-semibold text-accent">+$3,400/month increase</div>
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
