/**
 * Deluxe site image pool — unique hero and service images per site (by slug).
 * Each site gets a deterministic hero and service-card image set so layouts feel
 * unique and on-brand. Add more images to src/assets/deluxe (e.g. from
 * Detailer Site Fillers) and extend HERO_IMAGES / SERVICE_IMAGES for more variety.
 */
import heroBg from '@/assets/deluxe/hero-bg.jpg';
import stock1 from '@/assets/deluxe/stock-1.jpg';
import stock2 from '@/assets/deluxe/stock-2.jpg';
import stock3 from '@/assets/deluxe/stock-3.jpg';
import stock4 from '@/assets/deluxe/stock-4.jpg';
import stock5 from '@/assets/deluxe/stock-5.jpg';
import stock6 from '@/assets/deluxe/stock-6.jpg';
import stock7 from '@/assets/deluxe/stock-7.jpg';

/** Hero backgrounds: first is default; each site gets one by slug for a unique look. */
export const HERO_IMAGES = [
  heroBg,
  stock1,
  stock2,
  stock5,
  stock4,
  stock6,
] as const;

/** Service card / gallery filler pool — rotate by slug + index so each site feels unique. */
export const SERVICE_IMAGES = [
  stock1,
  stock2,
  stock3,
  stock4,
  stock5,
  stock6,
  stock7,
] as const;

function hashSlug(slug: string | undefined): number {
  if (!slug) return 0;
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return h;
}

/**
 * Deterministic hero image per site. Use customUrl when set (profile.hero_background_url).
 */
export function getHeroImageUrl(
  slug: string | undefined,
  customUrl: string | null | undefined
): string {
  if (customUrl && typeof customUrl === 'string' && customUrl.startsWith('http'))
    return customUrl;
  const idx = hashSlug(slug) % HERO_IMAGES.length;
  return HERO_IMAGES[idx];
}

/**
 * Deterministic service card image per site + slot. Use customUrl when set (service.image_url).
 */
export function getServiceImageUrl(
  slug: string | undefined,
  index: number,
  customUrl: string | null | undefined
): string {
  if (customUrl && typeof customUrl === 'string' && customUrl.startsWith('http'))
    return customUrl;
  const h = (hashSlug(slug) + index * 17) >>> 0;
  const idx = h % SERVICE_IMAGES.length;
  return SERVICE_IMAGES[idx];
}
