import FadeIn from "@/components/FadeIn";

const TestimonialSection = () => {
  return (
    <section className="bg-primary py-16 md:py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <h2 className="font-heading text-2xl md:text-4xl font-bold text-primary-foreground text-center mb-10 md:mb-12 leading-[1.15]">
            Detailers Are Booking More & Stressing Less
          </h2>
        </FadeIn>

        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Stat */}
          <div className="text-center md:text-left md:w-1/3">
            <div className="text-6xl md:text-7xl font-bold text-accent">47%</div>
            <p className="text-xl text-primary-foreground/80 mt-3">
              fewer no-shows on average
            </p>
          </div>

          {/* Quote */}
          <FadeIn className="md:w-2/3">
            <div className="bg-primary-foreground/10 backdrop-blur rounded-2xl p-8 md:p-10">
              <p className="text-primary-foreground/90 text-lg leading-relaxed italic mb-6">
                "I was losing 3-4 jobs a week to no-shows. Now clients book online, put down a deposit, and actually show up. Got my site in 2 days and it looks better than what I was paying someone $150/month for."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/30 flex items-center justify-center text-accent-foreground font-bold text-lg min-h-[48px]">
                  MC
                </div>
                <div>
                  <div className="font-bold text-primary-foreground">Marcus C.</div>
                  <div className="text-sm text-primary-foreground/60">Owner, Elite Mobile Detailing — Austin, TX</div>
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
