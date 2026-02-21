import { Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import type { BusinessProfile } from '@/hooks/useBusinessData';
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
}

const DeluxeFAQ = ({ profile }: Props) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="site-section">
      <div className="max-w-3xl mx-auto px-6">
        <SiteFadeIn>
          <div className="text-center mb-16">
            <p className="text-[13px] uppercase tracking-[0.2em] text-white/40 font-medium mb-4">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Common questions
            </h2>
          </div>
        </SiteFadeIn>

        <div className="space-y-2">
          {defaultFaqs.map((faq, index) => (
            <SiteFadeIn key={index} delay={index * 60} distance={16}>
              <div
                className={`border rounded-xl overflow-hidden transition-all duration-400 ${
                  openIndex === index
                    ? 'border-white/[0.12] bg-white/[0.04]'
                    : 'border-white/[0.06] hover:border-white/[0.1]'
                }`}
              >
                <button
                  className="w-full px-5 py-4 flex items-center justify-between text-left"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className="font-medium text-white/80 text-[15px] pr-4">{faq.question}</span>
                  <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                    openIndex === index ? 'bg-white/[0.12] rotate-0' : 'bg-white/[0.06]'
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
                    maxHeight: openIndex === index ? '200px' : '0px',
                    opacity: openIndex === index ? 1 : 0,
                  }}
                >
                  <div className="px-5 pb-4">
                    <p className="text-white/40 text-sm leading-relaxed">{faq.answer}</p>
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
