import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cookie, X } from "lucide-react";

const CONSENT_KEY = "darker_cookie_consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
    // TODO: Add your actual cookie consent logic here
    // Load analytics scripts after consent given
  };

  const dismiss = () => {
    localStorage.setItem(CONSENT_KEY, "dismissed");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-sm z-[100] rounded-xl p-5 shadow-2xl"
      style={{
        background: "hsl(222, 47%, 11%)",
        border: "1px solid hsla(0,0%,100%,0.1)",
      }}
    >
      <button
        onClick={dismiss}
        className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
        style={{ color: "hsla(0,0%,100%,0.4)" }}
      >
        <X className="w-3.5 h-3.5" />
      </button>
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: "hsla(217,91%,60%,0.1)" }}
        >
          <Cookie className="w-4 h-4" style={{ color: "hsl(217,91%,60%)" }} />
        </div>
        <div>
          <p className="text-sm font-medium text-white mb-1">We use cookies</p>
          <p className="text-xs mb-4" style={{ color: "hsla(0,0%,100%,0.5)" }}>
            We use cookies to improve your experience.{" "}
            <Link to="/cookies" className="underline hover:text-white transition-colors">
              Learn more
            </Link>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={accept}
              className="text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
              style={{
                background: "hsl(217,91%,60%)",
                color: "hsl(0,0%,100%)",
              }}
            >
              Accept
            </button>
            <button
              onClick={dismiss}
              className="text-xs font-semibold px-4 py-2 rounded-lg transition-colors hover:bg-white/10"
              style={{ color: "hsla(0,0%,100%,0.6)" }}
            >
              Manage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
