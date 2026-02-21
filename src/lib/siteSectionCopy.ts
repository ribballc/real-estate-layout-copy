/**
 * Default section titles and microcopy for the generated site.
 * Components use websiteCopy?.section_titles?.[key] ?? DEFAULT_SECTION_TITLES[key]
 * so businesses can override via CMS when section_titles is populated.
 */
export const DEFAULT_SECTION_TITLES: Record<string, string> = {
  section_services: "What we do best",
  section_services_sub: "From quick refreshes to complete transformations.",
  section_packages: "Pick your package",
  section_packages_sub: "No hidden fees. Book in under 60 seconds.",
  section_gallery: "Our Work",
  section_gallery_sub: "Results speak for themselves",
  section_testimonials: "The word on the street",
  section_testimonials_sub: "What our customers say",
  section_why_choose_us: "Built different",
  section_why_choose_us_sub: "Why book with us",
  section_cta: "Ready to see the difference?",
  section_faq: "Common questions",
  section_contact: "Get in touch",
  section_contact_heading: "Get in touch",
};

export function getSectionTitle(
  websiteCopy: { section_titles?: Record<string, string> } | null | undefined,
  key: keyof typeof DEFAULT_SECTION_TITLES
): string {
  return websiteCopy?.section_titles?.[key] ?? DEFAULT_SECTION_TITLES[key] ?? "";
}
