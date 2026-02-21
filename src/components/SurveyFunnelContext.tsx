import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type SurveyFunnelContextType = {
  isOpen: boolean;
  initialPhone: string;
  openFunnel: (phone?: string) => void;
  closeFunnel: () => void;
};

const SurveyFunnelContext = createContext<SurveyFunnelContextType>({
  isOpen: false,
  initialPhone: "",
  openFunnel: () => {},
  closeFunnel: () => {},
});

export const useSurveyFunnel = () => useContext(SurveyFunnelContext);

export const SurveyFunnelProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [initialPhone, setInitialPhone] = useState("");
  const openFunnel = useCallback((phone?: string) => {
    if (phone) setInitialPhone(phone);
    setIsOpen(true);
  }, []);
  const closeFunnel = useCallback(() => {
    setIsOpen(false);
    setInitialPhone("");
  }, []);

  return (
    <SurveyFunnelContext.Provider value={{ isOpen, initialPhone, openFunnel, closeFunnel }}>
      {children}
    </SurveyFunnelContext.Provider>
  );
};
