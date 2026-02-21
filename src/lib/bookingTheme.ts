/**
 * Fixed color palette for all booking pages. Never uses the business's
 * website colors — booking is always this consistent blue/white "Darker" look.
 */

export const BOOKING = {
  /** Primary CTA blue */
  primary: "hsl(217, 91%, 52%)",
  primaryHover: "hsl(217, 91%, 46%)",
  /** Gradient end for buttons */
  primaryEnd: "hsl(224, 91%, 46%)",
  /** Subtle blue tint for selected states, badges */
  primarySubtle: "hsl(217, 91%, 96%)",
  primaryBorder: "hsl(217, 91%, 88%)",
  primaryMuted: "hsl(217, 91%, 45%)",
  /** Page background — soft blue-white */
  bg: "hsl(212, 38%, 97%)",
  /** Cards, inputs */
  surface: "hsl(0, 0%, 100%)",
  /** Borders */
  border: "hsl(210, 40%, 90%)",
  borderLight: "hsl(210, 40%, 94%)",
  /** Text */
  text: "hsl(222, 47%, 11%)",
  textSecondary: "hsl(222, 47%, 22%)",
  textMuted: "hsl(215, 16%, 50%)",
  /** Order summary card — slightly elevated so it reads on all devices */
  summaryBg: "hsl(0, 0%, 100%)",
  summaryBorder: "hsl(210, 40%, 88%)",
  summaryShadow: "0 2px 12px hsla(217, 91%, 55%, 0.06); 0 1px 3px hsla(0,0%,0%,0.04)",
} as const;

/** CSS custom properties to set on the booking root. --site-primary/--site-secondary are set to the same fixed blue so no user website colors apply. */
export function getBookingRootStyle(): React.CSSProperties {
  return {
    "--booking-primary": BOOKING.primary,
    "--booking-primary-hover": BOOKING.primaryHover,
    "--booking-primary-end": BOOKING.primaryEnd,
    "--booking-primary-subtle": BOOKING.primarySubtle,
    "--booking-primary-muted": BOOKING.primaryMuted,
    "--booking-bg": BOOKING.bg,
    "--booking-surface": BOOKING.surface,
    "--booking-border": BOOKING.border,
    "--booking-text": BOOKING.text,
    "--booking-text-muted": BOOKING.textMuted,
    "--booking-summary-bg": BOOKING.summaryBg,
    "--booking-summary-border": BOOKING.summaryBorder,
    "--booking-summary-shadow": BOOKING.summaryShadow,
    "--site-primary": BOOKING.primary,
    "--site-secondary": BOOKING.primaryEnd,
    background: BOOKING.bg,
  } as React.CSSProperties;
}

export const BOOKING_CTA_GRADIENT = `linear-gradient(135deg, ${BOOKING.primary}, ${BOOKING.primaryEnd})`;
export const BOOKING_CTA_SHADOW = `0 4px 20px hsla(217, 91%, 55%, 0.35)`;
