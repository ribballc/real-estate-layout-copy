import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Car, Truck, ArrowLeft, ArrowRight, CheckCircle2, ChevronDown, Check, Plus, X } from "lucide-react";
import BookingLayout from "@/components/BookingLayout";
import FadeIn from "@/components/FadeIn";
import StickyBookingCTA from "@/components/StickyBookingCTA";
import VehicleIllustration from "@/components/VehicleIllustration";
import { useBooking } from "@/contexts/BookingContext";
import { vehicleYears, vehicleMakes, getModelsForYear } from "@/data/vehicles";

const IMAGIN_CUSTOMERS = ["img", "javascript-masede"];
function buildImaginUrls(make: string, model: string, year: string): string[] {
  const m = encodeURIComponent(make);
  const md = encodeURIComponent(model).replace(/%20/g, "+");
  return IMAGIN_CUSTOMERS.map(
    (c) => `https://cdn.imagin.studio/getimage?customer=${c}&make=${m}&modelFamily=${md}&modelYear=${year}&angle=01&width=800`
  );
}

const BookVehicle = () => {
  const navigate = useNavigate();
  const { slug, vehicle, vehicles, setVehicle, addVehicle, removeVehicle, setVehicleImageUrl } = useBooking();
  const [year, setYear] = useState(vehicle?.year ?? "");
  const [make, setMake] = useState(vehicle?.make ?? "");
  const [model, setModel] = useState(vehicle?.model ?? "");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageStatus, setImageStatus] = useState<"idle" | "loading" | "success" | "failed">("idle");
  const attemptRef = useRef(0);

  const yearNum = year ? parseInt(year, 10) : 0;
  const availableModels = useMemo(
    () => (!make || !yearNum || isNaN(yearNum) ? [] : getModelsForYear(make, yearNum)),
    [make, yearNum]
  );
  const canContinue = !!(year && make && model);
  const canAddAnother = canContinue;

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
    if (!slug) return;
    const v = { year, make, model };
    const alreadyInList = vehicles.some((x) => x.year === v.year && x.make === v.make && x.model === v.model);
    if (vehicles.length > 0 && !alreadyInList) addVehicle(v);
    else if (vehicles.length === 0) setVehicle(v);
    setVehicleImageUrl(imageUrl);
    navigate(`/site/${slug}/book/options`);
  };

  const handleAddAnother = () => {
    if (!canAddAnother) return;
    addVehicle({ year, make, model });
    setYear("");
    setMake("");
    setModel("");
    setImageUrl(null);
    setImageStatus("idle");
  };

  const selStyle = (on: boolean): React.CSSProperties => ({
    width: "100%", padding: "12px 14px 12px 40px", borderRadius: 10, fontSize: 16, minHeight: 48,
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

      {/* Vehicle preview — real car image when available; fallback to illustration */}
      <FadeIn delay={100}>
        <div
          className="flex flex-col items-center justify-center rounded-2xl mb-6 overflow-hidden"
          style={{
            minHeight: canContinue ? 220 : 160,
            background: "white",
            border: "1px solid hsl(210,40%,90%)",
            boxShadow: "0 2px 12px hsla(0,0%,0%,0.06)",
            transition: "min-height 0.3s ease",
          }}
        >
          {canContinue ? (
            <div className="flex flex-col items-center w-full p-6" style={{ animation: "vehicleFadeScale 300ms ease-out forwards" }}>
              {imageStatus === "success" && imageUrl ? (
                <img
                  src={imageUrl}
                  alt={`${year} ${make} ${model}`}
                  className="w-full max-w-[420px] object-contain"
                  style={{ maxHeight: 180 }}
                />
              ) : imageStatus === "loading" ? (
                <div className="w-full max-w-[380px] h-[140px] rounded-xl flex items-center justify-center" style={{ background: "hsl(210,40%,96%)" }}>
                  <div className="w-8 h-8 rounded-full border-2 border-t-[hsl(217,91%,55%)] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                </div>
              ) : (
                <div className="w-full max-w-[380px]" style={{ maxHeight: 160 }}>
                  <VehicleIllustration className="w-full h-full object-contain" />
                </div>
              )}
              <span className="mt-3 px-4 py-1.5 rounded-full text-sm font-semibold" style={{ background: "hsl(217,91%,96%)", border: "1px solid hsl(217,91%,88%)", color: "hsl(222,47%,11%)" }}>
                {year} {make} {model}
              </span>
              <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: "hsl(142,71%,94%)", color: "hsl(142,71%,35%)" }}>
                <CheckCircle2 size={12} /> Selected
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center p-4">
              <VehicleIllustration className="w-full max-w-[240px] opacity-40" />
              <p className="text-sm mt-3 text-center" style={{ color: "hsl(215,16%,55%)", maxWidth: 220 }}>Select year, make, and model above</p>
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
            { icon: Truck, val: model, set: setModel, opts: availableModels, placeholder: make ? (availableModels.length === 0 ? "No models for this year" : "Model") : "Select make first", enabled: !!make },
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

          {/* Added vehicles list + Add another */}
          {vehicles.length > 0 && (
            <div className="space-y-2 pt-2" style={{ borderTop: "1px solid hsl(210,40%,92%)" }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "hsl(215,16%,55%)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Vehicles ({vehicles.length})</p>
              {vehicles.map((v, i) => (
                <div key={i} className="flex items-center justify-between gap-2 rounded-lg px-3 py-2" style={{ background: "hsl(210,40%,97%)", border: "1px solid hsl(210,40%,90%)" }}>
                  <span style={{ fontSize: 14, color: "hsl(222,47%,11%)" }}>🚗 {v.year} {v.make} {v.model}</span>
                  <button type="button" onClick={() => removeVehicle(i)} className="public-touch-target p-1.5 rounded-md" style={{ color: "hsl(215,16%,55%)" }} aria-label={`Remove ${v.year} ${v.make} ${v.model}`}>
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
          {canAddAnother && (
            <button type="button" onClick={handleAddAnother} className="public-touch-target w-full inline-flex items-center justify-center gap-2 font-medium min-h-[44px] rounded-lg border border-dashed" style={{ fontSize: 14, borderColor: "hsl(217,91%,75%)", color: "hsl(217,91%,45%)", background: "hsl(217,91%,98%)" }}>
              <Plus size={16} /> Add another vehicle
            </button>
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
