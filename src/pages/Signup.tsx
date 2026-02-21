import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import darkerLogo from "@/assets/darker-logo.png";
import dashboardPreview from "@/assets/dashboard-preview-bg.jpg";
import { trackEvent, setPixelUserData, captureAndStoreFbCookies } from "@/lib/tracking";

const Signup = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/onboarding`,
      },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
    } else {
      if (data.user) captureAndStoreFbCookies(data.user.id);
      setPixelUserData({ email });
      trackEvent({
        eventName: 'CompleteRegistration',
        customData: { content_name: 'Account Created', status: true, currency: 'USD', value: 0 },
        userData: { email },
      });
      if (data.session) {
        window.location.href = "/onboarding";
      } else {
        toast({ title: "Account created!", description: "Taking you to set up your business…" });
        window.location.href = "/onboarding";
      }
    }
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: `${window.location.origin}/onboarding`,
    });
    if (result?.error) {
      toast({ title: `${provider === "google" ? "Google" : "Apple"} sign-up failed`, description: String(result.error), variant: "destructive" });
    }
  };

  const inputStyle: React.CSSProperties = {
    background: "hsla(0,0%,100%,0.06)",
    border: "1px solid hsla(0,0%,100%,0.12)",
    borderRadius: 10,
    color: "white",
    padding: "12px 16px",
    paddingLeft: 40,
    outline: "none",
  };

  const focusHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "hsl(217,91%,60%)";
    e.currentTarget.style.boxShadow = "0 0 0 3px hsla(217,91%,60%,0.2)";
  };

  const blurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "hsla(0,0%,100%,0.12)";
    e.currentTarget.style.boxShadow = "none";
  };

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
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12">
      <SEOHead title="Start Your Free Trial" description="Get your detailing website and booking system set up in 5 minutes. No card needed." canonicalUrl="https://darkerdigital.com/signup" />
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${dashboardPreview})` }} />
      <div className="absolute inset-0" style={{ background: "hsla(215,50%,10%,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }} />

      <FadeIn>
        <div
          className="relative z-10 w-full"
          style={{
            maxWidth: 420,
            background: "hsla(215,50%,10%,0.85)",
            border: "1px solid hsla(0,0%,100%,0.1)",
            borderRadius: 16,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            padding: 40,
          }}
        >
          <div className="text-center mb-6">
            <Link to="/" className="inline-block">
              <img src={darkerLogo} alt="Darker" className="h-10 mx-auto" />
            </Link>
          </div>

          <h1 className="text-center text-white font-bold text-2xl mb-1">Start your free trial</h1>
          <p className="text-center mb-8" style={{ color: "hsla(0,0%,100%,0.5)", fontSize: 14 }}>
            No credit card required
          </p>

          {/* Form — email + password first */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-white/70 text-sm">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "hsla(0,0%,100%,0.35)" }} />
                <input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full h-12 text-sm" style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-white/70 text-sm">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "hsla(0,0%,100%,0.35)" }} />
                <input id="password" type={showPassword ? "text" : "password"} placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full h-12 text-sm" style={{ ...inputStyle, paddingRight: 40 }} onFocus={focusHandler} onBlur={blurHandler} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "hsla(0,0%,100%,0.3)" }}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full font-semibold transition-all duration-200 disabled:opacity-50"
              style={{
                height: 48,
                borderRadius: 10,
                background: "linear-gradient(135deg, hsl(217,91%,60%) 0%, hsl(224,91%,54%) 100%)",
                color: "white",
                fontSize: 15,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(1.08)"; e.currentTarget.style.boxShadow = "0 4px 16px hsla(217,91%,60%,0.4)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.filter = "none"; e.currentTarget.style.boxShadow = "none"; }}
            >
              {loading ? "Creating account…" : "Start Free Trial"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs uppercase tracking-wider" style={{ color: "hsla(0,0%,100%,0.4)" }}>or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* OAuth — below form */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleOAuth("google")}
              className="w-full flex items-center justify-center gap-3 transition-all duration-200"
              style={oauthBtnStyle}
              onMouseEnter={(e) => (e.currentTarget.style.background = "hsla(0,0%,100%,0.10)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "hsla(0,0%,100%,0.05)")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Start with Google
            </button>

            <button
              type="button"
              onClick={() => handleOAuth("apple")}
              className="w-full flex items-center justify-center gap-3 transition-all duration-200"
              style={oauthBtnStyle}
              onMouseEnter={(e) => (e.currentTarget.style.background = "hsla(0,0%,100%,0.10)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "hsla(0,0%,100%,0.05)")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Start with Apple
            </button>
          </div>

          <p className="text-center mt-5" style={{ fontSize: 14, color: "hsla(0,0%,100%,0.5)" }}>
            Already have an account?{" "}
            <Link to="/login" className="font-medium hover:underline" style={{ color: "hsl(217,91%,60%)" }}>Sign in</Link>
          </p>
        </div>
      </FadeIn>
    </div>
  );
};

export default Signup;
