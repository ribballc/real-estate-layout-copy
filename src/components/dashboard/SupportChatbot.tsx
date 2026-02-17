import { useState, useRef, useEffect, forwardRef, useImperativeHandle, useCallback } from "react";
import { MessageCircle, X, Send, Loader2, Sparkles, Upload, Image, MapPin, Wrench, Pen, Star, Camera, CheckCircle2, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import { useToast } from "@/hooks/use-toast";

type Msg = { role: "user" | "assistant"; content: string; actions?: { name: string; result: string }[] };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/support-chat`;

interface Suggestion {
  label: string;
  icon: React.ElementType;
  prompt: string;
}

const suggestions: Suggestion[] = [
  { label: "Add a service area", icon: MapPin, prompt: "Add a service area" },
  { label: "Add photos", icon: Camera, prompt: "I want to add photos to my website" },
  { label: "Change my logo", icon: Image, prompt: "I want to change my logo" },
  { label: "Add a service", icon: Wrench, prompt: "I want to add a new service" },
  { label: "Add a testimonial", icon: Star, prompt: "I want to add a customer review" },
  { label: "Update my info", icon: Pen, prompt: "I want to update my business info" },
];

// Filter suggestions based on input text
function getFilteredSuggestions(input: string): Suggestion[] {
  if (!input.trim()) return [];
  const lower = input.toLowerCase();
  return suggestions.filter(
    (s) =>
      s.label.toLowerCase().includes(lower) ||
      s.prompt.toLowerCase().includes(lower)
  ).slice(0, 4);
}

export interface SupportChatbotHandle {
  openWithPrompt: (prompt: string) => void;
}

const SupportChatbot = forwardRef<SupportChatbotHandle>((_, ref) => {
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

  useImperativeHandle(ref, () => ({
    openWithPrompt: (prompt: string) => {
      setOpen(true);
      setInput(prompt);
      setTimeout(() => inputRef.current?.focus(), 100);
    },
  }));

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

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
      const token = session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: allMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to connect");
      }

      const data = await resp.json();
      const actions = data.actions || [];
      const content = data.content || "Done!";

      // Check if any action requires file upload
      const uploadAction = actions.find((a: { name: string; result: string }) =>
        a.result === "ACTION:UPLOAD_LOGO" || a.result === "ACTION:UPLOAD_PHOTOS"
      );

      if (uploadAction) {
        setPendingUpload(uploadAction.result === "ACTION:UPLOAD_LOGO" ? "logo" : "photos");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content, actions },
      ]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Sorry, I couldn't process that. ${e.message || "Please try again."}` },
      ]);
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
        const { error: uploadErr } = await supabase.storage
          .from("logos")
          .upload(path, file, { upsert: true });
        if (uploadErr) throw uploadErr;

        const { data: urlData } = supabase.storage.from("logos").getPublicUrl(path);
        const logoUrl = `${urlData.publicUrl}?t=${Date.now()}`;

        await supabase.from("profiles").update({ logo_url: logoUrl }).eq("user_id", user.id);

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "✅ Logo updated! Refresh your website preview to see the change." },
        ]);
        toast({ title: "Logo updated!", description: "Your new logo is live." });
      } else {
        // Photos upload
        const uploaded: string[] = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const ext = file.name.split(".").pop() || "jpg";
          const path = `${user.id}/${Date.now()}-${i}.${ext}`;
          const { error: uploadErr } = await supabase.storage
            .from("user-photos")
            .upload(path, file, { upsert: true });
          if (uploadErr) {
            console.error("Photo upload error:", uploadErr);
            continue;
          }
          const { data: urlData } = supabase.storage.from("user-photos").getPublicUrl(path);
          uploaded.push(urlData.publicUrl);
        }

        // Insert photo records
        const { data: existing } = await supabase
          .from("photos")
          .select("sort_order")
          .eq("user_id", user.id)
          .order("sort_order", { ascending: false })
          .limit(1);
        let nextOrder = (existing?.[0]?.sort_order ?? -1) + 1;

        for (const url of uploaded) {
          await supabase.from("photos").insert({
            user_id: user.id,
            url,
            sort_order: nextOrder++,
          });
        }

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `✅ ${uploaded.length} photo${uploaded.length > 1 ? "s" : ""} uploaded and added to your gallery!`,
          },
        ]);
        toast({ title: "Photos added!", description: `${uploaded.length} photo(s) uploaded.` });
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `❌ Upload failed: ${err.message}` },
      ]);
    }
  }, [pendingUpload, user, toast]);

  const handleSuggestionClick = (s: Suggestion) => {
    setInput("");
    setShowSuggestions(false);
    send(s.prompt);
  };

  return (
    <div className="support-chatbot">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={pendingUpload === "photos"}
        className="hidden"
        onChange={(e) => handleFileUpload(e.target.files)}
      />

      {/* FAB */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-20 md:bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-105 ${
          open ? "bg-white/10 backdrop-blur-xl border border-white/20" : ""
        }`}
        style={
          !open
            ? {
                background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 45%) 100%)",
                boxShadow: "0 8px 32px hsla(217, 91%, 50%, 0.4)",
              }
            : {}
        }
      >
        {open ? <X className="w-5 h-5 text-white" /> : <MessageCircle className="w-5 h-5 text-white" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-[8.5rem] md:bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col"
          style={{
            background: "linear-gradient(180deg, hsl(215 50% 12%) 0%, hsl(217 33% 10%) 100%)",
            height: "min(560px, calc(100vh - 140px))",
          }}
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 45%) 100%)",
              }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-sm">Darker AI</h3>
              <p className="text-white/40 text-xs">Ask me anything or make changes</p>
            </div>
            {messages.length > 0 && (
              <button
                onClick={() => { setMessages([]); setPendingUpload(null); }}
                className="text-white/30 hover:text-white/60 text-xs transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-white/50 text-sm text-center mb-4">
                  What would you like to do?
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => handleSuggestionClick(s)}
                      className="flex items-center gap-2 p-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] transition-colors text-left group"
                    >
                      <s.icon className="w-4 h-4 text-[hsl(217,91%,60%)] shrink-0" />
                      <span className="text-white/60 text-xs group-hover:text-white transition-colors leading-tight">
                        {s.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm ${
                    m.role === "user"
                      ? "bg-[hsl(217,91%,55%)] text-white rounded-br-md"
                      : "bg-white/[0.06] text-white/80 rounded-bl-md border border-white/5"
                  }`}
                >
                  {m.role === "assistant" ? (
                    <div className="space-y-2">
                      <div className="prose prose-sm prose-invert max-w-none [&>p]:m-0 [&>ul]:m-0 [&>ol]:m-0 [&>p]:leading-relaxed">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                      {/* Action badges */}
                      {m.actions && m.actions.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {m.actions
                            .filter((a) => a.result.startsWith("✅"))
                            .map((a, j) => (
                              <span
                                key={j}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 text-[11px] font-medium"
                              >
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

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/[0.06] rounded-xl px-4 py-3 border border-white/5">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-[hsl(217,91%,60%)]" />
                    <span className="text-white/40 text-xs">Working on it...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Upload prompt */}
            {pendingUpload && !loading && (
              <div className="flex justify-start">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-[hsl(217,91%,60%)]/40 bg-[hsl(217,91%,60%)]/5 hover:bg-[hsl(217,91%,60%)]/10 transition-colors group"
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
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-white/[0.06] transition-colors text-left"
                  >
                    <s.icon className="w-4 h-4 text-[hsl(217,91%,60%)] shrink-0" />
                    <span className="text-white/70 text-sm">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-white/10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setShowSuggestions(e.target.value.trim().length > 0);
                }}
                onFocus={() => setShowSuggestions(input.trim().length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Try &quot;Add Dallas, TX as a service area&quot;"
                disabled={loading}
                className="flex-1 h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[hsl(217,91%,60%)] disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                style={{
                  background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 45%) 100%)",
                }}
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
});

SupportChatbot.displayName = "SupportChatbot";

export default SupportChatbot;
