import { useCountUp } from "@/hooks/useCountUp";
import FadeIn from "@/components/FadeIn";

const CountStat = ({ end, suffix, label }: { end: number; suffix: string; label: string }) => {
  const { count, ref } = useCountUp(end, 2000);
  return (
    <div ref={ref} className="text-center py-4">
      <div className="font-mono text-4xl md:text-[64px] font-bold tabular-nums tracking-tight leading-none" style={{ color: 'hsl(0, 0%, 100%)' }}>
        {suffix === "$" ? `$${count.toLocaleString()}M+` : suffix === "%" ? `${count}%` : suffix === "hrs" ? `${count}hrs` : `${count}+`}
      </div>
      <div className="text-[13px] mt-3 uppercase tracking-[0.08em] font-medium" style={{ color: 'hsla(0, 0%, 100%, 0.45)' }}>{label}</div>
    </div>
  );
};

const PublishersSection = () => {
  return (
    <section
      className="relative py-8 md:py-10 px-5 md:px-8 overflow-hidden"
      style={{
        background: 'hsl(215, 50%, 8%)',
        borderTop: '1px solid hsla(217, 91%, 60%, 0.08)',
        borderBottom: '1px solid hsla(217, 91%, 60%, 0.08)',
      }}
    >
      {/* Subtle center glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 50% 100% at 50% 50%, hsla(217, 91%, 60%, 0.04) 0%, transparent 70%)',
      }} />

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="grid grid-cols-2 gap-4 md:gap-0">
          {[
            { end: 200, suffix: "+", label: "Shops Trust Darker" },
            { end: 2, suffix: "$", label: "In Bookings Captured" },
          ].map((stat, i) => (
            <FadeIn key={stat.label} delay={i * 100}>
              <div className={`${i > 0 ? 'md:border-l' : ''}`} style={i > 0 ? { borderColor: 'hsla(0, 0%, 100%, 0.1)' } : {}}>
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
