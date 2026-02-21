import { useState, useEffect } from "react";
import SEOHead from "@/components/SEOHead";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import darkerLogo from "@/assets/darker-logo.png";
import dashboardPreview from "@/assets/dashboard-preview-bg.jpg";

const ease = [0.16, 1, 0.3, 1] as const;

const fadeSlideUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease, delay },
});

const fadeIn = (delay: number) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6, ease, delay },
});

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("onboarding_complete, business_name")
          .eq("user_id", session.user.id)
          .single();
        if (profile && !profile.onboarding_complete) {
          navigate("/onboarding");
        } else {
          navigate("/dashboard");
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_complete, business_name")
        .eq("user_id", authData.user.id)
        .single();
      if (profile && !profile.onboarding_complete) {
        navigate("/onboarding");
      } else {
        navigate("/dashboard");
      }
    }
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.origin,
    });
    if (result?.error) {
      toast({ title: `${provider === "google" ? "Google" : "Apple"} sign-in failed`, description: String(result.error), variant: "destructive" });
    }
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    background: "hsla(0,0%,100%,0.06)",
    border: focusedField === field
      ? "1px solid hsl(217,91%,60%)"
      : "1px solid hsla(0,0%,100%,0.12)",
    boxShadow: focusedField === field
      ? "0 0 0 3px hsla(217,91%,60%,0.20)"
      : "none",
    borderRadius: 10,
    color: "white",
    width: "100%",
    height: 48,
    padding: "12px 16px",
    paddingLeft: 40,
    outline: "none",
    fontSize: 16,
    transition: "border-color 0.2s, box-shadow 0.2s",
  });

  const oauthBtnStyle: React.CSSProperties = {
    height: 48,
    borderRadius: 10,
    background: "hsla(0,0%,100%,0.05)",
    border: "1px solid hsla(0,0%,100%,0.10)",
    color: "white",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12 overflow-hidden">
      <SEOHead title="Log In" description="Sign in to your Darker dashboard." canonicalUrl="https://darkerdigital.com/login" noIndex />

      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${dashboardPreview})` }} />
      <div className="absolute inset-0" style={{ background: "hsla(215,50%,10%,0.88)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }} />

      {/* Ambient orb */}
      <div className="absolute z-0 pointer-events-none" style={{ width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle, hsla(217,91%,60%,0.35) 0%, transparent 70%)", filter: "blur(80px)", top: "50%", left: "50%", transform: "translate(-50%, -50%)", animation: "orbPulse 5s ease-in-out infinite" }} />
      <style>{`@keyframes orbPulse { 0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); } 50% { opacity: 0.65; transform: translate(-50%, -50%) scale(1.08); } }`}</style>

      <div className="relative z-10 w-full" style={{ maxWidth: 420 }}>
        <div style={{ background: "hsla(215,50%,10%,0.85)", border: "1px solid hsla(0,0%,100%,0.10)", borderRadius: 16, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", padding: 40, boxShadow: "0 24px 64px hsla(215,50%,5%,0.5)" }}>
          {/* Logo */}
          <motion.div className="text-center mb-7" {...fadeSlideUp(0.4)}>
            <Link to="/" className="inline-block">
              <img src={darkerLogo} alt="Darker" className="h-10 mx-auto" />
            </Link>
          </motion.div>

          {/* Headline */}
          <motion.div className="text-center mb-7" {...fadeSlideUp(0.5)}>
            <h1 style={{ color: "white", fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: 8 }}>
              Another day, another dollar.
            </h1>
            <p style={{ color: "hsla(0,0%,100%,0.50)", fontSize: 14, lineHeight: 1.5 }}>
              Your dashboard's been busy while you were out.
            </p>
          </motion.div>

          {/* Form — email + password first */}
          <form onSubmit={handleLogin}>
            <motion.div className="mb-4" {...fadeSlideUp(0.60)}>
              <label htmlFor="email" style={{ color: "hsla(0,0%,100%,0.60)", fontSize: 12, fontWeight: 500, display: "block", marginBottom: 6 }}>Email</label>
              <div className="relative">
                <Mail className="absolute top-1/2 -translate-y-1/2 pointer-events-none" style={{ left: 13, color: "hsla(0,0%,100%,0.35)", width: 15, height: 15 }} />
                <input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle("email")} onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)} />
              </div>
            </motion.div>

            <motion.div className="mb-2" {...fadeSlideUp(0.68)}>
              <label htmlFor="password" style={{ color: "hsla(0,0%,100%,0.60)", fontSize: 12, fontWeight: 500, display: "block", marginBottom: 6 }}>Password</label>
              <div className="relative">
                <Lock className="absolute top-1/2 -translate-y-1/2 pointer-events-none" style={{ left: 13, color: "hsla(0,0%,100%,0.35)", width: 15, height: 15 }} />
                <input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ ...inputStyle("password"), paddingRight: 44 }} onFocus={() => setFocusedField("password")} onBlur={() => setFocusedField(null)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 -translate-y-1/2 transition-opacity hover:opacity-80 flex items-center justify-center min-w-[44px] min-h-[44px]" style={{ right: 4, color: "hsla(0,0%,100%,0.35)", background: "none", border: "none", cursor: "pointer" }} aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
                </button>
              </div>
            </motion.div>

            <motion.div className="flex justify-end mb-5" {...fadeSlideUp(0.72)}>
              <Link to="/forgot-password" style={{ color: "hsla(0,0%,100%,0.40)", fontSize: 12, textDecoration: "none" }} onMouseEnter={(e) => (e.currentTarget.style.color = "hsla(0,0%,100%,0.65)")} onMouseLeave={(e) => (e.currentTarget.style.color = "hsla(0,0%,100%,0.40)")}>
                Forgot it?
              </Link>
            </motion.div>

            <motion.div {...fadeSlideUp(0.80)}>
              <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:opacity-50" style={{ height: 48, borderRadius: 10, background: "linear-gradient(135deg, hsl(217,91%,60%) 0%, hsl(224,91%,54%) 100%)", color: "white", fontSize: 15, fontWeight: 600, border: "none", cursor: loading ? "not-allowed" : "pointer", marginBottom: 0 }} onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.filter = "brightness(1.08)"; e.currentTarget.style.boxShadow = "0 4px 16px hsla(217,91%,60%,0.40)"; } }} onMouseLeave={(e) => { e.currentTarget.style.filter = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                {loading ? (<><Loader2 style={{ width: 16, height: 16 }} className="animate-spin" />One sec…</>) : "Let's Go →"}
              </button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div className="flex items-center gap-3 my-5" {...fadeSlideUp(0.88)}>
            <div className="h-px flex-1" style={{ background: "hsla(0,0%,100%,0.10)" }} />
            <span style={{ color: "hsla(0,0%,100%,0.40)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }}>or</span>
            <div className="h-px flex-1" style={{ background: "hsla(0,0%,100%,0.10)" }} />
          </motion.div>

          {/* OAuth — below form */}
          <motion.div className="space-y-3" {...fadeSlideUp(0.95)}>
            <button type="button" onClick={() => handleOAuth("google")} className="w-full flex items-center justify-center gap-3 transition-all duration-200" style={oauthBtnStyle} onMouseEnter={(e) => (e.currentTarget.style.background = "hsla(0,0%,100%,0.10)")} onMouseLeave={(e) => (e.currentTarget.style.background = "hsla(0,0%,100%,0.05)")}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <button type="button" onClick={() => handleOAuth("apple")} className="w-full flex items-center justify-center gap-3 transition-all duration-200" style={oauthBtnStyle} onMouseEnter={(e) => (e.currentTarget.style.background = "hsla(0,0%,100%,0.10)")} onMouseLeave={(e) => (e.currentTarget.style.background = "hsla(0,0%,100%,0.05)")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Continue with Apple
            </button>
          </motion.div>

          {/* Bottom signup link */}
          <motion.p className="text-center mt-4" style={{ fontSize: 13, color: "hsla(0,0%,100%,0.45)" }} {...fadeIn(1.1)}>
            New here?{" "}
            <Link to="/signup" style={{ color: "hsl(217,91%,60%)", fontWeight: 500, textDecoration: "none" }} onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")} onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}>
              → Get started free
            </Link>
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default Login;
