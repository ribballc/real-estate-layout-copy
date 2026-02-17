import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { Calendar, Car, Truck, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import BookingLayout from "@/components/BookingLayout";
import FadeIn from "@/components/FadeIn";
import { vehicleYears, vehicleMakes, vehicleModels } from "@/data/vehicles";

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
    } catch {
      // CORS or canvas error — still show the image
    }
    setImageLoaded(true);
  }, []);

  const handleMakeChange = (val: string) => {
    setMake(val);
    setModel("");
  };

  const selectClass =
    "w-full px-4 py-3.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all appearance-none min-h-[48px] pl-11";

  return (
    <BookingLayout activeStep={1}>
      {/* Section heading */}
      <FadeIn delay={50}>
        <h1 className="font-heading text-[28px] md:text-[40px] font-bold tracking-[-0.015em] leading-[1.2] text-foreground mb-8 md:mb-10">
          Find your vehicle
        </h1>
      </FadeIn>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* Left — dropdowns */}
        <FadeIn delay={100}>
          <div className="w-full md:w-[340px] space-y-4">
            {/* Year */}
            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className={selectClass}
              >
                <option value="">Year</option>
                {vehicleYears.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* Make */}
            <div className="relative">
              <Car className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <select
                value={make}
                onChange={(e) => handleMakeChange(e.target.value)}
                className={selectClass}
              >
                <option value="">Make</option>
                {vehicleMakes.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Model */}
            <div className="relative">
              <Truck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                disabled={!make}
                className={`${selectClass} ${!make ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <option value="">{make ? "Model" : "No models found"}</option>
                {availableModels.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Back / Continue */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => navigate(`/site/${slug}/book`)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border border-border text-foreground hover:bg-muted transition-colors min-h-[44px]"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={() => {
                  sessionStorage.setItem("booking_vehicle", JSON.stringify({ year, make, model }));
                  navigate(`/site/${slug}/book/options?service=${serviceId}&name=${encodeURIComponent(serviceName)}`);
                }}
                disabled={!canContinue}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold min-h-[44px] transition-all ${
                  canContinue
                    ? "bg-accent text-accent-foreground hover:brightness-105"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Can't find link */}
            <p className="text-sm text-muted-foreground pt-1">
              Can't find your vehicle?{" "}
              <a href="mailto:hello@darkerdigital.com" className="text-accent hover:underline">
                Contact us
              </a>
            </p>
          </div>
        </FadeIn>

        {/* Right — vehicle image */}
        <FadeIn delay={200}>
          <div className="flex-1 flex flex-col items-center justify-center min-h-[260px]">
            {/* Hidden img to preload with canvas color check */}
            {carImageUrl && !imageError && !imageLoaded && (
              <img
                src={carImageUrl}
                alt=""
                crossOrigin="anonymous"
                onLoad={handleImageLoad}
                onError={() => setImageError(true)}
                className="hidden"
              />
            )}

            {canContinue && imageLoaded && !imageError ? (
              <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
                <img
                  src={carImageUrl!}
                  alt={`${year} ${make} ${model}`}
                  className="w-full max-w-[360px] drop-shadow-[0_8px_24px_hsl(var(--accent)/0.3)]"
                />
                <p className="text-sm font-medium text-foreground mt-4">
                  {year} {make} {model}
                </p>
              </div>
            ) : canContinue ? (
              /* Enhanced fallback: silhouette + vehicle info card */
              <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
                <svg
                  viewBox="0 0 400 160"
                  className="w-full max-w-[320px] opacity-30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M40 120 C40 120 50 60 120 50 C160 44 200 40 240 44 C300 50 340 70 360 90 L380 100 C390 104 390 116 380 118 L360 120 L340 120 C340 106 328 94 314 94 C300 94 288 106 288 120 L140 120 C140 106 128 94 114 94 C100 94 88 106 88 120 Z"
                    fill="currentColor"
                    className="text-muted-foreground"
                  />
                  <circle cx="114" cy="120" r="18" fill="currentColor" className="text-muted-foreground" />
                  <circle cx="114" cy="120" r="10" fill="hsl(210 40% 98%)" />
                  <circle cx="314" cy="120" r="18" fill="currentColor" className="text-muted-foreground" />
                  <circle cx="314" cy="120" r="10" fill="hsl(210 40% 98%)" />
                </svg>
                <p className="text-lg font-semibold text-foreground mt-4">
                  {year} {make} {model}
                </p>
                <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Vehicle selected
                </span>
              </div>
            ) : (
              <>
                <svg
                  viewBox="0 0 400 160"
                  className="w-full max-w-[320px] opacity-20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M40 120 C40 120 50 60 120 50 C160 44 200 40 240 44 C300 50 340 70 360 90 L380 100 C390 104 390 116 380 118 L360 120 L340 120 C340 106 328 94 314 94 C300 94 288 106 288 120 L140 120 C140 106 128 94 114 94 C100 94 88 106 88 120 Z"
                    fill="currentColor"
                    className="text-muted-foreground"
                  />
                  <circle cx="114" cy="120" r="18" fill="currentColor" className="text-muted-foreground" />
                  <circle cx="114" cy="120" r="10" fill="hsl(210 40% 98%)" />
                  <circle cx="314" cy="120" r="18" fill="currentColor" className="text-muted-foreground" />
                  <circle cx="314" cy="120" r="10" fill="hsl(210 40% 98%)" />
                </svg>
                <p className="text-sm text-muted-foreground mt-4 text-center max-w-[240px] leading-relaxed">
                  Use the categories on the left to find your vehicle
                </p>
              </>
            )}
          </div>
        </FadeIn>
      </div>
    </BookingLayout>
  );
};

export default BookVehicle;
