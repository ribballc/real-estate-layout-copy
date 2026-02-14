import FadeIn from "@/components/FadeIn";

const TestimonialSection = () => {
  return (
    <section className="bg-background py-16 md:py-24 px-5 md:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <FadeIn>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-foreground mb-10 md:mb-12">
            Detailers Booking More, Stressing Less
          </h2>
        </FadeIn>

        <div className="mb-10">
          <div className="text-6xl font-extrabold text-accent">47%</div>
          <p className="text-lg text-muted-foreground mt-2">fewer no-shows on average</p>
        </div>

        <FadeIn>
          <div className="bg-secondary rounded-2xl p-8 md:p-10 border border-border text-left">
            <p className="text-foreground text-lg leading-relaxed italic mb-6">
              "I was losing 3-4 appointments a week to no-shows. Now clients book online, put a deposit down, and actually show up. Got my site in 2 days — it looks way better than what I was paying someone else $150/month for."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-lg min-h-[48px]">
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
