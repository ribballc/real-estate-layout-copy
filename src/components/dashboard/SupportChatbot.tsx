import { useState, useRef, useEffect, forwardRef, useImperativeHandle, useCallback } from "react";
import { MessageCircle, X, Send, Sparkles, Upload, ArrowRight, DollarSign, TrendingUp, HelpCircle, Bug, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import { useToast } from "@/hooks/use-toast";
import mascotPenguin from "@/assets/mascot-penguin.png";

type Msg = { role: "user" | "assistant"; content: string; actions?: { name: string; result: string }[] };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/support-chat`;

interface Suggestion {
  label: string;
  emoji: string;
  prompt: string;
}

const suggestions: Suggestion[] = [
  { label: "Price a Service", emoji: "💰", prompt: "Help me price this service for my shop:" },
  { label: "Write a Reply", emoji: "💬", prompt: "Help me write a professional response to this customer message:" },
  { label: "Marketing Idea", emoji: "🚀", prompt: "Give me content ideas to post this week for my detailing shop" },
  { label: "How do I...?", emoji: "❓", prompt: "How do I use this feature in the dashboard:" },
  { label: "Upsell Script", emoji: "📈", prompt: "Write me an upsell script for:" },
  { label: "Report a Bug", emoji: "🐛", prompt: "I found a bug I'd like to report:" },
];

function getFilteredSuggestions(input: string): Suggestion[] {
  if (!input.trim()) return [];
  const lower = input.toLowerCase();
  return suggestions.filter(
    (s) => s.label.toLowerCase().includes(lower) || s.prompt.toLowerCase().includes(lower)
  ).slice(0, 4);
}

/* ── Dot-wave loading animation ── */
const DotWave = () => (
  <div className="flex items-center gap-1 px-1 py-0.5">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-[6px] h-[6px] rounded-full bg-[hsl(217,91%,60%)]"
        style={{
          animation: "dotWave 1.2s ease-in-out infinite",
          animationDelay: `${i * 0.15}s`,
        }}
      />
    ))}
    <style>{`
      @keyframes dotWave {
        0%, 60%, 100% { transform: translateY(0); opacity: 0.35; }
        30% { transform: translateY(-6px); opacity: 1; }
      }
    `}</style>
  </div>
);

export interface SupportChatbotHandle {
  openWithPrompt: (prompt: string) => void;
  toggle: () => void;
}

interface SupportChatbotProps {
  isDark?: boolean;
}

const SupportChatbot = forwardRef<SupportChatbotHandle, SupportChatbotProps>(({ isDark = true }, ref) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [pendingUpload, setPendingUpload] = useState<"logo" | "photos" | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll-lock on mobile when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useImperativeHandle(ref, () => ({
    openWithPrompt: (prompt: string) => {
      setOpen(true);
      setInput(prompt);
      setTimeout(() => inputRef.current?.focus(), 100);
    },
    toggle: () => setOpen((prev) => !prev),
  }));

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const filteredSuggestions = getFilteredSuggestions(input);

  const send = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Msg = { role: "user", content: text.trim() };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput("");
    setShowSuggestions(false);
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Please log in first.");
      const token = session.access_token;

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ messages: allMessages.map((m) => ({ role: m.role, content: m.content })) }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to connect");
      }

      const data = await resp.json();
      const actions = data.actions || [];
      const content = data.content || "Done!";

      const uploadAction = actions.find((a: { name: string; result: string }) =>
        a.result === "ACTION:UPLOAD_LOGO" || a.result === "ACTION:UPLOAD_PHOTOS"
      );
      if (uploadAction) {
        setPendingUpload(uploadAction.result === "ACTION:UPLOAD_LOGO" ? "logo" : "photos");
      }

      setMessages((prev) => [...prev, { role: "assistant", content, actions }]);
    } catch (e: any) {
      setMessages((prev) => [...prev, { role: "assistant", content: `😕 ${e.message || "Something went wrong. Try again."}` }]);
    }
    setLoading(false);
  }, [messages, loading]);

  const handleFileUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0 || !user) return;
    const uploadType = pendingUpload;
    setPendingUpload(null);

    try {
      if (uploadType === "logo") {
        const file = files[0];
        const ext = file.name.split(".").pop() || "png";
        const path = `${user.id}/logo.${ext}`;
        const { error: uploadErr } = await supabase.storage.from("logos").upload(path, file, { upsert: true });
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from("logos").getPublicUrl(path);
        const logoUrl = `${urlData.publicUrl}?t=${Date.now()}`;
        await supabase.from("profiles").update({ logo_url: logoUrl }).eq("user_id", user.id);
        setMessages((prev) => [...prev, { role: "assistant", content: "✅ Logo updated! Refresh your preview to see it live." }]);
        toast({ title: "Logo updated!", description: "Your new logo is live." });
      } else {
        const uploaded: string[] = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const ext = file.name.split(".").pop() || "jpg";
          const path = `${user.id}/${Date.now()}-${i}.${ext}`;
          const { error: uploadErr } = await supabase.storage.from("user-photos").upload(path, file, { upsert: true });
          if (uploadErr) { console.error("Photo upload error:", uploadErr); continue; }
          const { data: urlData } = supabase.storage.from("user-photos").getPublicUrl(path);
          uploaded.push(urlData.publicUrl);
        }
        const { data: existing } = await supabase.from("photos").select("sort_order").eq("user_id", user.id).order("sort_order", { ascending: false }).limit(1);
        let nextOrder = (existing?.[0]?.sort_order ?? -1) + 1;
        for (const url of uploaded) {
          await supabase.from("photos").insert({ user_id: user.id, url, sort_order: nextOrder++ });
        }
        setMessages((prev) => [...prev, { role: "assistant", content: `✅ ${uploaded.length} photo${uploaded.length > 1 ? "s" : ""} uploaded! 📸` }]);
        toast({ title: "Photos added!", description: `${uploaded.length} photo(s) uploaded.` });
      }
    } catch (err: any) {
      setMessages((prev) => [...prev, { role: "assistant", content: `❌ Upload failed: ${err.message}` }]);
    }
  }, [pendingUpload, user, toast]);

  const handleSuggestionClick = (s: Suggestion) => {
    setInput("");
    setShowSuggestions(false);
    send(s.prompt);
  };

  return (
    <div className="support-chatbot">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={pendingUpload === "photos"}
        className="hidden"
        onChange={(e) => handleFileUpload(e.target.files)}
      />

      {/* Desktop FAB */}
      <button
        onClick={() => setOpen(!open)}
        className={`hidden md:flex fixed bottom-8 right-6 z-50 w-14 h-14 rounded-full items-center justify-center transition-all duration-300 hover:scale-105 ${
          open ? (isDark ? "bg-white/10 backdrop-blur-xl border border-white/20" : "bg-white border border-[hsl(214,32%,88%)]") : ""
        }`}
        style={!open ? { background: "hsl(217, 91%, 60%)", boxShadow: "0 10px 26px hsla(217, 91%, 50%, 0.36)" } : {}}
      >
        {open ? (
          <X className="w-5 h-5" style={{ color: isDark ? "#fff" : "hsl(218, 24%, 23%)" }} strokeWidth={2.2} />
        ) : (
          <MessageCircle className="w-6 h-6" style={{ color: "#fff", filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.28))" }} strokeWidth={2.2} />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed inset-0 md:inset-auto md:bottom-24 md:right-6 md:w-[400px] md:max-w-[calc(100vw-48px)] md:rounded-2xl md:h-[min(580px,calc(100vh-140px))] z-[55] md:border md:border-white/10 md:shadow-2xl overflow-hidden flex flex-col"
          style={{ background: "linear-gradient(180deg, hsl(215 50% 12%) 0%, hsl(217 33% 10%) 100%)" }}
        >
          {/* ── Header ── */}
          <div className="safe-area-pt p-4 border-b border-white/10 flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 45%) 100%)" }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-sm leading-tight">AI Shop Assistant</h3>
              <p className="text-white/40 text-[11px]">Detailing · PPF · Tint · Wraps</p>
            </div>
            {messages.length > 0 && (
              <button
                onClick={() => { setMessages([]); setPendingUpload(null); }}
                className="text-white/30 hover:text-white/60 text-xs transition-colors px-2 py-1 rounded-md hover:bg-white/5"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>

          {/* ── Messages ── */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 overscroll-contain">
            {messages.length === 0 && (
              <div className="flex flex-col items-center pt-4 pb-2 space-y-4">
                <img
                  src={mascotPenguin}
                  alt="Assistant"
                  className="w-16 h-16 object-contain opacity-80"
                  style={{ filter: "drop-shadow(0 4px 12px hsla(217,91%,50%,0.2))" }}
                />
                <div className="text-center space-y-1">
                  <p className="text-white/70 text-sm font-medium">Hey! 👋 How can I help?</p>
                  <p className="text-white/35 text-xs max-w-[260px] mx-auto">
                    Pricing, marketing, customer replies, dashboard help — ask me anything
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
                  {suggestions.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => handleSuggestionClick(s)}
                      className="flex items-center gap-2.5 p-3 rounded-xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.07] active:scale-[0.98] transition-all text-left group"
                    >
                      <span className="text-base shrink-0">{s.emoji}</span>
                      <span className="text-white/55 text-xs group-hover:text-white/80 transition-colors leading-tight">
                        {s.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                style={{ animation: "chatBubbleIn 0.25s ease-out both", animationDelay: `${i === messages.length - 1 ? 0.05 : 0}s` }}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-[hsl(217,91%,55%)] text-white rounded-br-md"
                      : "bg-white/[0.06] text-white/85 rounded-bl-md border border-white/5"
                  }`}
                >
                  {m.role === "assistant" ? (
                    <div className="space-y-2">
                      <div className="prose prose-sm prose-invert max-w-none [&>p]:m-0 [&>ul]:m-0 [&>ol]:m-0 [&>p]:leading-relaxed [&>ul]:leading-relaxed [&_li]:text-white/80">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                      {m.actions && m.actions.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {m.actions.filter((a) => a.result.startsWith("✅")).map((a, j) => (
                            <span key={j} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium" style={{ background: "hsla(142,71%,45%,0.1)", color: "hsl(142,71%,45%)" }}>
                              <CheckCircle2 className="w-3 h-3" />
                              {a.name.replace(/_/g, " ")}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    m.content
                  )}
                </div>
              </div>
            ))}

            {/* Dot-wave loading */}
            {loading && (
              <div className="flex justify-start" style={{ animation: "chatBubbleIn 0.2s ease-out both" }}>
                <div className="bg-white/[0.06] rounded-2xl rounded-bl-md px-4 py-3 border border-white/5">
                  <DotWave />
                </div>
              </div>
            )}

            {/* Upload prompt */}
            {pendingUpload && !loading && (
              <div className="flex justify-start">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-[hsl(217,91%,60%)]/40 bg-[hsl(217,91%,60%)]/5 hover:bg-[hsl(217,91%,60%)]/10 active:scale-[0.98] transition-all group"
                >
                  <Upload className="w-4 h-4 text-[hsl(217,91%,60%)]" />
                  <span className="text-white/70 text-sm group-hover:text-white transition-colors">
                    {pendingUpload === "logo" ? "Upload your new logo" : "Upload photos"}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-white/60 transition-colors" />
                </button>
              </div>
            )}
          </div>

          {/* Autocomplete suggestions */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="px-3 pb-1">
              <div className="rounded-xl border border-white/10 bg-[hsl(215,50%,14%)] overflow-hidden">
                {filteredSuggestions.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => handleSuggestionClick(s)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-white/[0.06] active:bg-white/[0.1] transition-colors text-left"
                  >
                    <span className="text-sm">{s.emoji}</span>
                    <span className="text-white/70 text-sm">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Input + Penguin ── */}
          <div className="p-3 border-t border-white/10 safe-area-pb">
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="flex items-center gap-2"
            >
              {/* Penguin mascot */}
              <img
                src={mascotPenguin}
                alt=""
                className="w-8 h-8 shrink-0 object-contain opacity-60 hover:opacity-90 transition-opacity"
                style={{ filter: "drop-shadow(0 2px 6px hsla(217,91%,50%,0.15))" }}
              />
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => { setInput(e.target.value); setShowSuggestions(e.target.value.trim().length > 0); }}
                onFocus={() => setShowSuggestions(input.trim().length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Ask me anything..."
                disabled={loading}
                className="flex-1 h-11 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-[16px] placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[hsl(217,91%,60%)] disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 active:scale-95 shrink-0"
                style={{ background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 45%) 100%)" }}
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Chat bubble entrance animation */}
      <style>{`
        @keyframes chatBubbleIn {
          0% { opacity: 0; transform: translateY(8px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
});

SupportChatbot.displayName = "SupportChatbot";

export default SupportChatbot;
