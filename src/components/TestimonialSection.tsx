import FadeIn from "@/components/FadeIn";

const TestimonialSection = () => {
  return (
    <section className="bg-muted py-16 md:py-24 px-5 md:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <FadeIn>
          <h2 className="font-heading text-[26px] md:text-[42px] font-bold tracking-[-0.015em] leading-[1.2] text-foreground text-center mb-10 md:mb-14">
            Real Detailers. <span className="font-serif italic text-[30px] md:text-[48px] text-accent">Real Results.</span>
          </h2>
        </FadeIn>

        <FadeIn delay={100}>
          <div className="mb-10">
            <div className="text-7xl md:text-8xl font-extrabold text-accent">47%</div>
            <p className="text-xl text-foreground font-medium mt-2">fewer no-shows</p>
            <p className="text-sm text-muted-foreground mt-1">on average across all shops</p>
          </div>
        </FadeIn>

        <FadeIn delay={200}>
          <div className="bg-background rounded-2xl p-6 md:p-10 mt-10 border border-border shadow-sm text-left">
            <p className="text-foreground text-lg leading-relaxed font-serif italic mb-6">
              "I was losing 3-4 jobs a week to no-shows. That's $600-800 a week just gone. Now clients book online, put down a deposit, and actually show up. Got my website in 2 days flat — it looks way better than what I was paying someone $150/month for. The deposit thing alone paid for the subscription in the first week."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center text-lg min-h-[48px]">
                MC
              </div>
              <div>
                <div className="font-bold text-foreground">Marcus C.</div>
                <div className="text-sm text-muted-foreground">Owner, Elite Mobile Detailing — Austin, TX</div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default TestimonialSection;
