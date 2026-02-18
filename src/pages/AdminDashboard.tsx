import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  DollarSign, Users, TrendingUp, RefreshCw, Search,
  ArrowUpRight, Activity, UserCheck, CreditCard, X, Download, Trash2,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";

// ━━━ Types ━━━
interface AdminData {
  mrr: number;
  arr: number;
  mrrMonthly: number;
  mrrAnnual: number;
  totalActive: number;
  totalUsers: number;
  signups30d: number;
  onboardingRate: number;
  activationRate: number;
  trialToPaidRate: number;
  churnRate: number;
  mrrHistory: { month: string; label: string; monthly: number; annual: number; total: number }[];
  users: UserRow[];
}

interface UserRow {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  status: string;
  plan: string | null;
  trialEndsAt: string | null;
  activated: boolean;
  onboardingComplete: boolean;
}

// ━━━ Helpers ━━━
const fmt = (n: number) => `$${n.toLocaleString()}`;

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  trialing: { label: "Trialing", bg: "hsla(45,93%,47%,0.15)", text: "hsl(45,93%,47%)" },
  active: { label: "Active", bg: "hsla(142,71%,45%,0.15)", text: "hsl(142,71%,45%)" },
  canceled: { label: "Canceled", bg: "hsla(0,84%,60%,0.15)", text: "hsl(0,84%,60%)" },
  past_due: { label: "Past Due", bg: "hsla(25,95%,53%,0.15)", text: "hsl(25,95%,53%)" },
  none: { label: "None", bg: "hsla(0,0%,100%,0.06)", text: "hsla(0,0%,100%,0.4)" },
  paused: { label: "Paused", bg: "hsla(0,0%,100%,0.06)", text: "hsla(0,0%,100%,0.4)" },
};

const StatusBadge = ({ status }: { status: string }) => {
  const cfg = statusConfig[status] || statusConfig.none;
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: cfg.bg, color: cfg.text }}>
      {cfg.label}
    </span>
  );
};

