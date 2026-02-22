import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CreditCard, XCircle, Globe, Bell, ListChecks, Sun, Moon, Bug, Check, Shield } from "lucide-react";
import { useAdminView } from "@/contexts/AdminViewContext";
import { useNavigate } from "react-router-dom";
import CancelFlowModal from "./CancelFlowModal";
import { useAllFeatureFlags } from "@/hooks/useFeatureFlag";
import { getDomainSuggestions } from "@/lib/domainSuggestions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const AccountSettings = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { viewMode, setViewMode, isAdmin } = useAdminView();
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [openingPortal, setOpeningPortal] = useState(false);
  const [cancelFlowOpen, setCancelFlowOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [wantsCustomDomain, setWantsCustomDomain] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [profileSlug, setProfileSlug] = useState("");
  const [requestedDomain, setRequestedDomain] = useState<string | null>(null);
  const [customDomain, setCustomDomain] = useState<string | null>(null);
  const [selectedDomainSuggestion, setSelectedDomainSuggestion] = useState("");
  const [savingDomainRequest, setSavingDomainRequest] = useState(false);
  const [existingDomainOpen, setExistingDomainOpen] = useState(false);
  const [existingDomainInput, setExistingDomainInput] = useState("");
  const [savingExistingDomain, setSavingExistingDomain] = useState(false);
  const [showDataPrefs, setShowDataPrefs] = useState(false);
  const [showDeleteFlow, setShowDeleteFlow] = useState(false);
  const { flags, loading: flagsLoading } = useAllFeatureFlags();
  const [waitlistToggles, setWaitlistToggles] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("business_name, slug, wants_custom_domain")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setBusinessName((data as any).business_name || "");
          setProfileSlug((data as any).slug || "");
          setWantsCustomDomain((data as any).wants_custom_domain ?? false);
          setRequestedDomain((data as any).requested_domain || null);
          setCustomDomain((data as any).custom_domain || null);
        }
      });
  }, [user]);

  const handleManageSubscription = () => {
    navigate("/dashboard/billing");
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newEmail.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }
    setSavingEmail(true);
    const { error } = await supabase.auth.updateUser({ email: trimmed });
    setSavingEmail(false);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Confirmation sent!", description: "Check your new email to confirm the change." }); setNewEmail(""); }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast({ title: "Password too short", description: "Minimum 6 characters.", variant: "destructive" });
      return;
    }
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSavingPassword(false);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Password updated!" }); setNewPassword(""); }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") return;
    setDeleting(true);
    try {
      const { error } = await supabase.functions.invoke("delete-account");
      if (error) throw error;
      await signOut();
      window.location.href = "/";
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to delete account.", variant: "destructive" });
      setDeleting(false);
    }
  };

  const toggleCustomDomain = async () => {
    const next = !wantsCustomDomain;
    setWantsCustomDomain(next);
    if (user) {
      await supabase.from("profiles").update({ wants_custom_domain: next }).eq("user_id", user.id);
      toast({ title: next ? "You're on the waitlist!" : "Removed from waitlist", description: next ? "We'll notify you when custom domains launch." : "" });
    }
  };

  const domainSuggestions = getDomainSuggestions(businessName || profileSlug);

  /** Normalize domain: lowercase, trim, strip protocol and www. */
  const normalizeDomain = (raw: string): string => {
    let s = raw.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "");
    const slash = s.indexOf("/");
    if (slash !== -1) s = s.slice(0, slash);
    return s.trim().slice(0, 253);
  };

  const handleRequestDomain = async () => {
    const domain = selectedDomainSuggestion.trim() || requestedDomain;
    if (!domain || !user) {
      toast({ title: "Select a domain", description: "Choose one of the suggested domains below.", variant: "destructive" });
      return;
    }
    setSavingDomainRequest(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        requested_domain: domain,
        domain_requested_at: new Date().toISOString(),
        wants_custom_domain: true,
      })
      .eq("user_id", user.id);
    setSavingDomainRequest(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    setRequestedDomain(domain);
    setSelectedDomainSuggestion(domain);
    toast({
      title: "Request received",
      description: "Our team will purchase the domain and connect it to your site. We'll notify you when it's live.",
    });
  };

  const handleSaveExistingDomain = async () => {
    const domain = normalizeDomain(existingDomainInput);
    if (!domain || !/^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}$/i.test(domain)) {
      toast({ title: "Invalid domain", description: "Enter a domain like example.com", variant: "destructive" });
      return;
    }
    if (!user) return;
    setSavingExistingDomain(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        requested_domain: domain,
        domain_requested_at: new Date().toISOString(),
        wants_custom_domain: true,
      })
      .eq("user_id", user.id);
    setSavingExistingDomain(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    setRequestedDomain(domain);
    setExistingDomainOpen(false);
    setExistingDomainInput("");
    toast({ title: "Domain saved", description: "Follow the steps below to link it to your site." });
  };

  // Compute slug from profile (we can infer from user context)
  const comingSoonFlags = flags.filter(f => !f.enabled_globally);

  return (
    <div className="max-w-md">
      <h2 className="dash-page-title text-white mb-6">Account Settings</h2>

      <div className="flex flex-col gap-4">
      {/* Current Email */}
      <div className="dash-card space-y-4">
        <div>
          <Label className="text-sm font-medium text-white/75">Current Email</Label>
          <p className="text-white text-sm mt-1">{user?.email}</p>
        </div>
      </div>

      {/* Preferences */}
      <div className="dash-card space-y-3">
        <h3 className="dash-card-title text-white">Preferences</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {(localStorage.getItem("dashboard-theme") || "light") === "dark"
              ? <Moon className="w-4 h-4 text-white/50" strokeWidth={1.5} />
              : <Sun className="w-4 h-4 text-white/50" strokeWidth={1.5} />}
            <span className="text-sm text-white/70">Theme</span>
          </div>
          <button
            onClick={() => {
              const current = localStorage.getItem("dashboard-theme") || "light";
              const next = current === "dark" ? "light" : "dark";
              localStorage.setItem("dashboard-theme", next);
              window.location.reload();
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{ background: "hsla(217,91%,60%,0.1)", color: "hsl(217,91%,60%)", border: "1px solid hsla(217,91%,60%,0.2)" }}
          >
            {(localStorage.getItem("dashboard-theme") || "light") === "dark" ? "Switch to Light" : "Switch to Dark"}
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bug className="w-4 h-4 text-white/50" strokeWidth={1.5} />
            <span className="text-sm text-white/70">Found a problem?</span>
          </div>
          <a
            href="mailto:support@darkerdigital.com?subject=Bug Report"
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{ background: "hsla(45,93%,47%,0.1)", color: "hsl(45,93%,47%)", border: "1px solid hsla(45,93%,47%,0.2)" }}
          >
            Report a Bug
          </a>
        </div>
      </div>

      {/* Admin View Toggle — only visible to admins */}
      {isAdmin && (
        <div className="dash-card space-y-3">
          <div className="flex items-center gap-2.5 mb-1">
            <Shield className="w-4 h-4" style={{ color: "hsl(45,93%,47%)" }} strokeWidth={1.5} />
            <h3 className="dash-card-title text-white">Admin View Mode</h3>
          </div>
          <p className="text-white/50 text-xs">Simulate what paid or unpaid users see across the dashboard.</p>
          <div className="flex gap-2">
            {([
              { value: "default" as const, label: "Default" },
              { value: "paid" as const, label: "Paid User" },
              { value: "unpaid" as const, label: "Free User" },
            ]).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setViewMode(opt.value)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: viewMode === opt.value ? "hsla(45,93%,47%,0.15)" : "hsla(0,0%,100%,0.06)",
                  color: viewMode === opt.value ? "hsl(45,93%,47%)" : "hsla(0,0%,100%,0.5)",
                  border: `1px solid ${viewMode === opt.value ? "hsla(45,93%,47%,0.3)" : "hsla(0,0%,100%,0.08)"}`,
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {viewMode !== "default" && (
            <p className="text-xs mt-1" style={{ color: "hsl(45,93%,47%)" }}>
              ⚠ Viewing as: {viewMode === "paid" ? "Paid user" : "Free user"}
            </p>
          )}
        </div>
      )}

      <div className="dash-card">
        <h3 className="dash-card-title text-white mb-2">Subscription & Billing</h3>
        <p className="text-white/50 text-sm mb-4">Manage your payment info and invoices.</p>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleManageSubscription}
            className="h-11 gap-2"
            style={{ background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)" }}
          >
            <CreditCard className="w-4 h-4" /> Manage Subscription
          </Button>
        </div>
      </div>

      <CancelFlowModal
        open={cancelFlowOpen}
        onClose={() => setCancelFlowOpen(false)}
        onProceedToStripe={handleManageSubscription}
      />

      {/* Website Domain */}
      <div className="dash-card">
        <div className="flex items-center gap-3 mb-2">
          <Globe className="w-5 h-5" style={{ color: "hsl(217,91%,60%)" }} />
          <h3 className="dash-card-title text-white">Website Domain</h3>
        </div>
        <p className="text-white/50 text-sm mb-4">Use your own domain. Pick one of the suggested domains for your business and we&apos;ll connect it to your site.</p>

        {customDomain ? (
          <div className="rounded-lg p-3 flex items-center gap-2" style={{ background: "hsla(142,71%,45%,0.1)", border: "1px solid hsla(142,71%,45%,0.25)" }}>
            <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
            <span className="text-sm text-white/90 font-medium">Live: {customDomain}</span>
          </div>
        ) : requestedDomain ? (
          <div className="rounded-lg p-3 mb-4" style={{ background: "hsla(217,91%,60%,0.08)", border: "1px solid hsla(217,91%,60%,0.2)" }}>
            <p className="text-sm text-white/80 font-medium mb-1">Requested: {requestedDomain}</p>
            <p className="text-xs text-white/50">We&apos;ve received your request. Point your domain&apos;s DNS to us (or we&apos;ll connect it), and your site and booking will go live at this domain.</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-white/50 mb-3">Top 3 suggested domains for your business:</p>
            <div className="space-y-2 mb-4">
              {domainSuggestions.map((domain) => (
                <div
                  key={domain}
                  className="flex items-center gap-3 rounded-lg p-2.5 cursor-pointer transition-colors"
                  style={{
                    background: selectedDomainSuggestion === domain ? "hsla(217,91%,60%,0.12)" : "hsla(0,0%,100%,0.04)",
                    border: `1px solid ${selectedDomainSuggestion === domain ? "hsla(217,91%,60%,0.35)" : "hsla(0,0%,100%,0.08)"}`,
                  }}
                  onClick={() => setSelectedDomainSuggestion(domain)}
                >
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ border: `2px solid ${selectedDomainSuggestion === domain ? "hsl(217,91%,60%)" : "hsla(0,0%,100%,0.3)"}` }}
                  >
                    {selectedDomainSuggestion === domain && <div className="w-2 h-2 rounded-full" style={{ background: "hsl(217,91%,60%)" }} />}
                  </div>
                  <span className="text-sm text-white/90 font-medium flex-1">{domain}</span>
                </div>
              ))}
            </div>
            <Button
              onClick={handleRequestDomain}
              disabled={savingDomainRequest || !selectedDomainSuggestion}
              className="w-full h-11 gap-2"
              style={{ background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)" }}
            >
              {savingDomainRequest ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
              Request domain
            </Button>
            <p className="text-center mt-3">
              <button
                type="button"
                onClick={() => setExistingDomainOpen(true)}
                className="text-sm text-white/80 underline underline-offset-2 hover:text-white transition-colors"
              >
                Already Have A Domain
              </button>
            </p>
          </>
        )}

        {!customDomain && !requestedDomain && (
          <label className="flex items-center gap-3 cursor-pointer mt-4 pt-4 border-t border-white/10">
            <button
              onClick={toggleCustomDomain}
              className="relative w-10 h-5 rounded-full transition-colors"
              style={{ background: wantsCustomDomain ? "hsl(217,91%,60%)" : "hsla(0,0%,100%,0.15)" }}
            >
              <span
                className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                style={{ transform: wantsCustomDomain ? "translateX(20px)" : "translateX(0)" }}
              />
            </button>
            <span className="text-sm text-white/70">Notify me when custom domains launch (no request)</span>
          </label>
        )}
      </div>

      {/* Already Have A Domain — connect existing domain */}
      <Dialog open={existingDomainOpen} onOpenChange={setExistingDomainOpen}>
        <DialogContent className="bg-[hsl(215,50%,12%)] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Connect your domain</DialogTitle>
            <DialogDescription className="text-white/60">
              Enter the domain you already own. We&apos;ll give you simple steps to point it to your website and booking pages.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-white/80">Your domain</Label>
              <Input
                value={existingDomainInput}
                onChange={(e) => setExistingDomainInput(e.target.value)}
                placeholder="example.com"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                onKeyDown={(e) => e.key === "Enter" && handleSaveExistingDomain()}
              />
              <p className="text-xs text-white/50">Enter without www or https — we&apos;ll use it for your site and booking.</p>
            </div>
            <div className="rounded-lg bg-white/5 border border-white/10 p-4 space-y-2">
              <p className="text-sm font-medium text-white/90">Setup steps (after you save):</p>
              <ol className="text-sm text-white/70 list-decimal list-inside space-y-1">
                <li>In your domain registrar, add a CNAME record pointing to us (we&apos;ll show the exact target).</li>
                <li>Once DNS updates, we verify and your site and booking go live on your domain.</li>
              </ol>
            </div>
          </div>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-2 [&>button]:w-full sm:[&>button]:w-auto [&>button]:min-h-[44px]">
            <Button variant="outline" className="border-white/20 text-white" onClick={() => setExistingDomainOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveExistingDomain}
              disabled={savingExistingDomain || !existingDomainInput.trim()}
              style={{ background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)" }}
            >
              {savingExistingDomain ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Save & get setup steps
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Coming Soon Features */}
      {!flagsLoading && comingSoonFlags.length > 0 && (
        <div className="dash-card">
          <h3 className="dash-card-title text-white mb-4">Upcoming Features</h3>
          <div className="space-y-3">
            {comingSoonFlags.map(flag => {
              const isOn = waitlistToggles[flag.flag_name] ?? false;
              return (
                <div key={flag.flag_name} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-white/80 font-medium">{flag.description}</p>
                    <span className="dash-badge" style={{ background: "hsla(45,93%,47%,0.15)", color: "hsl(45,93%,47%)" }}>
                      COMING SOON
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setWaitlistToggles(prev => ({ ...prev, [flag.flag_name]: !isOn }));
                      toast({ title: !isOn ? "Added to waitlist!" : "Removed from waitlist" });
                    }}
                    className="shrink-0 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors"
                    style={{
                      background: isOn ? "hsla(217,91%,60%,0.15)" : "hsla(0,0%,100%,0.06)",
                      color: isOn ? "hsl(217,91%,60%)" : "hsla(0,0%,100%,0.5)",
                    }}
                  >
                    <Bell className="w-3 h-3" />
                    {isOn ? "Notified" : "Notify me"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Change Email */}
      <div className="dash-card">
        <h3 className="dash-card-title text-white mb-4">Change Email</h3>
        <form onSubmit={handleChangeEmail} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-white/75">New Email Address</Label>
            <Input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="new@email.com"
              required
              className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-accent"
            />
          </div>
          <Button type="submit" disabled={savingEmail} className="h-11" style={{ background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)" }}>
            {savingEmail ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Updating…</> : "Update Email"}
          </Button>
        </form>
      </div>

      {/* Change Password */}
      <div className="dash-card">
        <h3 className="dash-card-title text-white mb-4">Change Password</h3>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-white/75">New Password</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              required
              className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-accent"
            />
          </div>
          <Button type="submit" disabled={savingPassword} className="h-11" style={{ background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)" }}>
            {savingPassword ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Updating…</> : "Update Password"}
          </Button>
        </form>
      </div>

      {/* Setup Guide */}
      <div className="dash-card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="dash-card-title text-white">Setup Guide</h3>
            <p className="text-white/50 text-sm mt-1">Re-open the onboarding checklist to finish setting up your shop.</p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("dashboard-onboarding-dismissed");
              navigate("/dashboard");
              window.location.reload();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:brightness-110"
            style={{
              background: "hsla(217,91%,60%,0.1)",
              color: "hsl(217,91%,60%)",
              border: "1px solid hsla(217,91%,60%,0.2)",
            }}
          >
            <ListChecks className="w-4 h-4" />
            Restart
          </button>
        </div>
      </div>

      {/* Layer 1 — Faint breadcrumb link */}
      <button
        onClick={() => setShowDataPrefs(prev => !prev)}
        className="text-white/25 text-xs hover:text-white/40 transition-colors self-start mt-2"
      >
        account &amp; data preferences →
      </button>

      {/* Layer 2 — Data Management card */}
      {showDataPrefs && (
        <div className="dash-card space-y-3">
          <h3 className="dash-card-title text-white">Data Management</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/50">Account created</span>
            <span className="text-sm text-white/40">
              {new Date(user?.created_at ?? "").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/50">Account status</span>
            <span className="text-sm text-white/40">Active</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/50">Account closure</span>
            <button
              onClick={() => setShowDeleteFlow(prev => !prev)}
              className="text-white/40 text-xs hover:text-white/60 transition-colors"
            >
              Manage →
            </button>
          </div>

          {/* Layer 3 — Inline delete flow */}
          {showDeleteFlow && (
            <div className="space-y-3 pt-3 border-t border-white/5">
              <p className="text-white/50 text-sm">
                This will cancel your subscription, anonymize your data, and sign you out. Your data will be permanently purged after 30 days. This action cannot be undone.
              </p>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-white/75">Type DELETE to confirm</Label>
                <Input
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  placeholder="DELETE"
                  className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-accent"
                />
              </div>
              <Button
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== "DELETE" || deleting}
                variant="ghost"
                className="h-11 gap-2"
                style={{
                  color: deleteConfirm === "DELETE" ? "hsl(0,84%,60%)" : "hsla(0,0%,100%,0.3)",
                }}
              >
                {deleting ? <><Loader2 className="w-4 h-4 animate-spin" /> Closing…</> : "Close Account"}
              </Button>
            </div>
          )}
        </div>
      )}

      </div> {/* end flex flex-col gap-4 */}
    </div>
  );
};

export default AccountSettings;
