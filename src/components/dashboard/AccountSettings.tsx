import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CreditCard, XCircle } from "lucide-react";
import CancelFlowModal from "./CancelFlowModal";

const AccountSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [openingPortal, setOpeningPortal] = useState(false);
  const [cancelFlowOpen, setCancelFlowOpen] = useState(false);

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
      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
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
    </div>
  );
};

export default AccountSettings;
