import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import BookingLayout from "@/components/BookingLayout";
import FadeIn from "@/components/FadeIn";
import type { BusinessData } from "@/hooks/useBusinessData";

const Book = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState("");

  const handleSelect = (id: string, title: string, price: number) => {
    setSelectedService(id);
    setSelectedName(title);
    sessionStorage.setItem("booking_service", JSON.stringify({ id, title, price }));
  };

  const handleContinue = () => {
    if (!selectedService) return;
    navigate(`/site/${slug}/book/vehicle?service=${selectedService}&name=${encodeURIComponent(selectedName)}`);
  };

  return (
    <BookingLayout activeStep={0}>
      {(businessData: BusinessData) => {
        const { services, loading, profile } = businessData;
        const primaryColor = profile?.primary_color || "hsl(217,91%,60%)";
        const businessName = profile?.business_name || "";

        if (loading) {
          return (
            <div className="flex justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
            </div>
          );
        }

        if (services.length === 0) {
          return (
            <div className="text-center py-20 text-muted-foreground">
              No services available yet.
            </div>
          );
        }

        return (
          <>
            {/* Headline */}
            <FadeIn delay={50}>
              <div className="mb-8 md:mb-10">
                <h1 className="font-heading text-[28px] md:text-[40px] font-bold tracking-[-0.015em] leading-[1.2] text-foreground">
                  What are you looking for?
                </h1>
                {businessName && (
                  <p className="text-sm md:text-base text-muted-foreground mt-2">
                    Choose a service from {businessName}
                  </p>
                )}
              </div>
            </FadeIn>

            {/* Service grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((service, i) => {
                const isSelected = selectedService === service.id;
                return (
                  <FadeIn key={service.id} delay={100 + i * 60}>
                    <button
                      onClick={() => handleSelect(service.id, service.title, service.price)}
                      className={`group relative w-full text-left rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 bg-card border ${
                        isSelected
                          ? "border-accent shadow-lg ring-1 ring-accent"
                          : "border-border hover:shadow-xl hover:border-l-[3px]"
                      }`}
                      style={!isSelected ? { ["--hover-border" as string]: "hsl(217,91%,60%)" } : undefined}
                    >
                      {/* Image / gradient placeholder */}
                      <div className="relative w-full aspect-[16/9] overflow-hidden">
                        {service.image_url ? (
                          <img
                            src={service.image_url}
                            alt={service.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div
                            className="w-full h-full"
                            style={{
                              background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}88)`,
                            }}
                          />
                        )}

                        {/* Popular badge */}
                        {service.popular && (
                          <span
                            className="absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-[0.04em] shadow-md"
                            style={{
                              background: "hsl(38, 92%, 50%)",
                              color: "hsl(38, 92%, 10%)",
                            }}
                          >
                            Most Popular
                          </span>
                        )}

                        {/* Selected checkmark */}
                        {isSelected && (
                          <div
                            className="absolute top-3 left-3 w-7 h-7 rounded-full flex items-center justify-center shadow-md animate-in zoom-in duration-200"
                            style={{ background: "hsl(217,91%,60%)" }}
                          >
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                        )}

                        {/* Selected blue tint overlay */}
                        {isSelected && (
                          <div className="absolute inset-0 pointer-events-none" style={{ background: "hsla(217,91%,60%,0.08)" }} />
                        )}
                      </div>

                      {/* Content */}
                      <div className={`flex flex-col flex-1 p-5 ${isSelected ? "bg-accent/[0.03]" : ""}`}>
                        <h3 className="text-base font-semibold text-foreground mb-1.5 line-clamp-1">
                          {service.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                          {service.description || "Professional detailing service"}
                        </p>

                        {/* Price */}
                        <div className="mt-auto flex items-end justify-between">
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Starting at</p>
                            <p className="text-2xl font-bold text-foreground tracking-tight">
                              ${service.price}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Hover left border accent (only when not selected) */}
                      {!isSelected && (
                        <div
                          className="absolute left-0 top-0 bottom-0 w-[3px] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center"
                          style={{ background: "hsl(217,91%,60%)" }}
                        />
                      )}
                    </button>
                  </FadeIn>
                );
              })}
            </div>

            {/* Sticky CTA */}
            <div className="fixed md:relative bottom-0 left-0 right-0 md:bottom-auto z-30 md:z-auto bg-background/80 backdrop-blur-lg md:backdrop-blur-none md:bg-transparent border-t border-border md:border-none px-4 py-3 md:p-0 md:mt-8">
              <div className="max-w-screen-lg mx-auto md:mx-0">
                <button
                  onClick={handleContinue}
                  disabled={!selectedService}
                  className={`w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-xl text-sm font-semibold min-h-[48px] transition-all duration-200 ${
                    selectedService
                      ? "bg-accent text-accent-foreground hover:brightness-105 shadow-lg shadow-accent/20"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  {selectedService ? `Continue with ${selectedName}` : "Select a service to continue"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            {/* Mobile spacer */}
            <div className="h-20 md:h-0" />
          </>
        );
      }}
    </BookingLayout>
  );
};

export default Book;
