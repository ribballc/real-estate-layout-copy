import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const STEPS = [
  { label: "Analyzing your business...", duration: 1200 },
  { label: "Generating custom layout...", duration: 1400 },
  { label: "Building booking engine...", duration: 1200 },
  { label: "Configuring automations...", duration: 1000 },
  { label: "Polishing final details...", duration: 1000 },
  { label: "Your site is ready!", duration: 600 },
];

const TOTAL_DURATION = STEPS.reduce((s, step) => s + step.duration, 0);

const Loading = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [businessName, setBusinessName] = useState("Your Website");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>();

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("leadData") || "{}");
      if (data.businessName) setBusinessName(data.businessName);
      if (!data.businessName) { navigate("/"); return; }
    } catch { navigate("/"); return; }
  }, [navigate]);

  // Progress + step tracking
  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / TOTAL_DURATION) * 100, 100);
      setProgress(pct);

      let accumulated = 0;
      for (let i = 0; i < STEPS.length; i++) {
        accumulated += STEPS[i].duration;
        if (elapsed < accumulated) { setCurrentStep(i); break; }
        if (i === STEPS.length - 1) setCurrentStep(i);
      }

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => navigate("/preview"), 400);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [navigate]);

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; hue: number }[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        hue: Math.random() > 0.5 ? 217 : 160,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${p.alpha})`;
        ctx.fill();
      });

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `hsla(217, 80%, 65%, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden" style={{
      background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 100%)',
    }}>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Scan beam */}
      <div className="absolute inset-x-0 pointer-events-none" style={{
        height: '2px',
        background: 'linear-gradient(90deg, transparent 0%, hsla(217, 91%, 60%, 0.6) 50%, transparent 100%)',
        top: `${30 + (progress / 100) * 40}%`,
        opacity: progress < 95 ? 0.6 : 0,
        transition: 'opacity 0.3s ease',
        boxShadow: '0 0 20px hsla(217, 91%, 60%, 0.4)',
      }} />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg">
        {/* Holographic icon */}
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8" style={{
          background: 'linear-gradient(135deg, hsla(217, 91%, 60%, 0.15), hsla(160, 80%, 50%, 0.1))',
          border: '1px solid hsla(217, 91%, 60%, 0.3)',
          boxShadow: '0 0 40px hsla(217, 91%, 60%, 0.15)',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="hsla(217, 91%, 60%, 0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18" />
            <path d="M9 21V9" />
          </svg>
        </div>

        {/* Business name */}
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#fff' }}>
          Building{' '}
          <span style={{ color: '#10b981', textShadow: '0 0 20px rgba(16,185,129,0.3)' }}>
            {businessName}
          </span>
        </h1>

        {/* Current step */}
        <p className="text-base md:text-lg mb-10" style={{ color: 'rgba(255,255,255,0.6)' }}>
          {STEPS[currentStep]?.label}
        </p>

        {/* Progress bar */}
        <div className="w-full max-w-sm mb-4 rounded-full overflow-hidden" style={{
          height: 6,
          background: 'rgba(255,255,255,0.08)',
        }}>
          <div
            className="h-full rounded-full transition-all duration-200"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, hsl(217, 91%, 60%), #10b981)',
              boxShadow: '0 0 12px hsla(217, 91%, 60%, 0.5)',
            }}
          />
        </div>

        <span className="text-sm font-mono font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {Math.round(progress)}%
        </span>

        {/* Step indicators */}
        <div className="mt-8 flex flex-col gap-2 items-start w-full max-w-sm">
          {STEPS.map((step, i) => (
            <div key={i} className="flex items-center gap-3 transition-opacity duration-300" style={{
              opacity: i <= currentStep ? 1 : 0.3,
            }}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{
                background: i < currentStep ? '#10b981' : i === currentStep ? 'hsl(217, 91%, 60%)' : 'rgba(255,255,255,0.1)',
                color: '#fff',
                boxShadow: i === currentStep ? '0 0 12px hsla(217, 91%, 60%, 0.5)' : 'none',
                transition: 'all 0.3s ease',
              }}>
                {i < currentStep ? '✓' : ''}
              </div>
              <span className="text-sm" style={{
                color: i <= currentStep ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)',
              }}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
