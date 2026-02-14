import { useCountUp } from "@/hooks/useCountUp";
import FadeIn from "@/components/FadeIn";

const CountStat = ({ end, suffix, label }: { end: number; suffix: string; label: string }) => {
  const { count, ref } = useCountUp(end, 2000);
  return (
    <div ref={ref} className="text-center py-4">
      <div className="font-mono text-4xl md:text-6xl font-bold text-foreground tabular-nums tracking-tight">
        {suffix === "$" ? `$${count.toLocaleString()}M+` : suffix === "%" ? `${count}%` : suffix === "hrs" ? `${count}hrs` : `${count}+`}
      </div>
      <div className="text-[11px] md:text-xs text-muted-foreground mt-3 uppercase tracking-[0.1em] font-semibold">{label}</div>
    </div>
  );
};

const PublishersSection = () => {
  return (
    <section className="bg-background py-14 md:py-20 px-5 md:px-8" style={{ borderTop: '1px solid hsla(220, 6%, 10%, 0.08)', borderBottom: '1px solid hsla(220, 6%, 10%, 0.08)' }}>
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <p className="text-center text-brass text-xs font-serif italic tracking-wider mb-8">
            ✦ TRUSTED BY THE BEST ✦
          </p>
        </FadeIn>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0">
          {[
            { end: 200, suffix: "+", label: "Professionals Trust Velarrio" },
            { end: 2, suffix: "$", label: "In Bookings Captured" },
            { end: 40, suffix: "%", label: "Fewer No-Shows" },
            { end: 48, suffix: "hrs", label: "To Live Status" },
          ].map((stat, i) => (
            <div key={stat.label} className={`${i > 0 ? 'md:border-l md:border-border' : ''}`}>
              <CountStat {...stat} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PublishersSection;
