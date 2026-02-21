import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, Save, RotateCcw } from "lucide-react";
import { trimAndCap } from "@/lib/businessValidation";

interface CopyField {
  key: string;
  label: string;
  maxLength: number;
  rows: number;
}

const FIELDS: CopyField[] = [
  { key: "hero_headline", label: "Hero Headline", maxLength: 80, rows: 2 },
  { key: "hero_subheadline", label: "Hero Subheadline", maxLength: 200, rows: 3 },
  { key: "about_paragraph", label: "About Paragraph", maxLength: 600, rows: 5 },
  { key: "seo_meta_description", label: "SEO Meta Description", maxLength: 160, rows: 2 },
  { key: "cta_tagline", label: "CTA Tagline", maxLength: 60, rows: 1 },
];

interface WebsiteCopy {
  hero_headline: string;
  hero_subheadline: string;
  about_paragraph: string;
  services_descriptions: { service: string; description: string }[];
  seo_meta_description: string;
  cta_tagline: string;
  hero_headline_edited: boolean;
  hero_subheadline_edited: boolean;
  about_paragraph_edited: boolean;
  services_descriptions_edited: boolean;
  seo_meta_description_edited: boolean;
  cta_tagline_edited: boolean;
}

const WebsiteCopyEditor = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [copy, setCopy] = useState<WebsiteCopy | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState<string | null>(null);
  const [profile, setProfile] = useState<{ business_name: string; address: string; tagline: string; phone: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("website_copy").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("profiles").select("business_name, address, tagline, phone").eq("user_id", user.id).single(),
    ]).then(([copyRes, profRes]) => {
      if (copyRes.data) setCopy(copyRes.data as unknown as WebsiteCopy);
      if (profRes.data) setProfile(profRes.data);
      setLoading(false);
    });
  }, [user]);

  const handleFieldChange = (key: string, value: string) => {
    if (!copy) return;
    setCopy({ ...copy, [key]: value, [`${key}_edited`]: true });
  };

  const handleServiceDescChange = (index: number, value: string) => {
    if (!copy) return;
    const updated = [...copy.services_descriptions];
    updated[index] = { ...updated[index], description: value };
    setCopy({ ...copy, services_descriptions: updated, services_descriptions_edited: true });
  };

  const handleSave = async () => {
    if (!user || !copy) return;
    setSaving(true);
    const safeCopy = {
      hero_headline: trimAndCap(copy.hero_headline, 80),
      hero_subheadline: trimAndCap(copy.hero_subheadline, 200),
      about_paragraph: trimAndCap(copy.about_paragraph, 600),
      seo_meta_description: trimAndCap(copy.seo_meta_description, 160),
      cta_tagline: trimAndCap(copy.cta_tagline, 60),
    };
    const { error } = await supabase
      .from("website_copy")
      .update({
        hero_headline: safeCopy.hero_headline,
        hero_subheadline: safeCopy.hero_subheadline,
        about_paragraph: safeCopy.about_paragraph,
        services_descriptions: copy.services_descriptions as any,
        seo_meta_description: safeCopy.seo_meta_description,
        cta_tagline: safeCopy.cta_tagline,
        hero_headline_edited: copy.hero_headline_edited,
        hero_subheadline_edited: copy.hero_subheadline_edited,
        about_paragraph_edited: copy.about_paragraph_edited,
        services_descriptions_edited: copy.services_descriptions_edited,
        seo_meta_description_edited: copy.seo_meta_description_edited,
        cta_tagline_edited: copy.cta_tagline_edited,
      })
      .eq("user_id", user.id);

    setSaving(false);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Saved", description: "Your website copy has been updated." });
  };

  const handleRegenerate = async (fieldKey: string) => {
    if (!user || !profile) return;
    setRegenerating(fieldKey);
    try {
      const services = profile.tagline?.split(", ").filter(Boolean) || [];
      const { data, error } = await supabase.functions.invoke("generate-website-copy", {
        body: {
          businessName: profile.business_name,
          ownerFirstName: "",
          city: profile.address,
          services,
          businessType: "shop",
          regenerateField: fieldKey,
        },
      });
      if (error) throw error;
      if (data?.value && copy) {
        setCopy({ ...copy, [fieldKey]: data.value, [`${fieldKey}_edited`]: false });
        toast({ title: "Regenerated", description: `New ${fieldKey.replace(/_/g, " ")} generated.` });
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to regenerate.", variant: "destructive" });
    }
    setRegenerating(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "hsl(217,91%,60%)" }} />
      </div>
    );
  }

  if (!copy) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
        <Sparkles className="w-8 h-8 mx-auto mb-3" style={{ color: "hsl(217,91%,60%)" }} />
        <p className="text-white/70 text-sm">No website copy generated yet. Complete onboarding to auto-generate your website copy with AI.</p>
      </div>
    );
  }

  const isEdited = (key: string) => !(copy as any)[`${key}_edited`];

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="dash-page-title text-white">Website Copy</h2>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="h-10 gap-2"
          style={{ background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)" }}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </Button>
      </div>

      {FIELDS.map((field) => (
        <div key={field.key} className="rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Label className="text-white/70 text-sm font-medium">{field.label}</Label>
              {isEdited(field.key) && (
                <span
                  className="dash-badge"
                  style={{ background: "hsla(217,91%,60%,0.15)", color: "hsl(217,91%,60%)" }}
                >
                  AI Generated
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRegenerate(field.key)}
              disabled={regenerating === field.key}
              className="h-7 gap-1.5 text-xs"
              style={{ color: "hsl(217,91%,60%)" }}
            >
              {regenerating === field.key ? <Loader2 className="w-3 h-3 animate-spin" /> : <RotateCcw className="w-3 h-3" />}
              Regenerate
            </Button>
          </div>
          <Textarea
            value={(copy as any)[field.key] || ""}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            rows={field.rows}
            maxLength={field.maxLength}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-[hsl(217,91%,60%)] resize-none"
          />
          <p className="text-white/30 text-xs mt-1 text-right">
            {((copy as any)[field.key] || "").length} / {field.maxLength}
          </p>
        </div>
      ))}

      {/* Service descriptions */}
      {copy.services_descriptions?.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Label className="text-white/70 text-sm font-medium">Service Descriptions</Label>
            {!copy.services_descriptions_edited && (
              <span
                className="dash-badge"
                style={{ background: "hsla(217,91%,60%,0.15)", color: "hsl(217,91%,60%)" }}
              >
                AI Generated
              </span>
            )}
          </div>
          <div className="space-y-4">
            {copy.services_descriptions.map((sd, i) => (
              <div key={i}>
                <p className="text-white/50 text-xs font-medium mb-1">{sd.service}</p>
                <Textarea
                  value={sd.description}
                  onChange={(e) => handleServiceDescChange(i, e.target.value)}
                  rows={2}
                  maxLength={200}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-[hsl(217,91%,60%)] resize-none"
                />
                <p className="text-white/30 text-xs mt-1 text-right">{sd.description.length} / 200</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WebsiteCopyEditor;
