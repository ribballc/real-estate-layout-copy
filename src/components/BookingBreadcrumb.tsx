import { ChevronRight } from "lucide-react";
import FadeIn from "@/components/FadeIn";

const steps = [
  { label: "Select a service", path: "/book" },
  { label: "Your Car", path: "/book/vehicle" },
  { label: "Options", path: "/book/options" },
  { label: "Add-ons", path: "/book/add-ons" },
  { label: "Booking", path: "/book/booking" },
  { label: "Checkout", path: "/book/checkout" },
];

interface BookingBreadcrumbProps {
  activeStep: number;
}

const BookingBreadcrumb = ({ activeStep }: BookingBreadcrumbProps) => (
  <FadeIn>
    <nav className="flex items-center gap-1 flex-wrap mb-8 md:mb-10">
      {steps.map((step, i) => (
        <span key={step.label} className="flex items-center gap-1">
          <span
            className={`text-sm font-medium transition-colors ${
              i === activeStep
                ? "text-accent"
                : i < activeStep
                ? "text-foreground"
                : "text-muted-foreground/50"
            }`}
          >
            {step.label}
          </span>
          {i < steps.length - 1 && (
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/30 flex-shrink-0" />
          )}
        </span>
      ))}
    </nav>
  </FadeIn>
);

export default BookingBreadcrumb;
