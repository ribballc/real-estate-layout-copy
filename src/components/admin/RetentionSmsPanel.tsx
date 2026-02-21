import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  MessageSquare, RotateCcw, Send, ChevronDown, ChevronUp,
  Phone, CheckCircle, XCircle, AlertTriangle, RefreshCw,
} from "lucide-react";

// ━━━ Types ━━━
interface RetentionUser {
  user_id: string;
  business_name: string;
  email: string;
  phone: string;
  trial_start: string;
  trial_ends_at: string;
  days_in_trial: number;
  onboarding_complete: boolean;
  slug: string | null;
  sms_consent: boolean;
  retention_step: number;
  last_sent_at: string | null;
  events: { step: number; sent_at: string; is_test: boolean; error: string | null }[];
}

// ━━━ Helpers ━━━
const StepBadge = ({ step }: { step: number }) => {
  const colors: Record<number, { bg: string; text: string }> = {
    0: { bg: "hsla(0,0%,100%,0.06)", text: "hsla(0,0%,100%,0.4)" },
    1: { bg: "hsla(45,93%,47%,0.15)", text: "hsl(45,93%,47%)" },
    2: { bg: "hsla(25,95%,53%,0.15)", text: "hsl(25,95%,53%)" },
    3: { bg: "hsla(142,71%,45%,0.15)", text: "hsl(142,71%,45%)" },
  };
  const c = colors[step] || colors[0];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: c.bg, color: c.text }}
    >
      {step === 0 ? "None" : `Step ${step}`}
    </span>
  );
};

