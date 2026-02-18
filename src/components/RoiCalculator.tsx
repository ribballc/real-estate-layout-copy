import { useState, useMemo } from "react";
import FadeIn from "@/components/FadeIn";
import { useNavigate } from "react-router-dom";
import { Slider } from "@/components/ui/slider";

const RoiCalculator = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState(15);
  const [avgValue, setAvgValue] = useState(150);
  const [noshowRate, setNoshowRate] = useState(25);

  const results = useMemo(() => {
    const monthly = Math.round(bookings * avgValue * (noshowRate / 100) * 0.4);
    const timeSaved = Math.round(bookings * 0.25);
    const yearly = monthly * 12 - 64 * 12;
    const roi = Math.round(yearly / (64 * 12));
    return { monthly, timeSaved, yearly: Math.max(yearly, 0), roi: Math.max(roi, 0) };
  }, [bookings, avgValue, noshowRate]);

  return (
    <section
      className="relative py-16 md:py-24 px-5 md:px-10 overflow-hidden"
      style={{
        background: "hsl(215, 50%, 8%)",
        backgroundImage:
          "radial-gradient(circle at 20% 30%, hsla(217, 91%, 60%, 0.06) 0%, transparent 50%), radial-gradient(circle at 80% 70%, hsla(217, 91%, 70%, 0.06) 0%, transparent 50%)",
      }}
    >
      {/* Animated dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, hsla(213, 94%, 68%, 0.15) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.25,
          animation: "gridMove 40s linear infinite",
        }}
      />

      {/* Glow orbs behind calculator */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 450, height: 450, top: "10%", left: "5%",
          background: "radial-gradient(circle, hsla(217, 91%, 60%, 0.35), transparent)",
          filter: "blur(80px)", opacity: 0.1,
          animation: "orbFloat1 25s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 400, height: 400, bottom: "5%", right: "10%",
          background: "radial-gradient(circle, hsla(213, 94%, 68%, 0.3), transparent)",
          filter: "blur(80px)", opacity: 0.08,
          animation: "orbFloat2 30s ease-in-out infinite 5s",
        }}
      />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <FadeIn>
          <div className="text-center mb-12 md:mb-16">
            <h2
              className="font-heading text-[32px] md:text-[56px] lg:text-[72px] font-bold tracking-[-0.02em] leading-[1.2] mb-4"
              style={{
                background: "linear-gradient(135deg, hsl(0, 0%, 100%) 0%, hsla(0, 0%, 100%, 0.8) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              See Your Savings
            </h2>
            <p className="text-lg md:text-xl" style={{ color: "hsla(0, 0%, 100%, 0.6)" }}>
              Find out how much you're actually losing to missed calls
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={150}>
          <div className="grid grid-cols-1 md:grid-cols-[45%_55%] gap-10 md:gap-14 items-start">
            {/* Sliders */}
            <div
              className="rounded-3xl p-8 md:p-10"
              style={{
                background: "hsla(215, 50%, 12%, 0.6)",
                border: "1px solid hsla(0, 0%, 100%, 0.08)",
                backdropFilter: "blur(20px)",
              }}
            >
              {[
                { label: "Current bookings per month", value: bookings, display: `${bookings}`, min: 5, max: 50, step: 1, set: setBookings, minLabel: "5", maxLabel: "50" },
                { label: "Average booking value", value: avgValue, display: `$${avgValue}`, min: 50, max: 500, step: 10, set: setAvgValue, minLabel: "$50", maxLabel: "$500" },
                { label: "Current no-show rate", value: noshowRate, display: `${noshowRate}%`, min: 5, max: 50, step: 1, set: setNoshowRate, minLabel: "5%", maxLabel: "50%" },
              ].map((s, i) => (
                <div key={s.label} className={i < 2 ? "mb-10" : ""}>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm md:text-base font-medium" style={{ color: "hsla(0, 0%, 100%, 0.9)" }}>{s.label}</span>
                    <span className="text-lg md:text-xl font-semibold text-accent">{s.display}</span>
                  </div>
                  <Slider
                    value={[s.value]}
                    onValueChange={([v]) => s.set(v)}
                    min={s.min}
                    max={s.max}
                    step={s.step}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs" style={{ color: "hsla(0, 0%, 100%, 0.4)" }}>
                    <span>{s.minLabel}</span>
                    <span>{s.maxLabel}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Results */}
            <div className="flex flex-col gap-5">
              {/* Monthly */}
              <div
                className="rounded-2xl p-7"
                style={{
                  background: "hsla(215, 50%, 12%, 0.6)",
                  border: "1px solid hsla(0, 0%, 100%, 0.08)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div className="text-2xl mb-2">💰</div>
                <div className="text-xs uppercase tracking-wider mb-2" style={{ color: "hsla(0, 0%, 100%, 0.6)" }}>Monthly Revenue Recovered</div>
                <div className="font-mono text-3xl md:text-4xl font-bold text-primary-foreground">${results.monthly.toLocaleString()}</div>
                <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: "hsla(0, 0%, 100%, 0.1)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min((results.monthly / 2000) * 100, 100)}%`,
                      background: "linear-gradient(90deg, hsl(217, 91%, 60%), hsl(213, 94%, 68%))",
                      boxShadow: "0 0 12px hsla(217, 91%, 60%, 0.6)",
                    }}
                  />
                </div>
              </div>

              {/* Time */}
              <div
                className="rounded-2xl p-7"
                style={{
                  background: "hsla(215, 50%, 12%, 0.6)",
                  border: "1px solid hsla(0, 0%, 100%, 0.08)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div className="text-2xl mb-2">⏱️</div>
                <div className="text-xs uppercase tracking-wider mb-2" style={{ color: "hsla(0, 0%, 100%, 0.6)" }}>Time Saved Per Month</div>
                <div className="font-mono text-3xl md:text-4xl font-bold text-primary-foreground">{results.timeSaved} hours</div>
                <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: "hsla(0, 0%, 100%, 0.1)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min((results.timeSaved / 20) * 100, 100)}%`,
                      background: "linear-gradient(90deg, hsl(217, 91%, 60%), hsl(213, 94%, 68%))",
                      boxShadow: "0 0 12px hsla(217, 91%, 60%, 0.6)",
                    }}
                  />
                </div>
              </div>

              {/* Yearly */}
              <div
                className="rounded-2xl p-8 relative overflow-hidden"
                style={{
                  background: "hsla(217, 91%, 60%, 0.05)",
                  border: "2px solid hsla(217, 91%, 60%, 0.3)",
                }}
              >
                <div
                  className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] pointer-events-none"
                  style={{
                    background: "radial-gradient(circle at center, hsla(217, 91%, 60%, 0.1) 0%, transparent 70%)",
                    animation: "orbFloat1 8s linear infinite",
                  }}
                />
                <div className="relative z-10">
                  <div className="text-2xl mb-2">🚀</div>
                  <div className="text-xs uppercase tracking-wider mb-2" style={{ color: "hsla(0, 0%, 100%, 0.6)" }}>First Year Value</div>
                  <div
                    className="font-mono text-4xl md:text-5xl font-bold mb-3"
                    style={{
                      background: "linear-gradient(135deg, hsl(0, 0%, 100%), hsl(213, 94%, 68%))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    ${results.yearly.toLocaleString()}
                  </div>
                  {results.roi > 0 && (
                    <span
                      className="inline-block px-5 py-2 rounded-xl text-sm font-semibold"
                      style={{
                        background: "hsla(160, 84%, 39%, 0.15)",
                        border: "1px solid hsla(160, 84%, 39%, 0.4)",
                        color: "hsl(160, 84%, 39%)",
                      }}
                    >
                      {results.roi}x ROI
                    </span>
                  )}
                </div>
              </div>

              {/* CTA */}
              {results.yearly > 1000 && (
                <button
                  onClick={() => navigate('/signup')}
                  className="w-full py-4 text-lg font-semibold rounded-xl text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 min-h-[48px]"
                  style={{
                    background: "linear-gradient(135deg, hsl(217, 91%, 60%), hsl(217, 91%, 50%))",
                    boxShadow: "0 4px 20px hsla(217, 91%, 60%, 0.3)",
                  }}
                >
                  Start My Free Trial →
                </button>
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default RoiCalculator;
