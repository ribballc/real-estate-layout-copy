import { useEffect, useState } from "react";
import {
  Building2, Share2, Wrench, PuzzleIcon, Clock, Camera, Star, Settings, LogOut,
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
  { title: "Home", url: "/dashboard", icon: LayoutDashboard, alwaysUnlocked: true, color: "hsl(217 91% 60%)" },
  { title: "Business Info", url: "/dashboard/business", icon: Building2, alwaysUnlocked: true, color: "hsl(271 91% 65%)" },
  { title: "Calendar", url: "/dashboard/calendar", icon: CalendarDays, color: "hsl(160 84% 39%)" },
  { title: "Customers", url: "/dashboard/customers", icon: Users, color: "hsl(45 93% 47%)" },
  { title: "Services", url: "/dashboard/services", icon: Wrench, color: "hsl(0 72% 51%)" },
  { title: "Photos", url: "/dashboard/photos", icon: Camera, color: "hsl(280 67% 55%)" },
  { title: "Testimonials", url: "/dashboard/testimonials", icon: Star, color: "hsl(45 93% 47%)" },
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
    <Sidebar className="border-r border-white/10" style={{ background: "linear-gradient(180deg, hsl(215 50% 10%) 0%, hsl(217 33% 14%) 100%)" }}>
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <img src={darkerLogo} alt="Darker" className="h-8" />
        </div>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/30 text-[10px] uppercase tracking-widest px-5 mt-2">Manage</SidebarGroupLabel>
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
                        className="group/nav flex items-center gap-3 px-4 py-3 text-[14px] text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-all mx-2"
                        activeClassName="bg-accent/10 text-accent font-medium shadow-[inset_0_0_0_1px_hsla(217,91%,60%,0.15)]"
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 group-hover/nav:scale-110"
                          style={{
                            background: `linear-gradient(135deg, ${item.color}15 0%, ${item.color}08 100%)`,
                            border: `1px solid ${item.color}25`,
                            boxShadow: `0 0 12px ${item.color}10`,
                          }}
                        >
                          <item.icon className="w-4 h-4 shrink-0 transition-all duration-300" style={{ color: item.color }} />
                        </div>
                        <span className="flex-1">{item.title}</span>
                        {isItemLocked && <Lock className="w-3.5 h-3.5 text-white/20 shrink-0" />}
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
      <div className="mt-auto border-t border-white/10">
        {/* Theme toggle */}
        <div className="px-3 pt-3">
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            {dashboardTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span>{dashboardTheme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>

        {/* Help links */}
        <div className="p-3 space-y-0.5">
          <button
            onClick={onReportBug}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-white/40 hover:text-amber-400 hover:bg-amber-400/5 rounded-lg transition-colors"
          >
            <Bug className="w-4 h-4" />
            <span>Report A Bug</span>
          </button>
          <button
            onClick={onNeedHelp}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-white/40 hover:text-accent hover:bg-accent/5 rounded-lg transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Need Help?</span>
          </button>
        </div>

        {/* Sign out */}
        <div className="px-3 pb-3">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-white/30 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Business logo + Account gear */}
        <div className="px-5 py-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            {logoUrl && (
              <img src={logoUrl} alt="Business" className="w-9 h-9 rounded-lg object-cover border border-white/10" />
            )}
            <span className="text-white/40 text-xs truncate flex-1">{businessName || "Your Business"}</span>
            <button
              onClick={() => navigate("/dashboard/account")}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-colors shrink-0"
              title="Account Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default DashboardSidebar;
