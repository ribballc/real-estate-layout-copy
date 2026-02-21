/**
 * Subtle "Booking Powered By [Darker logo]" footer for booking pages and generated websites.
 * Uses the same logo as headers across the site. No subheadline.
 */

import darkerLogo from "@/assets/darker-logo.png";
import darkerLogoDark from "@/assets/darker-logo-dark.png";

interface PoweredByDarkerProps {
  /** Light background (booking) vs dark background (deluxe site footer) */
  variant?: "light" | "dark";
  className?: string;
}

export default function PoweredByDarker({ variant = "light", className = "" }: PoweredByDarkerProps) {
  const isDark = variant === "dark";
  const logoSrc = isDark ? darkerLogo : darkerLogoDark;
  const linkColor = isDark ? "rgba(255,255,255,0.5)" : "hsl(215, 20%, 55%)";

  return (
    <div
      className={`flex flex-col items-center justify-center py-2 ${className}`}
      style={{ borderTop: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid hsl(210, 40%, 92%)" }}
    >
      <a
        href="https://darkerdigital.com"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity"
        style={{ fontSize: 11, fontWeight: 500, color: linkColor, letterSpacing: "0.02em" }}
      >
        Booking Powered By
        <img src={logoSrc} alt="Darker" className="h-4 w-auto" />
      </a>
    </div>
  );
}
