import { Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import type { BusinessProfile, WebsiteCopy } from '@/hooks/useBusinessData';
import { getSectionTitle } from '@/lib/siteSectionCopy';
import SiteFadeIn from './SiteFadeIn';

const defaultFaqs = [
  { question: 'How long does a full detail take?', answer: 'A full interior detail typically takes about 1.5 hours for sedans. Larger vehicles may take slightly longer. Express services are completed in about 35-40 minutes.' },
  { question: 'Do you offer mobile detailing?', answer: 'Contact us to discuss mobile detailing options. We can come to your home or office for added convenience.' },
  { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards, debit cards, and cash. Payment is collected at the time of booking or upon completion.' },
  { question: 'Do I need an appointment?', answer: 'We recommend booking online to guarantee your preferred time slot. Walk-ins are welcome based on availability.' },
  { question: 'What products do you use?', answer: 'We use only professional-grade, pH-balanced products that are safe for all vehicle surfaces, paint finishes, and interior materials.' },
  { question: 'Can you remove pet hair?', answer: 'Yes. Pet hair removal is available as an add-on service. Pricing varies based on severity.' },
];

interface Props {
  profile?: BusinessProfile | null;
  websiteCopy?: WebsiteCopy | null;
}

const DeluxeFAQ = ({ profile, websiteCopy }: Props) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqs = websiteCopy?.faq_items && websiteCopy.faq_items.length > 0
    ? websiteCopy.faq_items
    : defaultFaqs;

  return (
    <section id="faq" className="site-section relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-accent" style={{
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 70%)',
      }} />
      <div className="site-container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SiteFadeIn>
          <div className="text-center mb-12">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[var(--site-primary)] font-semibold mb-3">FAQ</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              {getSectionTitle(websiteCopy, 'section_faq')}
            </h2>
          </div>
        </SiteFadeIn>

        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <SiteFadeIn key={index} delay={index * 60} distance={16}>
              <div
                className={`border rounded-xl overflow-hidden transition-all duration-400 ${
                  openIndex === index
                    ? 'border-white/15 bg-surface-2 shadow-glass'
                    : 'border-white/10 hover:border-white/15 bg-surface-2/80 shadow-glass'
                }`}
              >
                <button
                  className="site-tap-target w-full px-5 py-4 flex items-center justify-between text-left min-h-[48px]"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className="font-medium text-white/80 text-[15px] pr-4">{faq.question}</span>
                  <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                    openIndex === index ? 'bg-white/15 rotate-0' : 'bg-surface-3'
                  }`}>
                    {openIndex === index
                      ? <Minus className="w-3.5 h-3.5 text-white/60" />
                      : <Plus className="w-3.5 h-3.5 text-white/50" />
                    }
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-all duration-400 ease-out"
                  style={{
                    maxHeight: openIndex === index ? '2000px' : '0px',
                    opacity: openIndex === index ? 1 : 0,
                  }}
                >
                  <div className="px-5 pb-4">
                    <p className="text-white/55 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            </SiteFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DeluxeFAQ;
