import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Star, Upload, UserCircle, Building2, X, ChevronDown } from "lucide-react";
import CsvImportModal from "./CsvImportModal";
import FormSkeleton from "@/components/skeletons/FormSkeleton";
import EmptyState from "@/components/EmptyState";

interface Testimonial { id: string; author: string; content: string; rating: number; photo_url: string; }

const REVIEW_FIELDS = [
  { key: "author", label: "Author / Name", required: true },
  { key: "content", label: "Review Text", required: true },
  { key: "rating", label: "Rating (1-5)" },
];

const TestimonialsManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Testimonial[]>([]);
  const [showCsvImport, setShowCsvImport] = useState(false);
  const [showGmbImport, setShowGmbImport] = useState(false);

  const fetchItems = async () => {
    if (!user) return;
    const { data } = await supabase.from("testimonials").select("*").eq("user_id", user.id).order("created_at");
    if (data) setItems(data as Testimonial[]);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, [user]);

  const add = async () => {
    if (!user) return;
    const { error } = await supabase.from("testimonials").insert({ user_id: user.id, author: "Customer Name", content: "Great service!" });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else fetchItems();
  };

  const update = async (id: string, updates: Partial<Testimonial>) => {
    await supabase.from("testimonials").update(updates).eq("id", id);
    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const remove = async (id: string) => {
    await supabase.from("testimonials").delete().eq("id", id);
    setItems((prev) => prev.filter((t) => t.id !== id));
  };

  const handlePhotoUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files?.[0]) return;
    const file = e.target.files[0];
    const path = `${user.id}/testimonials/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("user-photos").upload(path, file);
    if (error) { toast({ title: "Upload failed", description: error.message, variant: "destructive" }); return; }
    const { data: { publicUrl } } = supabase.storage.from("user-photos").getPublicUrl(path);
    await update(id, { photo_url: publicUrl });
    toast({ title: "Photo uploaded!" });
  };

  const handleCsvImport = async (rows: Record<string, string>[]) => {
    if (!user) return;
    const records = rows.map(row => ({
      user_id: user.id,
      author: row.author || "Unknown",
      content: row.content || "",
      rating: Math.min(5, Math.max(1, parseInt(row.rating) || 5)),
    }));
    const { error } = await supabase.from("testimonials").insert(records);
    if (error) throw error;
    fetchItems();
  };

  if (loading) return <FormSkeleton rows={3} />;

  const ImportDropdown = () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="text-sm text-accent underline underline-offset-2 hover:text-accent/80 transition-colors whitespace-nowrap flex items-center gap-1"
        >
          Import <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
          <div className="absolute right-0 top-full mt-1 z-50 rounded-lg border border-white/10 bg-[hsl(215,50%,12%)] p-1 min-w-[160px] shadow-xl">
            <button onClick={() => { setShowCsvImport(true); setOpen(false); }} className="w-full text-left text-sm px-3 py-2 rounded-md text-white/70 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2">
              <Upload className="w-3.5 h-3.5" /> Import CSV
            </button>
            <button onClick={() => { setShowGmbImport(true); setOpen(false); }} className="w-full text-left text-sm px-3 py-2 rounded-md text-white/70 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5" /> Import GMB
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="dash-page-title text-white">Testimonials</h2>
          <p className="text-white/60 text-sm mt-1">Manage customer reviews with photos</p>
        </div>
        <div className="flex items-center gap-3">
          <ImportDropdown />
          <Button onClick={add} size="sm" className="gap-2" style={{ background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)" }}>
            <Plus className="w-4 h-4" /> Add
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        {items.map((t) => (
          <div key={t.id} className="dash-card space-y-3 hover:border-white/20 transition-colors">
            <div className="flex items-start gap-4">
              <label className="cursor-pointer shrink-0 group">
                {t.photo_url ? (
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-accent/40 transition-colors">
                    <img src={t.photo_url} alt={t.author} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload className="w-4 h-4 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-full border-2 border-dashed border-white/20 group-hover:border-accent/40 flex items-center justify-center transition-colors bg-white/5">
                    <UserCircle className="w-6 h-6 text-white/50 group-hover:text-accent/60 transition-colors" />
                  </div>
                )}
                <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(t.id, e)} className="hidden" />
              </label>
              <div className="flex-1 space-y-3">
                <Input value={t.author} onChange={(e) => update(t.id, { author: e.target.value })} placeholder="Author name" className="h-9 bg-white/5 border-white/10 text-white font-medium focus-visible:ring-accent" />
                <Textarea value={t.content} onChange={(e) => update(t.id, { content: e.target.value })} placeholder="Testimonial text…" className="bg-white/5 border-white/10 text-white placeholder:text-white/45 focus-visible:ring-accent min-h-[60px]" />
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => update(t.id, { rating: star })} className="transition-colors hover:scale-110 active:scale-95">
                      <Star className={`w-4 h-4 ${star <= t.rating ? "fill-accent text-accent" : "text-white/20 hover:text-white/40"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => remove(t.id)} aria-label="Remove testimonial" className="text-white/50 hover:text-red-400 p-1 transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <EmptyState
            icon={Star}
            title="Collect your first review"
            description="After a job, send your review link. Reviews show on your website and build trust that converts new visitors to bookings."
            action={{ label: "Add a Review", onClick: add }}
          />
        )}
      </div>

      {/* CSV Import */}
      <CsvImportModal
        open={showCsvImport}
        onClose={() => setShowCsvImport(false)}
        onImport={handleCsvImport}
        targetFields={REVIEW_FIELDS}
        title="Import Reviews from CSV"
      />

      {/* GMB Import Modal */}
      {showGmbImport && (
        <div className="fixed inset-0 z-[55] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm dash-card p-6 space-y-4" style={{ background: "linear-gradient(180deg, hsl(215 50% 12%) 0%, hsl(217 33% 10%) 100%)" }}>
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg">Import from Google My Business</h3>
              <button onClick={() => setShowGmbImport(false)} className="text-white/50 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-white/60 text-sm">Import your reviews directly from Google My Business.</p>
            <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
              <p className="text-amber-400 text-xs">⚠️ Google My Business integration requires API credentials to be configured. Please contact support to enable this feature.</p>
            </div>
            <Button disabled className="w-full h-11 gap-2 opacity-50" style={{ background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)" }}>
              <Building2 className="w-4 h-4" /> Connect Google My Business
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsManager;
