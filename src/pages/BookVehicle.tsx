import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Calendar, Car, Truck, ArrowLeft, ArrowRight, CheckCircle2, ChevronDown, Check } from "lucide-react";
import BookingLayout from "@/components/BookingLayout";
import FadeIn from "@/components/FadeIn";
import StickyBookingCTA from "@/components/StickyBookingCTA";
import { useBooking } from "@/contexts/BookingContext";
import { vehicleYears, vehicleMakes, vehicleModels } from "@/data/vehicles";

/* ── Ghost car SVG placeholder ── */
const GhostCar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 400 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M40 120 C40 120 50 60 120 50 C160 44 200 40 240 44 C300 50 340 70 360 90 L380 100 C390 104 390 116 380 118 L360 120 L340 120 C340 106 328 94 314 94 C300 94 288 106 288 120 L140 120 C140 106 128 94 114 94 C100 94 88 106 88 120 Z" fill="hsl(210,40%,85%)" />
    <circle cx="114" cy="120" r="18" fill="hsl(210,40%,85%)" />
    <circle cx="114" cy="120" r="10" fill="hsl(210,40%,97%)" />
    <circle cx="314" cy="120" r="18" fill="hsl(210,40%,85%)" />
    <circle cx="314" cy="120" r="10" fill="hsl(210,40%,97%)" />
  </svg>
);

/* ── Imagin Studio URL builder with multiple fallback keys ── */
const IMAGIN_CUSTOMERS = [
  "hrjavascript-masede",
  "img",
  "javascript-masede",
];

function buildImaginUrls(make: string, model: string, year: string): string[] {
  const m = encodeURIComponent(make);
  const md = encodeURIComponent(model).replace(/%20/g, "+");
  return IMAGIN_CUSTOMERS.map(
    (c) => `https://cdn.imagin.studio/getimage?customer=${c}&make=${m}&modelFamily=${md}&modelYear=${year}&angle=01&width=800`
  );
}

