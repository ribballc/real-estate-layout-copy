import { Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import type { BusinessProfile } from '@/hooks/useBusinessData';

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
        <div className="text-center mb-16">
          <p className="text-[13px] uppercase tracking-[0.2em] text-white/40 font-medium mb-4">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            Common questions
          </h2>
        </div>

        <div className="space-y-2">
          {defaultFaqs.map((faq, index) => (
            <div
              key={index}
              className="border border-white/[0.06] rounded-xl overflow-hidden hover:border-white/[0.1] transition-colors"
            >
              <button
                className="w-full px-5 py-4 flex items-center justify-between text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-medium text-white/80 text-[15px] pr-4">{faq.question}</span>
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center">
                  {openIndex === index
                    ? <Minus className="w-3.5 h-3.5 text-white/50" />
                    : <Plus className="w-3.5 h-3.5 text-white/50" />
                  }
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-40' : 'max-h-0'}`}>
                <div className="px-5 pb-4">
                  <p className="text-white/40 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DeluxeFAQ;
