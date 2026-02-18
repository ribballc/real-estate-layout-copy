import { ChevronRight, Check } from "lucide-react";
import FadeIn from "@/components/FadeIn";

const steps = [
  { label: "Service", path: "/book" },
  { label: "Vehicle", path: "/book/vehicle" },
  { label: "Options", path: "/book/options" },
  { label: "Add-ons", path: "/book/add-ons" },
  { label: "Schedule", path: "/book/booking" },
  { label: "Checkout", path: "/book/checkout" },
];

interface BookingBreadcrumbProps {
  activeStep: number;
}

const BookingBreadcrumb = ({ activeStep }: BookingBreadcrumbProps) => (
  <FadeIn>
    <nav className="flex items-center gap-1.5 flex-wrap mb-8 md:mb-10">
      {steps.map((step, i) => {
        const isActive = i === activeStep;
        const isCompleted = i < activeStep;
        return (
          <span key={step.label} className="flex items-center gap-1.5">
            <span
              className="inline-flex items-center gap-1.5 text-sm font-medium px-2.5 py-1 rounded-lg transition-colors"
              style={
                isActive
                  ? {
                      background: "hsl(217,91%,96%)",
                      color: "hsl(217,91%,40%)",
                      border: "1px solid hsl(217,91%,80%)",
                    }
                  : isCompleted
                  ? {
                      background: "hsl(142,71%,94%)",
                      color: "hsl(142,71%,35%)",
                    }
                  : {
                      background: "hsl(210,40%,94%)",
                      color: "hsl(215,16%,47%)",
                    }
              }
            >
              {isCompleted && <Check className="w-3 h-3" />}
              {step.label}
            </span>
            {i < steps.length - 1 && (
              <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "hsl(210,40%,82%)" }} />
            )}
          </span>
        );
      })}
    </nav>
  </FadeIn>
);

export default BookingBreadcrumb;