const BookVehicle = () => {
  const navigate = useNavigate();
  const { slug, service, vehicle, setVehicle } = useBooking();
  const [year, setYear] = useState(vehicle?.year ?? "");
  const [make, setMake] = useState(vehicle?.make ?? "");
  const [model, setModel] = useState(vehicle?.model ?? "");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageStatus, setImageStatus] = useState<"idle" | "loading" | "success" | "failed">("idle");
  const attemptRef = useRef(0);

  const availableModels = useMemo(() => (!make ? [] : vehicleModels[make] || []), [make]);
  const canContinue = !!(year && make && model);

  // Try loading vehicle images with multiple fallback customer keys
  useEffect(() => {
    if (!year || !make || !model) {
      setImageUrl(null);
      setImageStatus("idle");
      return;
    }

    setImageStatus("loading");
    setImageUrl(null);
    const currentAttempt = ++attemptRef.current;
    const urls = buildImaginUrls(make, model, year);
    let idx = 0;

    const tryNext = () => {
      if (idx >= urls.length || currentAttempt !== attemptRef.current) {
        if (currentAttempt === attemptRef.current) setImageStatus("failed");
        return;
      }
      const url = urls[idx++];
      const img = new Image();
      img.onload = () => {
        if (currentAttempt !== attemptRef.current) return;
        // Accept any image that isn't a 1x1 placeholder
        if (img.naturalWidth < 50) { tryNext(); return; }
        setImageUrl(url);
        setImageStatus("success");
      };
      img.onerror = () => {
        if (currentAttempt !== attemptRef.current) return;
        tryNext();
      };
      img.src = url;
    };
    tryNext();
  }, [year, make, model]);

  const handleContinue = () => {
    setVehicle({ year, make, model });
    navigate(`/site/${slug}/book/options`);
  };

  const selStyle = (on: boolean): React.CSSProperties => ({
    width: "100%", padding: "12px 14px 12px 40px", borderRadius: 10, fontSize: 14, minHeight: 48,
    appearance: "none" as const, outline: "none", transition: "border-color 0.15s",
    background: on ? "white" : "hsl(210,40%,96%)",
    border: `1px solid ${on ? "hsl(210,40%,86%)" : "hsl(210,40%,90%)"}`,
    color: on ? "hsl(222,47%,11%)" : "hsl(215,16%,60%)",
    cursor: on ? "pointer" : "not-allowed", opacity: on ? 1 : 0.55,
  });

  return (
    <BookingLayout activeStep={1}>
      <style>{`
        @keyframes vehicleFadeScale { from{opacity:0;transform:scale(.97)} to{opacity:1;transform:scale(1)} }
      `}</style>

      <FadeIn delay={40}>
        <h1 className="font-heading font-bold tracking-[-0.01em] leading-[1.2] mb-1" style={{ fontSize: 22, color: "hsl(222,47%,11%)" }}>
          What's your vehicle?
        </h1>
        <p style={{ fontSize: 14, color: "hsl(215,16%,55%)", marginBottom: 20 }}>
          We'll tailor the service to your car
        </p>
      </FadeIn>

      {/* Vehicle preview — full width above selects on desktop too */}
      <FadeIn delay={100}>
        <div
          className="flex flex-col items-center justify-center rounded-2xl mb-6"
          style={{
            minHeight: canContinue ? 240 : 160,
            background: "white",
            border: "1px solid hsl(210,40%,90%)",
            boxShadow: "0 2px 12px hsla(0,0%,0%,0.06)",
            transition: "min-height 0.3s ease",
          }}
        >
          {canContinue && imageStatus === "success" && imageUrl ? (
            <div className="flex flex-col items-center w-full p-6" style={{ animation: "vehicleFadeScale 300ms ease-out forwards" }}>
              <img
                src={imageUrl}
                alt={`${year} ${make} ${model}`}
                className="w-full max-w-[420px] object-contain"
                style={{ maxHeight: 200 }}
              />
              <span className="mt-3 px-4 py-1.5 rounded-full text-sm font-semibold" style={{ background: "hsl(217,91%,96%)", border: "1px solid hsl(217,91%,88%)", color: "hsl(222,47%,11%)" }}>
                {year} {make} {model}
              </span>
            </div>
          ) : canContinue ? (
            <div className="flex flex-col items-center p-6" style={{ animation: "vehicleFadeScale 300ms ease-out forwards" }}>
              {imageStatus === "loading" ? (
                <div className="w-full max-w-[260px] h-[120px] rounded-xl animate-pulse" style={{ background: "hsl(210,40%,92%)" }} />
              ) : (
                <GhostCar className="w-full max-w-[260px] opacity-30" />
              )}
              <p className="text-sm font-semibold mt-3" style={{ color: "hsl(222,47%,11%)" }}>{year} {make} {model}</p>
              <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: "hsl(142,71%,94%)", color: "hsl(142,71%,35%)" }}>
                <CheckCircle2 size={12} /> Selected
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center p-4">
              <GhostCar className="w-full max-w-[220px] opacity-12" />
              <p className="text-xs mt-3 text-center" style={{ color: "hsl(215,16%,60%)", maxWidth: 200 }}>Select your vehicle above</p>
            </div>
          )}
        </div>
      </FadeIn>

      {/* Selects — full width, stacked */}
      <FadeIn delay={60}>
        <div className="w-full max-w-[480px] space-y-3">
          {[
            { icon: Calendar, val: year, set: (v: string) => { setYear(v); setMake(""); setModel(""); }, opts: vehicleYears, placeholder: "Year", enabled: true },
            { icon: Car, val: make, set: (v: string) => { setMake(v); setModel(""); }, opts: vehicleMakes, placeholder: year ? "Make" : "Select year first", enabled: !!year },
            { icon: Truck, val: model, set: setModel, opts: availableModels, placeholder: make ? "Model" : "Select make first", enabled: !!make },
          ].map(({ icon: Ic, val, set, opts, placeholder, enabled }, idx) => (
            <div key={idx} className="relative">
              <Ic size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "hsl(215,16%,60%)", pointerEvents: "none", zIndex: 1 }} />
              {val && <Check size={14} style={{ position: "absolute", right: 36, top: "50%", transform: "translateY(-50%)", color: "hsl(142,71%,35%)", pointerEvents: "none" }} />}
              <ChevronDown size={14} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "hsl(215,16%,60%)", pointerEvents: "none" }} />
              <select value={val} onChange={(e) => set(e.target.value)} disabled={!enabled} style={selStyle(enabled)}>
                <option value="">{placeholder}</option>
                {opts.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}

          {canContinue && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-sm font-medium animate-in fade-in duration-300" style={{ background: "hsl(142,71%,94%)", border: "1px solid hsl(142,71%,80%)", color: "hsl(142,71%,30%)" }}>
              <CheckCircle2 size={14} /> Ready to continue
            </div>
          )}

          <p style={{ fontSize: 13, color: "hsl(215,16%,55%)", paddingTop: 4 }}>
            Can't find your vehicle? <a href="mailto:hello@darkerdigital.com" className="hover:underline" style={{ color: "hsl(217,91%,50%)" }}>Contact us</a>
          </p>
        </div>
      </FadeIn>

      {/* CTA */}
      <StickyBookingCTA>
        <div className="flex items-center gap-3">
          <button onClick={() => slug && navigate(`/site/${slug}/book`)} className="public-touch-target inline-flex items-center gap-2 font-semibold min-w-[44px]" style={{ height: 50, padding: "0 20px", borderRadius: 12, fontSize: 14, border: "1px solid hsl(210,40%,90%)", color: "hsl(222,47%,11%)", background: "white" }}>
            <ArrowLeft size={15} /> Back
          </button>
          <button onClick={handleContinue} disabled={!canContinue} className="public-touch-target flex-1 md:flex-none inline-flex items-center justify-center gap-2 font-bold min-h-[44px]" style={{
            height: 50, borderRadius: 12, fontSize: 15, padding: "0 24px",
            ...(canContinue
              ? { background: "linear-gradient(135deg, hsl(217,91%,55%), hsl(224,91%,48%))", color: "white", boxShadow: "0 4px 16px hsla(217,91%,55%,0.35)" }
              : { background: "hsl(210,40%,92%)", color: "hsl(215,16%,60%)", cursor: "not-allowed", opacity: 0.45 }),
          }}>
            Continue <ArrowRight size={15} />
          </button>
        </div>
      </StickyBookingCTA>
    </BookingLayout>
  );
};

export default BookVehicle;
