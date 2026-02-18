import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Copy, Check, ChevronLeft, Target, BarChart3, Users, Plus,
  TrendingUp, CheckCircle2, X,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OfferProgress {
  firstTimerMagnet: boolean;
  subscriptionTiers: boolean;
  referralProgram: boolean;
  addOnUpsells: boolean;
}

interface Strategy {
  id: keyof OfferProgress;
  emoji: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  preview: string;
  stat: string;
}

// ─── Strategy definitions ─────────────────────────────────────────────────────

const STRATEGIES: Strategy[] = [
  {
    id: "firstTimerMagnet",
    emoji: "🎯",
    icon: Target,
    title: "First-Timer Magnet",
    subtitle: "50% Off First Detail + Membership",
    preview: "Lock in 65–80% of new customers as monthly subscribers",
    stat: "65–80% conversion rate",
  },
  {
    id: "subscriptionTiers",
    emoji: "📊",
    icon: BarChart3,
    title: "Subscription Tiers",
    subtitle: "Tiered Monthly Plans",
    preview: "Increase average order value by 40% with Bronze, Silver, Gold tiers",
    stat: "+40% avg order value",
  },
  {
    id: "referralProgram",
    emoji: "👥",
    icon: Users,
    title: "Referral Program",
    subtitle: "Give $25, Get $25",
    preview: "Turn every customer into 2.3 new customers within 90 days",
    stat: "2.3x customer multiplier",
  },
  {
    id: "addOnUpsells",
    emoji: "➕",
    icon: Plus,
    title: "Add-On Upsells",
    subtitle: "Add-On Services",
    preview: "Boost revenue 30% per job with ceramic coating, interior deep clean, more",
    stat: "+30% revenue per job",
  },
];

// ─── Copy button ──────────────────────────────────────────────────────────────

const CopyButton = ({ text, label = "Copy Template" }: { text: string; label?: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className={cn(
        "flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg transition-all duration-150",
        copied
          ? "bg-green-500/15 text-green-500"
          : "bg-[hsla(217,91%,60%,0.12)] text-[hsl(217,91%,65%)] hover:bg-[hsla(217,91%,60%,0.2)]"
      )}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied!" : label}
    </button>
  );
};

// ─── Template block ───────────────────────────────────────────────────────────

const TemplateBlock = ({ text }: { text: string }) => (
  <div className="relative">
    <pre className="text-[12px] leading-relaxed whitespace-pre-wrap font-mono rounded-xl p-4 border dash-input-base text-white/70 overflow-auto max-h-64">
      {text.trim()}
    </pre>
    <div className="mt-2 flex justify-end">
      <CopyButton text={text.trim()} />
    </div>
  </div>
);

// ─── Section header ───────────────────────────────────────────────────────────

const SectionHead = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-[13px] font-semibold uppercase tracking-widest text-white/30 mb-3 mt-6">
    {children}
  </h3>
);

// ─── Calculator: First-Timer ──────────────────────────────────────────────────

