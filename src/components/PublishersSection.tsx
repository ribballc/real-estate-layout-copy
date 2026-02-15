import { useCountUp } from "@/hooks/useCountUp";
import FadeIn from "@/components/FadeIn";

const CountStat = ({ end, suffix, label }: { end: number; suffix: string; label: string }) => {
  const { count, ref } = useCountUp(end, 2000);
  return (
    <div ref={ref} className="text-center py-4">
      <div className="font-mono text-4xl md:text-[64px] font-bold text-foreground tabular-nums tracking-tight leading-none">
        {suffix === "$" ? `$${count.toLocaleString()}M+` : suffix === "%" ? `${count}%` : suffix === "hrs" ? `${count}hrs` : `${count}+`}
      </div>
      <div className="text-[13px] text-muted-foreground mt-3 uppercase tracking-[0.08em] font-medium">{label}</div>
    </div>
  );
};

const PublishersSection = () => {
  return (
    <section className="bg-card py-8 md:py-10 px-5 md:px-8" style={{ borderTop: '1px solid hsl(214 20% 90%)', borderBottom: '1px solid hsl(214 20% 90%)' }}>
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-2 gap-4 md:gap-0">
          {[
            { end: 200, suffix: "+", label: "Shops Trust Darker" },
            { end: 2, suffix: "$", label: "In Bookings Captured" },
          ].map((stat, i) => (
            <FadeIn key={stat.label} delay={i * 100}>
              <div className={`${i > 0 ? 'md:border-l md:border-border' : ''}`}>
                <CountStat {...stat} />
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PublishersSection;