// ━━━ Main Component ━━━
const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: result, error: err } = await supabase.functions.invoke("admin-metrics");
      if (err) throw err;
      if (result?.error) {
        if (result.error.includes("Forbidden") || result.error.includes("Unauthorized")) {
          navigate("/dashboard", { replace: true });
          return;
        }
        throw new Error(result.error);
      }
      setData(result);
    } catch (e: any) {
      setError(e.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (!user) { navigate("/login", { replace: true }); return; }

    // Verify admin role client-side
    supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle()
      .then(({ data: role }) => {
        if (!role) { navigate("/dashboard", { replace: true }); return; }
        fetchData();
      });
  }, [user, navigate, fetchData]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const filteredUsers = data?.users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.name.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const deletionsPending = data?.users.filter(u => u.email.includes("deleted_user_")).length ?? 0;

  const exportCsv = (d: AdminData) => {
    const rows = [
      ["Metric", "Value"],
      ["MRR", String(d.mrr)],
      ["ARR", String(d.arr)],
      ["MRR Monthly", String(d.mrrMonthly)],
      ["MRR Annual", String(d.mrrAnnual)],
      ["Active Subscribers", String(d.totalActive)],
      ["Total Users", String(d.totalUsers)],
      ["Signups (30d)", String(d.signups30d)],
      ["Onboarding Rate", `${d.onboardingRate}%`],
      ["Activation Rate", `${d.activationRate}%`],
      ["Trial to Paid Rate", `${d.trialToPaidRate}%`],
      ["Churn Rate (30d)", `${d.churnRate}%`],
      [],
      ["Month", "Monthly MRR", "Annual MRR", "Total MRR"],
      ...d.mrrHistory.map(h => [h.label, String(h.monthly), String(h.annual), String(h.total)]),
      [],
      ["Email", "Name", "Signed Up", "Status", "Plan", "Activated", "Onboarded"],
      ...d.users.map(u => [u.email, u.name, u.createdAt, u.status, u.plan || "none", String(u.activated), String(u.onboardingComplete)]),
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `darker-metrics-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(222,47%,6%)" }}>
        <RefreshCw className="w-6 h-6 animate-spin" style={{ color: "hsla(0,0%,100%,0.4)" }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(222,47%,6%)", color: "hsl(0,84%,60%)" }}>
        <p>{error}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen" style={{ background: "hsl(222,47%,6%)", color: "white" }}>
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b px-6 h-14 flex items-center justify-between"
        style={{ background: "hsla(222,47%,6%,0.9)", backdropFilter: "blur(12px)", borderColor: "hsla(0,0%,100%,0.08)" }}>
        <div className="flex items-center gap-3">
          <h1 className="text-base font-semibold">Admin Dashboard</h1>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: "hsl(0,85%,60%)", color: "white" }}>
            ADMIN
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => exportCsv(data)} disabled={!data}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors"
            style={{ background: "hsla(142,71%,45%,0.1)", color: "hsl(142,71%,45%)" }}>
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button onClick={fetchData} disabled={loading}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors"
            style={{ background: "hsla(0,0%,100%,0.06)", color: "hsla(0,0%,100%,0.6)" }}>
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button onClick={() => navigate("/dashboard")}
            className="text-sm px-3 py-1.5 rounded-lg transition-colors"
            style={{ background: "hsla(0,0%,100%,0.06)", color: "hsla(0,0%,100%,0.6)" }}>
            ← Dashboard
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

        {/* Row 1: Headline metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard icon={<DollarSign className="w-4 h-4" />} label="MRR" value={fmt(data.mrr)} sub={`Monthly: ${fmt(data.mrrMonthly)} · Annual: ${fmt(data.mrrAnnual)}`} />
          <MetricCard icon={<TrendingUp className="w-4 h-4" />} label="ARR" value={fmt(data.arr)} />
          <MetricCard icon={<CreditCard className="w-4 h-4" />} label="Active Subscribers" value={String(data.totalActive)} />
          <MetricCard icon={<Users className="w-4 h-4" />} label="Total Users" value={String(data.totalUsers)} />
        </div>

        {/* Row 2: Funnel metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <FunnelCard label="Signups (30d)" value={String(data.signups30d)} />
          <FunnelCard label="Onboarding Rate" value={`${data.onboardingRate}%`} />
          <FunnelCard label="Activation Rate" value={`${data.activationRate}%`} />
          <FunnelCard label="Trial → Paid" value={`${data.trialToPaidRate}%`} />
          <FunnelCard label="Churn (30d)" value={`${data.churnRate}%`} alert={data.churnRate > 10} />
          <FunnelCard label="Deletions Pending" value={String(deletionsPending)} alert={deletionsPending > 0} />
        </div>

        {/* Row 3: MRR Chart */}
        <div className="rounded-xl p-5" style={{ background: "hsla(0,0%,100%,0.03)", border: "1px solid hsla(0,0%,100%,0.07)" }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: "hsla(0,0%,100%,0.7)" }}>MRR Growth (Last 12 Months)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data.mrrHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsla(0,0%,100%,0.06)" />
              <XAxis dataKey="label" tick={{ fill: "hsla(0,0%,100%,0.4)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsla(0,0%,100%,0.4)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{ background: "hsl(222,47%,12%)", border: "1px solid hsla(0,0%,100%,0.1)", borderRadius: "8px", color: "white", fontSize: 13 }}
                formatter={(value: number, name: string) => [`$${value}`, name === "monthly" ? "Monthly Plans" : "Annual Plans"]}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: "hsla(0,0%,100%,0.5)" }} />
              <Line type="monotone" dataKey="monthly" stroke="hsl(217,91%,60%)" strokeWidth={2} dot={false} name="Monthly Plans" />
              <Line type="monotone" dataKey="annual" stroke="hsl(142,71%,45%)" strokeWidth={2} dot={false} name="Annual Plans" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Row 4: User table */}
        <div className="rounded-xl overflow-hidden" style={{ background: "hsla(0,0%,100%,0.03)", border: "1px solid hsla(0,0%,100%,0.07)" }}>
          <div className="p-4 flex items-center justify-between gap-4" style={{ borderBottom: "1px solid hsla(0,0%,100%,0.07)" }}>
            <h3 className="text-sm font-semibold" style={{ color: "hsla(0,0%,100%,0.7)" }}>Recent Users ({filteredUsers.length})</h3>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "hsla(0,0%,100%,0.3)" }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search email..."
                className="pl-8 pr-3 py-1.5 rounded-lg text-sm w-56 outline-none"
                style={{ background: "hsla(0,0%,100%,0.06)", border: "1px solid hsla(0,0%,100%,0.08)", color: "white" }}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid hsla(0,0%,100%,0.07)" }}>
                  {["Email", "Name", "Signed Up", "Status", "Plan", "Trial Ends", "Activated", "Onboarded"].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "hsla(0,0%,100%,0.35)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id} onClick={() => setSelectedUser(u)} className="cursor-pointer transition-colors"
                    style={{ borderBottom: "1px solid hsla(0,0%,100%,0.04)" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "hsla(0,0%,100%,0.03)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <td className="px-4 py-2.5 font-mono text-xs" style={{ color: "hsla(0,0%,100%,0.8)" }}>{u.email}</td>
                    <td className="px-4 py-2.5 text-xs" style={{ color: "hsla(0,0%,100%,0.6)" }}>{u.name || "—"}</td>
                    <td className="px-4 py-2.5 text-xs" style={{ color: "hsla(0,0%,100%,0.4)" }}>
                      {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })}
                    </td>
                    <td className="px-4 py-2.5"><StatusBadge status={u.status} /></td>
                    <td className="px-4 py-2.5 text-xs capitalize" style={{ color: "hsla(0,0%,100%,0.5)" }}>{u.plan || "—"}</td>
                    <td className="px-4 py-2.5 text-xs" style={{ color: "hsla(0,0%,100%,0.4)" }}>
                      {u.trialEndsAt ? new Date(u.trialEndsAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`w-2 h-2 rounded-full inline-block ${u.activated ? "bg-green-500" : "bg-white/10"}`} />
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`w-2 h-2 rounded-full inline-block ${u.onboardingComplete ? "bg-green-500" : "bg-white/10"}`} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User detail panel */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "hsla(0,0%,0%,0.5)" }} onClick={() => setSelectedUser(null)}>
          <div className="w-full max-w-md rounded-xl p-6" style={{ background: "hsl(222,47%,10%)", border: "1px solid hsla(0,0%,100%,0.1)" }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">User Detail</h3>
              <button onClick={() => setSelectedUser(null)}><X className="w-4 h-4" style={{ color: "hsla(0,0%,100%,0.4)" }} /></button>
            </div>
            <div className="space-y-3 text-sm">
              <DetailRow label="Email" value={selectedUser.email} />
              <DetailRow label="Business" value={selectedUser.name || "—"} />
              <DetailRow label="Signed Up" value={new Date(selectedUser.createdAt).toLocaleString()} />
              <DetailRow label="Status" value={<StatusBadge status={selectedUser.status} />} />
              <DetailRow label="Plan" value={selectedUser.plan || "None"} />
              <DetailRow label="Trial Ends" value={selectedUser.trialEndsAt ? new Date(selectedUser.trialEndsAt).toLocaleString() : "—"} />
              <DetailRow label="Activated" value={selectedUser.activated ? "Yes" : "No"} />
              <DetailRow label="Onboarding" value={selectedUser.onboardingComplete ? "Complete" : "Incomplete"} />
              <DetailRow label="User ID" value={<span className="font-mono text-[11px] break-all">{selectedUser.id}</span>} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ━━━ Sub-components ━━━
const MetricCard = ({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) => (
  <div className="rounded-xl p-4" style={{ background: "hsla(0,0%,100%,0.03)", border: "1px solid hsla(0,0%,100%,0.07)" }}>
    <div className="flex items-center gap-2 mb-2">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "hsla(217,91%,60%,0.1)", color: "hsl(217,91%,60%)" }}>{icon}</div>
      <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "hsla(0,0%,100%,0.4)" }}>{label}</span>
    </div>
    <div className="text-2xl font-bold tracking-tight">{value}</div>
    {sub && <p className="text-[11px] mt-1" style={{ color: "hsla(0,0%,100%,0.35)" }}>{sub}</p>}
  </div>
);

const FunnelCard = ({ label, value, alert }: { label: string; value: string; alert?: boolean }) => (
  <div className="rounded-xl p-4" style={{ background: "hsla(0,0%,100%,0.03)", border: `1px solid ${alert ? "hsla(0,84%,60%,0.25)" : "hsla(0,0%,100%,0.07)"}` }}>
    <div className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: "hsla(0,0%,100%,0.4)" }}>{label}</div>
    <div className="text-xl font-bold" style={{ color: alert ? "hsl(0,84%,60%)" : "white" }}>{value}</div>
  </div>
);

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-start justify-between gap-4">
    <span style={{ color: "hsla(0,0%,100%,0.4)" }}>{label}</span>
    <span className="text-right" style={{ color: "hsla(0,0%,100%,0.8)" }}>{value}</span>
  </div>
);

export default AdminDashboard;
