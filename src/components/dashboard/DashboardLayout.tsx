import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "./DashboardSidebar";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Building2, Share2, Wrench, PuzzleIcon, Clock, Camera, Star, Settings,
  TrendingUp, Users, Eye, Calendar,
} from "lucide-react";

const pageTitles: Record<string, { title: string; description: string; icon: any }> = {
  "/dashboard": { title: "Business Info", description: "Manage your brand, address and service areas", icon: Building2 },
  "/dashboard/social": { title: "Social Media", description: "Connect your social profiles", icon: Share2 },
  "/dashboard/services": { title: "Services", description: "Manage your service offerings and pricing", icon: Wrench },
  "/dashboard/add-ons": { title: "Add-ons", description: "Create add-on packages for services", icon: PuzzleIcon },
  "/dashboard/hours": { title: "Business Hours", description: "Set your weekly schedule", icon: Clock },
  "/dashboard/photos": { title: "Photos", description: "Upload your portfolio and gallery", icon: Camera },
  "/dashboard/testimonials": { title: "Testimonials", description: "Manage customer reviews", icon: Star },
  "/dashboard/account": { title: "Account", description: "Manage your account settings", icon: Settings },
};

const DashboardLayout = () => {
  const location = useLocation();
  const { user } = useAuth();
  const page = pageTitles[location.pathname] || pageTitles["/dashboard"];
  const PageIcon = page.icon;

  const [stats, setStats] = useState({ services: 0, photos: 0, testimonials: 0 });

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("services").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("photos").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("testimonials").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    ]).then(([s, p, t]) => {
      setStats({ services: s.count || 0, photos: p.count || 0, testimonials: t.count || 0 });
    });
  }, [user, location.pathname]);

  const isIndex = location.pathname === "/dashboard";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full" style={{ background: "linear-gradient(135deg, hsl(215 50% 10%) 0%, hsl(217 33% 14%) 100%)" }}>
        <DashboardSidebar />
        <main className="flex-1 flex flex-col min-w-0">
          {/* Header bar */}
          <header className="h-16 flex items-center gap-4 px-4 md:px-8 border-b border-white/10 shrink-0">
            <SidebarTrigger className="text-white/60 hover:text-white" />
            <div className="flex items-center gap-3 flex-1">
              <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                <PageIcon className="w-4 h-4 text-accent" />
              </div>
              <div className="min-w-0">
                <h1 className="text-white font-semibold text-sm md:text-base truncate">{page.title}</h1>
                <p className="text-white/40 text-xs hidden sm:block">{page.description}</p>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            {/* Quick stats on index page */}
            {isIndex && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
                {[
                  { label: "Services", value: stats.services, icon: Wrench, color: "hsl(217 91% 60%)" },
                  { label: "Photos", value: stats.photos, icon: Camera, color: "hsl(271 91% 65%)" },
                  { label: "Reviews", value: stats.testimonials, icon: Star, color: "hsl(45 93% 47%)" },
                  { label: "Page Views", value: "—", icon: Eye, color: "hsl(160 84% 39%)" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.06] transition-colors group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white/40 text-xs font-medium uppercase tracking-wider">{s.label}</span>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: `${s.color}15` }}>
                        <s.icon className="w-4 h-4" style={{ color: s.color }} />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-white">{s.value}</p>
                  </div>
                ))}
              </div>
            )}

            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
