import {
  Building2, Share2, Wrench, PuzzleIcon, Clock, Camera, Star, Settings, LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";
import darkerLogo from "@/assets/darker-logo.png";

const items = [
  { title: "Business Info", url: "/dashboard", icon: Building2 },
  { title: "Social Media", url: "/dashboard/social", icon: Share2 },
  { title: "Services", url: "/dashboard/services", icon: Wrench },
  { title: "Add-ons", url: "/dashboard/add-ons", icon: PuzzleIcon },
  { title: "Hours", url: "/dashboard/hours", icon: Clock },
  { title: "Photos", url: "/dashboard/photos", icon: Camera },
  { title: "Testimonials", url: "/dashboard/testimonials", icon: Star },
  { title: "Account", url: "/dashboard/account", icon: Settings },
];

const DashboardSidebar = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

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
                      className="flex items-center gap-3 px-5 py-2.5 text-sm text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-all mx-2"
                      activeClassName="bg-accent/10 text-accent font-medium shadow-[inset_0_0_0_1px_hsla(217,91%,60%,0.15)]"
                    >
                      <item.icon className="w-[18px] h-[18px] shrink-0" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className="mt-auto p-4 border-t border-white/10">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-5 py-2.5 text-sm text-white/30 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </Sidebar>
  );
};

export default DashboardSidebar;
