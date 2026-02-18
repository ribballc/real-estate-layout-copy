import { ReactNode, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import BookingSidebar from "@/components/BookingSidebar";
import BookingBreadcrumb from "@/components/BookingBreadcrumb";
import darkerLogo from "@/assets/darker-logo.png";
import { useBusinessDataBySlug, type BusinessData } from "@/hooks/useBusinessData";

interface BookingLayoutProps {
  activeStep: number;
  children: ReactNode | ((data: BusinessData) => ReactNode);
}

const BookingLayout = ({ activeStep, children }: BookingLayoutProps) => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const businessData = useBusinessDataBySlug(slug || null);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div className="min-h-[100dvh] bg-background overflow-x-hidden">
      {/* Top Nav */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: "hsla(0, 0%, 100%, 0.85)",
          backdropFilter: "blur(16px) saturate(180%)",
          borderBottom: "1px solid hsl(210,40%,90%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center">
          <a href={`/site/${slug}`}>
            <img
              src={businessData.profile?.logo_url || darkerLogo}
              alt={businessData.profile?.business_name || "Darker"}
              className="h-8"
            />
          </a>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <main className="flex-1 min-w-0 order-1">
            <BookingBreadcrumb activeStep={activeStep} />
            {typeof children === "function" ? children(businessData) : children}
          </main>

          <BookingSidebar businessData={businessData} />
        </div>
      </div>
    </div>
  );
};

export default BookingLayout;
