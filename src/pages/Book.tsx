import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import BookingLayout from "@/components/BookingLayout";
import FadeIn from "@/components/FadeIn";
import type { BusinessData } from "@/hooks/useBusinessData";

const Book = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const handleSelect = (id: string, title: string, price: number) => {
    setSelectedService(id);
    sessionStorage.setItem("booking_service", JSON.stringify({ id, title, price }));
    setTimeout(
      () =>
        navigate(
          `/site/${slug}/book/vehicle?service=${id}&name=${encodeURIComponent(title)}`
        ),
      300
    );
  };

  return (
    <BookingLayout activeStep={0}>
      {(businessData: BusinessData) => {
        const { services, loading } = businessData;

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
            <FadeIn delay={50}>
              <h1 className="font-heading text-[28px] md:text-[40px] font-bold tracking-[-0.015em] leading-[1.2] text-foreground mb-8 md:mb-10">
                Select a service
              </h1>
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((service, i) => (
                <FadeIn key={service.id} delay={100 + i * 80}>
                  <button
                    onClick={() => handleSelect(service.id, service.title, service.price)}
                    className={`group relative w-full text-left rounded-2xl p-6 md:p-7 min-h-[200px] flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 bg-card border border-border ${
                      selectedService === service.id
                        ? "ring-2 ring-accent shadow-lg"
                        : "hover:shadow-lg"
                    }`}
                  >
                    {service.popular && (
                      <span className="absolute -top-3 right-4 text-[11px] font-semibold px-3 py-1 rounded-md uppercase tracking-[0.06em] bg-accent text-accent-foreground">
                        Most Popular
                      </span>
                    )}

                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {service.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {service.description}
                        {service.price > 0 ? ` — starting at $${service.price}.` : ""}
                      </p>
                    </div>

                    <div className="mt-5">
                      <span className="inline-flex items-center gap-2 text-sm font-semibold rounded-lg px-5 py-2.5 min-h-[44px] transition-all duration-300 group-hover:gap-3 bg-accent text-accent-foreground">
                        Continue
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </button>
                </FadeIn>
              ))}
            </div>
          </>
        );
      }}
    </BookingLayout>
  );
};

export default Book;
