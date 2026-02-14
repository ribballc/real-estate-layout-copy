import { useCountUp } from "@/hooks/useCountUp";
import FadeIn from "@/components/FadeIn";

const CountStat = ({ end, suffix, label }: { end: number; suffix: string; label: string }) => {
  const { count, ref } = useCountUp(end, 2000);
  return (
    <div ref={ref} className="text-center py-4">
      <div className="font-serif italic text-3xl md:text-5xl font-bold text-foreground tabular-nums">
        {suffix === "$" ? `$${count.toLocaleString()}M+` : suffix === "%" ? `${count}%` : suffix === "hrs" ? `${count}hrs` : `${count}+`}
      </div>
      <div className="text-[11px] md:text-xs text-muted-foreground mt-2 uppercase tracking-[0.15em] font-medium">{label}</div>
    </div>
  );
};

const PublishersSection = () => {
  return (
    <section className="bg-background py-10 md:py-14 px-5 md:px-8 border-y border-border">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <p className="text-center text-brass text-xs font-serif italic tracking-wider mb-6">
            ✦ TRUSTED BY THE BEST ✦
          </p>
        </FadeIn>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          <CountStat end={200} suffix="+" label="Professionals Trust Velarrio" />
          <CountStat end={2} suffix="$" label="In Bookings Captured" />
          <CountStat end={40} suffix="%" label="Fewer No-Shows" />
          <CountStat end={48} suffix="hrs" label="To Live Status" />
        </div>
      </div>
    </section>
  );
};

export default PublishersSection;
