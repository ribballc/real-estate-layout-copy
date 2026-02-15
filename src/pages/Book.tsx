import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import BookingLayout from "@/components/BookingLayout";
import FadeIn from "@/components/FadeIn";

/* ═══════════════════════════════════════════════════════
   CMS-READY CONFIG — replace with DB/API data later
   ═══════════════════════════════════════════════════════ */

interface Service {
  id: string;
  title: string;
  description: string;
  popular?: boolean;
}

const services: Service[] = [
  {
    id: "interior",
    title: "Interior Detail",
    description: "Deep interior clean, vacuum, leather care, and interior protection — starting at $180.",
  },
  {
    id: "exterior",
    title: "Exterior Detail",
    description: "Full wash, clay bar, polish, and sealant for a showroom finish — starting at $250.",
    popular: true,
  },
  {
    id: "full",
    title: "Full Detail",
    description: "Complete interior + exterior package for the ultimate transformation — starting at $400.",
  },
  {
    id: "ceramic",
    title: "Ceramic Coating",
    description: "Professional-grade ceramic coating for long-lasting paint protection — starting at $600.",
  },
];

/* ═══════════════════════════════════════════════════════ */

const Book = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelectedService(id);
    const svc = services.find((s) => s.id === id);
    setTimeout(() => navigate(`/book/vehicle?service=${id}&name=${encodeURIComponent(svc?.title || "")}`), 300);
  };

  return (
    <BookingLayout activeStep={0}>
      {/* Section heading */}
      <FadeIn delay={50}>
        <h1 className="font-heading text-[28px] md:text-[40px] font-bold tracking-[-0.015em] leading-[1.2] text-foreground mb-8 md:mb-10">
          Select a service
        </h1>
      </FadeIn>

      {/* Service cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((service, i) => (
          <FadeIn key={service.id} delay={100 + i * 80}>
            <button
              onClick={() => handleSelect(service.id)}
              className={`group relative w-full text-left rounded-2xl p-6 md:p-7 min-h-[200px] flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${
                selectedService === service.id
                  ? "ring-2 ring-accent shadow-[0_12px_32px_hsla(217,91%,60%,0.2)]"
                  : "hover:shadow-[0_12px_32px_hsla(217,91%,60%,0.12)]"
              }`}
              style={{
                background: "linear-gradient(135deg, hsl(215 50% 10%) 0%, hsl(217 33% 17%) 100%)",
              }}
            >
              {service.popular && (
                <span className="absolute -top-3 right-4 text-[11px] font-semibold px-3 py-1 rounded-md uppercase tracking-[0.06em] bg-accent text-accent-foreground">
                  Most Popular
                </span>
              )}

              <div>
                <h3 className="text-lg font-semibold text-primary-foreground mb-2">{service.title}</h3>
                <p className="text-sm text-primary-foreground/60 leading-relaxed">{service.description}</p>
              </div>

              <div className="mt-5">
                <span
                  className="inline-flex items-center gap-2 text-sm font-semibold rounded-lg px-5 py-2.5 min-h-[44px] transition-all duration-300 group-hover:gap-3"
                  style={{
                    background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)",
                    color: "hsl(0 0% 100%)",
                    boxShadow: "0 4px 12px hsla(217, 91%, 60%, 0.3)",
                  }}
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </button>
          </FadeIn>
        ))}
      </div>
    </BookingLayout>
  );
};

export default Book;
