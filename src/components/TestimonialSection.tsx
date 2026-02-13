const TestimonialSection = () => {
  return (
    <section className="bg-primary py-20 md:py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground text-center mb-16">
          Brands Find Success With Realize
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Stat */}
          <div className="text-center md:text-left md:w-1/3">
            <div className="text-6xl md:text-7xl font-bold text-accent">+300%</div>
            <p className="text-xl text-primary-foreground/80 mt-3">
              Increase in new user growth
            </p>
          </div>

          {/* Quote */}
          <div className="md:w-2/3 bg-primary-foreground/10 backdrop-blur rounded-2xl p-8 md:p-10">
            <p className="text-primary-foreground/90 text-lg leading-relaxed italic mb-6">
              "Realize gave us another point of view in terms of the volume of content we create for our users. Instead of focusing solely on the conversion part of the funnel, we started seeing a bigger impact from users that already engage with our product."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/30 flex items-center justify-center text-accent-foreground font-bold text-lg">
                MK
              </div>
              <div>
                <div className="font-bold text-primary-foreground">Mary J. Kim</div>
                <div className="text-sm text-primary-foreground/60">Senior Online Marketing Manager</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
