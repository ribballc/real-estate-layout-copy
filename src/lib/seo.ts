export const SITE_URL = 'https://darkerdigital.com';
export const SITE_NAME = 'Darker';
export const SITE_TWITTER = '@darkerdigital';

export const DEFAULT_SEO = {
  title: 'Darker — Website & Booking System for Auto Detailers',
  description:
    'Get a done-for-you website and 24/7 online booking system built for auto detailers, PPF installers, and tint shops. Customers book, pay deposits, and get reminders automatically. Start free.',
  ogImage: `${SITE_URL}/og-default.jpg`,
};

export function buildTitle(pageTitle?: string): string {
  if (!pageTitle) return DEFAULT_SEO.title;
  return `${pageTitle} | ${SITE_NAME}`;
}

/** FAQ items exported so they can power both UI and structured data */
export const FAQ_ITEMS = [
  {
    question: 'How long does it take to get my website live?',
    answer:
      '48 hours or less. Once you tell us about your shop — services, hours, location — we build everything: your website, booking calendar, SMS reminders, and deposit collection. You\'ll be taking online bookings by the weekend.',
  },
  {
    question: 'Do I need any tech skills?',
    answer:
      'Zero. We handle everything from setup to launch. If you can send a text message, you can manage your Darker dashboard. We also provide hands-on support if you ever get stuck.',
  },
  {
    question: 'How does the deposit system work?',
    answer:
      'When customers book, they pay a deposit ($50–$100, you choose the amount) upfront via card. This filters out tire-kickers and protects you from no-shows. If they don\'t show, you keep the deposit. Payments hit your bank account next business day.',
  },
  {
    question: 'What if I already have a website?',
    answer:
      'No problem. We can either replace your existing site or add our booking system alongside it. Most detailers find our done-for-you website outperforms what they were paying $100–$150/month for elsewhere.',
  },
  {
    question: 'Can I cancel anytime?',
    answer:
      'Yes — cancel in 2 clicks from your dashboard. No contracts, no cancellation fees, no questions asked. You also get a full 14-day free trial before you\'re ever charged.',
  },
  {
    question: 'How does the 14-day free trial work?',
    answer:
      'Sign up, get your website built, and start taking bookings — all without entering a credit card. After 14 days, pick the plan that fits. If it\'s not for you, just walk away. No charge, no hassle.',
  },
];

/** Build OpeningHoursSpecification from business hours */
export function buildHoursSchema(hours: { day: string; time: string }[]) {
  const dayMap: Record<string, string> = {
    Monday: 'Mo', Tuesday: 'Tu', Wednesday: 'We', Thursday: 'Th',
    Friday: 'Fr', Saturday: 'Sa', Sunday: 'Su',
  };
  return hours
    .filter((h) => h.time !== 'Closed')
    .map((h) => {
      const [open, close] = h.time.split(' – ');
      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: dayMap[h.day] || h.day,
        opens: open,
        closes: close,
      };
    });
}