const ConsentBadge = ({ consent }: { consent: boolean }) => (
  <span
    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
    style={{
      background: consent ? "hsla(142,71%,45%,0.15)" : "hsla(0,84%,60%,0.15)",
      color: consent ? "hsl(142,71%,45%)" : "hsl(0,84%,60%)",
    }}
  >
    {consent ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
    {consent ? "Yes" : "No"}
  </span>
);

// ━━━ Main Component ━━━
const RetentionSmsPanel = () => {
  const [users, setUsers] = useState<RetentionUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [actionResult, setActionResult] = useState<{ userId: string; msg: string; ok: boolean } | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase.functions.invoke("admin-retention-sms", {
        body: { action: "list" },
      });
      if (err) throw err;
      if (data?.error) throw new Error(data.error);
      setUsers(data.users || []);
    } catch (e: any) {
      setError(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSendNext = async (userId: string) => {
    setActionLoading(userId + "-next");
    setActionResult(null);
    try {
      const { data, error: err } = await supabase.functions.invoke("admin-retention-sms", {
        body: { action: "send_next", user_id: userId },
      });
      if (err) throw err;
      if (data?.error) throw new Error(data.error);
      setActionResult({ userId, msg: `Step ${data.step} sent successfully`, ok: true });
      fetchUsers();
    } catch (e: any) {
      setActionResult({ userId, msg: e.message, ok: false });
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendStep = async (userId: string, step: number) => {
    setActionLoading(userId + `-step${step}`);
    setActionResult(null);
    try {
      const { data, error: err } = await supabase.functions.invoke("admin-retention-sms", {
        body: { action: "send", user_id: userId, step },
      });
      if (err) throw err;
      if (data?.error) throw new Error(data.error);
      setActionResult({ userId, msg: `Step ${step} sent`, ok: true });
      fetchUsers();
    } catch (e: any) {
      setActionResult({ userId, msg: e.message, ok: false });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReset = async (userId: string) => {
    if (!window.confirm("Reset retention sequence for this user? This will clear all sent SMS records.")) return;
    setActionLoading(userId + "-reset");
    setActionResult(null);
    try {
      const { data, error: err } = await supabase.functions.invoke("admin-retention-sms", {
        body: { action: "reset", user_id: userId },
      });
      if (err) throw err;
      if (data?.error) throw new Error(data.error);
      setActionResult({ userId, msg: "Sequence reset", ok: true });
      fetchUsers();
    } catch (e: any) {
      setActionResult({ userId, msg: e.message, ok: false });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="w-5 h-5 animate-spin" style={{ color: "hsla(0,0%,100%,0.4)" }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20" style={{ color: "hsl(0,84%,60%)" }}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" style={{ color: "hsl(217,91%,60%)" }} />
            <h3 className="text-sm font-semibold" style={{ color: "hsla(0,0%,100%,0.8)" }}>
              Trial Retention SMS – Internal Admin / Testing Only
            </h3>
          </div>
          <p className="text-xs mt-1" style={{ color: "hsla(0,0%,100%,0.45)" }}>
            Users in trial who have NOT activated their website. {users.length} user{users.length !== 1 ? "s" : ""} in funnel.
          </p>
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors"
          style={{ background: "hsla(0,0%,100%,0.06)", color: "hsla(0,0%,100%,0.6)" }}
        >
          <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Warning banner */}
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
        style={{ background: "hsla(45,93%,47%,0.1)", color: "hsl(45,93%,47%)" }}
      >
        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
        Sending SMS here will deliver real messages via Twilio. Test actions are logged with a TEST flag.
      </div>

      {/* Users table */}
      {users.length === 0 ? (
        <div className="text-center py-12 text-sm" style={{ color: "hsla(0,0%,100%,0.4)" }}>
          No users currently in the retention funnel.
        </div>
      ) : (
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: "hsla(0,0%,100%,0.03)", border: "1px solid hsla(0,0%,100%,0.07)" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid hsla(0,0%,100%,0.07)" }}>
                  {["Business", "Email", "Phone", "Day", "Consent", "Step", "Last SMS", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "hsla(0,0%,100%,0.5)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <>
                    <tr
                      key={u.user_id}
                      className="cursor-pointer transition-colors"
                      style={{ borderBottom: "1px solid hsla(0,0%,100%,0.04)" }}
                      onClick={() => setExpandedUser(expandedUser === u.user_id ? null : u.user_id)}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "hsla(0,0%,100%,0.03)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td className="px-4 py-2.5 text-xs" style={{ color: "hsla(0,0%,100%,0.8)" }}>
                        <div className="flex items-center gap-1.5">
                          {expandedUser === u.user_id ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                          {u.business_name || "—"}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs" style={{ color: "hsla(0,0%,100%,0.7)" }}>
                        {u.email}
                      </td>
                      <td className="px-4 py-2.5 text-xs" style={{ color: "hsla(0,0%,100%,0.65)" }}>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {u.phone || "—"}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-xs font-semibold" style={{ color: "hsla(0,0%,100%,0.8)" }}>
                        {u.days_in_trial}
                      </td>
                      <td className="px-4 py-2.5">
                        <ConsentBadge consent={u.sms_consent} />
                      </td>
                      <td className="px-4 py-2.5">
                        <StepBadge step={u.retention_step} />
                      </td>
                      <td className="px-4 py-2.5 text-xs" style={{ color: "hsla(0,0%,100%,0.55)" }}>
                        {u.last_sent_at
                          ? new Date(u.last_sent_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })
                          : "—"}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleSendNext(u.user_id)}
                            disabled={!!actionLoading || !u.phone || !u.sms_consent || u.retention_step >= 3}
                            className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-md transition-colors disabled:opacity-30"
                            style={{ background: "hsla(217,91%,60%,0.15)", color: "hsl(217,91%,60%)" }}
                            title="Send next retention SMS"
                          >
                            <Send className="w-3 h-3" />
                            Next
                          </button>
                          <button
                            onClick={() => handleReset(u.user_id)}
                            disabled={!!actionLoading || u.retention_step === 0}
                            className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-md transition-colors disabled:opacity-30"
                            style={{ background: "hsla(0,84%,60%,0.15)", color: "hsl(0,84%,60%)" }}
                            title="Reset retention sequence"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Reset
                          </button>
                        </div>
                      </td>
                    </tr>
                    {/* Expanded row: test controls + event history */}
                    {expandedUser === u.user_id && (
                      <tr key={u.user_id + "-expanded"}>
                        <td colSpan={8} className="px-4 py-3" style={{ background: "hsla(0,0%,100%,0.02)" }}>
                          <div className="flex flex-col gap-3">
                            {/* Action result */}
                            {actionResult && actionResult.userId === u.user_id && (
                              <div
                                className="text-xs px-3 py-1.5 rounded-md"
                                style={{
                                  background: actionResult.ok
                                    ? "hsla(142,71%,45%,0.1)"
                                    : "hsla(0,84%,60%,0.1)",
                                  color: actionResult.ok
                                    ? "hsl(142,71%,45%)"
                                    : "hsl(0,84%,60%)",
                                }}
                              >
                                {actionResult.msg}
                              </div>
                            )}

                            {/* Test send buttons */}
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: "hsla(0,0%,100%,0.4)" }}>
                                Send specific:
                              </span>
                              {[1, 2, 3].map((step) => (
                                <button
                                  key={step}
                                  onClick={() => handleSendStep(u.user_id, step)}
                                  disabled={!!actionLoading || !u.phone}
                                  className="text-[11px] px-2.5 py-1 rounded-md transition-colors disabled:opacity-30"
                                  style={{
                                    background: "hsla(0,0%,100%,0.06)",
                                    color: "hsla(0,0%,100%,0.7)",
                                  }}
                                >
                                  {actionLoading === u.user_id + `-step${step}` ? "…" : `SMS ${step} (TEST)`}
                                </button>
                              ))}
                            </div>

                            {/* Event history */}
                            {u.events.length > 0 && (
                              <div>
                                <span className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: "hsla(0,0%,100%,0.4)" }}>
                                  History:
                                </span>
                                <div className="mt-1 space-y-1">
                                  {u.events
                                    .sort((a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime())
                                    .map((ev, i) => (
                                      <div
                                        key={i}
                                        className="flex items-center gap-2 text-[11px] px-2 py-1 rounded"
                                        style={{ background: "hsla(0,0%,100%,0.03)" }}
                                      >
                                        <StepBadge step={ev.step} />
                                        <span style={{ color: "hsla(0,0%,100%,0.5)" }}>
                                          {new Date(ev.sent_at).toLocaleString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            hour: "numeric",
                                            minute: "2-digit",
                                          })}
                                        </span>
                                        {ev.is_test && (
                                          <span
                                            className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                                            style={{ background: "hsla(45,93%,47%,0.15)", color: "hsl(45,93%,47%)" }}
                                          >
                                            TEST
                                          </span>
                                        )}
                                        {ev.error && (
                                          <span style={{ color: "hsl(0,84%,60%)" }}>⚠ {ev.error.slice(0, 50)}</span>
                                        )}
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}

                            {/* User meta */}
                            <div className="flex flex-wrap gap-4 text-[11px]" style={{ color: "hsla(0,0%,100%,0.45)" }}>
                              <span>Trial: {new Date(u.trial_start).toLocaleDateString()} → {new Date(u.trial_ends_at).toLocaleDateString()}</span>
                              <span>Onboarding: {u.onboarding_complete ? "✓" : "✗"}</span>
                              <span>Slug: {u.slug || "none"}</span>
                              <span className="font-mono break-all">ID: {u.user_id}</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetentionSmsPanel;
