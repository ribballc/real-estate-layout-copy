import { ReactNode } from "react";
import { useParams } from "react-router-dom";
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
  const businessData = useBusinessDataBySlug(slug || null);

  const isDark = businessData.profile?.secondary_color !== "#FFFFFF";

  return (
    <div className={`min-h-screen bg-background ${isDark ? "site-dark" : ""}`}>
      {/* Top Nav */}
      <header
        className="sticky top-0 z-50 border-b border-border"
        style={{
          background: isDark ? "hsla(215, 50%, 8%, 0.85)" : "hsla(0, 0%, 100%, 0.85)",
          backdropFilter: "blur(16px) saturate(180%)",
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
