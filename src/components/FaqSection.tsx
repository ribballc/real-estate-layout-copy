import { useState } from "react";
import { ChevronDown } from "lucide-react";
import FadeIn from "@/components/FadeIn";

const faqs = [
  {
    question: "How long does it take to get my website live?",
    answer: "48 hours or less. Once you tell us about your shop — services, hours, location — we build everything: your website, booking calendar, SMS reminders, and deposit collection. You'll be taking online bookings by the weekend.",
  },
  {
    question: "Do I need any tech skills?",
    answer: "Zero. We handle everything from setup to launch. If you can send a text message, you can manage your Darker dashboard. We also provide hands-on support if you ever get stuck.",
  },
  {
    question: "How does the deposit system work?",
    answer: "When customers book, they pay a deposit ($50–$100, you choose the amount) upfront via card. This filters out tire-kickers and protects you from no-shows. If they don't show, you keep the deposit. Payments hit your bank account next business day.",
  },
  {
    question: "What if I already have a website?",
    answer: "No problem. We can either replace your existing site or add our booking system alongside it. Most detailers find our done-for-you website outperforms what they were paying $100–$150/month for elsewhere.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes — cancel in 2 clicks from your dashboard. No contracts, no cancellation fees, no questions asked. You also get a full 14-day free trial before you're ever charged.",
  },
  {
    question: "How does the 14-day free trial work?",
    answer: "Sign up, get your website built, and start taking bookings — all without entering a credit card. After 14 days, pick the plan that fits. If it's not for you, just walk away. No charge, no hassle.",
  },
];

const FaqItem = ({ question, answer, index }: { question: string; answer: string; index: number }) => {
  const [open, setOpen] = useState(false);

  return (
    <FadeIn delay={index * 80}>
      <div
        className="group rounded-2xl transition-all duration-300"
        style={{
          background: open ? 'hsla(217, 91%, 60%, 0.05)' : 'hsla(215, 50%, 12%, 0.4)',
          border: open ? '1px solid hsla(217, 91%, 60%, 0.2)' : '1px solid hsla(0, 0%, 100%, 0.08)',
          boxShadow: open ? '0 8px 32px hsla(217, 91%, 60%, 0.06)' : 'none',
        }}
      >
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between gap-4 px-6 md:px-8 py-5 md:py-6 text-left min-h-[48px]"
          aria-expanded={open}
        >
          <span className="font-semibold text-base md:text-lg leading-snug pr-4" style={{ color: 'hsl(0, 0%, 100%)' }}>
            {question}
          </span>
          <div
            className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300"
            style={{
              background: open ? 'hsla(217, 91%, 60%, 0.15)' : 'hsla(0, 0%, 100%, 0.06)',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            <ChevronDown className="w-4 h-4" style={{ color: open ? 'hsl(217, 91%, 70%)' : 'hsla(0, 0%, 100%, 0.4)' }} />
          </div>
        </button>
        <div
          className="overflow-hidden transition-all duration-400"
          style={{
            maxHeight: open ? "300px" : "0px",
            opacity: open ? 1 : 0,
            transition: "max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease",
          }}
        >
          <p className="px-6 md:px-8 pb-6 md:pb-8 leading-relaxed text-[15px] md:text-base" style={{ color: 'hsla(0, 0%, 100%, 0.6)' }}>
            {answer}
          </p>
        </div>
      </div>
    </FadeIn>
  );
};

const FaqSection = () => {
  return (
    <section
      className="relative py-16 md:py-24 px-5 md:px-8 overflow-hidden"
      style={{
        background: 'hsl(215, 50%, 10%)',
      }}
    >
      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(0 0% 100%) 1px, transparent 0)',
        backgroundSize: '50px 50px',
      }} />

      <div className="max-w-3xl mx-auto relative z-10">
        <FadeIn>
          <h2
            className="font-heading text-[28px] md:text-[56px] lg:text-[72px] font-bold tracking-[-0.015em] leading-[1.2] text-center mb-3"
            style={{
              background: 'linear-gradient(135deg, hsl(0, 0%, 100%) 0%, hsla(0, 0%, 100%, 0.85) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Frequently Asked Questions
          </h2>
          <p className="text-base md:text-lg text-center max-w-xl mx-auto mb-12 md:mb-16 leading-relaxed" style={{ color: 'hsla(0, 0%, 100%, 0.6)' }}>
            Everything you need to know before getting started.
          </p>
        </FadeIn>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <FaqItem key={i} question={faq.question} answer={faq.answer} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
