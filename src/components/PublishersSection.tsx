import FadeIn from "@/components/FadeIn";

const stats = [
  { value: "200+", label: "Active shops" },
  { value: "10,000+", label: "Bookings processed" },
  { value: "4.9 ★", label: "Average rating" },
  { value: "48hrs", label: "Average setup" },
];

const PublishersSection = () => {
  return (
    <section className="bg-secondary py-8 md:py-10 px-5 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, i) => (
            <FadeIn key={stat.label} delay={i * 80}>
              <div className="text-2xl md:text-3xl font-extrabold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PublishersSection;
