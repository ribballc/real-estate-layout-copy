import { ReactNode, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import BookingSidebar from "@/components/BookingSidebar";
import BookingBreadcrumb from "@/components/BookingBreadcrumb";
import SEOHead from "@/components/SEOHead";
import darkerLogo from "@/assets/darker-logo.png";
import { ShieldCheck } from "lucide-react";
import { useBusinessDataBySlug, type BusinessData } from "@/hooks/useBusinessData";

interface BookingLayoutProps {
  activeStep: number;
  children: ReactNode | ((data: BusinessData) => ReactNode);
}

const STEP_LABELS = [
  "Choose a Service",
  "Select Your Vehicle",
  "Choose Your Options",
  "Pick Add-ons",
  "Pick Date & Time",
  "Confirm Booking",
];

const BookingLayout = ({ activeStep, children }: BookingLayoutProps) => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const businessData = useBusinessDataBySlug(slug || null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  const businessName = businessData.profile?.business_name || "";
  const ogImage = businessData.photos?.length
    ? businessData.photos[0].url
    : "https://darkerdigital.com/og-default.jpg";
  const canonicalUrl = slug ? `https://darkerdigital.com/site/${slug}/book` : undefined;

  return (
    <div
      className="min-h-[100dvh] overflow-x-hidden"
      style={{ background: "hsl(210,40%,97%)" }}
    >
      <SEOHead
        title={businessName ? `Book with ${businessName}` : "Book Online"}
        description={businessName ? `Schedule your detail appointment with ${businessName}. Book online 24/7, instant confirmation.` : "Book your detailing appointment online 24/7."}
        ogImage={ogImage.startsWith("http") ? ogImage : `https://darkerdigital.com${ogImage.startsWith("/") ? "" : "/"}${ogImage}`}
        canonicalUrl={canonicalUrl}
      />
      {/* ── Booksy-style sticky header with brand continuity ── */}
      <header
        className="sticky top-0 z-30"
        style={{
          height: 60,
          background: "white",
          borderBottom: "1px solid hsl(210,40%,92%)",
          boxShadow: "0 1px 4px hsla(0,0%,0%,0.06)",
        }}
      >
        <div className="max-w-[780px] mx-auto px-4 h-full flex items-center justify-between">
          {/* Left: logo + name */}
          <a href={`/site/${slug}`} className="flex items-center gap-2.5 min-w-0">
            {businessData.profile?.logo_url ? (
              <img
                src={businessData.profile.logo_url}
                alt={businessName || "Business"}
                className="h-8 w-auto flex-shrink-0"
              />
            ) : businessName ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "hsl(222,47%,11%)" }}>
                  <span className="text-white font-bold text-sm">{businessName.charAt(0)}</span>
                </div>
                <span
                  className="font-semibold truncate hidden sm:inline"
                  style={{ fontSize: 15, color: "hsl(222,47%,11%)" }}
                >
                  {businessName}
                </span>
              </div>
            ) : (
              <img
                src={darkerLogo}
                alt="Business"
                className="h-7 w-auto flex-shrink-0"
              />
            )}
          </a>

          {/* Right: secure badge */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <ShieldCheck size={15} style={{ color: "hsl(142,71%,40%)" }} />
            <span
              className="hidden min-[375px]:inline"
              style={{ fontSize: 12, color: "hsl(215,16%,55%)" }}
            >
              Secure Booking
            </span>
          </div>
        </div>
      </header>

      {/* ── Progress bar ── */}
      <BookingBreadcrumb activeStep={activeStep} totalSteps={STEP_LABELS.length} label={STEP_LABELS[activeStep] || ""} />

      {/* ── Content ── */}
      <div className="max-w-[780px] mx-auto px-4 py-6 md:py-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          <main className="flex-1 min-w-0 order-1">
            {/* Step enter animation */}
            <div
              key={location.pathname}
              style={{
                animation: "stepEnter 220ms ease-out both",
              }}
            >
              {typeof children === "function" ? children(businessData) : children}
            </div>
          </main>

          <BookingSidebar businessData={businessData} />
        </div>
      </div>

      {/* Step transition keyframes */}
      <style>{`
        @keyframes stepEnter {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default BookingLayout;
