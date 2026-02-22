/**
 * Website template engine: takes profile (and optional services/hours) and returns
 * a complete mobile-first HTML/CSS string for the customer's site.
 */

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export interface ProfileInput {
  business_name: string;
  tagline: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  slug?: string | null;
  logo_url?: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
}

export interface ServiceInput {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url?: string | null;
  sort_order?: number;
}

export interface BusinessHoursInput {
  day_of_week: number;
  open_time: string;
  close_time: string;
  is_closed: boolean;
}

export interface WebsiteGeneratorInput {
  profile: ProfileInput;
  services?: ServiceInput[];
  businessHours?: BusinessHoursInput[];
  /** Base URL for booking (e.g. origin + /site/:slug/book) */
  bookingUrl?: string;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatPrice(dollars: number): string {
  return "$" + (Number(dollars) % 1 === 0 ? dollars.toFixed(0) : dollars.toFixed(2));
}

function formatTime(t: string): string {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m ? String(m).padStart(2, "0") : "00"} ${period}`;
}

function formatHours(hours: BusinessHoursInput[]): { day: string; text: string }[] {
  const byDay = new Map<number, BusinessHoursInput>();
  hours.forEach((h) => byDay.set(h.day_of_week, h));
  return DAY_NAMES.map((day, i) => {
    const h = byDay.get(i);
    const text = !h || h.is_closed ? "Closed" : `${formatTime(h.open_time)} – ${formatTime(h.close_time)}`;
    return { day, text };
  });
}

/**
 * Returns a complete HTML document (mobile-first) for the business site.
 */
export function generateWebsiteHtml(input: WebsiteGeneratorInput): string {
  const { profile, services = [], businessHours = [], bookingUrl = "#book" } = input;
  const name = escapeHtml(profile.business_name || "Our Business");
  const tagline = escapeHtml(profile.tagline || "Quality service you can trust.");
  const primary = profile.primary_color || "#2563eb";
  const secondary = profile.secondary_color || "#1e40af";
  const phone = profile.phone ? escapeHtml(profile.phone) : "";
  const email = profile.email ? escapeHtml(profile.email) : "";
  const address = profile.address ? escapeHtml(profile.address) : "";
  const hoursFormatted = businessHours.length ? formatHours(businessHours) : [];
  const sortedServices = [...services].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  const servicesHtml =
    sortedServices.length > 0
      ? sortedServices
          .map(
            (s) => `
        <article class="card">
          <div class="card-img">${s.image_url ? `<img src="${escapeHtml(s.image_url)}" alt="${escapeHtml(s.title)}" loading="lazy" />` : '<span class="card-img-placeholder">Service</span>'}</div>
          <div class="card-body">
            <h3 class="card-title">${escapeHtml(s.title)}</h3>
            <p class="card-desc">${escapeHtml(s.description || "")}</p>
            <p class="card-price">${formatPrice(s.price)}</p>
          </div>
        </article>`
          )
          .join("\n")
      : `
        <p class="section-sub">No services listed yet. Check back soon.</p>`;

  const hoursHtml =
    hoursFormatted.length > 0
      ? hoursFormatted
          .map(({ day, text }) => `<tr><td>${day}</td><td>${escapeHtml(text)}</td></tr>`)
          .join("\n")
      : "";

  const galleryPlaceholders = [1, 2, 3, 4, 5, 6].map(
    (i) =>
      `<div class="gallery-item"><img src="https://placehold.co/600x400/1e293b/64748b?text=Photo+${i}" alt="Gallery ${i}" loading="lazy" /></div>`
  ).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${name}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { margin: 0; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; line-height: 1.6; color: #1e293b; background: #fff; }
    img { max-width: 100%; height: auto; display: block; }
    a { color: ${primary}; text-decoration: none; }
    a:hover { text-decoration: underline; }

    .container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
    @media (min-width: 768px) { .container { padding: 0 1.5rem; } }

    /* Hero - mobile first */
    .hero { padding: 2.5rem 0 3rem; text-align: center; background: linear-gradient(180deg, ${primary}22 0%, transparent 100%); }
    @media (min-width: 768px) { .hero { padding: 4rem 0 5rem; } }
    .hero-logo { max-height: 56px; margin-bottom: 1rem; }
    .hero h1 { font-size: 1.75rem; font-weight: 700; margin: 0 0 0.5rem; color: #0f172a; }
    @media (min-width: 768px) { .hero h1 { font-size: 2.5rem; } }
    .hero-tagline { font-size: 1rem; color: #475569; margin: 0; }
    @media (min-width: 768px) { .hero-tagline { font-size: 1.25rem; } }

    /* Section */
    section { padding: 2.5rem 0; }
    @media (min-width: 768px) { section { padding: 3.5rem 0; } }
    .section-title { font-size: 1.5rem; font-weight: 700; margin: 0 0 1rem; color: #0f172a; }
    @media (min-width: 768px) { .section-title { font-size: 1.75rem; } }
    .section-sub { color: #64748b; margin: 0; }

    /* Services - cards */
    .services-grid { display: grid; gap: 1.25rem; }
    @media (min-width: 640px) { .services-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 1024px) { .services-grid { grid-template-columns: repeat(3, 1fr); gap: 1.5rem; } }
    .card { border-radius: 12px; overflow: hidden; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
    .card-img { aspect-ratio: 16/10; background: #f1f5f9; }
    .card-img img { width: 100%; height: 100%; object-fit: cover; }
    .card-img-placeholder { display: flex; align-items: center; justify-content: center; height: 100%; color: #94a3b8; font-size: 0.875rem; }
    .card-body { padding: 1rem; }
    .card-title { font-size: 1.125rem; font-weight: 600; margin: 0 0 0.25rem; color: #0f172a; }
    .card-desc { font-size: 0.875rem; color: #64748b; margin: 0 0 0.5rem; }
    .card-price { font-size: 1rem; font-weight: 700; color: ${primary}; margin: 0; }

    /* Gallery */
    .gallery { background: #f8fafc; }
    .gallery-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; }
    @media (min-width: 640px) { .gallery-grid { grid-template-columns: repeat(3, 1fr); gap: 0.75rem; } }
    .gallery-item { aspect-ratio: 1; overflow: hidden; border-radius: 8px; }
    .gallery-item img { width: 100%; height: 100%; object-fit: cover; }

    /* About */
    .about p { margin: 0 0 1rem; color: #475569; }
    .about p:last-child { margin-bottom: 0; }

    /* CTA */
    .cta { text-align: center; background: ${primary}; color: #fff; }
    .cta .section-title { color: #fff; }
    .cta .section-sub { color: rgba(255,255,255,0.9); margin-bottom: 1.5rem; }
    .cta-btn { display: inline-block; padding: 0.875rem 2rem; font-size: 1rem; font-weight: 600; color: ${primary}; background: #fff; border-radius: 8px; border: none; cursor: pointer; text-decoration: none; transition: transform 0.2s, box-shadow 0.2s; }
    .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); text-decoration: none; }

    /* Footer */
    footer { background: #0f172a; color: #94a3b8; padding: 2rem 0; font-size: 0.875rem; }
    footer a { color: #cbd5e1; }
    .footer-grid { display: grid; gap: 1.5rem; }
    @media (min-width: 640px) { .footer-grid { grid-template-columns: 1fr 1fr; } }
    @media (min-width: 768px) { .footer-grid { grid-template-columns: 1fr 1fr 1fr; } }
    .footer-brand { font-weight: 700; color: #fff; font-size: 1rem; }
    .footer-section h4 { color: #e2e8f0; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 0.5rem; }
    .footer-section p { margin: 0; }
    .footer-section table { width: 100%; border-collapse: collapse; }
    .footer-section td { padding: 0.2rem 0; }
    .footer-section td:first-child { color: #94a3b8; padding-right: 0.5rem; }
  </style>
</head>
<body>
  <header class="hero">
    <div class="container">
      ${profile.logo_url ? `<img class="hero-logo" src="${escapeHtml(profile.logo_url)}" alt="${name}" />` : ""}
      <h1>${name}</h1>
      <p class="hero-tagline">${tagline}</p>
    </div>
  </header>

  <section id="services" class="container">
    <h2 class="section-title">Services</h2>
    <div class="services-grid">${servicesHtml}</div>
  </section>

  <section id="gallery" class="gallery">
    <div class="container">
      <h2 class="section-title">Gallery</h2>
      <div class="gallery-grid">${galleryPlaceholders}</div>
    </div>
  </section>

  <section id="about" class="about container">
    <h2 class="section-title">About Us</h2>
    <p>${name} is here to deliver the best experience. ${tagline}</p>
    <p>Get in touch or book online to get started.</p>
  </section>

  <section id="book" class="cta">
    <div class="container">
      <h2 class="section-title">Book Now</h2>
      <p class="section-sub">Reserve your spot online — fast and easy.</p>
      <a href="${escapeHtml(bookingUrl)}" class="cta-btn">Book Online</a>
    </div>
  </section>

  <footer>
    <div class="container">
      <div class="footer-grid">
        <div class="footer-section">
          <p class="footer-brand">${name}</p>
          <p>${tagline}</p>
        </div>
        ${hoursFormatted.length > 0 ? `
        <div class="footer-section">
          <h4>Hours</h4>
          <table>${hoursHtml}</table>
        </div>` : ""}
        <div class="footer-section">
          <h4>Contact</h4>
          ${phone ? `<p><a href="tel:${phone.replace(/\D/g, "")}">${phone}</a></p>` : ""}
          ${email ? `<p><a href="mailto:${email}">${email}</a></p>` : ""}
          ${address ? `<p>${address}</p>` : ""}
        </div>
      </div>
    </div>
  </footer>
</body>
</html>`;
}
