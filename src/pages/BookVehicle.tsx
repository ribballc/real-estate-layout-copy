import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { Calendar, Car, Truck, ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, ChevronDown, Check } from "lucide-react";
import BookingLayout from "@/components/BookingLayout";
import FadeIn from "@/components/FadeIn";
import { vehicleYears, vehicleMakes, vehicleModels } from "@/data/vehicles";

/* ─── ghost car SVG ─── */
const GhostCar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 400 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M40 120 C40 120 50 60 120 50 C160 44 200 40 240 44 C300 50 340 70 360 90 L380 100 C390 104 390 116 380 118 L360 120 L340 120 C340 106 328 94 314 94 C300 94 288 106 288 120 L140 120 C140 106 128 94 114 94 C100 94 88 106 88 120 Z"
      fill="currentColor" className="text-muted-foreground"
    />
    <circle cx="114" cy="120" r="18" fill="currentColor" className="text-muted-foreground" />
    <circle cx="114" cy="120" r="10" fill="hsl(210 40% 98%)" />
    <circle cx="314" cy="120" r="18" fill="currentColor" className="text-muted-foreground" />
    <circle cx="314" cy="120" r="10" fill="hsl(210 40% 98%)" />
  </svg>
);

const BookVehicle = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("service") || "";
  const serviceName = searchParams.get("name") || "";
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const imageKey = useRef(0);

  const availableModels = useMemo(() => {
    if (!make) return [];
    return vehicleModels[make] || [];
  }, [make]);

  const canContinue = !!(year && make && model);

  const carImageUrl = useMemo(() => {
    if (!year || !make || !model) return null;
    const encodedModel = model.replace(/\s+/g, "+");
    return `https://cdn.imagin.studio/getimage?customer=hrjavascript-masede&make=${encodeURIComponent(make)}&modelFamily=${encodedModel}&modelYear=${year}&angle=01`;
  }, [year, make, model]);

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
    setShowImage(false);
    imageKey.current += 1;
  }, [year, make, model]);

  const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        if (r > 150 && g < 100 && b < 100) {
          setImageError(true);
          return;
        }
      }
    } catch { /* CORS */ }
    setImageLoaded(true);
    // trigger fade+scale animation
    requestAnimationFrame(() => setShowImage(true));
  }, []);

  const handleMakeChange = (val: string) => {
    setMake(val);
    setModel("");
  };

  const handleYearChange = (val: string) => {
    setYear(val);
    setMake("");
    setModel("");
  };

  const handleContinue = () => {
    sessionStorage.setItem("booking_vehicle", JSON.stringify({ year, make, model }));
    navigate(`/site/${slug}/book/options?service=${serviceId}&name=${encodeURIComponent(serviceName)}`);
  };

  /* ─── Custom select styling ─── */
  const selectWrapperClass = "relative group";
  const selectClass = (enabled: boolean) =>
    `w-full px-4 py-3.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all appearance-none min-h-[52px] pl-11 pr-10 ${
      enabled
        ? "border-border bg-card text-foreground focus:ring-accent cursor-pointer"
        : "border-border/50 bg-muted/50 text-muted-foreground cursor-not-allowed opacity-60"
    }`;
  const chevronClass = "absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none";
  const checkClass = "absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none";

  /* ─── Vehicle preview panel ─── */
  const vehiclePreview = (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[280px] md:min-h-[360px] relative">
      {/* Hidden preload img */}
      {carImageUrl && !imageError && !imageLoaded && (
        <img
          key={imageKey.current}
          src={carImageUrl}
          alt=""
          crossOrigin="anonymous"
          onLoad={handleImageLoad}
          onError={() => setImageError(true)}
          className="hidden"
        />
      )}

      {canContinue && imageLoaded && !imageError && showImage ? (
        <div className="flex flex-col items-center w-full">
          {/* Main car image with fade+scale */}
          <div className="relative w-full max-w-[440px]">
            <img
              src={carImageUrl!}
              alt={`${year} ${make} ${model}`}
              className="w-full object-contain relative z-10 transition-all duration-300"
              style={{
                animation: "vehicleFadeScale 300ms ease-out forwards",
              }}
            />
            {/* Gradient floor */}
            <div
              className="absolute bottom-0 left-0 right-0 h-16 z-0 rounded-b-xl"
              style={{
                background: "linear-gradient(to top, hsla(215,50%,8%,0.12), transparent)",
              }}
            />
            {/* Reflection */}
            <img
              src={carImageUrl!}
              alt=""
              aria-hidden
              className="w-full object-contain pointer-events-none select-none"
              style={{
                transform: "scaleY(-1)",
                opacity: 0.12,
                filter: "blur(4px)",
                maskImage: "linear-gradient(to top, transparent 30%, black 100%)",
                WebkitMaskImage: "linear-gradient(to top, transparent 30%, black 100%)",
                marginTop: "-8px",
              }}
            />
          </div>
          {/* Pill badge */}
          <span className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-sm font-semibold text-foreground">
            {year} {make} {model}
          </span>
        </div>
      ) : canContinue && (imageError || !imageLoaded) ? (
        /* Fallback: silhouette + info */
        <div className="flex flex-col items-center w-full" style={{ animation: "vehicleFadeScale 300ms ease-out forwards" }}>
          <GhostCar className="w-full max-w-[320px] opacity-30" />
          <p className="text-lg font-semibold text-foreground mt-4">{year} {make} {model}</p>
          <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Vehicle selected
          </span>
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center">
          <GhostCar className="w-full max-w-[280px] opacity-15" />
          <p className="text-sm text-muted-foreground mt-4 text-center max-w-[240px] leading-relaxed">
            Select your vehicle above
          </p>
        </div>
      )}
    </div>
  );

  return (
    <BookingLayout activeStep={1}>
      {/* Keyframes for vehicle animation */}
      <style>{`
        @keyframes vehicleFadeScale {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulseOnce {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
      `}</style>

      <FadeIn delay={50}>
        <h1 className="font-heading text-[28px] md:text-[40px] font-bold tracking-[-0.015em] leading-[1.2] text-foreground mb-6 md:mb-8">
          Find your vehicle
        </h1>
      </FadeIn>

      {/* Mobile: preview first, then selectors */}
      <div className="flex flex-col md:flex-row gap-6 lg:gap-12">
        {/* Preview — shown first on mobile, second on desktop */}
        <FadeIn delay={150} className="order-first md:order-last flex-1">
          {vehiclePreview}
        </FadeIn>

        {/* Selectors */}
        <FadeIn delay={100} className="order-last md:order-first">
          <div className="w-full md:w-[340px] space-y-4">
            {/* Year */}
            <div className={selectWrapperClass}>
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
              {year && <Check className={`${checkClass} text-accent`} />}
              <ChevronDown className={chevronClass} />
              <select value={year} onChange={(e) => handleYearChange(e.target.value)} className={selectClass(true)}>
                <option value="">Year</option>
                {vehicleYears.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            {/* Make */}
            <div className={selectWrapperClass}>
              <Car className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
              {make && <Check className={`${checkClass} text-accent`} />}
              <ChevronDown className={chevronClass} />
              <select value={make} onChange={(e) => handleMakeChange(e.target.value)} disabled={!year} className={selectClass(!!year)}>
                <option value="">{year ? "Make" : "Select year first"}</option>
                {vehicleMakes.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            {/* Model */}
            <div className={selectWrapperClass}>
              <Truck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
              {model && <Check className={`${checkClass} text-accent`} />}
              <ChevronDown className={chevronClass} />
              <select value={model} onChange={(e) => setModel(e.target.value)} disabled={!make} className={selectClass(!!make)}>
                <option value="">{make ? "Model" : "Select make first"}</option>
                {availableModels.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            {/* Green confirmation row */}
            {canContinue && (
              <div
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium animate-in fade-in duration-300"
                style={{
                  background: "hsla(160, 84%, 39%, 0.08)",
                  borderColor: "hsla(160, 84%, 39%, 0.25)",
                  color: "hsl(160, 84%, 39%)",
                }}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="flex-1">Looks great — continue</span>
                <ChevronRight className="w-4 h-4 shrink-0" style={{ animation: "pulseOnce 0.6s ease-out 0.3s 1" }} />
              </div>
            )}

            {/* Can't find link */}
            <p className="text-sm text-muted-foreground pt-1">
              Can't find your vehicle?{" "}
              <a href="mailto:hello@darkerdigital.com" className="text-accent hover:underline">Contact us</a>
            </p>
          </div>
        </FadeIn>
      </div>

      {/* Sticky bottom bar on mobile, inline on desktop */}
      <div className="fixed md:relative bottom-0 left-0 right-0 md:bottom-auto md:left-auto md:right-auto z-30 md:z-auto bg-background/80 backdrop-blur-lg md:backdrop-blur-none md:bg-transparent border-t border-border md:border-none px-4 py-3 md:p-0 md:mt-6">
        <div className="flex items-center gap-3 max-w-screen-lg mx-auto md:mx-0">
          <button
            onClick={() => navigate(`/site/${slug}/book`)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-border text-foreground hover:bg-muted transition-colors min-h-[48px]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className={`flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold min-h-[48px] transition-all ${
              canContinue
                ? "bg-accent text-accent-foreground hover:brightness-105 shadow-lg shadow-accent/20"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      {/* Spacer for fixed bottom bar on mobile */}
      <div className="h-20 md:h-0" />
    </BookingLayout>
  );
};

export default BookVehicle;
