import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type SurveyFunnelContextType = {
  isOpen: boolean;
  openFunnel: () => void;
  closeFunnel: () => void;
};

const SurveyFunnelContext = createContext<SurveyFunnelContextType>({
  isOpen: false,
  openFunnel: () => {},
  closeFunnel: () => {},
});

export const useSurveyFunnel = () => useContext(SurveyFunnelContext);

export const SurveyFunnelProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const openFunnel = useCallback(() => setIsOpen(true), []);
  const closeFunnel = useCallback(() => setIsOpen(false), []);

  return (
    <SurveyFunnelContext.Provider value={{ isOpen, openFunnel, closeFunnel }}>
      {children}
    </SurveyFunnelContext.Provider>
  );
};
