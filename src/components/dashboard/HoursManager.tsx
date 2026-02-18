import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { TOAST } from "@/lib/toast-messages";
import { Loader2, Pencil, ChevronDown } from "lucide-react";
import FormSkeleton from "@/components/skeletons/FormSkeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface HourRow { id?: string; day_of_week: number; open_time: string; close_time: string; is_closed: boolean; }

const formatTime12 = (time24: string) => {
  const [h, m] = time24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
};

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
    const rows = hours.map((h) => ({
      user_id: user.id,
      day_of_week: h.day_of_week,
      open_time: h.open_time,
      close_time: h.close_time,
      is_closed: h.is_closed,
    }));
    await supabase.from("business_hours").delete().eq("user_id", user.id);
    const { error } = await supabase.from("business_hours").insert(rows);
    setSaving(false);
    if (error) toast(TOAST.GENERIC_ERROR);
    else toast(TOAST.HOURS_SAVED);
  };

  if (loading) return <FormSkeleton rows={7} />;

  return (
    <div className="max-w-2xl">
      <h2 className="dash-page-title text-foreground mb-6">Business Hours</h2>
      <div className="space-y-2">
        {hours.map((h, i) => (
          <Collapsible key={i}>
            <div className="dash-card !p-0 overflow-hidden">
              <CollapsibleTrigger className="w-full flex items-center gap-3 px-4 py-3 text-left group">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Pencil className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-foreground">{DAYS[i]}</span>
                </div>
                <span className="text-xs text-muted-foreground shrink-0 mr-2">
                  {h.is_closed ? "Closed" : `${formatTime12(h.open_time)} – ${formatTime12(h.close_time)}`}
                </span>
                <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180 shrink-0" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-4 pb-4 pt-2 border-t border-border space-y-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!h.is_closed}
                      onChange={(e) => update(i, { is_closed: !e.target.checked })}
                      className="rounded border-border"
                    />
                    <span className="text-sm text-muted-foreground">Open this day</span>
                  </label>
                  {!h.is_closed && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <span className="text-xs text-muted-foreground w-12 shrink-0">From</span>
                        <Input type="time" value={h.open_time} onChange={(e) => update(i, { open_time: e.target.value })} className="h-11 bg-muted/50 border-border text-foreground w-full sm:w-36" />
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <span className="text-xs text-muted-foreground w-12 shrink-0">To</span>
                        <Input type="time" value={h.close_time} onChange={(e) => update(i, { close_time: e.target.value })} className="h-11 bg-muted/50 border-border text-foreground w-full sm:w-36" />
                      </div>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        ))}
      </div>
      <Button onClick={handleSave} disabled={saving} className="mt-6 h-11" style={{ background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)" }}>
        {saving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving…</> : "Save Hours"}
      </Button>
    </div>
  );
};

export default HoursManager;
