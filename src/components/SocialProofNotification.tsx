import { useState, useEffect } from "react";

const notifications = [
  { name: "Jason", city: "Dallas, TX", action: "just activated their website", time: "2 minutes ago" },
  { name: "Mike", city: "Houston", action: "got his first booking", time: "5 minutes ago" },
  { name: "Sarah", city: "Austin", action: "collected $150 deposit", time: "8 minutes ago" },
  { name: "Alex", city: "San Antonio", action: "went live in 4 minutes", time: "12 minutes ago" },
  { name: "Carlos", city: "Fort Worth", action: "made $420 today", time: "15 minutes ago" },
  { name: "Tyler", city: "Plano", action: "just signed up for the trial", time: "Just now" },
];

const SocialProofNotification = () => {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const showTimer = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(showTimer);
  }, [dismissed]);

  useEffect(() => {
    if (dismissed || !visible) return;
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % notifications.length);
        setVisible(true);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, [visible, dismissed]);

  if (dismissed) return null;

  const n = notifications[current];

  return (
    <div
      className={`fixed bottom-20 md:bottom-6 left-4 z-50 rounded-xl px-4 py-3 flex items-center gap-3 max-w-[340px] transition-all duration-500 ${
        visible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
      }`}
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        backdropFilter: 'blur(20px)',
        borderRadius: '12px',
      }}
    >
      {/* Green pulse dot */}
      <div className="flex-shrink-0 relative">
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#10B981' }} />
        <div className="absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping" style={{ background: '#10B981', opacity: 0.4 }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] text-foreground font-medium truncate">
          {n.name} from {n.city} {n.action}
        </p>
        <p className="text-[11px] text-muted-foreground">{n.time}</p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-muted-foreground hover:text-foreground text-lg leading-none flex-shrink-0 p-1"
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
};

export default SocialProofNotification;
