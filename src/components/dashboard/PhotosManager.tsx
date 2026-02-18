import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, Trash2 } from "lucide-react";
import PhotoGridSkeleton from "@/components/skeletons/PhotoGridSkeleton";

interface Photo { id: string; url: string; caption: string; sort_order: number; }

const PhotosManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState<Photo[]>([]);

  const fetchPhotos = async () => {
    if (!user) return;
    const { data } = await supabase.from("photos").select("*").eq("user_id", user.id).order("sort_order");
    if (data) setPhotos(data as Photo[]);
    setLoading(false);
  };

  useEffect(() => { fetchPhotos(); }, [user]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files) return;
    for (const file of Array.from(e.target.files)) {
      const path = `${user.id}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("user-photos").upload(path, file);
      if (error) { toast({ title: "Upload failed", description: error.message, variant: "destructive" }); continue; }
      const { data: { publicUrl } } = supabase.storage.from("user-photos").getPublicUrl(path);
      await supabase.from("photos").insert({ user_id: user.id, url: publicUrl, sort_order: photos.length });
    }
    fetchPhotos();
    toast({ title: "Photos uploaded!" });
  };

  const updateCaption = async (id: string, caption: string) => {
    await supabase.from("photos").update({ caption }).eq("id", id);
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, caption } : p)));
  };

  const deletePhoto = async (id: string) => {
    await supabase.from("photos").delete().eq("id", id);
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  if (loading) return <PhotoGridSkeleton />;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Photos</h2>
        <label className="cursor-pointer">
          <Button asChild size="sm" className="gap-2" style={{ background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)" }}>
            <span><Upload className="w-4 h-4" /> Upload</span>
          </Button>
          <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
        </label>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
            <img src={photo.url} alt={photo.caption} className="w-full h-40 object-cover" />
            <div className="p-3 flex items-center gap-2">
              <Input
                value={photo.caption}
                onChange={(e) => updateCaption(photo.id, e.target.value)}
                placeholder="Caption…"
                className="h-8 text-xs bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-accent"
              />
              <button onClick={() => deletePhoto(photo.id)} aria-label="Delete photo" className="text-white/50 hover:text-red-400 p-1 shrink-0">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {photos.length === 0 && <p className="text-center text-white/30 py-12 text-sm">No photos yet. Upload some above.</p>}
    </div>
  );
};

export default PhotosManager;
