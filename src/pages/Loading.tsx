import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const STEPS = [
  { label: "Analyzing your business", threshold: 20 },
  { label: "Generating pages", threshold: 40 },
  { label: "Setting up booking system", threshold: 60 },
  { label: "Optimizing for mobile", threshold: 80 },
];

const PARTICLE_COUNT = 100;
const DURATION_MS = 6500;

// ── Particle canvas ────────────────────────────────
const useParticleCanvas = (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
  const animRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;
    const resize = () => { w = canvas.width = canvas.clientWidth; h = canvas.height = canvas.clientHeight; };
    resize();
    window.addEventListener("resize", resize);

    // Create particles that converge toward center
    const particles = Array.from({ length: PARTICLE_COUNT }, () => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 200 + Math.random() * 150;
      return {
        ox: Math.cos(angle) * dist,
        oy: Math.sin(angle) * dist,
        x: 0, y: 0,
        size: 1 + Math.random() * 2.5,
        speed: 0.3 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
        hue: Math.random() > 0.5 ? 217 : 160,
        t: 0,
      };
    });

    const startTime = Date.now();

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const elapsed = (Date.now() - startTime) / 1000;
      const cx = w / 2, cy = h / 2;

      particles.forEach((p) => {
        // Converge over first 2 seconds, then orbit
        p.t = Math.min(1, elapsed * p.speed * 0.5);
        const convergeFactor = 1 - p.t;
        const orbitAngle = elapsed * 0.3 + p.phase;
        const orbitRadius = 20 * convergeFactor;

        p.x = cx + p.ox * convergeFactor + Math.cos(orbitAngle) * orbitRadius;
        p.y = cy + p.oy * convergeFactor + Math.sin(orbitAngle) * orbitRadius;

        const alpha = 0.3 + p.t * 0.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${alpha})`;
        ctx.fill();
      });

      // Connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `hsla(217, 80%, 60%, ${0.12 * (1 - dist / 80)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [canvasRef]);
};

// ── Main component ─────────────────────────────────
const Loading = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [businessName, setBusinessName] = useState("Your Website");
  const [glitching, setGlitching] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startRef = useRef(Date.now());

  useParticleCanvas(canvasRef);

  // Redirect guard
  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("leadData") || "{}");
      if (data.businessName) setBusinessName(data.businessName);
      else if (data.email) setBusinessName(data.email);
      else { navigate("/"); return; }
    } catch { navigate("/"); }
  }, [navigate]);

  // Progress ticker
  useEffect(() => {
    startRef.current = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min((elapsed / DURATION_MS) * 100, 100);
      setProgress(pct);

      if (pct >= 100) {
        setTimeout(() => {
          setGlitching(true);
          setTimeout(() => navigate("/preview"), 500);
        }, 400);
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [navigate]);

  const activeStep = useCallback((threshold: number) => progress >= threshold, [progress]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%)",
        animation: glitching ? "loadingGlitchOut 0.5s ease-out forwards" : undefined,
      }}
    >
      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "repeating-linear-gradient(0deg, transparent 0px, rgba(0,113,227,0.03) 1px, transparent 2px)",
        animation: "loadingScanDrift 8s linear infinite",
      }} />

      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* ── Holographic display (desktop) ── */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block pointer-events-none" style={{ width: 600, height: 600, perspective: 1200 }}>
        {/* 3D website formation */}
        <div style={{
          position: "absolute", width: 400, height: 500, top: "50%", left: "50%",
          transform: "translate(-50%,-50%) rotateX(-10deg) rotateY(15deg)",
          transformStyle: "preserve-3d",
          animation: "loadingFormationRotate 8s ease-in-out infinite",
        }}>
          {/* Wireframe grid */}
          <div style={{ position: "absolute", inset: 0, opacity: 0, animation: "loadingGridAppear 0.8s ease-out 0.5s forwards" }}>
            {[20, 40, 60, 80].map((p) => (
              <div key={`h${p}`} style={{
                position: "absolute", width: "100%", height: 1, top: `${p}%`,
                background: "linear-gradient(90deg, transparent, #0071e3, transparent)",
                opacity: 0.4, animation: "loadingLineScan 2s ease-in-out infinite",
                animationDelay: `${p * 0.02}s`,
              }} />
            ))}
            {[25, 50, 75].map((p) => (
              <div key={`v${p}`} style={{
                position: "absolute", height: "100%", width: 1, left: `${p}%`,
                background: "linear-gradient(0deg, transparent, #0071e3, transparent)",
                opacity: 0.4, animation: "loadingLineScan 2s ease-in-out infinite",
                animationDelay: `${p * 0.015}s`,
              }} />
            ))}
          </div>

          {/* Website blocks materializing */}
          {[
            { top: "0%", left: "0%", w: "100%", h: "15%", delay: "1s" },
            { top: "15%", left: "0%", w: "20%", h: "70%", delay: "1.3s" },
            { top: "15%", left: "20%", w: "80%", h: "35%", delay: "1.6s" },
            { top: "50%", left: "20%", w: "80%", h: "35%", delay: "1.9s" },
            { bottom: "0%", left: "0%", w: "100%", h: "15%", delay: "2.2s" },
          ].map((block, i) => (
            <div key={i} style={{
              position: "absolute",
              top: block.top, bottom: block.bottom, left: block.left,
              width: block.w, height: block.h,
              background: "rgba(0, 113, 227, 0.15)",
              border: "1px solid rgba(0, 113, 227, 0.35)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 0 20px rgba(0, 113, 227, 0.2)",
              opacity: 0, transform: "scale(0)",
              animation: `loadingBlockMaterialize 0.6s ease-out ${block.delay} forwards`,
            }} />
          ))}

          {/* Core pulse */}
          <div style={{
            position: "absolute", width: 60, height: 60, top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            background: "radial-gradient(circle, #0071e3 0%, transparent 70%)",
            borderRadius: "50%",
            animation: "loadingCorePulse 2s ease-in-out infinite",
          }} />

          {/* Scan beams */}
          <div style={{
            position: "absolute", width: "100%", height: 2, top: "50%",
            background: "linear-gradient(90deg, transparent, #0071e3, transparent)",
            boxShadow: "0 0 20px rgba(0,113,227,0.8)",
            opacity: 0,
            animation: "loadingScanH 3s ease-in-out 2.5s forwards",
          }} />
          <div style={{
            position: "absolute", height: "100%", width: 2, left: "50%",
            background: "linear-gradient(0deg, transparent, #0071e3, transparent)",
            boxShadow: "0 0 20px rgba(0,113,227,0.8)",
            opacity: 0,
            animation: "loadingScanV 3s ease-in-out 2.5s forwards",
          }} />
        </div>
      </div>

      {/* ── Status panel ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-5 max-w-[600px] w-full">
        <h1 className="text-2xl md:text-[32px] font-bold mb-8 md:mb-10 tracking-tight" style={{ color: "#fff", letterSpacing: "-0.5px" }}>
          Building{" "}
          <span style={{ color: "#0071e3", textShadow: "0 0 20px rgba(0,113,227,0.6)" }}>
            {businessName}
          </span>
        </h1>

        {/* Steps */}
        <div className="flex flex-col gap-3 w-full mb-8 md:mb-10">
          {STEPS.map((step, i) => {
            const isActive = activeStep(step.threshold);
            return (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl px-4 md:px-6 py-3.5 md:py-4 transition-all duration-400"
                style={{
                  background: isActive ? "rgba(0, 113, 227, 0.1)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isActive ? "#0071e3" : "rgba(255,255,255,0.08)"}`,
                  boxShadow: isActive ? "0 0 20px rgba(0,113,227,0.3)" : "none",
                  opacity: isActive ? 1 : 0.3,
                }}
              >
                <span className="text-lg" style={{
                  transition: "transform 0.3s ease",
                  transform: isActive ? "scale(1.3)" : "scale(1)",
                }}>⚡</span>
                <span className="text-[15px] md:text-base font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="w-full rounded-full overflow-hidden relative mb-3" style={{
          height: 8, background: "rgba(255,255,255,0.05)",
        }}>
          <div className="h-full rounded-full relative" style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, #0071e3, #10b981)",
            transition: "width 0.1s linear",
          }}>
            {/* Shimmer */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <div className="absolute inset-0" style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                animation: "loadingProgressShimmer 1.5s ease-in-out infinite",
              }} />
            </div>
          </div>
          {/* Glow underneath */}
          <div className="absolute top-0 left-0 h-full rounded-full" style={{
            width: `${progress}%`,
            background: "#0071e3",
            filter: "blur(12px)",
            opacity: 0.5,
            transition: "width 0.1s linear",
          }} />
        </div>

        <span className="text-xl font-bold font-mono" style={{ color: "#0071e3" }}>
          {Math.floor(progress)}%
        </span>
      </div>
    </div>
  );
};

export default Loading;
