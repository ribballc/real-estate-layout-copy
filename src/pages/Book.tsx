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
              <Loader2 className="w-6 h-6 animate-spin" style={{ color: "hsl(217,91%,50%)" }} />
            </div>
          );
        }

        if (services.length === 0) {
          return (
            <div className="text-center py-20" style={{ color: "hsl(215,16%,47%)" }}>
              No services available yet.
            </div>
          );
        }

        return (
          <>
            {/* Headline */}
            <FadeIn delay={50}>
              <div className="mb-8 md:mb-10">
                <h1
                  className="font-heading text-[28px] md:text-[40px] font-bold tracking-[-0.015em] leading-[1.2]"
                  style={{ color: "hsl(222,47%,11%)" }}
                >
                  What are you looking for?
                </h1>
                {businessName && (
                  <p className="text-sm md:text-base mt-2" style={{ color: "hsl(215,16%,47%)" }}>
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
                      className="group relative w-full text-left rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1"
                      style={{
                        background: "white",
                        border: isSelected
                          ? "2px solid hsl(217,91%,50%)"
                          : "1px solid hsl(210,40%,90%)",
                        boxShadow: isSelected
                          ? "0 8px 24px hsla(217,91%,50%,0.12)"
                          : undefined,
                      }}
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
                            style={{ background: "hsl(217,91%,50%)" }}
                          >
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                        )}

                        {/* Selected tint overlay */}
                        {isSelected && (
                          <div className="absolute inset-0 pointer-events-none" style={{ background: "hsla(217,91%,50%,0.06)" }} />
                        )}
                      </div>

                      {/* Content */}
                      <div
                        className="flex flex-col flex-1 p-5"
                        style={{ background: isSelected ? "hsl(217,91%,97%)" : "white" }}
                      >
                        <h3
                          className="text-base font-semibold mb-1.5 line-clamp-1"
                          style={{ color: "hsl(222,47%,11%)" }}
                        >
                          {service.title}
                        </h3>
                        <p
                          className="text-sm leading-relaxed line-clamp-2 mb-4"
                          style={{ color: "hsl(215,16%,47%)" }}
                        >
                          {service.description || "Professional detailing service"}
                        </p>

                        {/* Price */}
                        <div className="mt-auto flex items-end justify-between">
                          <div>
                            <p className="text-[10px] uppercase tracking-wider font-medium" style={{ color: "hsl(215,16%,60%)" }}>Starting at</p>
                            <p className="text-2xl font-bold tracking-tight" style={{ color: "hsl(217,91%,45%)" }}>
                              ${service.price}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Hover left border accent (only when not selected) */}
                      {!isSelected && (
                        <div
                          className="absolute left-0 top-0 bottom-0 w-[3px] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center"
                          style={{ background: "hsl(217,91%,70%)" }}
                        />
                      )}
                    </button>
                  </FadeIn>
                );
              })}
            </div>

            {/* Sticky CTA */}
            <div
              className="fixed md:relative bottom-0 left-0 right-0 md:bottom-auto z-30 md:z-auto md:bg-transparent px-4 py-3 md:p-0 md:mt-8"
              style={{
                background: "hsla(0,0%,100%,0.85)",
                backdropFilter: "blur(16px)",
                borderTop: "1px solid hsl(210,40%,90%)",
              }}
            >
              <div className="max-w-screen-lg mx-auto md:mx-0" style={{ borderTop: "none" }}>
                <button
                  onClick={handleContinue}
                  disabled={!selectedService}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-xl text-sm font-semibold min-h-[48px] transition-all duration-200"
                  style={
                    selectedService
                      ? {
                          background: "linear-gradient(135deg, hsl(217,91%,60%) 0%, hsl(217,91%,50%) 100%)",
                          color: "white",
                          boxShadow: "0 4px 12px hsla(217,91%,60%,0.3)",
                        }
                      : {
                          background: "hsl(210,40%,94%)",
                          color: "hsl(215,16%,60%)",
                          cursor: "not-allowed",
                        }
                  }
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
