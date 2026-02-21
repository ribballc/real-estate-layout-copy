import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, CheckCircle2, Sparkles, Car, Paintbrush, Shield, Droplets, Zap } from "lucide-react";
import BookingLayout from "@/components/BookingLayout";
import FadeIn from "@/components/FadeIn";
import StickyBookingCTA from "@/components/StickyBookingCTA";
import { useBooking } from "@/contexts/BookingContext";
import type { BusinessData, BusinessService } from "@/hooks/useBusinessData";

function getServiceIcon(title: string) {
  const t = title.toLowerCase();
  if (t.includes("ceramic") || t.includes("coat")) return Shield;
  if (t.includes("interior") || t.includes("clean")) return Sparkles;
  if (t.includes("exterior") || t.includes("wash")) return Droplets;
  if (t.includes("tint")) return Car;
  return Paintbrush;
}

function getBenefits(service: BusinessService): string[] {
  if (!service.description?.trim()) return [];
  return service.description.split("\n").filter((line) => line.trim().length > 0);
}

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
    if (!selectedService || !slug) return;
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

            <p style={{ fontSize: 15, color: "hsl(215,16%,50%)", marginBottom: 16 }}>
              Pick a package below. You can add extras later.
            </p>

            <div className="space-y-4">
              {services.map((service, i) => {
                const isSelected = selectedService === service.id;
                const Icon = getServiceIcon(service.title);
                const benefits = getBenefits(service);
                const firstLine = service.description?.split("\n")[0]?.trim() ?? "";
                return (
                  <FadeIn key={service.id} delay={60 + i * 50}>
                    <button
                      type="button"
                      onClick={() => handleSelect(service.id, service.title, service.price)}
                      className="public-touch-target w-full text-left rounded-2xl overflow-hidden min-h-[44px]"
                      style={{
                        background: "white",
                        border: `2px solid ${isSelected ? "var(--site-primary, hsl(217,91%,55%))" : "hsl(210,40%,90%)"}`,
                        boxShadow: isSelected ? "0 0 0 4px hsla(217,91%,55%,0.12)" : "0 2px 8px hsla(0,0%,0%,0.04)",
                        transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
                      }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-5">
                        {/* Image or icon */}
                        <div className="flex-shrink-0 w-full sm:w-[100px] h-[80px] sm:h-[72px] rounded-xl overflow-hidden flex items-center justify-center" style={{ background: "hsl(210,40%,96%)" }}>
                          {service.image_url ? (
                            <img src={service.image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Icon size={32} style={{ color: "hsl(217,91%,55%)" }} />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold" style={{ fontSize: 17, color: "hsl(222,47%,11%)" }}>
                              {service.title}
                            </span>
                            {service.popular && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide" style={{ background: "hsl(45,93%,47%)", color: "#1a1a1a" }}>
                                <Zap size={10} /> Popular
                              </span>
                            )}
                          </div>
                          {firstLine && (
                            <p className="mt-0.5 text-sm line-clamp-2" style={{ color: "hsl(215,16%,50%)" }}>
                              {firstLine}
                            </p>
                          )}
                          {benefits.length > 0 && (
                            <ul className="mt-2 space-y-0.5">
                              {benefits.slice(0, 3).map((b, j) => (
                                <li key={j} className="flex items-center gap-1.5 text-[13px]" style={{ color: "hsl(215,16%,45%)" }}>
                                  <CheckCircle2 size={12} style={{ color: "hsl(142,71%,40%)", flexShrink: 0 }} />
                                  <span>{b.trim()}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="font-bold" style={{ fontSize: 18, color: "var(--site-primary, hsl(217,91%,45%))" }}>
                            ${service.price}
                          </span>
                          {isSelected && (
                            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--site-primary, hsl(217,91%,55%))", color: "white" }}>
                              <CheckCircle2 size={18} />
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  </FadeIn>
                );
              })}
            </div>

            {/* CTA — large tap target for all devices */}
            <StickyBookingCTA>
              <button
                type="button"
                key={bounceKey}
                onClick={handleContinue}
                disabled={!selectedService}
                className="public-touch-target w-full inline-flex items-center justify-center gap-2 font-bold min-h-[50px]"
                style={{
                  height: 52,
                  borderRadius: 14,
                  fontSize: 16,
                  transition: "opacity 0.15s, box-shadow 0.15s, transform 0.15s",
                  ...(selectedService
                    ? {
                        background: "linear-gradient(135deg, var(--site-primary, hsl(217,91%,55%)), var(--site-secondary, hsl(224,91%,48%)))",
                        color: "white",
                        boxShadow: "0 4px 20px hsla(217,91%,55%,0.35)",
                        animation: "ctaBounce 0.25s ease",
                      }
                    : {
                        background: "hsl(210,40%,92%)",
                        color: "hsl(215,16%,60%)",
                        cursor: "not-allowed",
                        opacity: 0.5,
                      }),
                }}
              >
                Continue to vehicle
                <ArrowRight size={18} />
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
