import FadeIn from "@/components/FadeIn";

const stats = [
  { value: "200+", label: "Active Shops" },
  { value: "$2.4M+", label: "Revenue Booked" },
  { value: "40%", label: "Fewer No-Shows" },
  { value: "48hrs", label: "Site Goes Live" },
];

const PublishersSection = () => {
  return (
    <section className="bg-background py-8 md:py-12 px-5 md:px-8 border-y border-border">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
          {stats.map((stat, i) => (
            <FadeIn key={stat.label} delay={i * 60}>
              <div className="text-2xl md:text-3xl font-extrabold text-foreground">{stat.value}</div>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PublishersSection;
