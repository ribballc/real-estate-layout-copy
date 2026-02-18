import { useState } from "react";
import { ChevronDown } from "lucide-react";
import FadeIn from "@/components/FadeIn";

const faqs = [
  {
    question: "How long does it take to get my website live?",
    answer: "48 hours from when you complete onboarding. We build it, you approve it. If you need changes, we make them same day. Most shops are live and taking bookings within 3 days total.",
  },
  {
    question: "Do I need any tech skills?",
    answer: "None. Zero. We've set this up for shop owners who had never built anything online before. If you can send a text, you can manage your Darker dashboard.",
  },
  {
    question: "How does the deposit system work?",
    answer: "When a customer books, they pay a $50–$100 deposit right on your site — before the appointment is confirmed. This gets processed by Stripe and sent to your bank account. Serious customers only.",
  },
  {
    question: "What if I already have a website?",
    answer: "Most shops that switch say their Darker site outperforms their old one in 30 days — in traffic, bookings, and Google ranking. But you can run both. We'll help you migrate over time.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes. No contracts, no calls, no forms. Two clicks inside your account and you're done. We don't make cancelling hard because we don't need to — the product keeps people here.",
  },
  {
    question: "How does the 14-day free trial work?",
    answer: "Sign up, get your site built, start taking bookings — all before you ever enter a card. At day 14, you decide. If it's not worth $54/month, cancel. No hard feelings, no charge.",
  },
];

const FaqItem = ({ question, answer, index }: { question: string; answer: string; index: number }) => {
  const [open, setOpen] = useState(false);

  return (
    <FadeIn delay={index * 80}>
      <div
        className="group rounded-2xl transition-all duration-300"
        style={{
          background: open ? "hsla(217, 71%, 53%, 0.05)" : "hsl(0, 0%, 100%)",
          border: open ? "1px solid hsla(217, 71%, 53%, 0.3)" : "1px solid hsl(214, 20%, 90%)",
          boxShadow: open ? "0 8px 32px hsla(217, 71%, 53%, 0.08)" : "0 2px 8px hsla(0, 0%, 0%, 0.04)",
        }}
      >
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between gap-4 px-6 md:px-8 py-5 md:py-6 text-left min-h-[48px]"
          aria-expanded={open}
        >
          <span className="font-semibold text-base md:text-lg leading-snug pr-4" style={{ color: "hsl(222, 47%, 11%)" }}>
            {question}
          </span>
          <div
            className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300"
            style={{
              background: open ? "hsla(217, 71%, 53%, 0.1)" : "hsl(210, 40%, 96%)",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <ChevronDown className="w-4 h-4" style={{ color: open ? "hsl(217, 71%, 53%)" : "hsl(215, 16%, 47%)" }} />
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
          <p className="px-6 md:px-8 pb-6 md:pb-8 leading-[1.7] text-[15px] md:text-base" style={{ color: "hsl(215, 16%, 47%)" }}>
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
      style={{ background: "hsl(210, 40%, 98%)" }}
    >
      <div className="max-w-3xl mx-auto relative z-10">
        <FadeIn>
          <h2
            className="font-heading text-[30px] md:text-[48px] lg:text-[56px] font-bold tracking-[-0.015em] leading-[1.2] text-center mb-3"
            style={{ color: "hsl(222, 47%, 11%)" }}
          >
            You've Got Questions.
          </h2>
          <p className="text-lg text-center max-w-xl mx-auto mb-12 md:mb-16 leading-[1.7] mt-3" style={{ color: "hsl(215, 16%, 47%)" }}>
            We've heard them all. Here are the real answers.
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
