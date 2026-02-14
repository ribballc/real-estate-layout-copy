import { useState, useEffect } from "react";

const notifications = [
  { name: "Jason", city: "Dallas, TX" },
  { name: "Marcus", city: "Austin, TX" },
  { name: "Anthony", city: "Miami, FL" },
  { name: "Chris", city: "Phoenix, AZ" },
  { name: "DeShawn", city: "Atlanta, GA" },
  { name: "Tyler", city: "Denver, CO" },
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
    }, 8000);
    return () => clearInterval(interval);
  }, [visible, dismissed]);

  if (dismissed) return null;

  const n = notifications[current];

  return (
    <div
      className={`fixed bottom-20 md:bottom-6 left-4 z-50 bg-card border border-border rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3 max-w-[320px] transition-all duration-500 ${
        visible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
      }`}
    >
      <div className="w-9 h-9 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center text-sm flex-shrink-0">
        {n.name[0]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground font-medium truncate">
          {n.name} from {n.city}
        </p>
        <p className="text-xs text-muted-foreground">just activated their website</p>
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
