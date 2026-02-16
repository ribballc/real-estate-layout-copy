import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Check, ChevronRight, ArrowLeft, Building2, Wrench, Target, DollarSign, CalendarDays, Eye, Star, LayoutDashboard, Camera, Users } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import darkerLogo from "@/assets/darker-logo.png";

const SPECIALTIES = [
  "Mobile Detailing",
  "Paint Protection Film (PPF)",
  "Window Tinting",
  "Ceramic Coating",
  "Full Detail Shop",
  "Car Wash",
  "Other",
];

const GOALS = [
  "No-shows & last-minute cancels",
  "Missing calls while I'm working",
  "No professional website",
  "Losing jobs to competitors online",
  "Too much texting back and forth",
  "Can't collect deposits upfront",
];

const STEPS = [
  { id: 1, title: "Tell Us About Your Shop", subtitle: "Quick details so we can build your demo site.", icon: Building2 },
  { id: 2, title: "What Do You Specialize In?", subtitle: "Select your primary service type.", icon: Wrench },
  { id: 3, title: "What's Eating Your Revenue?", subtitle: "Pick the problems you want fixed.", icon: Target },
];

/** Fake dashboard content rendered as a blurred background */
const DashboardBackdrop = () => (
  <div
    className="absolute inset-0 overflow-hidden"
    style={{
      background: "linear-gradient(160deg, hsl(215 50% 6%) 0%, hsl(217 33% 10%) 100%)",
      filter: "blur(4px) brightness(0.55)",
      transform: "scale(1.05)",
    }}
  >
    {/* Fake sidebar */}
    <div className="absolute left-0 top-0 bottom-0 w-48" style={{ background: "linear-gradient(180deg, hsl(215 50% 7%) 0%, hsl(217 33% 10%) 100%)", borderRight: "1px solid hsla(217,91%,60%,0.04)" }}>
      <div className="p-4">
        <div className="h-5 w-20 rounded bg-white/10 mb-8" />
        <div className="space-y-2">
          {[LayoutDashboard, Building2, CalendarDays, Users, Wrench, Camera, Star].map((Icon, i) => (
            <div key={i} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${i === 0 ? 'bg-accent/10' : ''}`}>
              <Icon className="w-3 h-3 text-white/20" strokeWidth={1.5} />
              <div className={`h-2.5 rounded bg-white/${i === 0 ? '30' : '10'}`} style={{ width: `${50 + Math.random() * 30}px` }} />
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Fake main content */}
    <div className="ml-48 p-6">
      {/* Header bar */}
      <div className="h-10 mb-6 flex items-center justify-between" style={{ borderBottom: "1px solid hsla(217,91%,60%,0.04)" }}>
        <div className="flex items-center gap-2">
          <div className="h-3 w-16 rounded bg-white/15" />
          <div className="h-2 w-32 rounded bg-white/6" />
        </div>
        <div className="h-6 w-40 rounded-lg bg-white/5" />
      </div>

      {/* Title */}
      <div className="mb-5">
        <div className="h-5 w-32 rounded bg-white/15 mb-1" />
        <div className="h-2.5 w-48 rounded bg-white/6" />
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[DollarSign, CalendarDays, Eye, Star].map((Icon, i) => (
          <div
            key={i}
            className="rounded-xl p-4"
            style={{
              background: "hsla(215,50%,10%,0.6)",
              border: "1px solid hsla(217,91%,60%,0.06)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="h-2 w-12 rounded bg-white/10" />
              <Icon className="w-3 h-3 text-white/10" strokeWidth={1.5} />
            </div>
            <div className="h-5 w-16 rounded bg-white/12" />
          </div>
        ))}
      </div>

      {/* Chart cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[0, 1].map(i => (
          <div
            key={i}
            className="rounded-xl p-4"
            style={{
              background: "hsla(215,50%,10%,0.6)",
              border: "1px solid hsla(217,91%,60%,0.06)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 rounded bg-white/6" />
              <div>
                <div className="h-2 w-12 rounded bg-white/10 mb-1" />
                <div className="h-4 w-14 rounded bg-white/12" />
              </div>
            </div>
            {/* Fake chart line */}
            <svg className="w-full h-16 opacity-30" viewBox="0 0 200 60">
              <path
                d={i === 0
                  ? "M0,50 C30,45 50,30 80,35 C110,40 130,15 160,20 C180,23 195,18 200,15"
                  : "M0,40 C20,38 40,42 70,30 C100,18 120,25 150,20 C175,16 190,22 200,18"
                }
                fill="none"
                stroke={i === 0 ? "hsl(160 84% 39%)" : "hsl(217 91% 60%)"}
                strokeWidth="2"
              />
              <path
                d={i === 0
                  ? "M0,50 C30,45 50,30 80,35 C110,40 130,15 160,20 C180,23 195,18 200,15 L200,60 L0,60 Z"
                  : "M0,40 C20,38 40,42 70,30 C100,18 120,25 150,20 C175,16 190,22 200,18 L200,60 L0,60 Z"
                }
                fill={i === 0 ? "hsl(160 84% 39%)" : "hsl(217 91% 60%)"}
                opacity="0.1"
              />
            </svg>
          </div>
        ))}
      </div>

      {/* Fake table */}
      <div className="rounded-xl" style={{ background: "hsla(215,50%,10%,0.6)", border: "1px solid hsla(217,91%,60%,0.06)" }}>
        <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: "1px solid hsla(217,91%,60%,0.04)" }}>
          <div className="w-1.5 h-1.5 rounded-full bg-accent/40" />
          <div className="h-2.5 w-24 rounded bg-white/10" />
        </div>
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="px-4 py-3 flex items-center gap-8" style={{ borderBottom: "1px solid hsla(217,91%,60%,0.02)" }}>
            <div className="h-2 w-24 rounded bg-white/8" />
            <div className="h-2 w-20 rounded bg-white/5" />
            <div className="h-2 w-16 rounded bg-white/4" />
            <div className="h-2 w-12 rounded bg-white/6 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const toggleGoal = (g: string) =>
    setGoals((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));

  const canProceed = () => {
    if (step === 0) return businessName.trim().length > 0 && phone.trim().length > 0;
    if (step === 1) return specialty.length > 0;
    if (step === 2) return goals.length > 0;
    return true;
  };

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        business_name: businessName.trim(),
        phone: phone.trim(),
        tagline: specialty,
        onboarding_complete: true,
      })
      .eq("user_id", user.id);

    if (error) {
      toast({ title: "Error saving", description: error.message, variant: "destructive" });
      setSubmitting(false);
      return;
    }

    localStorage.setItem("leadData", JSON.stringify({ businessName: businessName.trim() }));
    navigate("/loading");
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else handleSubmit();
  };

  const currentStep = STEPS[step];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Blurred dashboard background */}
      <DashboardBackdrop />

      {/* Dark overlay for extra depth */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Foreground content */}
      <div className="w-full max-w-lg relative z-10">
        {/* Logo */}
        <div className="text-center mb-6">
          <img src={darkerLogo} alt="Darker" className="h-10 mx-auto" />
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-8 max-w-xs mx-auto">
          {STEPS.map((_, i) => (
            <div key={i} className="flex-1">
              <div
                className="h-1.5 rounded-full transition-colors duration-300"
                style={{
                  background: i <= step ? "hsl(217 91% 60%)" : "rgba(255,255,255,0.15)",
                  boxShadow: i <= step ? "0 0 8px hsla(217,91%,60%,0.3)" : "none",
                }}
              />
            </div>
          ))}
        </div>

        <FadeIn key={step}>
          <div
            className="rounded-2xl p-8"
            style={{
              background: "hsla(215,50%,8%,0.85)",
              border: "1px solid hsla(217,91%,60%,0.1)",
              backdropFilter: "blur(40px) saturate(150%)",
              boxShadow: "0 25px 80px hsla(0,0%,0%,0.5), 0 0 40px hsla(217,91%,60%,0.04)",
            }}
          >
            <div className="text-center mb-8">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{
                  background: "linear-gradient(135deg, hsla(217,91%,60%,0.2), hsla(217,91%,60%,0.05))",
                  border: "1px solid hsla(217,91%,60%,0.3)",
                  boxShadow: "0 0 20px hsla(217,91%,60%,0.1)",
                }}
              >
                <currentStep.icon className="w-6 h-6" style={{ color: "hsl(217 91% 60%)" }} />
              </div>
              <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "hsl(217 91% 60%)" }}>
                Step {currentStep.id} of {STEPS.length}
              </p>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-1">{currentStep.title}</h2>
              <p className="text-sm text-white/50">{currentStep.subtitle}</p>
            </div>

            {/* Step 1 */}
            {step === 0 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white/70 text-sm">Business Name</Label>
                  <Input
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Elite Mobile Detailing"
                    maxLength={100}
                    className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-accent"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70 text-sm">Phone Number</Label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                    maxLength={20}
                    className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-accent"
                  />
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SPECIALTIES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSpecialty(s)}
                    className="p-4 rounded-xl text-sm font-medium transition-all duration-200 text-left min-h-[48px]"
                    style={{
                      background: specialty === s ? "hsl(217 91% 60%)" : "rgba(255,255,255,0.06)",
                      color: specialty === s ? "#fff" : "rgba(255,255,255,0.7)",
                      border: `1px solid ${specialty === s ? "hsl(217 91% 60%)" : "rgba(255,255,255,0.1)"}`,
                    }}
                  >
                    {specialty === s && <Check className="w-4 h-4 inline mr-2" />}
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Step 3 */}
            {step === 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {GOALS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleGoal(g)}
                    className="p-4 rounded-xl text-sm font-medium transition-all duration-200 text-left min-h-[48px]"
                    style={{
                      background: goals.includes(g) ? "hsl(217 91% 60%)" : "rgba(255,255,255,0.06)",
                      color: goals.includes(g) ? "#fff" : "rgba(255,255,255,0.7)",
                      border: `1px solid ${goals.includes(g) ? "hsl(217 91% 60%)" : "rgba(255,255,255,0.1)"}`,
                    }}
                  >
                    {goals.includes(g) && <Check className="w-4 h-4 inline mr-2" />}
                    {g}
                  </button>
                ))}
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center gap-4 mt-8">
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="flex items-center gap-2 text-white/40 hover:text-white transition-colors font-medium min-h-[48px]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              )}
              <Button
                onClick={handleNext}
                disabled={!canProceed() || submitting}
                className="ml-auto h-12 px-8 text-sm font-semibold rounded-full"
                style={{
                  background: canProceed() ? "linear-gradient(135deg, hsl(217 91% 60%), hsl(217 91% 50%))" : "rgba(255,255,255,0.1)",
                  boxShadow: canProceed() ? "0 4px 12px hsla(217,91%,60%,0.3)" : "none",
                  color: canProceed() ? "#fff" : "rgba(255,255,255,0.3)",
                }}
              >
                {submitting ? "Saving..." : step < STEPS.length - 1 ? (
                  <>Continue <ChevronRight className="w-4 h-4 ml-1" /></>
                ) : (
                  "Build My Site →"
                )}
              </Button>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default Onboarding;
