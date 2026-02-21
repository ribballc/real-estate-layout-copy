import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Loader2, CheckCircle2, Sparkles, Car, Paintbrush, Shield, Droplets } from "lucide-react";
import BookingLayout from "@/components/BookingLayout";
import FadeIn from "@/components/FadeIn";
import StickyBookingCTA from "@/components/StickyBookingCTA";
import { useBooking } from "@/contexts/BookingContext";
import type { BusinessData } from "@/hooks/useBusinessData";

/* Map service keywords to icons */
const getServiceIcon = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("ceramic") || t.includes("coat")) return Shield;
  if (t.includes("interior") || t.includes("clean")) return Sparkles;
  if (t.includes("exterior") || t.includes("wash")) return Droplets;
  return Paintbrush;
};

const cardStyle: React.CSSProperties = {
  background: "white",
  border: "1px solid hsl(210,40%,90%)",
  borderRadius: 12,
  padding: "16px 18px",
  cursor: "pointer",
  transition: "border-color 0.15s, box-shadow 0.15s, background 0.15s",
};

const Book = () => {
  const navigate = useNavigate();
  const { slug, service, setService } = useBooking();
  const [selectedService, setSelectedService] = useState<string | null>(service?.id ?? null);
  const [bounceKey, setBounceKey] = useState(0);

  useEffect(() => {
    if (service?.id && !selectedService) setSelectedService(service.id);
  }, [service?.id, selectedService]);

  const handleSelect = (id: string, title: string, price: number) => {
    const wasNull = !selectedService;
    setSelectedService(id);
    setService({ id, title, price });
    if (wasNull) setBounceKey((k) => k + 1);
  };

  const handleContinue = () => {
    if (!selectedService) return;
    navigate(`/site/${slug}/book/vehicle`);
  };

  return (
    <BookingLayout activeStep={0}>
      {(businessData: BusinessData) => {
        const { services, loading } = businessData;

        if (loading) {
          return (
            <div className="flex justify-center py-20">
              <Loader2 className="w-5 h-5 animate-spin" style={{ color: "hsl(217,91%,55%)" }} />
            </div>
          );
        }

        if (services.length === 0) {
          return (
            <div className="text-center py-16 px-4">
              <p className="font-medium mb-1" style={{ fontSize: 18, color: "hsl(222,47%,11%)" }}>
                No services available yet
              </p>
              <p style={{ fontSize: 14, color: "hsl(215,16%,55%)", marginBottom: 24, maxWidth: 320, marginLeft: "auto", marginRight: "auto" }}>
                This business is still setting up their booking menu. Check back soon or visit their site.
              </p>
              <a
                href={slug ? `/site/${slug}` : "#"}
                className="inline-flex items-center justify-center gap-2 font-semibold rounded-full px-6 py-3 transition-all"
                style={{ background: "var(--site-primary, hsl(217,91%,55%))", color: "white", fontSize: 14 }}
              >
                Back to {businessData.profile?.business_name || "site"}
              </a>
            </div>
          );
        }

        return (
          <>
            <FadeIn delay={40}>
              <h1
                className="font-heading font-bold tracking-[-0.01em] leading-[1.2] mb-1"
                style={{ fontSize: 22, color: "hsl(222,47%,11%)" }}
              >
                Choose a service
              </h1>
              <p style={{ fontSize: 14, color: "hsl(215,16%,55%)", marginBottom: 20 }}>
                Select what you'd like done
              </p>
            </FadeIn>

            <div className="space-y-3">
              {services.map((service, i) => {
                const isSelected = selectedService === service.id;
                const Icon = getServiceIcon(service.title);
                return (
                  <FadeIn key={service.id} delay={60 + i * 40}>
                    <button
                      onClick={() => handleSelect(service.id, service.title, service.price)}
                      className="w-full text-left flex items-center gap-3.5"
                      style={{
                        ...cardStyle,
                        ...(isSelected
                          ? {
                              borderColor: "hsl(217,91%,55%)",
                              background: "hsl(217,91%,98%)",
                              boxShadow: "0 0 0 3px hsla(217,91%,55%,0.12)",
                            }
                          : {}),
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = "hsl(217,91%,65%)";
                          e.currentTarget.style.boxShadow = "0 2px 12px hsla(217,91%,60%,0.1)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = "hsl(210,40%,90%)";
                          e.currentTarget.style.boxShadow = "none";
                        }
                      }}
                    >
                      {/* Icon box */}
                      <div
                        className="flex items-center justify-center flex-shrink-0"
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 8,
                          background: "hsl(217,91%,96%)",
                        }}
                      >
                        <Icon size={18} style={{ color: "hsl(217,91%,50%)" }} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <span className="block font-semibold truncate" style={{ fontSize: 15, color: "hsl(222,47%,11%)" }}>
                          {service.title}
                        </span>
                        {service.description && (
                          <span className="block truncate" style={{ fontSize: 13, color: "hsl(215,16%,55%)" }}>
                            {service.description}
                          </span>
                        )}
                      </div>

                      {/* Price / check */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="font-semibold" style={{ fontSize: 15, color: "hsl(217,91%,45%)" }}>
                          ${service.price}
                        </span>
                        {isSelected && (
                          <CheckCircle2 size={20} style={{ color: "hsl(217,91%,55%)" }} />
                        )}
                      </div>
                    </button>
                  </FadeIn>
                );
              })}
            </div>

            {/* CTA */}
            <StickyBookingCTA>
              <button
                key={bounceKey}
                onClick={handleContinue}
                disabled={!selectedService}
                className="w-full inline-flex items-center justify-center gap-2 font-bold"
                style={{
                  height: 50,
                  borderRadius: 12,
                  fontSize: 15,
                  transition: "opacity 0.15s, box-shadow 0.15s, transform 0.15s",
                  ...(selectedService
                    ? {
                        background: "linear-gradient(135deg, var(--site-primary, hsl(217,91%,55%)), var(--site-secondary, hsl(224,91%,48%)))",
                        color: "white",
                        boxShadow: "0 4px 16px hsla(217,91%,55%,0.35)",
                        animation: "ctaBounce 0.25s ease",
                      }
                    : {
                        background: "hsl(210,40%,92%)",
                        color: "hsl(215,16%,60%)",
                        cursor: "not-allowed",
                        opacity: 0.45,
                      }),
                }}
              >
                Continue
                <ArrowRight size={16} />
              </button>
            </StickyBookingCTA>

            <style>{`
              @keyframes ctaBounce {
                0%   { transform: scale(1); }
                50%  { transform: scale(1.02); }
                100% { transform: scale(1); }
              }
            `}</style>
          </>
        );
      }}
    </BookingLayout>
  );
};

export default Book;
