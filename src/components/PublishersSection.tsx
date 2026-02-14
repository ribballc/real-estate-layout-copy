import { useCountUp } from "@/hooks/useCountUp";

const CountStat = ({ end, suffix, label }: { end: number; suffix: string; label: string }) => {
  const { count, ref } = useCountUp(end, 2000);
  return (
    <div ref={ref} className="text-center">
      <div className="text-2xl md:text-3xl font-extrabold text-foreground">
        {suffix === "$" ? `$${count.toLocaleString()}M+` : suffix === "%" ? `${count}%` : suffix === "hrs" ? `${count}hrs` : `${count}+`}
      </div>
      <div className="text-xs md:text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );
};

const PublishersSection = () => {
  return (
    <section className="bg-background py-8 md:py-12 px-5 md:px-8 border-y border-border">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          <CountStat end={200} suffix="+" label="Active Shops" />
          <CountStat end={2} suffix="$" label="Revenue Booked" />
          <CountStat end={40} suffix="%" label="Fewer No-Shows" />
          <CountStat end={48} suffix="hrs" label="Site Goes Live" />
        </div>
      </div>
    </section>
  );
};

export default PublishersSection;