const FirstTimerCalc = () => {
  const [price, setPrice] = useState("");
  const p = parseFloat(price) || 0;
  const half = (p / 2).toFixed(0);
  const monthly = (p * 1.1).toFixed(0);
  const annual = (parseFloat(monthly) * 12).toFixed(0);
  return (
    <div className="space-y-4">
      <div>
        <label className="dash-label">Your standard detail price ($)</label>
        <Input
          type="number"
          inputMode="numeric"
          placeholder="150"
          value={price}
          onChange={e => setPrice(e.target.value)}
          className="dash-input mt-1 w-40"
        />
      </div>
      {p > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "First-timer price", value: `$${half}` },
            { label: "Monthly membership", value: `$${monthly}/mo` },
            { label: "Annual value", value: `$${annual}/yr` },
          ].map(({ label, value }) => (
            <div key={label} className="dash-card rounded-xl p-3 text-center">
              <div className="text-[11px] text-white/40 mb-1">{label}</div>
              <div className="text-[16px] font-bold text-[hsl(217,91%,65%)]">{value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Calculator: Subscription Tiers ──────────────────────────────────────────

const TiersCalc = () => {
  const [price, setPrice] = useState("");
  const p = parseFloat(price) || 0;
  const bronze = Math.round(p * 1.0);
  const silver = Math.round(p * 1.45);
  const gold = Math.round(p * 2.5);
  return (
    <div className="space-y-4">
      <div>
        <label className="dash-label">Your standard detail price ($)</label>
        <Input
          type="number"
          inputMode="numeric"
          placeholder="150"
          value={price}
          onChange={e => setPrice(e.target.value)}
          className="dash-input mt-1 w-40"
        />
      </div>
      {p > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "🥉 Bronze", value: `$${bronze}/mo`, sub: "1 detail/month" },
            { label: "🥈 Silver", value: `$${silver}/mo`, sub: "1 detail + 2 washes" },
            { label: "🥇 Gold", value: `$${gold}/mo`, sub: "2 details + unlimited washes" },
          ].map(({ label, value, sub }) => (
            <div key={label} className="dash-card rounded-xl p-3 text-center">
              <div className="text-[12px] font-semibold text-white/70 mb-1">{label}</div>
              <div className="text-[16px] font-bold text-[hsl(217,91%,65%)]">{value}</div>
              <div className="text-[10px] text-white/35 mt-1">{sub}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Strategy detail content ──────────────────────────────────────────────────

const DETAIL_CONTENT: Record<keyof OfferProgress, React.FC> = {
  firstTimerMagnet: () => (
    <Tabs defaultValue="booking">
      <SectionHead>Overview</SectionHead>
      <div className="space-y-2 text-[14px] text-white/65 leading-relaxed">
        <p><span className="font-semibold text-white/80">Why it works:</span> Removes the price barrier for new customers while locking them into recurring revenue immediately.</p>
        <p><span className="font-semibold text-white/80">Expected results:</span> 65–80% of first-time customers convert to monthly members.</p>
      </div>

      <SectionHead>How to Structure</SectionHead>
      <ul className="text-[13px] text-white/65 space-y-1.5 list-none">
        {[
          "Offer the first detail at 50% off",
          "Automatically enroll them in a monthly subscription",
          "Example: $75 first detail → $150/month (1 detail per month)",
          "Customer can cancel anytime — no contracts",
        ].map(item => (
          <li key={item} className="flex items-start gap-2">
            <span className="text-[hsl(217,91%,60%)] mt-0.5">→</span>{item}
          </li>
        ))}
      </ul>

      <SectionHead>Ready-to-Use Templates</SectionHead>
      <TabsList className="mb-4 flex-wrap h-auto gap-1">
        {["booking", "email", "sms", "calculator"].map(t => (
          <TabsTrigger key={t} value={t} className="capitalize text-[12px]">{t === "calculator" ? "Calculator" : t.charAt(0).toUpperCase() + t.slice(1)}</TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="booking">
        <TemplateBlock text={`🎉 First-Time Customer Special

Get 50% off your first detail + lock in our monthly membership rate.

First Detail: Just $[HALF_PRICE] (Reg. $[FULL_PRICE])
Then: $[MONTHLY_PRICE]/month for 1 premium detail every month

Cancel anytime. No contracts.`} />
      </TabsContent>

      <TabsContent value="email">
        <TemplateBlock text={`Subject: Welcome to [BUSINESS_NAME] — Your First Detail is 50% Off

Hey [CUSTOMER_NAME],

Thanks for choosing [BUSINESS_NAME]!

Your first detail is 50% off when you join our monthly membership:

• First visit: $[HALF_PRICE] (normally $[FULL_PRICE])
• Then $[MONTHLY_PRICE]/month for 1 detail every month
• Cancel anytime

Book your first appointment: [BOOKING_LINK]

— [YOUR_NAME]`} />
      </TabsContent>

      <TabsContent value="sms">
        <TemplateBlock text={`[BUSINESS_NAME]: First detail 50% off + monthly membership! $[HALF_PRICE] first visit, then $[MONTHLY_PRICE]/mo. Book: [LINK]`} />
      </TabsContent>

      <TabsContent value="calculator">
        <FirstTimerCalc />
      </TabsContent>
    </Tabs>
  ),

  subscriptionTiers: () => (
    <Tabs defaultValue="booking">
      <SectionHead>Overview</SectionHead>
      <div className="space-y-2 text-[14px] text-white/65 leading-relaxed">
        <p><span className="font-semibold text-white/80">Why it works:</span> Customers self-select their value level, increasing average order value by 40%.</p>
        <p><span className="font-semibold text-white/80">Expected results:</span> 30–40% choose mid-tier, 15–20% choose top-tier.</p>
      </div>

      <SectionHead>How to Structure</SectionHead>
      <ul className="text-[13px] text-white/65 space-y-1.5">
        {[
          "🥉 Bronze — 1 detail/month at $150",
          "🥈 Silver — 1 detail + 2 express washes at $220",
          "🥇 Gold — 2 details + unlimited express washes at $380",
        ].map(item => (
          <li key={item} className="flex items-start gap-2">
            <span className="text-[hsl(217,91%,60%)] mt-0.5">→</span>{item}
          </li>
        ))}
      </ul>

      <SectionHead>Ready-to-Use Templates</SectionHead>
      <TabsList className="mb-4 flex-wrap h-auto gap-1">
        {["booking", "email", "sms", "calculator"].map(t => (
          <TabsTrigger key={t} value={t} className="capitalize text-[12px]">{t.charAt(0).toUpperCase() + t.slice(1)}</TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="booking">
        <TemplateBlock text={`Choose Your Monthly Plan

🥉 Bronze — $150/month
  • 1 full detail per month

🥈 Silver — $220/month
  • 1 full detail per month
  • 2 express washes

🥇 Gold — $380/month
  • 2 full details per month
  • Unlimited express washes

All plans include priority booking. Cancel anytime.`} />
      </TabsContent>

      <TabsContent value="email">
        <TemplateBlock text={`Subject: Choose Your [BUSINESS_NAME] Membership Plan

Hi [CUSTOMER_NAME],

Pick the plan that fits your car care needs:

Bronze ($150/mo): 1 full detail monthly
Silver ($220/mo): 1 detail + 2 express washes
Gold ($380/mo): 2 details + unlimited washes

Lock in your rate today: [BOOKING_LINK]

Questions? Just reply to this email.

— [YOUR_NAME]`} />
      </TabsContent>

      <TabsContent value="sms">
        <TemplateBlock text={`[BUSINESS_NAME]: Choose your plan — Bronze $150, Silver $220, Gold $380/mo. All include priority booking. Sign up: [LINK]`} />
      </TabsContent>

      <TabsContent value="calculator">
        <TiersCalc />
      </TabsContent>
    </Tabs>
  ),

  referralProgram: () => (
    <Tabs defaultValue="existing">
      <SectionHead>Overview</SectionHead>
      <div className="space-y-2 text-[14px] text-white/65 leading-relaxed">
        <p><span className="font-semibold text-white/80">Why it works:</span> Turns happy customers into your best salespeople with built-in incentives for both parties.</p>
        <p><span className="font-semibold text-white/80">Expected results:</span> Each customer brings an average of 2.3 new customers within 90 days.</p>
      </div>

      <SectionHead>How to Structure</SectionHead>
      <ul className="text-[13px] text-white/65 space-y-1.5">
        {[
          "Existing customer refers a friend",
          "Friend gets $25 off their first service",
          "Referring customer gets $25 credit",
          "Generate unique referral codes/links per customer",
        ].map(item => (
          <li key={item} className="flex items-start gap-2">
            <span className="text-[hsl(217,91%,60%)] mt-0.5">→</span>{item}
          </li>
        ))}
      </ul>

      <SectionHead>Ready-to-Use Templates</SectionHead>
      <TabsList className="mb-4 flex-wrap h-auto gap-1">
        {["existing", "existing-sms", "new-customer", "instructions"].map(t => (
          <TabsTrigger key={t} value={t} className="text-[12px]">
            {t === "existing" ? "Email (Existing)" : t === "existing-sms" ? "SMS (Existing)" : t === "new-customer" ? "Email (New)" : "How To Track"}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="existing">
        <TemplateBlock text={`Subject: Give $25, Get $25 — Share [BUSINESS_NAME]

Hey [CUSTOMER_NAME],

Love your clean car? Your friends will too.

Refer a friend and you both get $25:

• They get $25 off their first detail
• You get $25 credit toward your next service

Your personal referral link: [UNIQUE_LINK]

No limit. The more you share, the more you save!

— [YOUR_NAME]`} />
      </TabsContent>

      <TabsContent value="existing-sms">
        <TemplateBlock text={`[BUSINESS_NAME]: Give $25, get $25! Share your link with friends: [UNIQUE_LINK]. They save, you save. Win-win!`} />
      </TabsContent>

      <TabsContent value="new-customer">
        <TemplateBlock text={`Subject: [REFERRER_NAME] sent you $25 off at [BUSINESS_NAME]

Hi [NEW_CUSTOMER_NAME],

Your friend [REFERRER_NAME] thinks you'd love [BUSINESS_NAME].

They're giving you $25 off your first detail!

Book now: [BOOKING_LINK]
Use code: [REFERRAL_CODE]

— [YOUR_NAME]`} />
      </TabsContent>

      <TabsContent value="instructions">
        <div className="text-[13px] text-white/65 space-y-2">
          {[
            "Generate a unique code/link for each customer",
            "Apply $25 discount when new customer books with code",
            "Credit referring customer $25 toward next service",
            "Send confirmation to both the referrer and the new customer",
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[hsla(217,91%,60%,0.15)] text-[hsl(217,91%,65%)] text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  ),

  addOnUpsells: () => (
    <Tabs defaultValue="confirmation">
      <SectionHead>Overview</SectionHead>
      <div className="space-y-2 text-[14px] text-white/65 leading-relaxed">
        <p><span className="font-semibold text-white/80">Why it works:</span> Increases revenue per job by 30% without booking more appointments.</p>
        <p><span className="font-semibold text-white/80">Expected results:</span> 40–50% of customers add at least one upsell when offered at the right time.</p>
      </div>

      <SectionHead>How to Structure</SectionHead>
      <ul className="text-[13px] text-white/65 space-y-1.5">
        {[
          "Offer 2–3 add-ons in the booking confirmation",
          "Offer again in the day-before reminder",
          "Common add-ons: Ceramic coating ($200), Interior deep clean ($80), Headlight restoration ($60)",
        ].map(item => (
          <li key={item} className="flex items-start gap-2">
            <span className="text-[hsl(217,91%,60%)] mt-0.5">→</span>{item}
          </li>
        ))}
      </ul>

      <SectionHead>Ready-to-Use Templates</SectionHead>
      <TabsList className="mb-4 flex-wrap h-auto gap-1">
        {["confirmation", "reminder", "followup", "pricing"].map(t => (
          <TabsTrigger key={t} value={t} className="text-[12px]">
            {t === "confirmation" ? "Booking Confirm" : t === "reminder" ? "Day-Before SMS" : t === "followup" ? "Follow-Up Email" : "Pricing Guide"}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="confirmation">
        <TemplateBlock text={`💡 Popular Add-Ons (Book now and save)

Enhance your detail with:

• Ceramic Coating — $200 (6-month protection)
• Interior Deep Clean — $80 (stain removal, deep vacuum)
• Headlight Restoration — $60 (crystal clear visibility)
• Wheel & Tire Treatment — $40 (deep shine)

Add to your appointment: [LINK]

Or reply to this email with what you'd like to add.`} />
      </TabsContent>

      <TabsContent value="reminder">
        <TemplateBlock text={`[BUSINESS_NAME]: Your detail is tomorrow at [TIME]. Add ceramic coating for $200? Protects your car for 6 months. Reply YES to add it.`} />
      </TabsContent>

      <TabsContent value="followup">
        <TemplateBlock text={`Subject: Keep Your Car Looking Fresh — Add Protection

Hey [CUSTOMER_NAME],

Your car looks amazing! Want to keep it that way?

Add ceramic coating to your next detail for $200:

• 6 months of protection
• Easier to clean
• Enhanced shine

Book your next appointment + coating: [LINK]

— [YOUR_NAME]`} />
      </TabsContent>

      <TabsContent value="pricing">
        <div className="space-y-2">
          {[
            { service: "Ceramic coating", range: "$200–$300" },
            { service: "Interior deep clean", range: "$80–$120" },
            { service: "Headlight restoration", range: "$60–$80" },
            { service: "Engine bay detail", range: "$100–$150" },
            { service: "Pet hair removal", range: "$50–$75" },
          ].map(({ service, range }) => (
            <div key={service} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <span className="text-[13px] text-white/70">{service}</span>
              <span className="text-[13px] font-semibold text-[hsl(217,91%,65%)]">{range}</span>
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  ),
};

// ─── Strategy card ─────────────────────────────────────────────────────────────

const StrategyCard = ({
  strategy,
  implemented,
  onClick,
}: {
  strategy: Strategy;
  implemented: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "dash-card rounded-2xl p-5 text-left w-full group transition-all duration-200",
      "hover:border-[hsl(217,91%,60%)]/40 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]",
      "relative overflow-hidden"
    )}
  >
    {implemented && (
      <div className="absolute top-3 right-3 flex items-center gap-1 bg-green-500/15 text-green-400 text-[11px] font-semibold px-2 py-1 rounded-full">
        <CheckCircle2 className="w-3 h-3" />
        Implemented
      </div>
    )}
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl bg-[hsla(217,91%,60%,0.1)] flex items-center justify-center flex-shrink-0 text-xl group-hover:bg-[hsla(217,91%,60%,0.18)] transition-colors">
        {strategy.emoji}
      </div>
      <div className="min-w-0 flex-1 pr-16">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-0.5">{strategy.title}</div>
        <div className="text-[15px] font-semibold text-white/85 leading-snug mb-1.5">{strategy.subtitle}</div>
        <div className="text-[12px] text-white/50 leading-relaxed mb-3">{strategy.preview}</div>
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-3 h-3 text-[hsl(217,91%,60%)]" />
          <span className="text-[11px] font-semibold text-[hsl(217,91%,65%)]">{strategy.stat}</span>
        </div>
      </div>
    </div>
    <div className="mt-4 flex justify-end">
      <span className="text-[12px] font-semibold px-3 py-1.5 rounded-lg bg-[hsla(217,91%,60%,0.12)] text-[hsl(217,91%,65%)] group-hover:bg-[hsla(217,91%,60%,0.2)] transition-colors">
        View Strategy →
      </span>
    </div>
  </button>
);

// ─── Detail modal / panel ──────────────────────────────────────────────────────

const DetailPanel = ({
  strategy,
  implemented,
  onToggleImplemented,
  onClose,
}: {
  strategy: Strategy;
  implemented: boolean;
  onToggleImplemented: (id: keyof OfferProgress) => void;
  onClose: () => void;
}) => {
  const Content = DETAIL_CONTENT[strategy.id];
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div
        className={cn(
          "relative w-full sm:max-w-2xl max-h-[90vh] flex flex-col rounded-t-2xl sm:rounded-2xl",
          "bg-[hsl(217,33%,12%)] border border-[hsla(215,25%,20%,1)] shadow-2xl overflow-hidden"
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/[0.07] flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-[hsla(217,91%,60%,0.12)] flex items-center justify-center text-lg flex-shrink-0">
            {strategy.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-white/30">{strategy.title}</div>
            <div className="text-[16px] font-semibold text-white/90 leading-tight">{strategy.subtitle}</div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4 text-white/50" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-none">
          <Content />

          {/* Implementation toggle */}
          <div className="mt-8 pt-5 border-t border-white/[0.07]">
            <div
              className="flex items-center gap-3 cursor-pointer group w-fit"
              onClick={() => onToggleImplemented(strategy.id)}
            >
              <Checkbox
                checked={implemented}
                onCheckedChange={() => onToggleImplemented(strategy.id)}
                className="border-white/20 data-[state=checked]:bg-[hsl(217,91%,60%)] data-[state=checked]:border-[hsl(217,91%,60%)]"
              />
              <span className="text-[13px] font-medium text-white/60 group-hover:text-white/80 transition-colors select-none">
                ✓ Mark this strategy as implemented
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main component ────────────────────────────────────────────────────────────

const OfferLabManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [progress, setProgress] = useState<OfferProgress>({
    firstTimerMagnet: false,
    subscriptionTiers: false,
    referralProgram: false,
    addOnUpsells: false,
  });
  const [loading, setLoading] = useState(true);
  const [activeStrategy, setActiveStrategy] = useState<Strategy | null>(null);

  // ── Load progress ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("offer_lab_progress")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.offer_lab_progress && typeof data.offer_lab_progress === "object") {
          setProgress(prev => ({ ...prev, ...(data.offer_lab_progress as Partial<OfferProgress>) }));
        }
        setLoading(false);
      });
  }, [user]);

  // ── Save progress ──────────────────────────────────────────────────────────
  const saveProgress = useCallback(
    async (updated: OfferProgress) => {
      if (!user) return;
      const { error } = await supabase
        .from("profiles")
        .update({ offer_lab_progress: updated as unknown as import("@/integrations/supabase/types").Json })
        .eq("user_id", user.id);
      if (error) {
        toast({ title: "Couldn't save progress", description: error.message, variant: "destructive" });
      }
    },
    [user, toast]
  );

  const handleToggleImplemented = (id: keyof OfferProgress) => {
    const updated = { ...progress, [id]: !progress[id] };
    setProgress(updated);
    saveProgress(updated);
    toast({
      title: updated[id] ? "Strategy marked as implemented 🎉" : "Strategy unmarked",
      description: updated[id] ? "Keep it up — consistent execution is the key." : "You can mark it again anytime.",
    });
  };

  const implementedCount = Object.values(progress).filter(Boolean).length;

  if (loading) {
    return (
      <div className="flex-1 p-6 lg:p-8 space-y-6 animate-pulse">
        <div className="h-8 w-48 rounded-xl bg-white/5" />
        <div className="h-4 w-72 rounded-lg bg-white/5" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {[0, 1, 2, 3].map(i => <div key={i} className="h-48 rounded-2xl bg-white/5" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      {/* ── Page header ───────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-[22px] font-bold tracking-tight text-white/90">Offer Lab</h1>
            <p className="dash-subtitle mt-0.5">
              Proven strategies to 3x your bookings and revenue
            </p>
          </div>
          {/* Progress widget */}
          <div className="flex items-center gap-3 dash-card rounded-xl px-4 py-2.5 flex-shrink-0">
            <div className="flex gap-1">
              {STRATEGIES.map(s => (
                <div
                  key={s.id}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-colors",
                    progress[s.id] ? "bg-green-400" : "bg-white/10"
                  )}
                />
              ))}
            </div>
            <span className="text-[13px] font-semibold text-white/60">
              {implementedCount} of {STRATEGIES.length} active
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1.5 w-full max-w-xs rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-[hsl(217,91%,60%)] transition-all duration-500"
            style={{ width: `${(implementedCount / STRATEGIES.length) * 100}%` }}
          />
        </div>
        {implementedCount === STRATEGIES.length && (
          <p className="text-[12px] text-green-400 mt-2 font-semibold">
            🎉 All strategies implemented! You're running a full growth engine.
          </p>
        )}
      </div>

      {/* ── Strategy grid ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {STRATEGIES.map(strategy => (
          <StrategyCard
            key={strategy.id}
            strategy={strategy}
            implemented={progress[strategy.id]}
            onClick={() => setActiveStrategy(strategy)}
          />
        ))}
      </div>

      {/* ── Detail panel ──────────────────────────────────────────────────── */}
      {activeStrategy && (
        <DetailPanel
          strategy={activeStrategy}
          implemented={progress[activeStrategy.id]}
          onToggleImplemented={handleToggleImplemented}
          onClose={() => setActiveStrategy(null)}
        />
      )}
    </div>
  );
};

export default OfferLabManager;
