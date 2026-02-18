import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CreditCard, XCircle, Trash2, AlertTriangle, Globe, Bell } from "lucide-react";
import CancelFlowModal from "./CancelFlowModal";
import { useAllFeatureFlags } from "@/hooks/useFeatureFlag";

const AccountSettings = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [openingPortal, setOpeningPortal] = useState(false);
  const [cancelFlowOpen, setCancelFlowOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [wantsCustomDomain, setWantsCustomDomain] = useState(false);
  const { flags, loading: flagsLoading } = useAllFeatureFlags();
  const [waitlistToggles, setWaitlistToggles] = useState<Record<string, boolean>>({});

  // Load custom domain preference
  useState(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("wants_custom_domain")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) setWantsCustomDomain(data.wants_custom_domain ?? false);
      });
  });

  const handleManageSubscription = async () => {
    setOpeningPortal(true);
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
      else throw new Error("No portal URL returned");
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Could not open billing portal.", variant: "destructive" });
    } finally {
      setOpeningPortal(false);
    }
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

  // Compute slug from profile (we can infer from user context)
  const comingSoonFlags = flags.filter(f => !f.enabled_globally);

  return (
    <div className="max-w-md">
      <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>

      {/* Current Email */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4 mb-6">
        <div>
          <Label className="text-white/50 text-xs">Current Email</Label>
          <p className="text-white text-sm mt-1">{user?.email}</p>
        </div>
      </div>

      {/* Manage Subscription */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-5 mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Subscription & Billing</h3>
        <p className="text-white/50 text-sm mb-4">Manage your plan, payment method, and invoices.</p>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleManageSubscription}
            disabled={openingPortal}
            className="h-11 gap-2"
            style={{ background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)" }}
          >
            {openingPortal ? <><Loader2 className="w-4 h-4 animate-spin" /> Opening…</> : <><CreditCard className="w-4 h-4" /> Manage Subscription</>}
          </Button>
          <Button
            onClick={() => setCancelFlowOpen(true)}
            variant="ghost"
            className="h-11 gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <XCircle className="w-4 h-4" /> Cancel
          </Button>
        </div>
      </div>

      <CancelFlowModal
        open={cancelFlowOpen}
        onClose={() => setCancelFlowOpen(false)}
        onProceedToStripe={handleManageSubscription}
      />

      {/* Custom Domain Placeholder */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-5 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <Globe className="w-5 h-5" style={{ color: "hsl(217,91%,60%)" }} />
          <h3 className="text-lg font-semibold text-white">Custom Domain</h3>
          <span className="dash-badge" style={{ background: "hsla(217,91%,60%,0.15)", color: "hsl(217,91%,60%)" }}>
            COMING SOON
          </span>
        </div>
        <p className="text-white/50 text-sm mb-4">Use your own domain instead of darkerdigital.com. Get notified when this launches.</p>
        <label className="flex items-center gap-3 cursor-pointer">
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
          <span className="text-sm text-white/70">Notify me when available</span>
        </label>
      </div>

      {/* Coming Soon Features */}
      {!flagsLoading && comingSoonFlags.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Upcoming Features</h3>
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
      <div className="rounded-xl border border-white/10 bg-white/5 p-5 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Change Email</h3>
        <form onSubmit={handleChangeEmail} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white/70 text-sm">New Email Address</Label>
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
      <div className="rounded-xl border border-white/10 bg-white/5 p-5 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white/70 text-sm">New Password</Label>
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

      {/* Delete Account */}
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <h3 className="text-lg font-semibold text-red-400">Delete My Account</h3>
        </div>
        <p className="text-white/50 text-sm mb-4">
          This will cancel your subscription, anonymize your data, and sign you out. Your data will be permanently purged after 30 days. This action cannot be undone.
        </p>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-white/50 text-xs">Type DELETE to confirm</Label>
            <Input
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="DELETE"
              className="h-11 bg-white/5 border-red-500/20 text-white placeholder:text-white/20 focus-visible:ring-red-500"
            />
          </div>
          <Button
            onClick={handleDeleteAccount}
            disabled={deleteConfirm !== "DELETE" || deleting}
            className="h-11 gap-2"
            style={{
              background: deleteConfirm === "DELETE" ? "hsl(0,84%,60%)" : "hsla(0,0%,100%,0.06)",
              color: deleteConfirm === "DELETE" ? "white" : "hsla(0,0%,100%,0.3)",
            }}
          >
            {deleting ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting…</> : <><Trash2 className="w-4 h-4" /> Delete My Account</>}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
