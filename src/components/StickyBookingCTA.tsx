import { type ReactNode } from "react";

interface StickyBookingCTAProps {
  children: ReactNode;
}

export default function StickyBookingCTA({ children }: StickyBookingCTAProps) {
  return (
    <>
      {/* Spacer so content scrolls above sticky CTA on mobile — minimal height */}
      <div className="md:hidden h-[64px] flex-shrink-0" aria-hidden />
      <div
        className="md:relative fixed md:static bottom-0 left-0 right-0 z-20 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:p-0 md:mt-6"
        style={{
          background: "rgba(255,255,255,0.98)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid var(--booking-border, hsl(210,40%,92%))",
          boxShadow: "0 -4px 24px hsla(0,0%,0%,0.06)",
        }}
      >
        <div className="max-w-[780px] mx-auto md:max-w-none">
          {children}
        </div>
      </div>
    </>
  );
}
