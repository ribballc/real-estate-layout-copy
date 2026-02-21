import { useState, lazy, Suspense } from "react";
import { FlaskConical, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";

const OfferLabManager = lazy(() => import("./OfferLabManager"));
const QrCodeTab = lazy(() => import("./QrCodeTab"));

type LabTab = "offers" | "qr";

const TABS: { key: LabTab; label: string; icon: React.ElementType }[] = [
  { key: "offers", label: "Offers", icon: FlaskConical },
  { key: "qr", label: "QR Code", icon: QrCode },
];

const TheLabPage = () => {
  const [activeTab, setActiveTab] = useState<LabTab>("offers");

  // Detect dark mode from dashboard context (body attribute)
  const isDark = typeof document !== "undefined"
    ? document.body.getAttribute("data-dashboard-theme") === "dark"
    : true;

  const cardBorder = isDark ? "hsla(0,0%,100%,0.08)" : "hsl(214,20%,88%)";

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Tab Toggle — same pattern as WebsitePage */}
      <div className="px-6 lg:px-8 pt-6 lg:pt-8">
        <div
          className="inline-flex"
          style={{
            background: isDark ? "hsla(0,0%,100%,0.06)" : "hsl(210,40%,94%)",
            border: `1px solid ${cardBorder}`,
            borderRadius: 10,
            padding: 4,
            gap: 2,
          }}
        >
          {TABS.map(({ key, label, icon: Icon }) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className="inline-flex items-center gap-1.5 transition-all duration-200"
                style={{
                  padding: "8px 18px",
                  borderRadius: 7,
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 500,
                  background: isActive
                    ? isDark ? "hsla(217,91%,60%,0.15)" : "white"
                    : "transparent",
                  color: isActive
                    ? isDark ? "white" : "hsl(222,47%,11%)"
                    : isDark ? "hsla(0,0%,100%,0.5)" : "hsl(215,16%,47%)",
                  boxShadow: isActive
                    ? isDark ? "0 1px 4px hsla(0,0%,0%,0.3)" : "0 1px 4px hsla(0,0%,0%,0.1)"
                    : "none",
                  cursor: isActive ? "default" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = isDark ? "hsla(0,0%,100%,0.06)" : "hsl(210,40%,90%)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = "transparent";
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "hsl(217,91%,60%)", borderTopColor: "transparent" }} />
          </div>
        }
      >
        {activeTab === "offers" ? (
          <OfferLabManager />
        ) : (
          <div className="px-6 lg:px-8 py-6 lg:py-8">
            <QrCodeTab isDark={isDark} />
          </div>
        )}
      </Suspense>
    </div>
  );
};

export default TheLabPage;
