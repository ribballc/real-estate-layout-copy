import { useState } from "react";
import { Check, ChevronRight, ArrowLeft } from "lucide-react";

const STEPS = [
  {
    id: 1,
    title: "Tell Us About Your Business",
    subtitle: "Help us understand your business so we can build the perfect website.",
    fields: [
      { name: "businessName", label: "Business Name", type: "text", placeholder: "e.g. Joe's Plumbing" },
      { name: "industry", label: "Industry", type: "select", placeholder: "Select your industry", options: ["Restaurant / Food", "Retail / E-commerce", "Professional Services", "Health & Wellness", "Real Estate", "Technology", "Construction / Trades", "Education", "Other"] },
      { name: "businessDescription", label: "Briefly Describe Your Business", type: "textarea", placeholder: "What does your business do?" },
    ],
  },
  {
    id: 2,
    title: "What Are Your Goals?",
    subtitle: "Select the goals that matter most to you.",
    fields: [
      { name: "goals", label: "Primary Goals", type: "multiselect", options: ["Get more customers", "Build online presence", "Showcase my work", "Sell products online", "Generate leads", "Book appointments"] },
    ],
  },
  {
    id: 3,
    title: "Almost There!",
    subtitle: "Just a couple more details and we'll get started.",
    fields: [
      { name: "fullName", label: "Your Full Name", type: "text", placeholder: "John Doe" },
      { name: "phone", label: "Phone Number (optional)", type: "tel", placeholder: "(555) 123-4567" },
    ],
  },
];

const FormFunnelSection = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);

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
      return !!(formData.fullName as string)?.trim();
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
      <section id="form-funnel" className="bg-primary py-24 md:py-32 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-[hsl(72,80%,75%)] flex items-center justify-center mx-auto mb-8">
            <Check className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground leading-[1.1] mb-4">
            You're All Set!
          </h2>
          <p className="text-lg text-primary-foreground/70 leading-snug">
            We'll reach out to <span className="text-primary-foreground font-medium">{formData.fullName as string}</span> shortly to get your website started. Keep an eye on your inbox!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="form-funnel" className="bg-primary py-20 md:py-28 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-12 max-w-xs mx-auto">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex-1 flex items-center gap-2">
              <div
                className={`h-2 rounded-full flex-1 transition-colors duration-300 ${
                  i <= currentStep ? "bg-[hsl(72,80%,75%)]" : "bg-primary-foreground/15"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="text-center mb-10">
          <p className="text-sm font-medium text-[hsl(72,80%,75%)] uppercase tracking-wider mb-3">
            Step {step.id} of {STEPS.length}
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground leading-[1.1] mb-3">
            {step.title}
          </h2>
          <p className="text-primary-foreground/60 text-base">{step.subtitle}</p>
        </div>

        {/* Fields */}
        <div className="space-y-5">
          {step.fields.map((field) => {
            if (field.type === "multiselect") {
              const selected = (formData.goals as string[]) || [];
              return (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-primary-foreground/70 mb-3">{field.label}</label>
                  <div className="grid grid-cols-2 gap-3">
                    {field.options!.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleGoal(option)}
                        className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left ${
                          selected.includes(option)
                            ? "bg-[hsl(72,80%,75%)] text-primary shadow-md"
                            : "bg-primary-foreground/10 text-primary-foreground/80 border border-primary-foreground/15 hover:border-primary-foreground/30"
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
                  <label className="block text-sm font-medium text-primary-foreground/70 mb-2">{field.label}</label>
                  <select
                    value={(formData[field.name] as string) || ""}
                    onChange={(e) => updateField(field.name, e.target.value)}
                    className="w-full px-5 py-4 rounded-xl bg-primary-foreground/10 border border-primary-foreground/15 text-primary-foreground text-base focus:outline-none focus:border-primary-foreground/40 focus:ring-2 focus:ring-primary-foreground/10 transition-all appearance-none"
                  >
                    <option value="" className="text-foreground">{field.placeholder}</option>
                    {field.options!.map((opt) => (
                      <option key={opt} value={opt} className="text-foreground">{opt}</option>
                    ))}
                  </select>
                </div>
              );
            }

            if (field.type === "textarea") {
              return (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-primary-foreground/70 mb-2">{field.label}</label>
                  <textarea
                    value={(formData[field.name] as string) || ""}
                    onChange={(e) => updateField(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    maxLength={500}
                    rows={3}
                    className="w-full px-5 py-4 rounded-xl bg-primary-foreground/10 border border-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/35 text-base focus:outline-none focus:border-primary-foreground/40 focus:ring-2 focus:ring-primary-foreground/10 transition-all resize-none"
                  />
                </div>
              );
            }

            return (
              <div key={field.name}>
                <label className="block text-sm font-medium text-primary-foreground/70 mb-2">{field.label}</label>
                <input
                  type={field.type}
                  value={(formData[field.name] as string) || ""}
                  onChange={(e) => updateField(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  maxLength={150}
                  className="w-full px-5 py-4 rounded-xl bg-primary-foreground/10 border border-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/35 text-base focus:outline-none focus:border-primary-foreground/40 focus:ring-2 focus:ring-primary-foreground/10 transition-all"
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
              className="flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed()}
            className={`ml-auto inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full text-lg font-bold transition-all duration-300 shadow-lg ${
              canProceed()
                ? "bg-[hsl(72,80%,75%)] text-primary hover:bg-[hsl(72,80%,70%)]"
                : "bg-primary-foreground/15 text-primary-foreground/30 cursor-not-allowed"
            }`}
          >
            {currentStep < STEPS.length - 1 ? (
              <>
                Continue
                <ChevronRight className="w-5 h-5" />
              </>
            ) : (
              "Get My Website"
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default FormFunnelSection;
