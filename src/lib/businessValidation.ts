/**
 * Limits and sanitization for business info and website customizations.
 * Ensures invalid or too-long input is adjusted so saves always work.
 */

export const LIMITS = {
  business_name: 100,
  tagline: 200,
  email: 254,
  phone: 30,
  address: 300,
  map_query: 500,
  service_area: 80,
  service_areas_max: 50,
} as const;

/** Trim and cap string to max length. */
export function trimAndCap(value: string, max: number): string {
  return value.trim().slice(0, max);
}

/** Normalize primary/secondary color to valid hex or return fallback. */
const HEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
export function normalizeHexColor(value: string | null | undefined, fallback: string): string {
  if (value == null || typeof value !== "string") return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  if (HEX.test(trimmed)) return trimmed;
  // Allow 6 hex without #
  const noHash = trimmed.replace(/^#/, "");
  if (/^[0-9A-Fa-f]{6}$/.test(noHash)) return `#${noHash}`;
  if (/^[0-9A-Fa-f]{3}$/.test(noHash)) return `#${noHash}`;
  return fallback;
}

/** Slug-safe string for URL: lowercase, alphanumeric and hyphens only, max length. */
export const SLUG_MAX = 60;
export function toSlugSafe(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, SLUG_MAX);
}
