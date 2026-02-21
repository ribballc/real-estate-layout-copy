interface BookingBreadcrumbProps {
  activeStep: number;
  totalSteps: number;
  label: string;
}

const BookingBreadcrumb = ({ activeStep, totalSteps, label }: BookingBreadcrumbProps) => {
  const progress = ((activeStep + 1) / totalSteps) * 100;

  return (
    <div className="max-w-[780px] mx-auto px-4 pt-5 pb-1">
      {/* Progress bar */}
      <div
        className="w-full overflow-hidden"
        style={{
          height: 4,
          borderRadius: 2,
          background: "hsl(210,40%,90%)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            borderRadius: 2,
            background: "var(--booking-primary, hsl(217, 91%, 52%))",
            transition: "width 0.4s ease",
          }}
        />
      </div>

      {/* Step label */}
      <p
        className="mt-2"
        style={{
          fontSize: 12,
          color: "hsl(215,16%,55%)",
        }}
      >
        Step {activeStep + 1} of {totalSteps} — {label}
      </p>
    </div>
  );
};

export default BookingBreadcrumb;
