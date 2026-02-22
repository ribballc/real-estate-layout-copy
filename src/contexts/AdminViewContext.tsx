import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type ViewMode = "default" | "paid" | "unpaid";

interface AdminViewContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isAdmin: boolean;
  adminLoading: boolean;
}

const AdminViewContext = createContext<AdminViewContextType>({
  viewMode: "default",
  setViewMode: () => {},
  isAdmin: false,
  adminLoading: true,
});

export const useAdminView = () => useContext(AdminViewContext);

export const AdminViewProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);
  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    return (localStorage.getItem("admin-view-mode") as ViewMode) || "default";
  });

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      setAdminLoading(false);
      return;
    }
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data }) => {
        setIsAdmin(!!data);
        setAdminLoading(false);
        // Reset view mode if not admin
        if (!data) {
          setViewModeState("default");
          localStorage.removeItem("admin-view-mode");
        }
      });
  }, [user]);

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    if (mode === "default") {
      localStorage.removeItem("admin-view-mode");
    } else {
      localStorage.setItem("admin-view-mode", mode);
    }
  };

  return (
    <AdminViewContext.Provider value={{ viewMode, setViewMode, isAdmin, adminLoading }}>
      {children}
    </AdminViewContext.Provider>
  );
};
