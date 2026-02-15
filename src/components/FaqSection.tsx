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
          background: open ? "hsla(210, 100%, 45%, 0.04)" : "#ffffff",
          border: open ? "1px solid hsla(210, 100%, 45%, 0.15)" : "1px solid rgba(0, 0, 0, 0.08)",
          boxShadow: open ? "0 8px 32px rgba(0, 0, 0, 0.06)" : "0 2px 8px rgba(0, 0, 0, 0.03)",
        }}
      >
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between gap-4 px-6 md:px-8 py-5 md:py-6 text-left min-h-[48px]"
          aria-expanded={open}
        >
          <span className="font-medium text-[17px] md:text-[19px] leading-snug pr-4" style={{ color: "#1d1d1f", letterSpacing: "-0.2px" }}>
            {question}
          </span>
          <div
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              background: open ? "hsla(210, 100%, 45%, 0.1)" : "#f5f5f7",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <ChevronDown className="w-4 h-4" style={{ color: open ? "#0071e3" : "#86868b" }} />
          </div>
        </button>
        <div
          className="overflow-hidden transition-all"
          style={{
            maxHeight: open ? "300px" : "0px",
            opacity: open ? 1 : 0,
            transition: "max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease",
          }}
        >
          <p className="px-6 md:px-8 pb-6 md:pb-8 leading-[1.5] text-[15px] md:text-[17px]" style={{ color: "#86868b", letterSpacing: "-0.2px" }}>
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
      className="relative py-20 md:py-[100px] px-5 md:px-8 overflow-hidden"
      style={{ background: "#fbfbfd" }}
    >
      <div className="max-w-3xl mx-auto relative z-10">
        <FadeIn>
          <h2
            className="font-heading text-[28px] md:text-[40px] font-semibold leading-[1.15] text-center mb-4"
            style={{ color: "#1d1d1f", letterSpacing: "-0.4px" }}
          >
            Frequently Asked Questions
          </h2>
          <p className="text-[17px] md:text-[19px] text-center max-w-xl mx-auto mb-12 md:mb-16 leading-[1.5]" style={{ color: "#86868b", letterSpacing: "-0.2px" }}>
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
