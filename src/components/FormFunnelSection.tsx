import { useState, useEffect } from "react";
import { Check, ChevronRight, ArrowLeft } from "lucide-react";
import FadeIn from "@/components/FadeIn";

const STEPS = [
  {
    id: 1,
    title: "Tell Us About Your Shop",
    subtitle: "Quick details so we can build your site.",
    fields: [
      { name: "businessName", label: "Business Name", type: "text", placeholder: "e.g. Elite Mobile Detailing" },
      { name: "industry", label: "What do you specialize in?", type: "select", placeholder: "Select your specialty", options: ["Mobile Detailing", "Paint Protection Film (PPF)", "Window Tinting", "Ceramic Coating", "Full Detail Shop", "Car Wash", "Other"] },
    ],
  },
  {
    id: 2,
    title: "What's Costing You Money?",
    subtitle: "Pick the problems you want solved.",
    fields: [
      { name: "goals", label: "Select All That Apply", type: "multiselect", options: ["No-shows & cancellations", "No online booking", "No professional website", "Losing jobs to competitors online", "Too much texting back and forth", "Can't collect deposits"] },
    ],
  },
  {
    id: 3,
    title: "Where Should We Send Your Site?",
    subtitle: "We'll have it ready in 48 hours.",
    fields: [
      { name: "fullName", label: "Your Name", type: "text", placeholder: "Jake Smith" },
      { name: "phone", label: "Phone", type: "tel", placeholder: "(555) 123-4567" },
      { name: "email", label: "Email", type: "email", placeholder: "you@business.com" },
    ],
  },
];

const FormFunnelSection = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail) setFormData((prev) => ({ ...prev, email: detail }));
    };
    window.addEventListener("hero-email", handler);
    return () => window.removeEventListener("hero-email", handler);
  }, []);

  const step = STEPS[currentStep];

  const updateField = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleGoal = (goal: string) => {
    const current = (formData.goals as string[]) || [];
    const updated = current.includes(goal)
      ? current.filter((g) => g !== goal)
      : [...current, goal];
    setFormData((prev) => ({ ...prev, goals: updated }));
  };

  const canProceed = () => {
    if (currentStep === 0) {
      return !!(formData.businessName as string)?.trim() && !!(formData.industry as string)?.trim();
    }
    if (currentStep === 1) {
      return ((formData.goals as string[]) || []).length > 0;
    }
    if (currentStep === 2) {
      return !!(formData.fullName as string)?.trim() && !!(formData.phone as string)?.trim() && !!(formData.email as string)?.trim();
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setSubmitted(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  if (submitted) {
    return (
      <section id="form-funnel" className="bg-secondary py-16 md:py-24 px-5 md:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mx-auto mb-8">
            <Check className="w-10 h-10 text-accent-foreground" />
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4">
            You're All Set!
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We'll have your site ready in 48 hours. Check your email at <span className="text-foreground font-medium">{formData.email as string}</span> for next steps.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="form-funnel" className="bg-secondary py-16 md:py-24 px-5 md:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-12 max-w-xs mx-auto">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex-1">
              <div
                className={`h-2 rounded-full transition-colors duration-300 ${
                  i <= currentStep ? "bg-accent" : "bg-border"
                }`}
              />
            </div>
          ))}
        </div>

        <FadeIn>
          <div className="text-center mb-10">
            <p className="text-sm font-medium text-accent uppercase tracking-wider mb-3">
              {currentStep === 0 ? "est. takes <1 min" : `Step ${step.id} of ${STEPS.length}`}
            </p>
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-foreground mb-3">
              {step.title}
            </h2>
            <p className="text-muted-foreground text-base">{step.subtitle}</p>
          </div>
        </FadeIn>

        {/* Fields */}
        <div className="space-y-5">
          {step.fields.map((field) => {
            if (field.type === "multiselect") {
              const selected = (formData.goals as string[]) || [];
              return (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-foreground mb-3">{field.label}</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {field.options!.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleGoal(option)}
                        className={`p-4 rounded-xl text-sm font-medium transition-all duration-200 text-left min-h-[48px] ${
                          selected.includes(option)
                            ? "bg-accent text-accent-foreground shadow-md"
                            : "bg-background text-foreground border border-border hover:border-foreground/20"
                        }`}
                      >
                        {selected.includes(option) && <Check className="w-4 h-4 inline mr-2" />}
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              );
            }

            if (field.type === "select") {
              return (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-foreground mb-2">{field.label}</label>
                  <select
                    value={(formData[field.name] as string) || ""}
                    onChange={(e) => updateField(field.name, e.target.value)}
                    className="w-full px-5 py-4 rounded-xl bg-background border border-border text-foreground text-base focus:outline-none focus:ring-2 focus:ring-ring transition-all appearance-none min-h-[52px]"
                  >
                    <option value="">{field.placeholder}</option>
                    {field.options!.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              );
            }

            return (
              <div key={field.name}>
                <label className="block text-sm font-medium text-foreground mb-2">{field.label}</label>
                <input
                  type={field.type}
                  value={(formData[field.name] as string) || ""}
                  onChange={(e) => updateField(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  maxLength={150}
                  className="w-full px-5 py-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground/50 text-base focus:outline-none focus:ring-2 focus:ring-ring transition-all min-h-[52px]"
                />
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4 mt-10">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium min-h-[48px]"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed()}
            className={`ml-auto inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full text-lg font-bold transition-all duration-200 shadow-md min-h-[48px] ${
              canProceed()
                ? "bg-accent text-accent-foreground hover:shadow-lg hover:brightness-105 active:scale-[0.98]"
                : "bg-border text-muted-foreground cursor-not-allowed"
            }`}
          >
            {currentStep < STEPS.length - 1 ? (
              <>
                Continue
                <ChevronRight className="w-5 h-5" />
              </>
            ) : (
              "Build My Site Free"
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default FormFunnelSection;
