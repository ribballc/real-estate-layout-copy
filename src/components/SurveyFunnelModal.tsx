import { useState, useEffect } from "react";
import { Check, ChevronRight, ArrowLeft, X } from "lucide-react";
import { useSurveyFunnel } from "@/components/SurveyFunnelContext";

const STEPS = [
  {
    id: 1,
    title: "Tell Us About Your Shop",
    subtitle: "Quick details so we can start building. Takes 60 seconds.",
    fields: [
      { name: "businessName", label: "Business Name", type: "text", placeholder: "e.g. Elite Mobile Detailing" },
      { name: "industry", label: "What do you specialize in?", type: "select", placeholder: "Select your specialty", options: ["Mobile Detailing", "Paint Protection Film (PPF)", "Window Tinting", "Ceramic Coating", "Full Detail Shop", "Car Wash", "Other"] },
    ],
  },
  {
    id: 2,
    title: "What's Eating Your Revenue?",
    subtitle: "Pick the problems you want fixed.",
    fields: [
      { name: "goals", label: "Select All That Apply", type: "multiselect", options: ["No-shows & last-minute cancels", "Missing calls while I'm working", "No professional website", "Losing jobs to competitors online", "Too much texting back and forth", "Can't collect deposits upfront"] },
    ],
  },
  {
    id: 3,
    title: "Where Should We Send Your New Site?",
    subtitle: "Your preview will be ready in 48 hours.",
    fields: [
      { name: "fullName", label: "Your Name", type: "text", placeholder: "Jake Smith" },
      { name: "phone", label: "Phone", type: "tel", placeholder: "(555) 123-4567" },
      { name: "email", label: "Email", type: "email", placeholder: "you@business.com" },
    ],
  },
];

const SurveyFunnelModal = () => {
  const { isOpen, closeFunnel } = useSurveyFunnel();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);

  // Listen for hero email pre-fill
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail) setFormData((prev) => ({ ...prev, email: detail }));
    };
    window.addEventListener("hero-email", handler);
    return () => window.removeEventListener("hero-email", handler);
  }, []);

  // Reset when closed
  useEffect(() => {
    if (!isOpen) {
      // Small delay so animation finishes before resetting
      const t = setTimeout(() => {
        setCurrentStep(0);
        setSubmitted(false);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={closeFunnel}
      />

      {/* Modal */}
      <div className="relative z-10 bg-background w-full md:max-w-lg md:rounded-2xl rounded-t-2xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-4 fade-in duration-300">
        {/* Header with close + progress */}
        <div className="sticky top-0 bg-background z-10 px-5 pt-5 pb-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">
              {submitted ? "Complete" : `Step ${currentStep + 1} of ${STEPS.length}`}
            </span>
            <button
              onClick={closeFunnel}
              className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors min-h-[48px] min-w-[48px]"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Step indicator dots */}
          {!submitted && (
            <div className="flex items-center gap-2">
              {STEPS.map((s, i) => (
                <div key={s.id} className="flex-1">
                  <div
                    className={`h-1.5 rounded-full transition-colors duration-300 ${
                      i <= currentStep ? "bg-accent" : "bg-border"
                    }`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-5 py-6 md:px-8 md:py-8">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-accent-foreground" />
              </div>
              <h2 className="font-heading text-[22px] md:text-3xl font-extrabold tracking-tight leading-[1.15] text-foreground mb-3">
                You're All Set!
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We'll have your site ready to preview in 48 hours. Check your email at{" "}
                <span className="text-foreground font-medium">{formData.email as string}</span> for next steps!
              </p>
              <button
                onClick={closeFunnel}
                className="mt-8 inline-flex items-center justify-center px-8 py-3.5 bg-accent text-accent-foreground font-bold rounded-full shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.98] transition-all duration-200 min-h-[48px]"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Step title */}
              <div className="mb-6">
                <h2 className="font-heading text-[22px] md:text-2xl font-extrabold tracking-tight leading-[1.15] text-foreground mb-1.5">
                  {step.title}
                </h2>
                <p className="text-sm text-muted-foreground">{step.subtitle}</p>
              </div>

              {/* Fields */}
              <div className="space-y-4">
                {step.fields.map((field) => {
                  if (field.type === "multiselect") {
                    const selected = (formData.goals as string[]) || [];
                    return (
                      <div key={field.name}>
                        <label className="block text-sm font-medium text-foreground mb-3">{field.label}</label>
                        <div className="grid grid-cols-1 gap-2.5">
                          {field.options!.map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => toggleGoal(option)}
                              className={`p-4 rounded-xl text-sm font-medium transition-all duration-200 text-left min-h-[48px] flex items-center gap-3 ${
                                selected.includes(option)
                                  ? "bg-accent/10 text-foreground border-2 border-accent"
                                  : "bg-muted text-foreground border-2 border-transparent hover:border-border"
                              }`}
                            >
                              <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${
                                selected.includes(option) ? "bg-accent" : "border-2 border-border"
                              }`}>
                                {selected.includes(option) && <Check className="w-3.5 h-3.5 text-accent-foreground" />}
                              </div>
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
                          className="w-full px-4 py-3.5 rounded-xl bg-muted border-2 border-transparent text-foreground text-base focus:outline-none focus:border-accent transition-all appearance-none min-h-[52px]"
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
                        className="w-full px-4 py-3.5 rounded-xl bg-muted border-2 border-transparent text-foreground placeholder:text-muted-foreground text-base focus:outline-none focus:border-accent transition-all min-h-[52px]"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-4 mt-8">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors font-medium text-sm min-h-[48px]"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className={`ml-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-base font-bold transition-all duration-200 shadow-md min-h-[48px] ${
                    canProceed()
                      ? "bg-accent text-accent-foreground hover:shadow-lg hover:brightness-105 active:scale-[0.98]"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  {currentStep < STEPS.length - 1 ? (
                    <>
                      Next
                      <ChevronRight className="w-5 h-5" />
                    </>
                  ) : (
                    "Build My Site Free →"
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurveyFunnelModal;
