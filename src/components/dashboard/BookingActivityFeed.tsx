import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Bell, ArrowRight } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";

function formatCurrency(val: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);
}

/** Play a pleasant 2-tone chime using Web Audio API */
function playBookingChime() {
  try {
    const ctx = new AudioContext();
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

    // First tone: 880 Hz
    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(880, ctx.currentTime);
    osc1.connect(gain);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.15);

    // Second tone: 1100 Hz
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1100, ctx.currentTime + 0.15);
    const gain2 = ctx.createGain();
    gain2.connect(ctx.destination);
    gain2.gain.setValueAtTime(0.12, ctx.currentTime + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
    osc2.connect(gain2);
    osc2.start(ctx.currentTime + 0.15);
    osc2.stop(ctx.currentTime + 0.4);

    // Cleanup
    setTimeout(() => ctx.close(), 1000);
  } catch {
    // Silently fail if AudioContext isn't available
  }
}

interface BookingActivityFeedProps {
  onNewBooking?: () => void;
}

const BookingActivityFeed = ({ onNewBooking }: BookingActivityFeedProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const channelRef = useRef<any>(null);
  const isDark = (localStorage.getItem("dashboard-theme") || "light") === "dark";

  // Load recent bookings on mount
  useEffect(() => {
    if (!user) return;
    supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => {
        setRecentActivity(data || []);
      });
  }, [user]);

  // Subscribe to realtime booking inserts
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("bookings-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookings",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newBooking = payload.new as any;

          // Add to activity feed with animation flag
          setRecentActivity((prev) => [{ ...newBooking, _isNew: true }, ...prev.slice(0, 9)]);

          // Play chime
          playBookingChime();

          // Show toast
          toast({
            title: `New booking from ${newBooking.customer_name || "a customer"}! 🎉`,
            description: `${newBooking.service_title} — ${formatCurrency(Number(newBooking.service_price) || 0)}`,
          });

          // Notify parent to refresh metrics
          onNewBooking?.();

          // Remove animation flag after animation completes
          setTimeout(() => {
            setRecentActivity((prev) =>
              prev.map((b) => (b.id === newBooking.id ? { ...b, _isNew: false } : b))
            );
          }, 600);
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast, onNewBooking]);

  if (recentActivity.length === 0) return null;

  return (
    <div className="alytics-card rounded-2xl overflow-hidden">
      <div className="px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4" style={{ color: "hsl(217,91%,60%)" }} />
          <h3 className="alytics-card-title text-sm font-semibold">Activity Feed</h3>
        </div>
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live" />
      </div>
      <div className="alytics-divide">
        {recentActivity.slice(0, 5).map((b, index) => (
          <div
            key={b.id}
            className={`flex items-center justify-between px-5 py-3.5 alytics-row-hover transition-all duration-300 ${
              b._isNew ? "animate-in slide-in-from-top-2 fade-in duration-500" : ""
            }`}
            style={b._isNew ? { background: "hsla(217,91%,60%,0.06)" } : undefined}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold"
                style={{
                  background: isDark
                    ? `hsl(${(index * 50 + 200) % 360}, 55%, 22%)`
                    : `hsl(${(index * 50 + 200) % 360}, 70%, 92%)`,
                  color: isDark
                    ? `hsl(${(index * 50 + 200) % 360}, 80%, 70%)`
                    : `hsl(${(index * 50 + 200) % 360}, 60%, 35%)`,
                }}
              >
                {(b.customer_name || "?").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="alytics-card-title text-sm font-medium truncate">
                  {b.customer_name || "—"}
                  {b._isNew && <span className="ml-2 text-xs font-semibold text-emerald-400">NEW</span>}
                </p>
                <p className="alytics-card-sub text-xs truncate">
                  {b.service_title || "—"} · {b.booking_date ? format(parseISO(b.booking_date), "MMM d") : ""}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0 ml-3">
              <p className="alytics-card-title text-sm font-semibold font-mono">
                {formatCurrency(Number(b.service_price) || 0)}
              </p>
              <span
                className={`text-xs font-semibold uppercase tracking-wide ${
                  b.status === "confirmed"
                    ? "text-emerald-400"
                    : b.status === "completed"
                    ? "text-[hsl(217,91%,60%)]"
                    : b.status === "cancelled"
                    ? "text-rose-400"
                    : "text-amber-400"
                }`}
              >
                {b.status}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="px-5 py-3">
        <button
          onClick={() => navigate("/dashboard/calendar")}
          className="alytics-link text-xs font-medium inline-flex items-center gap-1"
        >
          All bookings <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default BookingActivityFeed;
