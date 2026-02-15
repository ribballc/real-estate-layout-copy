import { ReactNode } from "react";
import BookingSidebar from "@/components/BookingSidebar";
import BookingBreadcrumb from "@/components/BookingBreadcrumb";

interface BookingLayoutProps {
  activeStep: number;
  showMap?: boolean;
  children: ReactNode;
}

const BookingLayout = ({ activeStep, showMap = false, children }: BookingLayoutProps) => (
  <div className="min-h-screen" style={{ background: "hsl(210 40% 98%)" }}>
    {/* Top Nav */}
    <header
      className="sticky top-0 z-50 border-b border-border"
      style={{
        background: "hsla(0, 0%, 100%, 0.85)",
        backdropFilter: "blur(16px) saturate(180%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center">
        <a href="/" className="font-heading text-xl font-bold text-foreground tracking-tight">
          velarrio
        </a>
      </div>
    </header>

    <div className="max-w-7xl mx-auto px-5 md:px-8 py-8 md:py-12">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <BookingSidebar showMap={showMap} />

        <main className="flex-1 min-w-0">
          <BookingBreadcrumb activeStep={activeStep} />
          {children}
        </main>
      </div>
    </div>
  </div>
);

export default BookingLayout;
