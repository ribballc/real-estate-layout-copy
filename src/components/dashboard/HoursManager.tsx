import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import FormSkeleton from "@/components/skeletons/FormSkeleton";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface HourRow { id?: string; day_of_week: number; open_time: string; close_time: string; is_closed: boolean; }

const HoursManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hours, setHours] = useState<HourRow[]>(DAYS.map((_, i) => ({ day_of_week: i, open_time: "09:00", close_time: "17:00", is_closed: false })));

  useEffect(() => {
    if (!user) return;
    supabase.from("business_hours").select("*").eq("user_id", user.id).then(({ data }) => {
      if (data && data.length > 0) {
        const map = new Map((data as HourRow[]).map((d) => [d.day_of_week, d]));
        setHours(DAYS.map((_, i) => map.get(i) || { day_of_week: i, open_time: "09:00", close_time: "17:00", is_closed: false }));
      }
      setLoading(false);
    });
  }, [user]);

  const update = (idx: number, updates: Partial<HourRow>) => {
    setHours((prev) => prev.map((h, i) => (i === idx ? { ...h, ...updates } : h)));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    // Upsert all 7 days
    const rows = hours.map((h) => ({
      user_id: user.id,
      day_of_week: h.day_of_week,
      open_time: h.open_time,
      close_time: h.close_time,
      is_closed: h.is_closed,
    }));
    // Delete existing then insert
    await supabase.from("business_hours").delete().eq("user_id", user.id);
    const { error } = await supabase.from("business_hours").insert(rows);
    setSaving(false);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Saved!", description: "Business hours updated." });
  };

  if (loading) return <FormSkeleton rows={7} />;

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-white mb-6">Business Hours</h2>
      <div className="space-y-3">
        {hours.map((h, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
            <span className="w-28 text-sm text-white/70 font-medium shrink-0">{DAYS[i]}</span>
            <label className="flex items-center gap-2 shrink-0">
              <input
                type="checkbox"
                checked={!h.is_closed}
                onChange={(e) => update(i, { is_closed: !e.target.checked })}
                className="rounded border-white/20"
              />
              <span className="text-xs text-white/40">Open</span>
            </label>
            {!h.is_closed && (
              <>
                <Input type="time" value={h.open_time} onChange={(e) => update(i, { open_time: e.target.value })} className="w-32 h-9 bg-white/5 border-white/10 text-white focus-visible:ring-accent" />
                <span className="text-white/30 text-sm">to</span>
                <Input type="time" value={h.close_time} onChange={(e) => update(i, { close_time: e.target.value })} className="w-32 h-9 bg-white/5 border-white/10 text-white focus-visible:ring-accent" />
              </>
            )}
            {h.is_closed && <span className="text-white/30 text-sm italic">Closed</span>}
          </div>
        ))}
      </div>
      <Button onClick={handleSave} disabled={saving} className="mt-6 h-11" style={{ background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)" }}>
        {saving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving…</> : "Save Hours"}
      </Button>
    </div>
  );
};

export default HoursManager;
