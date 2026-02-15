import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "./DashboardSidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full" style={{ background: "linear-gradient(135deg, hsl(215 50% 10%) 0%, hsl(217 33% 17%) 100%)" }}>
        <DashboardSidebar />
        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-3 px-6 border-b border-white/10 shrink-0">
            <SidebarTrigger className="text-white/60 hover:text-white" />
          </header>
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
