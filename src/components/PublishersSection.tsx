import FadeIn from "@/components/FadeIn";

const stats = [
  { value: "200+", label: "Active Shops" },
  { value: "10,000+", label: "Bookings" },
  { value: "4.9★", label: "Rating" },
  { value: "48hr", label: "Setup" },
];

const PublishersSection = () => {
  return (
    <section className="bg-background py-10 md:py-14 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <FadeIn>
          <h3 className="font-heading text-2xl md:text-4xl font-bold text-foreground mb-10 md:mb-12 leading-[1.15]">
            Trusted by Shops Across the Country
          </h3>
        </FadeIn>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PublishersSection;
