import { Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import type { BusinessProfile } from '@/hooks/useBusinessData';

const defaultFaqs = [
  { question: 'How long does a full detail take?', answer: 'A full thorough interior detail typically takes about 1.5 hours for sedans and coupes. Larger vehicles like trucks and SUVs may take slightly longer. Express services are completed in about 35-40 minutes.' },
  { question: 'Do you offer mobile detailing services?', answer: 'Contact us to discuss mobile detailing options. We can accommodate your needs and come to your location for added convenience.' },
  { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards, debit cards, and cash. Payment is due upon completion of the service.' },
  { question: 'Do I need to make an appointment?', answer: 'Yes, we recommend booking an appointment to ensure we can accommodate you at your preferred time. Contact us via email or social media to schedule.' },
  { question: 'What products do you use?', answer: 'We use only premium, professional-grade detailing products that are safe for all vehicle surfaces and interiors. Our products are carefully selected for optimal results.' },
  { question: 'Can you remove pet hair from my vehicle?', answer: 'Absolutely! We offer pet hair removal as an add-on service. Pricing ranges from $10 to $80+ depending on the severity level, which we assess upon arrival.' },
];

interface Props {
  profile?: BusinessProfile | null;
}

const DeluxeFAQ = ({ profile }: Props) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary font-semibold tracking-[0.2em] uppercase mb-4">Got Questions?</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Frequently <span className="gold-gradient-text">Asked</span> Questions</h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {defaultFaqs.map((faq, index) => (
            <div key={index} className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-colors">
              <button className="w-full px-6 py-5 flex items-center justify-between text-left" onClick={() => setOpenIndex(openIndex === index ? null : index)}>
                <span className="font-semibold text-foreground pr-4">{faq.question}</span>
                <span className="flex-shrink-0 w-8 h-8 rounded-full gold-gradient flex items-center justify-center">
                  {openIndex === index ? <Minus className="w-4 h-4 text-primary-foreground" /> : <Plus className="w-4 h-4 text-primary-foreground" />}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5">
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DeluxeFAQ;
