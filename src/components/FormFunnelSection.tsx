import { useState } from "react";
import { Check, ChevronRight, ArrowLeft } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import { FUNNEL_STEPS } from "@/components/SurveyFunnelModal";
import { trackEvent, generateEventId } from "@/lib/tracking";

const FormFunnelSection = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);

  const step = FUNNEL_STEPS[currentStep];

  const updateField = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleMultiselect = (fieldName: string, option: string) => {
    const current = (formData[fieldName] as string[]) || [];
    const updated = current.includes(option)
      ? current.filter((g) => g !== option)
      : [...current, option];
    setFormData((prev) => ({ ...prev, [fieldName]: updated }));
  };

  const canProceed = () => {
    if (currentStep === 0) return !!(formData.businessName as string)?.trim() && !!(formData.industry as string)?.trim();
    if (currentStep === 1) return !!(formData.phone as string)?.trim();
    if (currentStep === 2) return ((formData.services as string[]) || []).length > 0;
    if (currentStep === 3) return ((formData.goals as string[]) || []).length > 0;
    return true;
  };

  const handleNext = () => {
    if (currentStep < FUNNEL_STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      trackEvent({
        eventName: 'Lead',
        type: 'track',
        eventId: generateEventId(),
        userData: {
          phone: formData.phone as string,
          email: (formData.email as string) || undefined,
        },
        customData: {
          content_name: 'Inline Form Submission',
          content_category: 'Lead',
          funnel_source: 'inline',
        },
      });
      setSubmitted(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  if (submitted) {
    return (
      <section id="form-funnel" className="bg-primary py-16 md:py-24 px-5 md:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mx-auto mb-8">
            <Check className="w-10 h-10 text-accent-foreground" />
          </div>
          <h2 className="font-heading text-[26px] md:text-4xl font-extrabold tracking-tight leading-[1.15] text-primary-foreground mb-4">
            You're All Set!
          </h2>
          <p className="text-lg text-primary-foreground/70 leading-relaxed">
            We'll have your site ready to preview in 48 hours. {formData.email ? (
              <>Check your email at <span className="text-primary-foreground font-medium">{formData.email as string}</span> for next steps!</>
            ) : (
              <>We'll text you at <span className="text-primary-foreground font-medium">{formData.phone as string}</span>.</>
            )}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="form-funnel" className="bg-primary py-16 md:py-24 px-5 md:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-12 max-w-xs mx-auto">
          {FUNNEL_STEPS.map((s, i) => (
            <div key={s.id} className="flex-1">
              <div
                className={`h-2 rounded-full transition-colors duration-300 ${
                  i <= currentStep ? "bg-accent" : "bg-primary-foreground/20"
                }`}
              />
            </div>
          ))}
        </div>

        <FadeIn>
          <div className="text-center mb-10">
            <p className="text-sm font-medium text-accent uppercase tracking-wider mb-3">
              {currentStep === 0 ? "est. takes <1 min" : `Step ${step.id} of ${FUNNEL_STEPS.length}`}
            </p>
            <h2 className="font-heading text-[26px] md:text-4xl font-extrabold tracking-tight leading-[1.15] text-primary-foreground mb-3">
              {step.title}
            </h2>
            <p className="text-primary-foreground/70 text-base">{step.subtitle}</p>
          </div>
        </FadeIn>

        {/* Fields */}
        <div className="space-y-5">
          {step.fields.map((field) => {
            if (field.type === "multiselect") {
              const selected = (formData[field.name] as string[]) || [];
              return (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-primary-foreground mb-3">{field.label}</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {field.options!.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleMultiselect(field.name, option)}
                        className={`p-4 rounded-xl text-sm font-medium transition-all duration-200 text-left min-h-[48px] ${
                          selected.includes(option)
                            ? "bg-accent text-accent-foreground shadow-md"
                            : "bg-primary-foreground/10 text-primary-foreground border border-primary-foreground/15 hover:border-primary-foreground/30"
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
                  <label className="block text-sm font-medium text-primary-foreground mb-2">{field.label}</label>
                  <select
                    value={(formData[field.name] as string) || ""}
                    onChange={(e) => updateField(field.name, e.target.value)}
                    className="w-full px-5 py-4 rounded-xl bg-primary-foreground/10 border border-primary-foreground/15 text-primary-foreground text-base focus:outline-none focus:ring-2 focus:ring-accent transition-all appearance-none min-h-[52px]"
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
                <label className="block text-sm font-medium text-primary-foreground mb-2">{field.label}</label>
                <input
                  type={field.type}
                  value={(formData[field.name] as string) || ""}
                  onChange={(e) => updateField(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  maxLength={150}
                  className="w-full px-5 py-4 rounded-xl bg-primary-foreground/10 border border-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/40 text-base focus:outline-none focus:ring-2 focus:ring-accent transition-all min-h-[52px]"
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
              className="flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground transition-colors font-medium min-h-[48px]"
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
                : "bg-primary-foreground/20 text-primary-foreground/40 cursor-not-allowed"
            }`}
          >
            {currentStep < FUNNEL_STEPS.length - 1 ? (
              <>
                Continue
                <ChevronRight className="w-5 h-5" />
              </>
            ) : (
              "Next"
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default FormFunnelSection;
