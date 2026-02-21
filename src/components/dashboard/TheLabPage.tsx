import { useState, useEffect, useCallback, lazy, Suspense, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Search, ChevronRight, ChevronLeft, Check, ArrowRight, Copy,
  Clock, X, Bookmark, Filter, Sparkles, QrCode, CheckCircle2,
} from "lucide-react";
import {
  LAB_CATEGORIES, getAllLessons, findLesson, getAllTags,
  type LabCategory, type Lesson, type LessonLevel,
} from "@/data/lab-content";
import { useNavigate } from "react-router-dom";

const QrCodeTab = lazy(() => import("./QrCodeTab"));

// ─── Copy button ──────────────────────────────────────────────────────────────
const CopyBtn = ({ text, label = "Copy" }: { text: string; label?: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => { await navigator.clipboard.writeText(text.trim()); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className={cn("flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg transition-all",
        copied ? "bg-green-500/15 text-green-400" : "bg-[hsla(217,91%,60%,0.12)] text-[hsl(217,91%,65%)] hover:bg-[hsla(217,91%,60%,0.2)]"
      )}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied!" : label}
    </button>
  );
};

// ─── Level badge ──────────────────────────────────────────────────────────────
const LevelBadge = ({ level }: { level: LessonLevel }) => {
  const colors = {
    beginner: "bg-green-500/15 text-green-400",
    intermediate: "bg-amber-500/15 text-amber-400",
    advanced: "bg-red-500/15 text-red-400",
  };
  return <span className={cn("text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md", colors[level])}>{level}</span>;
};

// ─── Type badge ───────────────────────────────────────────────────────────────
const TypeBadge = ({ type }: { type: string }) => (
  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[hsla(217,91%,60%,0.1)] text-[hsl(217,91%,65%)]">
    {type}
  </span>
);

// ─── Views ────────────────────────────────────────────────────────────────────

type View = { type: "home" } | { type: "category"; id: string } | { type: "lesson"; id: string } | { type: "qr" };

const TheLabPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const isDark = typeof document !== "undefined"
    ? document.body.getAttribute("data-dashboard-theme") !== "light"
    : true;

  const [view, setView] = useState<View>({ type: "home" });
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<LessonLevel | "all">("all");
  const [tagFilter, setTagFilter] = useState<string | "all">("all");
  const [showFilters, setShowFilters] = useState(false);

  // Progress (completed lesson IDs)
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("offer_lab_progress").eq("user_id", user.id).single().then(({ data }) => {
      const p = data?.offer_lab_progress;
      if (p && typeof p === "object" && Array.isArray((p as any).completedLessons)) {
        setCompleted((p as any).completedLessons);
      } else if (p && typeof p === "object") {
        // Migrate old boolean progress
        const old = p as Record<string, boolean>;
        const migrated = Object.entries(old).filter(([, v]) => v).map(([k]) => k);
        if (migrated.length) setCompleted(migrated);
      }
    });
  }, [user]);

  const saveCompleted = useCallback(async (ids: string[]) => {
    if (!user) return;
    await supabase.from("profiles").update({
      offer_lab_progress: { completedLessons: ids } as any,
    }).eq("user_id", user.id);
  }, [user]);

  const toggleComplete = (lessonId: string) => {
    const next = completed.includes(lessonId)
      ? completed.filter(id => id !== lessonId)
      : [...completed, lessonId];
    setCompleted(next);
    saveCompleted(next);
    toast({
      title: next.includes(lessonId) ? "Lesson completed! 🎉" : "Lesson unmarked",
    });
  };

  const allLessons = useMemo(() => getAllLessons(), []);
  const allTags = useMemo(() => getAllTags(), []);

  const filteredLessons = useMemo(() => {
    let list = allLessons;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(l => l.title.toLowerCase().includes(q) || l.outcome.toLowerCase().includes(q) || l.tags.some(t => t.toLowerCase().includes(q)));
    }
    if (levelFilter !== "all") list = list.filter(l => l.level === levelFilter);
    if (tagFilter !== "all") list = list.filter(l => l.tags.includes(tagFilter));
    return list;
  }, [allLessons, search, levelFilter, tagFilter]);

  const totalCompleted = completed.length;
  const totalLessons = allLessons.length;

  // ─── Render ─────────────────────────────────────────────────────────────────

  // Lesson Detail View
  if (view.type === "lesson") {
    const found = findLesson(view.id);
    if (!found) return null;
    const { lesson, module, category } = found;
    const isComplete = completed.includes(lesson.id);
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 md:py-8">
          {/* Breadcrumb */}
          <button onClick={() => setView({ type: "category", id: category.id })} className="flex items-center gap-1.5 text-[13px] text-white/40 hover:text-white/70 transition-colors mb-6">
            <ChevronLeft className="w-4 h-4" /> {category.title} / {module.title}
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <LevelBadge level={lesson.level} />
            <TypeBadge type={lesson.type} />
            <span className="flex items-center gap-1 text-[11px] text-white/30"><Clock className="w-3 h-3" />{lesson.estimatedMinutes} min</span>
          </div>

          <h1 className="text-[22px] md:text-[28px] font-bold text-white/90 leading-tight mb-2">{lesson.title}</h1>
          <p className="text-[14px] text-white/50 leading-relaxed mb-8">{lesson.outcome}</p>

          {/* Sections */}
          <div className="space-y-8">
            {lesson.sections.map((section, i) => (
              <div key={i}>
                <h3 className="text-[13px] font-semibold uppercase tracking-widest text-white/30 mb-3">{section.heading}</h3>
                <div className="text-[14px] text-white/65 leading-relaxed whitespace-pre-line">{section.body}</div>
                {section.template && (
                  <div className="mt-3">
                    <pre className="text-[12px] leading-relaxed whitespace-pre-wrap font-mono rounded-xl p-4 border border-white/[0.08] bg-white/[0.03] text-white/70 overflow-auto max-h-64">{section.template.trim()}</pre>
                    <div className="mt-2 flex justify-end">
                      <CopyBtn text={section.template} label={section.templateLabel || "Copy"} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action link */}
          {lesson.actionLink && (
            <button
              onClick={() => navigate(lesson.actionLink!)}
              className="mt-8 w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-[14px] text-white transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, hsl(217,91%,60%) 0%, hsl(224,91%,54%) 100%)", boxShadow: "0 4px 16px hsla(217,91%,60%,0.3)" }}
            >
              {lesson.actionLabel} <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {/* Complete toggle */}
          <div className="mt-8 pt-6 border-t border-white/[0.07]">
            <button onClick={() => toggleComplete(lesson.id)} className="flex items-center gap-3 group">
              <div className={cn("w-5 h-5 rounded-md flex items-center justify-center border transition-colors",
                isComplete ? "bg-[hsl(217,91%,60%)] border-[hsl(217,91%,60%)]" : "border-white/20 group-hover:border-white/40"
              )}>
                {isComplete && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
              <span className="text-[13px] font-medium text-white/60 group-hover:text-white/80 transition-colors">
                {isComplete ? "Completed ✓" : "Mark as completed"}
              </span>
            </button>
          </div>

          {/* Next lessons */}
          {lesson.nextLessons && lesson.nextLessons.length > 0 && (
            <div className="mt-8">
              <h3 className="text-[13px] font-semibold uppercase tracking-widest text-white/30 mb-4">Recommended Next</h3>
              <div className="space-y-2">
                {lesson.nextLessons.map(nid => {
                  const nf = findLesson(nid);
                  if (!nf) return null;
                  return (
                    <button key={nid} onClick={() => setView({ type: "lesson", id: nid })}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.14] transition-all text-left">
                      <nf.lesson.icon className="w-4 h-4 text-white/40 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium text-white/75 truncate">{nf.lesson.title}</div>
                        <div className="text-[11px] text-white/35 truncate">{nf.module.title}</div>
                      </div>
                      {completed.includes(nid) && <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />}
                      <ChevronRight className="w-4 h-4 text-white/20 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // QR Code View
  if (view.type === "qr") {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 md:px-8 py-6 md:py-8">
          <button onClick={() => setView({ type: "home" })} className="flex items-center gap-1.5 text-[13px] text-white/40 hover:text-white/70 transition-colors mb-6">
            <ChevronLeft className="w-4 h-4" /> Back to The Lab
          </button>
          <Suspense fallback={<div className="flex items-center justify-center py-32"><div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "hsl(217,91%,60%)", borderTopColor: "transparent" }} /></div>}>
            <QrCodeTab isDark={isDark} />
          </Suspense>
        </div>
      </div>
    );
  }

  // Category View
  if (view.type === "category") {
    const cat = LAB_CATEGORIES.find(c => c.id === view.id);
    if (!cat) return null;
    const catLessons = allLessons.filter(l => l.categoryId === cat.id);
    const catCompleted = catLessons.filter(l => completed.includes(l.id)).length;
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-8">
          <button onClick={() => setView({ type: "home" })} className="flex items-center gap-1.5 text-[13px] text-white/40 hover:text-white/70 transition-colors mb-6">
            <ChevronLeft className="w-4 h-4" /> Back to The Lab
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${cat.color}15`, border: `1px solid ${cat.color}25` }}>
              <cat.icon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-[22px] font-bold text-white/90">{cat.title}</h1>
              <p className="text-[13px] text-white/45">{cat.description}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-3 mt-4 mb-8">
            <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden max-w-xs">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${catLessons.length ? (catCompleted / catLessons.length) * 100 : 0}%`, background: cat.color }} />
            </div>
            <span className="text-[12px] font-medium text-white/40">{catCompleted}/{catLessons.length} completed</span>
          </div>

          {/* Modules */}
          {cat.modules.map(mod => (
            <div key={mod.id} className="mb-10">
              <h2 className="text-[16px] font-semibold text-white/80 mb-1">{mod.title}</h2>
              <p className="text-[13px] text-white/40 mb-4">{mod.promise}</p>
              <div className="space-y-2.5">
                {mod.lessons.map(lesson => {
                  const done = completed.includes(lesson.id);
                  return (
                    <button key={lesson.id} onClick={() => setView({ type: "lesson", id: lesson.id })}
                      className={cn("w-full flex items-center gap-3.5 p-4 rounded-xl border transition-all text-left group",
                        done ? "bg-white/[0.02] border-white/[0.06]" : "bg-white/[0.03] border-white/[0.08] hover:border-white/[0.16] hover:-translate-y-0.5"
                      )}>
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                        done ? "bg-green-500/15" : "bg-white/[0.06]"
                      )}>
                        {done ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <lesson.icon className="w-4 h-4 text-white/50" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={cn("text-[14px] font-medium leading-snug mb-0.5", done ? "text-white/50 line-through" : "text-white/80")}>{lesson.title}</div>
                        <div className="text-[12px] text-white/35 truncate">{lesson.outcome}</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <LevelBadge level={lesson.level} />
                        <span className="flex items-center gap-1 text-[11px] text-white/25"><Clock className="w-3 h-3" />{lesson.estimatedMinutes}m</span>
                        <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── Home View ──────────────────────────────────────────────────────────────

  const isSearching = search || levelFilter !== "all" || tagFilter !== "all";

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
          <div>
            <h1 className="text-[22px] font-bold tracking-tight text-white/90 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[hsl(217,91%,60%)]" /> The Lab
            </h1>
            <p className="text-[13px] text-white/45 mt-0.5">Your growth academy — learn, implement, and scale your shop.</p>
          </div>
          <div className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 shrink-0">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={cn("w-2.5 h-2.5 rounded-full transition-colors",
                  i < Math.ceil((totalCompleted / totalLessons) * 5) ? "bg-[hsl(217,91%,60%)]" : "bg-white/10"
                )} />
              ))}
            </div>
            <span className="text-[13px] font-semibold text-white/60">{totalCompleted}/{totalLessons} done</span>
          </div>
        </div>

        {/* Overall progress */}
        <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden mb-8">
          <div className="h-full rounded-full bg-[hsl(217,91%,60%)] transition-all duration-500" style={{ width: `${(totalCompleted / totalLessons) * 100}%` }} />
        </div>

        {/* Search & filters */}
        <div className="flex items-center gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search lessons, scripts, calculators..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-[hsl(217,91%,60%)] transition-colors"
            />
            {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-3.5 h-3.5 text-white/30" /></button>}
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={cn("h-10 px-3 rounded-xl border flex items-center gap-1.5 text-[13px] font-medium transition-colors",
              showFilters ? "bg-[hsla(217,91%,60%,0.1)] border-[hsl(217,91%,60%)] text-[hsl(217,91%,65%)]" : "bg-white/[0.04] border-white/[0.08] text-white/50 hover:text-white/70"
            )}>
            <Filter className="w-3.5 h-3.5" /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="flex flex-wrap items-center gap-3 mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-white/30 font-semibold mr-2">Level:</span>
              {(["all", "beginner", "intermediate", "advanced"] as const).map(l => (
                <button key={l} onClick={() => setLevelFilter(l)}
                  className={cn("text-[12px] px-2.5 py-1 rounded-md mr-1 transition-colors",
                    levelFilter === l ? "bg-[hsla(217,91%,60%,0.15)] text-[hsl(217,91%,65%)]" : "text-white/40 hover:text-white/60"
                  )}>
                  {l === "all" ? "All" : l.charAt(0).toUpperCase() + l.slice(1)}
                </button>
              ))}
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-white/30 font-semibold mr-2">Topic:</span>
              <select value={tagFilter} onChange={e => setTagFilter(e.target.value)}
                className="text-[12px] px-2.5 py-1 rounded-md bg-white/[0.06] border border-white/[0.08] text-white/60 appearance-none">
                <option value="all">All Topics</option>
                {allTags.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Search results */}
        {isSearching ? (
          <div className="space-y-2.5">
            <p className="text-[12px] text-white/30 mb-3">{filteredLessons.length} result{filteredLessons.length !== 1 ? "s" : ""}</p>
            {filteredLessons.map(lesson => (
              <button key={lesson.id} onClick={() => setView({ type: "lesson", id: lesson.id })}
                className="w-full flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.16] transition-all text-left group">
                <lesson.icon className="w-4 h-4 text-white/40 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-medium text-white/80 truncate">{lesson.title}</div>
                  <div className="text-[12px] text-white/35 truncate">{lesson.outcome}</div>
                </div>
                <LevelBadge level={lesson.level} />
                <ChevronRight className="w-4 h-4 text-white/20" />
              </button>
            ))}
          </div>
        ) : (
          <>
            {/* Start Here banner */}
            {totalCompleted === 0 && (
              <div className="mb-8 p-5 rounded-2xl border border-[hsla(217,91%,60%,0.2)] bg-[hsla(217,91%,60%,0.06)]">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-[hsl(217,91%,60%)]" />
                  <h3 className="text-[14px] font-semibold text-white/80">Start Here</h3>
                </div>
                <p className="text-[13px] text-white/50 mb-3">New to the platform? Start with these quick wins to get your first bookings.</p>
                <div className="flex flex-wrap gap-2">
                  {["gbp-setup", "offer-design", "no-show-prevention"].map(id => {
                    const f = findLesson(id);
                    if (!f) return null;
                    return (
                      <button key={id} onClick={() => setView({ type: "lesson", id })}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] transition-colors text-[12px] font-medium text-white/70">
                        <f.lesson.icon className="w-3.5 h-3.5" /> {f.lesson.title} <ArrowRight className="w-3 h-3 text-white/30" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {LAB_CATEGORIES.map(cat => {
                const catLessons = allLessons.filter(l => l.categoryId === cat.id);
                const catDone = catLessons.filter(l => completed.includes(l.id)).length;
                return (
                  <button key={cat.id} onClick={() => setView({ type: "category", id: cat.id })}
                    className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.16] hover:-translate-y-0.5 transition-all text-left group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${cat.color}12`, border: `1px solid ${cat.color}22` }}>
                        <cat.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[15px] font-semibold text-white/85 leading-snug">{cat.title}</div>
                        <div className="text-[12px] text-white/40">{catLessons.length} lessons</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
                    </div>
                    <p className="text-[12px] text-white/40 leading-relaxed mb-3">{cat.description}</p>
                    {/* Mini progress */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${catLessons.length ? (catDone / catLessons.length) * 100 : 0}%`, background: cat.color }} />
                      </div>
                      <span className="text-[11px] text-white/30">{catDone}/{catLessons.length}</span>
                    </div>
                  </button>
                );
              })}

              {/* QR Code tool card */}
              <button onClick={() => setView({ type: "qr" })}
                className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.16] hover:-translate-y-0.5 transition-all text-left group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[hsla(280,60%,60%,0.12)] border border-[hsla(280,60%,60%,0.22)]">
                    <QrCode className="w-5 h-5 text-[hsl(280,60%,60%)]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[15px] font-semibold text-white/85">QR Code Generator</div>
                    <div className="text-[12px] text-white/40">Create a print-ready QR code for your business</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
                </div>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TheLabPage;
