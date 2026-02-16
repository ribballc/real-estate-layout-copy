import { useEffect, useState } from "react";
import {
  Building2, Wrench, Clock, Camera, Star, Settings, LogOut,
  Bug, HelpCircle, CalendarDays, Users, Sun, Moon, LayoutDashboard, Lock,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";
import darkerLogo from "@/assets/darker-logo.png";

const items = [
  { title: "Home", url: "/dashboard", icon: LayoutDashboard, alwaysUnlocked: true },
  { title: "Business Info", url: "/dashboard/business", icon: Building2, alwaysUnlocked: true },
  { title: "Calendar", url: "/dashboard/calendar", icon: CalendarDays },
  { title: "Customers", url: "/dashboard/customers", icon: Users },
  { title: "Services", url: "/dashboard/services", icon: Wrench },
  { title: "Photos", url: "/dashboard/photos", icon: Camera },
  { title: "Testimonials", url: "/dashboard/testimonials", icon: Star },
];

interface DashboardSidebarProps {
  dashboardTheme?: "dark" | "light";
  onToggleTheme?: () => void;
  onReportBug?: () => void;
  onNeedHelp?: () => void;
}

const DashboardSidebar = ({ dashboardTheme = "dark", onToggleTheme, onReportBug, onNeedHelp }: DashboardSidebarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string>("");
  const [trialActive, setTrialActive] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("logo_url, business_name, trial_active").eq("user_id", user.id).single().then(({ data }) => {
      if (data?.logo_url) setLogoUrl(data.logo_url);
      if (data?.business_name) setBusinessName(data.business_name);
      setTrialActive(data?.trial_active ?? false);
    });
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <Sidebar
      className="border-r border-white/[0.04]"
      style={{
        background: "linear-gradient(180deg, hsl(215 50% 7%) 0%, hsl(217 33% 10%) 100%)",
      }}
    >
      {/* Logo */}
      <div className="px-4 py-4 border-b border-white/[0.04]">
        <img src={darkerLogo} alt="Darker" className="h-6" />
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/15 text-[9px] uppercase tracking-[0.25em] px-4 mt-4 mb-1 font-medium">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isItemLocked = !trialActive && !("alwaysUnlocked" in item && item.alwaysUnlocked);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/dashboard"}
                        className="group/nav flex items-center gap-2.5 px-3 py-[7px] text-[12px] text-white/30 hover:text-white/80 rounded-lg transition-all duration-200 mx-1.5 relative overflow-hidden hover:bg-white/[0.03]"
                        activeClassName="!bg-accent/8 !text-white/90 font-medium"
                        style={{ border: "1px solid transparent" }}
                      >
                        <item.icon className="w-3.5 h-3.5 shrink-0 transition-all duration-200 opacity-40 group-hover/nav:opacity-80" strokeWidth={1.5} />
                        <span className="flex-1 tracking-tight">{item.title}</span>
                        {isItemLocked && <Lock className="w-2.5 h-2.5 text-white/8 shrink-0" strokeWidth={1.5} />}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Bottom section */}
      <div className="mt-auto border-t border-white/[0.03]">
        <div className="p-2 space-y-0">
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-2.5 w-full px-3 py-[7px] text-[11px] text-white/20 hover:text-white/50 hover:bg-white/[0.02] rounded-lg transition-all duration-200"
          >
            {dashboardTheme === "dark" ? <Sun className="w-3 h-3" strokeWidth={1.5} /> : <Moon className="w-3 h-3" strokeWidth={1.5} />}
            <span>{dashboardTheme === "dark" ? "Light" : "Dark"}</span>
          </button>
          <button
            onClick={onReportBug}
            className="flex items-center gap-2.5 w-full px-3 py-[7px] text-[11px] text-white/20 hover:text-amber-400/60 hover:bg-white/[0.02] rounded-lg transition-all duration-200"
          >
            <Bug className="w-3 h-3" strokeWidth={1.5} />
            <span>Bug</span>
          </button>
          <button
            onClick={onNeedHelp}
            className="flex items-center gap-2.5 w-full px-3 py-[7px] text-[11px] text-white/20 hover:text-white/50 hover:bg-white/[0.02] rounded-lg transition-all duration-200"
          >
            <HelpCircle className="w-3 h-3" strokeWidth={1.5} />
            <span>Help</span>
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2.5 w-full px-3 py-[7px] text-[11px] text-white/12 hover:text-red-400/50 hover:bg-white/[0.02] rounded-lg transition-all duration-200"
          >
            <LogOut className="w-3 h-3" strokeWidth={1.5} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Business + gear */}
        <div className="px-3 py-3 border-t border-white/[0.03]">
          <div className="flex items-center gap-2">
            {logoUrl ? (
              <img src={logoUrl} alt="Business" className="w-6 h-6 rounded-lg object-cover" style={{ border: "1px solid hsla(217,91%,60%,0.1)" }} />
            ) : (
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "hsla(217,91%,60%,0.06)", border: "1px solid hsla(217,91%,60%,0.1)" }}>
                <Building2 className="w-2.5 h-2.5 text-accent/40" strokeWidth={1.5} />
              </div>
            )}
            <span className="text-white/20 text-[10px] truncate flex-1 font-medium">{businessName || "Your Business"}</span>
            <button
              onClick={() => navigate("/dashboard/account")}
              className="w-5 h-5 rounded flex items-center justify-center text-white/12 hover:text-white/40 hover:bg-white/[0.03] transition-all duration-200 shrink-0"
              title="Account Settings"
            >
              <Settings className="w-3 h-3" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default DashboardSidebar;
