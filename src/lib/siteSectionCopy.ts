/**
 * Default section titles and microcopy for the generated site.
 * Components use websiteCopy?.section_titles?.[key] ?? DEFAULT_SECTION_TITLES[key]
 * so businesses can override via CMS when section_titles is populated.
 */
/** Default section titles — aligned with leading detailer sites (Top Class, Auto Detailing Solutions, etc.). */
export const DEFAULT_SECTION_TITLES: Record<string, string> = {
  section_services: "Our Services",
  section_services_sub: "From exterior washes to ceramic coating and paint correction.",
  section_packages: "Packages & Pricing",
  section_packages_sub: "Transparent pricing. Book online in under a minute.",
  section_gallery: "Our Work",
  section_gallery_sub: "Results that speak for themselves.",
  section_testimonials: "What Our Clients Say",
  section_testimonials_sub: "Real reviews from real customers.",
  section_why_choose_us: "Why Choose Us",
  section_why_choose_us_sub: "Professional care and attention to detail.",
  section_cta: "Let's Get Started",
  section_faq: "Frequently Asked Questions",
  section_contact: "Contact Us",
  section_contact_heading: "Get in Touch",
};

export function getSectionTitle(
  websiteCopy: { section_titles?: Record<string, string> } | null | undefined,
  key: keyof typeof DEFAULT_SECTION_TITLES
): string {
  return websiteCopy?.section_titles?.[key] ?? DEFAULT_SECTION_TITLES[key] ?? "";
}
