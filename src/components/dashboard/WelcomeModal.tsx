import { useEffect, useState } from "react";
import { Sparkles, Globe, Settings, CreditCard, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WELCOME_FLAG = "darker_welcome_modal_seen";

interface WelcomeModalProps {
  firstName: string;
  isDark: boolean;
}

const WelcomeModal = ({ firstName, isDark }: WelcomeModalProps) => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(WELCOME_FLAG)) return;
    const timer = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      localStorage.setItem(WELCOME_FLAG, "1");
    }, 300);
  };

  if (!visible) return null;

  const actions = [
    { icon: Globe, text: "Preview your website and booking page" },
    { icon: Settings, text: "Update your shop info, hours, and services" },
    { icon: CreditCard, text: "Activate your trial to go live and start taking bookings" },
  ];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{
        background: "hsla(0,0%,0%,0.6)",
        backdropFilter: "blur(8px)",
        opacity: closing ? 0 : 1,
        transition: "opacity 0.3s ease",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
    >
      <div
        className="relative w-full max-w-[480px]"
        style={{
          background: isDark
            ? "linear-gradient(180deg, hsl(215,50%,12%) 0%, hsl(217,33%,14%) 100%)"
            : "hsl(0, 0%, 100%)",
          border: isDark ? "1px solid hsla(0,0%,100%,0.1)" : "1px solid hsl(214,20%,90%)",
          borderRadius: "16px",
          padding: "40px",
          boxShadow: isDark ? "0 24px 64px hsla(0,0%,0%,0.4)" : "0 24px 64px hsla(0,0%,0%,0.15)",
          transform: closing ? "scale(0.96)" : "scale(1)",
          opacity: closing ? 0 : 1,
          transition: "transform 0.3s ease, opacity 0.3s ease",
        }}
      >
        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          style={{ color: "hsla(0,0%,100%,0.3)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "hsla(0,0%,100%,0.3)")}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <Sparkles className="w-7 h-7 mb-4" style={{ color: "hsl(217,91%,60%)" }} />

        {/* Heading */}
        <h2
          className="font-bold tracking-tight"
          style={{
            fontSize: "22px",
            color: isDark ? "white" : "hsl(215,25%,12%)",
          }}
        >
          Welcome to Darker, {firstName || "there"}.
        </h2>
        <p
          className="mt-2"
          style={{
            fontSize: "14px",
            color: isDark ? "hsla(0,0%,100%,0.5)" : "hsl(215,16%,55%)",
          }}
        >
          Your website is live in demo mode. Here's what you can do right now:
        </p>

        {/* Action rows */}
        <div className="mt-6">
          {actions.map((action, i) => {
            const Icon = action.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-3 py-3"
                style={{
                  borderBottom:
                    i < actions.length - 1
                      ? `1px solid ${isDark ? "hsla(0,0%,100%,0.06)" : "hsl(214,20%,92%)"}`
                      : "none",
                }}
              >
                <Icon
                  className="w-[18px] h-[18px] shrink-0"
                  style={{ color: "hsl(217,91%,60%)" }}
                  strokeWidth={1.5}
                />
                <span
                  className="font-medium"
                  style={{
                    fontSize: "14px",
                    color: isDark ? "white" : "hsl(215,25%,12%)",
                  }}
                >
                  {action.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Primary CTA */}
        <button
          onClick={dismiss}
          className="w-full mt-6 font-semibold transition-all"
          style={{
            height: "48px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, hsl(217,91%,60%) 0%, hsl(230,80%,55%) 100%)",
            color: "white",
            fontSize: "15px",
            border: "none",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
        >
          Explore My Dashboard →
        </button>

        {/* Secondary link */}
        <div className="text-center mt-3">
          <button
            onClick={() => {
              dismiss();
              navigate("/dashboard/account");
            }}
            className="transition-colors hover:underline"
            style={{
              color: "hsl(217,91%,60%)",
              fontSize: "13px",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Activate my free trial
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
