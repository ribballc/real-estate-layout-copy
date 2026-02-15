import { useEffect, useState } from "react";
import {
  Building2, Share2, Wrench, PuzzleIcon, Clock, Camera, Star, Settings, LogOut,
  Bug, HelpCircle, CalendarDays, Users, Sun, Moon,
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
  { title: "Business Info", url: "/dashboard", icon: Building2 },
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

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("logo_url, business_name").eq("user_id", user.id).single().then(({ data }) => {
      if (data?.logo_url) setLogoUrl(data.logo_url);
      if (data?.business_name) setBusinessName(data.business_name);
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
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="flex items-center gap-3 px-5 py-3.5 text-[15px] text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-all mx-2"
                      activeClassName="bg-accent/10 text-accent font-medium shadow-[inset_0_0_0_1px_hsla(217,91%,60%,0.15)]"
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
