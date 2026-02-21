import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown, Download, Share2, RefreshCw, Globe, Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface QrCodeTabProps {
  isDark?: boolean;
}

const QR_SIZE = 280;

function buildQrDataUrl(url: string, size = QR_SIZE): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&format=png&margin=12`;
}

const QrCodeTab = ({ isDark = true }: QrCodeTabProps) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [slug, setSlug] = useState<string | null>(null);
  const [savedQrUrl, setSavedQrUrl] = useState<string | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const publishedOrigin = "https://darker-digital.lovable.app";

  // Load profile data
  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("slug, qr_code_url")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        setSlug(data?.slug ?? null);
        if (data?.qr_code_url) {
          setSavedQrUrl(data.qr_code_url);
          setSelectedUrl(data.qr_code_url);
        } else if (data?.slug) {
          setSelectedUrl(`${publishedOrigin}/site/${data.slug}`);
        }
        setLoading(false);
      });
  }, [user]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const availableUrls = slug
    ? [
        { label: `${slug}.darkerdigital.com`, url: `${publishedOrigin}/site/${slug}`, type: "default" },
        { label: `darker-digital.lovable.app/site/${slug}`, url: `${publishedOrigin}/site/${slug}`, type: "full" },
      ]
    : [];

  const handleGenerate = useCallback(async () => {
    if (!user || !selectedUrl) return;
    setGenerating(true);
    const { error } = await supabase
      .from("profiles")
      .update({ qr_code_url: selectedUrl })
      .eq("user_id", user.id);
    if (error) {
      toast({ title: "Error saving QR code", description: error.message, variant: "destructive" });
    } else {
      setSavedQrUrl(selectedUrl);
      toast({ title: "QR Code generated ✅", description: "Your QR code is saved and ready to share." });
    }
    setGenerating(false);
  }, [user, selectedUrl, toast]);

  const handleDownload = useCallback(async () => {
    if (!savedQrUrl) return;
    try {
      const response = await fetch(buildQrDataUrl(savedQrUrl, 600));
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "qr-code.png";
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "Downloaded!", description: "QR code saved to your device." });
    } catch {
      toast({ title: "Download failed", variant: "destructive" });
    }
  }, [savedQrUrl, toast]);

  const handleShare = useCallback(async () => {
    if (!savedQrUrl) return;
    if (navigator.share) {
      try {
        const response = await fetch(buildQrDataUrl(savedQrUrl, 600));
        const blob = await response.blob();
        const file = new File([blob], "qr-code.png", { type: "image/png" });
        await navigator.share({ title: "My QR Code", files: [file] });
      } catch {
        // Fallback: copy URL
        await navigator.clipboard.writeText(savedQrUrl);
        toast({ title: "Link copied to clipboard" });
      }
    } else {
      await navigator.clipboard.writeText(savedQrUrl);
      setCopied(true);
      toast({ title: "Link copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    }
  }, [savedQrUrl, toast]);

  const cardBg = isDark ? "hsla(0,0%,100%,0.04)" : "hsl(0,0%,98%)";
  const cardBorder = isDark ? "hsla(0,0%,100%,0.08)" : "hsl(214,20%,88%)";
  const headingText = isDark ? "white" : "hsl(222,47%,11%)";
  const mutedText = isDark ? "hsla(0,0%,100%,0.5)" : "hsl(215,16%,47%)";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "hsl(217,91%,60%)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* URL Selector Pill */}
      <div className="space-y-2">
        <label className="text-sm font-medium" style={{ color: mutedText }}>Website URL</label>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center justify-between gap-2 transition-all duration-150"
            style={{
              background: cardBg,
              border: `1px solid ${dropdownOpen ? "hsl(217,91%,60%)" : cardBorder}`,
              borderRadius: 12,
              padding: "12px 16px",
              color: headingText,
              fontSize: 14,
            }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Globe className="w-4 h-4 shrink-0" style={{ color: "hsl(217,91%,60%)" }} />
              <span className="truncate font-mono text-[13px]">{selectedUrl || "Select a URL"}</span>
            </div>
            <ChevronDown
              className={cn("w-4 h-4 shrink-0 transition-transform duration-200", dropdownOpen && "rotate-180")}
              style={{ color: mutedText }}
            />
          </button>

          {dropdownOpen && (
            <div
              className="absolute z-50 w-full mt-1.5 overflow-hidden"
              style={{
                background: isDark ? "hsl(215,50%,10%)" : "white",
                border: `1px solid ${cardBorder}`,
                borderRadius: 12,
                boxShadow: isDark ? "0 8px 32px hsla(0,0%,0%,0.5)" : "0 8px 32px hsla(0,0%,0%,0.12)",
              }}
            >
              {availableUrls.map((item) => (
                <button
                  key={item.type}
                  className="w-full text-left flex items-center gap-2.5 transition-colors duration-100"
                  style={{
                    padding: "12px 16px",
                    fontSize: 13,
                    color: selectedUrl === item.url ? "hsl(217,91%,60%)" : headingText,
                    background: selectedUrl === item.url
                      ? isDark ? "hsla(217,91%,60%,0.08)" : "hsla(217,91%,60%,0.06)"
                      : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedUrl !== item.url) e.currentTarget.style.background = isDark ? "hsla(0,0%,100%,0.04)" : "hsl(210,40%,96%)";
                  }}
                  onMouseLeave={(e) => {
                    if (selectedUrl !== item.url) e.currentTarget.style.background = "transparent";
                  }}
                  onClick={() => {
                    setSelectedUrl(item.url);
                    setDropdownOpen(false);
                  }}
                >
                  <Globe className="w-3.5 h-3.5 shrink-0" style={{ color: selectedUrl === item.url ? "hsl(217,91%,60%)" : mutedText }} />
                  <span className="font-mono truncate">{item.label}</span>
                  {selectedUrl === item.url && <Check className="w-3.5 h-3.5 ml-auto shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={generating || !selectedUrl}
        className="w-full flex items-center justify-center gap-2 font-semibold text-white transition-all duration-200 disabled:opacity-50"
        style={{
          height: 48,
          borderRadius: 12,
          fontSize: 15,
          background: "linear-gradient(135deg, hsl(217,91%,60%) 0%, hsl(224,91%,54%) 100%)",
          boxShadow: "0 4px 16px hsla(217,91%,60%,0.3)",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(1.08)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.filter = "none"; }}
      >
        <RefreshCw className={cn("w-4 h-4", generating && "animate-spin")} />
        {savedQrUrl ? "Regenerate QR Code" : "Generate QR Code"}
      </button>

      {/* QR Code Display */}
      {savedQrUrl && (
        <div className="space-y-5">
          <div
            className="flex items-center justify-center"
            style={{
              background: "white",
              borderRadius: 16,
              padding: 24,
              border: `1px solid ${cardBorder}`,
            }}
          >
            <img
              src={buildQrDataUrl(savedQrUrl)}
              alt="QR Code"
              width={QR_SIZE}
              height={QR_SIZE}
              className="rounded-lg"
              style={{ imageRendering: "pixelated" }}
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2.5 font-semibold transition-all duration-150"
              style={{
                height: 52,
                borderRadius: 12,
                fontSize: 15,
                background: isDark ? "hsla(0,0%,100%,0.06)" : "hsl(210,40%,94%)",
                border: `1px solid ${cardBorder}`,
                color: headingText,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isDark ? "hsla(0,0%,100%,0.1)" : "hsl(210,40%,90%)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isDark ? "hsla(0,0%,100%,0.06)" : "hsl(210,40%,94%)";
              }}
            >
              <Download className="w-5 h-5" />
              Download
            </button>
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2.5 font-semibold transition-all duration-150"
              style={{
                height: 52,
                borderRadius: 12,
                fontSize: 15,
                background: isDark ? "hsla(0,0%,100%,0.06)" : "hsl(210,40%,94%)",
                border: `1px solid ${cardBorder}`,
                color: headingText,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isDark ? "hsla(0,0%,100%,0.1)" : "hsl(210,40%,90%)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isDark ? "hsla(0,0%,100%,0.06)" : "hsl(210,40%,94%)";
              }}
            >
              {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
              {copied ? "Copied!" : "Share"}
            </button>
          </div>

          <p className="text-center text-[12px]" style={{ color: mutedText }}>
            This QR code links to your website. It's saved and will persist across sessions.
          </p>
        </div>
      )}
    </div>
  );
};

export default QrCodeTab;
