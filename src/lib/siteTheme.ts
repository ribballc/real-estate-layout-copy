import type { BusinessProfile } from "@/hooks/useBusinessData";

/** Chemical Guys–style default (when user hasn’t set a color post-onboarding): yellow/gold + dark gold. */
const DEFAULT_PRIMARY = "hsl(45,100%,52%)";
const DEFAULT_SECONDARY = "hsl(42,100%,45%)";

/** Normalize color to a valid CSS value; if invalid, return default. */
function normalizeColor(value: string | null | undefined, fallback: string): string {
  if (!value || typeof value !== "string") return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  // Accept hsl(), hsla(), #hex, rgb(), named
  if (/^(hsl|hsla|rgb|rgba)\(/.test(trimmed) || /^#[0-9A-Fa-f]{3,8}$/.test(trimmed)) return trimmed;
  if (/^[a-zA-Z]+$/.test(trimmed)) return trimmed;
  return fallback;
}

/**
 * Get primary and secondary accent colors from profile for the generated site.
 * Falls back to Chemical Guys–style yellow/gold when null (post-onboarding, no color set).
 */
export function getSiteAccentColors(profile: BusinessProfile | null | undefined): {
  primary: string;
  secondary: string;
} {
  const primary = normalizeColor(profile?.primary_color, DEFAULT_PRIMARY);
  const secondary = normalizeColor(profile?.secondary_color, DEFAULT_SECONDARY);
  return { primary, secondary };
}

/**
 * CSS custom properties to inject on the site root (e.g. main.site-page)
 * so all deluxe components can use var(--accent), var(--site-primary), var(--site-secondary).
 */
export function getSiteThemeStyle(profile: BusinessProfile | null | undefined): Record<string, string> {
  const { primary, secondary } = getSiteAccentColors(profile);
  return {
    "--accent": primary,
    "--site-primary": primary,
    "--site-secondary": secondary,
  };
}
