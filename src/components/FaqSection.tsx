import { useState } from "react";
import { ChevronDown } from "lucide-react";
import FadeIn from "@/components/FadeIn";

const faqs = [
  {
    question: "How long does it take to get my website live?",
    answer: "Your website is ready in 5 minutes after you complete the signup form. We use smart templates designed specifically for mobile detailers, so there's zero wait time.",
  },
  {
    question: "Do I need any tech skills?",
    answer: "None. We build everything for you. You just tell us your business name, services, and location. We handle the rest.",
  },
  {
    question: "How does the 14-day free trial work?",
    answer: "Start your trial instantly. No credit card required until day 14. Use the full system, get bookings, collect deposits. If you don't love it, cancel anytime with 2 clicks.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes. Cancel anytime from your dashboard in 2 clicks. No contracts, no commitments, no hassle.",
  },
  {
    question: "What if I already have a website?",
    answer: "Keep it or replace it — your choice. Most detailers replace their old site because ours books jobs automatically and looks more professional. We can also add a booking calendar to your existing site.",
  },
  {
    question: "How does the deposit system work?",
    answer: "Customers pay a deposit ($50-100, you choose) when they book. This filters out tire-kickers and cuts no-shows by 40%. Deposits are automatically applied to the final invoice.",
  },
  {
    question: "What's included in the $64/mo?",
    answer: "Everything: Website, booking calendar, SMS reminders, deposit collection, route optimization, client database, review automation, and priority support. Only additional cost is payment processing (2.9% + 30¢ per transaction).",
  },
  {
    question: "Do you take a percentage of my bookings?",
    answer: "Never. We don't touch your money. You pay $64/mo flat, plus standard payment processing fees (same as Stripe/Square). We make money when you subscribe, not when you get paid.",
  },
  {
    question: "What if I don't get any bookings?",
    answer: "We offer a First Booking Guarantee. If you don't get your first booking within 30 days, we'll refund everything. Zero risk.",
  },
];

const FaqItem = ({ question, answer, index }: { question: string; answer: string; index: number }) => {
  const [open, setOpen] = useState(false);

  return (
    <FadeIn delay={index * 80}>
      <div
        className={`group rounded-2xl border transition-all duration-300 ${
          open
            ? "border-accent/30 shadow-[0_8px_32px_hsla(217,91%,60%,0.08)]"
            : "border-border hover:border-accent/20"
        }`}
        style={{ background: open ? "hsla(217, 91%, 60%, 0.03)" : "hsl(var(--card))" }}
      >
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between gap-4 px-6 md:px-8 py-5 md:py-6 text-left min-h-[48px]"
          aria-expanded={open}
        >
          <span className="font-semibold text-base md:text-lg text-foreground leading-snug pr-4">
            {question}
          </span>
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
              open ? "bg-accent/10 rotate-180" : "bg-secondary group-hover:bg-accent/10"
            }`}
          >
            <ChevronDown className={`w-4 h-4 transition-colors duration-300 ${open ? "text-accent" : "text-muted-foreground"}`} />
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
          <p className="px-6 md:px-8 pb-6 md:pb-8 text-muted-foreground leading-relaxed text-[15px] md:text-base">
            {answer}
          </p>
        </div>
      </div>
    </FadeIn>
  );
};

const FaqSection = () => {
  return (
    <section className="py-16 md:py-24 px-5 md:px-8" style={{
      background: "linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(210 40% 98%) 100%)",
    }}>
      <div className="max-w-3xl mx-auto">
        <FadeIn>
          <h2 className="font-heading text-[28px] md:text-[48px] font-bold tracking-[-0.015em] leading-[1.2] text-foreground text-center mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-base md:text-lg text-muted-foreground text-center max-w-xl mx-auto mb-12 md:mb-16 leading-relaxed">
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
