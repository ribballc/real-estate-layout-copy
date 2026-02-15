import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Car, Truck, ArrowLeft, ArrowRight } from "lucide-react";
import BookingLayout from "@/components/BookingLayout";
import FadeIn from "@/components/FadeIn";
import { vehicleYears, vehicleMakes, vehicleModels } from "@/data/vehicles";

const BookVehicle = () => {
  const navigate = useNavigate();
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");

  const availableModels = useMemo(() => {
    if (!make) return [];
    return vehicleModels[make] || [];
  }, [make]);

  const canContinue = !!(year && make && model);

  const handleMakeChange = (val: string) => {
    setMake(val);
    setModel("");
  };

  const selectClass =
    "w-full px-4 py-3.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all appearance-none min-h-[48px] pl-11";

  return (
    <BookingLayout activeStep={1} showMap>
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
                onClick={() => navigate("/book")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border border-border text-foreground hover:bg-muted transition-colors min-h-[44px]"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={() => {/* next step placeholder */}}
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
              <a href={`mailto:hello@velarrio.com`} className="text-accent hover:underline">
                Contact us
              </a>
            </p>
          </div>
        </FadeIn>

        {/* Right — vehicle silhouette */}
        <FadeIn delay={200}>
          <div className="flex-1 flex flex-col items-center justify-center min-h-[260px]">
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
          </div>
        </FadeIn>
      </div>
    </BookingLayout>
  );
};

export default BookVehicle;
