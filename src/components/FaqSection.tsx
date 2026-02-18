import { useState } from "react";
import { ChevronDown } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import { FAQ_ITEMS } from "@/lib/seo";

const faqs = FAQ_ITEMS;
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
          <p className="px-6 md:px-8 pb-6 md:pb-8 leading-relaxed text-[15px] md:text-base" style={{ color: "hsl(215, 16%, 47%)" }}>
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
            className="font-heading text-[28px] md:text-[56px] lg:text-[72px] font-bold tracking-[-0.015em] leading-[1.2] text-center mb-3"
            style={{ color: "hsl(222, 47%, 11%)" }}
          >
            Frequently Asked Questions
          </h2>
          <p className="text-base md:text-lg text-center max-w-xl mx-auto mb-12 md:mb-16 leading-relaxed" style={{ color: "hsl(215, 16%, 47%)" }}>
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
