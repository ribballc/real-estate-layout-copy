import { useNavigate } from "react-router-dom";
import { ChevronRight, Lock, Zap, X } from "lucide-react";
import darkerLogo from "@/assets/darker-logo.png";
import mascotPenguin from "@/assets/mascot-penguin.png";

const CtaFooter = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* ═══ CTA SECTION — "The Close" ═══ */}
      <section
        className="relative py-32 md:py-40 px-5 md:px-8 text-center overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, hsl(215, 50%, 10%) 0%, hsl(217, 33%, 17%) 100%)",
        }}
      >
        {/* Background layers — pointer-events-none, z-0 */}
        {/* 1. Faint dot grid */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            opacity: 0.025,
            backgroundImage:
              "radial-gradient(circle at 1px 1px, hsl(0 0% 100%) 1px, transparent 0)",
            backgroundSize: "50px 50px",
          }}
        />

        {/* 2. Large ice crystal (snowflake) — 600×600, centered, slow spin */}
        <div
          className="absolute top-1/2 left-1/2 pointer-events-none z-0"
          style={{
            width: 600,
            height: 600,
            opacity: 0.025,
            transform: "translate(-50%, -50%)",
            animation: "spin 120s linear infinite",
          }}
        >
          <svg
            viewBox="0 0 600 600"
            className="w-full h-full"
            fill="none"
            stroke="white"
            strokeWidth="1"
          >
            {/* 6 main arms at 0°, 60°, 120°, 180°, 240°, 300° */}
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <line
                key={deg}
                x1="300"
                y1="300"
                x2="300"
                y2="0"
                transform={`rotate(${deg} 300 300)`}
              />
            ))}
            {/* 6 shorter arms at 30°, 90°, 150°, 210°, 270°, 330° */}
            {[30, 90, 150, 210, 270, 330].map((deg) => (
              <line
                key={`s-${deg}`}
                x1="300"
                y1="300"
                x2="300"
                y2="120"
                transform={`rotate(${deg} 300 300)`}
              />
            ))}
          </svg>
        </div>

        {/* 3. Three floating frost particles */}
        <div
          className="absolute rounded-full pointer-events-none z-0"
          style={{
            width: 6,
            height: 6,
            top: "20%",
            left: "15%",
            background: "rgba(186,230,255,0.35)",
            filter: "blur(1px)",
            animation: "orbFloat1 25s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none z-0"
          style={{
            width: 8,
            height: 8,
            top: "65%",
            right: "20%",
            background: "rgba(186,230,255,0.35)",
            filter: "blur(1px)",
            animation: "orbFloat2 30s ease-in-out infinite 5s",
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none z-0"
          style={{
            width: 5,
            height: 5,
            top: "35%",
            right: "8%",
            background: "rgba(186,230,255,0.35)",
            filter: "blur(1px)",
            animation: "orbFloat3 35s ease-in-out infinite 10s",
          }}
        />

        {/* Main content — z-10, max-width 680px */}
        <div className="relative z-10 max-w-[680px] mx-auto">
          {/* Eyebrow */}
          <div
            className="flex flex-row items-center justify-center gap-3 mb-5"
            style={{
              opacity: 0,
              animation: "fadeSlideUp 0.5s ease-out 0.2s forwards",
            }}
          >
            <div
              style={{
                width: 40,
                height: 1,
                background: "rgba(125,211,252,0.3)",
              }}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(125, 211, 252, 0.8)",
              }}
            >
              DARKER DIGITAL
            </span>
            <div
              style={{
                width: 40,
                height: 1,
                background: "rgba(125,211,252,0.3)",
              }}
            />
          </div>

          {/* Headline */}
          <h2
            className="font-heading font-extrabold mb-5"
            style={{
              fontSize: "clamp(32px, 5.5vw, 58px)",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              lineHeight: "1.1",
              letterSpacing: "-0.02em",
              lineHeight: "1.1",
              color: "hsl(0, 0%, 100%)",
              opacity: 0,
              animation: "fadeSlideUp 0.5s ease-out 0.35s forwards",
            }}
          >
            The Moment You Sign Up,
            <br />
            Your Shop Runs Itself.
          </h2>

          {/* Subtext */}
          <p
            className="text-[17px] md:text-[18px] max-w-[520px] mx-auto mb-10"
            style={{
              lineHeight: 1.75,
              color: "rgba(255,255,255,0.62)",
              opacity: 0,
              animation: "fadeSlideUp 0.5s ease-out 0.5s forwards",
            }}
          >
            Your booking page live. Deposits flowing in. No-shows down. All done
            for you — in under 5 minutes.
          </p>

          {/* CTA Button */}
          <div
            style={{
              opacity: 0,
              animation: "fadeSlideUp 0.5s ease-out 0.65s forwards",
            }}
          >
            <button
              onClick={() => navigate("/signup")}
              type="button"
              className="group relative inline-flex items-center justify-center overflow-hidden transition-all duration-300"
              style={{
                height: 56,
                paddingLeft: 40,
                paddingRight: 40,
                borderRadius: 14,
                fontWeight: 700,
                fontSize: 16,
                background:
                  "linear-gradient(135deg, hsl(210, 95%, 58%) 0%, hsl(217, 91%, 50%) 100%)",
                color: "white",
                boxShadow:
                  "0 0 0 1px rgba(125,211,252,0.2), 0 8px 32px rgba(56,189,248,0.35), 0 2px 8px rgba(0,0,0,0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 0 1px rgba(125,211,252,0.4), 0 12px 48px rgba(56,189,248,0.5), 0 4px 16px rgba(0,0,0,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 0 1px rgba(125,211,252,0.2), 0 8px 32px rgba(56,189,248,0.35), 0 2px 8px rgba(0,0,0,0.2)";
              }}
            >
              <span className="relative z-10">Start Free — No Card Needed</span>
              <span
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, hsla(0, 0%, 100%, 0.2) 50%, transparent 100%)",
                }}
              />
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-5 mt-4 text-[12px]" style={{ color: "hsla(0, 0%, 100%, 0.4)" }}>
            <span>🔒 No credit card required</span>
            <span>⚡ Live in 5 minutes</span>
            <span>↩ Cancel anytime</span>
          </div>

          {/* Trust badges */}
          <div
            className="flex flex-wrap justify-center gap-4 mt-5"
            style={{
              opacity: 0,
              animation: "fadeSlideUp 0.5s ease-out 0.8s forwards",
            }}
          >
            <span
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(125,211,252,0.15)",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              <Lock className="w-3.5 h-3.5" style={{ color: "rgba(125,211,252,0.7)" }} />
              No credit card
            </span>
            <span
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(125,211,252,0.15)",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              <Zap className="w-3.5 h-3.5" style={{ color: "rgba(125,211,252,0.7)" }} />
              Live in 5 minutes
            </span>
            <span
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(125,211,252,0.15)",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              <X className="w-3.5 h-3.5" style={{ color: "rgba(125,211,252,0.7)" }} />
              Cancel anytime
            </span>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER — "The Frozen Base" ═══ */}
      <footer
        className="relative overflow-hidden pt-16 pb-0 px-5 md:px-8"
        style={{ background: "hsl(222, 47%, 11%)" }}
      >
        {/* Faint ambient glow behind icicles */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none z-[5]"
          style={{
            width: 600,
            height: 120,
            background:
              "radial-gradient(ellipse at 50% 100%, rgba(125,211,252,0.08) 0%, transparent 70%)",
          }}
        />

        {/* Icicle SVG */}
        <svg
          viewBox="0 0 1440 180"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-0 w-full pointer-events-none z-10"
          style={{ bottom: 0, height: 180 }}
        >
          <defs>
            <linearGradient id="icicleGrad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(186,230,255,0)" />
              <stop offset="100%" stopColor="rgba(186,230,255,0.22)" />
            </linearGradient>
            <linearGradient id="icicleGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(125,211,252,0)" />
              <stop offset="100%" stopColor="rgba(125,211,252,0.18)" />
            </linearGradient>
            <linearGradient id="icicleGrad3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
            </linearGradient>
            <mask id="iceMask">
              <linearGradient id="maskGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="black" />
                <stop offset="45%" stopColor="white" />
                <stop offset="100%" stopColor="white" />
              </linearGradient>
              <rect width="1440" height="180" fill="url(#maskGrad)" />
            </mask>
          </defs>
          <g mask="url(#iceMask)">
            <polygon points="60,180 85,180 72,145" fill="url(#icicleGrad1)" opacity="0.5" />
            <polygon points="140,180 172,180 156,110" fill="url(#icicleGrad1)" opacity="0.4" />
            <polygon points="210,180 228,180 219,132" fill="url(#icicleGrad1)" opacity="0.45" />
            <polygon points="285,180 315,180 300,118" fill="url(#icicleGrad1)" opacity="0.5" />
            <polygon points="360,180 382,180 371,140" fill="url(#icicleGrad1)" opacity="0.35" />
            <polygon points="445,180 470,180 457,105" fill="url(#icicleGrad1)" opacity="0.5" />
            <polygon points="530,180 548,180 539,138" fill="url(#icicleGrad1)" opacity="0.4" />
            <polygon points="620,180 650,180 635,95" fill="url(#icicleGrad1)" opacity="0.55" />
            <polygon points="710,180 730,180 720,128" fill="url(#icicleGrad1)" opacity="0.4" />
            <polygon points="800,180 825,180 812,112" fill="url(#icicleGrad1)" opacity="0.5" />
            <polygon points="885,180 905,180 895,142" fill="url(#icicleGrad1)" opacity="0.35" />
            <polygon points="970,180 995,180 982,108" fill="url(#icicleGrad1)" opacity="0.5" />
            <polygon points="1060,180 1078,180 1069,135" fill="url(#icicleGrad1)" opacity="0.45" />
            <polygon points="1145,180 1170,180 1157,115" fill="url(#icicleGrad1)" opacity="0.5" />
            <polygon points="1230,180 1248,180 1239,130" fill="url(#icicleGrad1)" opacity="0.4" />
            <polygon points="1310,180 1338,180 1324,100" fill="url(#icicleGrad1)" opacity="0.55" />
            <polygon points="1395,180 1415,180 1405,138" fill="url(#icicleGrad1)" opacity="0.4" />

            <polygon points="20,180 52,180 36,88" fill="url(#icicleGrad2)" />
            <polygon points="100,180 128,180 114,60" fill="url(#icicleGrad2)" />
            <polygon points="175,180 200,180 187,92" fill="url(#icicleGrad2)" />
            <polygon points="248,180 272,180 260,72" fill="url(#icicleGrad2)" />
            <polygon points="330,180 354,180 342,45" fill="url(#icicleGrad2)" />
            <polygon points="400,180 422,180 411,80" fill="url(#icicleGrad2)" />
            <polygon points="478,180 505,180 491,55" fill="url(#icicleGrad2)" />
            <polygon points="558,180 580,180 569,78" fill="url(#icicleGrad2)" />
            <polygon points="640,180 668,180 654,38" fill="url(#icicleGrad2)" />
            <polygon points="725,180 748,180 736,68" fill="url(#icicleGrad2)" />
            <polygon points="808,180 832,180 820,48" fill="url(#icicleGrad2)" />
            <polygon points="888,180 910,180 899,75" fill="url(#icicleGrad2)" />
            <polygon points="958,180 982,180 970,52" fill="url(#icicleGrad2)" />
            <polygon points="1035,180 1055,180 1045,82" fill="url(#icicleGrad2)" />
            <polygon points="1108,180 1136,180 1122,42" fill="url(#icicleGrad2)" />
            <polygon points="1185,180 1206,180 1195,70" fill="url(#icicleGrad2)" />
            <polygon points="1258,180 1282,180 1270,56" fill="url(#icicleGrad2)" />
            <polygon points="1340,180 1365,180 1352,35" fill="url(#icicleGrad2)" />
            <polygon points="1410,180 1440,180 1425,68" fill="url(#icicleGrad2)" />

            <line x1="114" y1="180" x2="117" y2="65" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            <line x1="260" y1="180" x2="263" y2="77" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <line x1="342" y1="180" x2="345" y2="50" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
            <line x1="491" y1="180" x2="494" y2="60" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <line x1="654" y1="180" x2="657" y2="43" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <line x1="820" y1="180" x2="823" y2="53" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            <line x1="970" y1="180" x2="973" y2="57" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <line x1="1122" y1="180" x2="1125" y2="47" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
            <line x1="1270" y1="180" x2="1273" y2="61" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <line x1="1352" y1="180" x2="1355" y2="40" stroke="rgba(255,255,255,0.13)" strokeWidth="1" />
          </g>
        </svg>

        {/* Penguin mascot — centered above icicles */}
        <img
          src={mascotPenguin}
          alt=""
          aria-hidden
          loading="lazy"
          className="absolute left-1/2 -translate-x-1/2 pointer-events-none select-none z-[20] w-[100px] md:w-[110px] h-auto"
          style={{
            bottom: 60,
            filter: "drop-shadow(0 -4px 16px rgba(125,211,252,0.25))",
          }}
        />

        {/* Footer content — max-width 1100px, z-10 */}
        <div className="relative z-10 max-w-[1100px] mx-auto">
          {/* Row 1: Logo + tagline */}
          <div className="text-center mb-10">
            <img
              src={darkerLogo}
              alt="Darker"
              className="h-8 mx-auto mb-3 w-auto"
            />
            <p
              className="text-[13px] italic"
              style={{
                color: "rgba(255,255,255,0.35)",
                letterSpacing: "0.01em",
              }}
            >
              The last booking system you'll need.
            </p>
          </div>

          {/* Divider */}
          <div
            className="w-full my-8"
            style={{
              height: 1,
              background:
                "linear-gradient(to right, transparent, rgba(125,211,252,0.18), transparent)",
            }}
          />

          {/* Row 2: Nav links */}
          <div className="flex flex-wrap justify-center gap-8 mb-10">
            <a
              href="/privacy"
              className="text-[13px] transition-colors duration-200 hover:underline"
              style={{ color: "rgba(255,255,255,0.4)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "rgba(125,211,252,0.8)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.4)";
              }}
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="text-[13px] transition-colors duration-200 hover:underline"
              style={{ color: "rgba(255,255,255,0.4)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "rgba(125,211,252,0.8)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.4)";
              }}
            >
              Terms of Service
            </a>
            <a
              href="/cookies"
              className="text-[13px] transition-colors duration-200 hover:underline"
              style={{ color: "rgba(255,255,255,0.4)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "rgba(125,211,252,0.8)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.4)";
              }}
            >
              Cookie Policy
            </a>
          </div>

          {/* Row 3: Trust + copyright */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-16">
            <div className="flex flex-wrap items-center gap-5">
              <span
                className="flex items-center gap-1.5 text-[12px]"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                🔒 Bank-level encryption
              </span>
              <span
                className="flex items-center gap-1.5 text-[12px]"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                Secured by Stripe
              </span>
            </div>
            <p
              className="text-[12px]"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              © 2026 Darker. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default CtaFooter;
