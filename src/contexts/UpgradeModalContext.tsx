import { createContext, useContext, useState, type ReactNode } from "react";

interface UpgradeModalContextType {
  upgradeModalOpen: boolean;
  openUpgradeModal: () => void;
  closeUpgradeModal: () => void;
}

const UpgradeModalContext = createContext<UpgradeModalContextType>({
  upgradeModalOpen: false,
  openUpgradeModal: () => {},
  closeUpgradeModal: () => {},
});

export const useUpgradeModal = () => useContext(UpgradeModalContext);

export const UpgradeModalProvider = ({ children }: { children: ReactNode }) => {
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  return (
    <UpgradeModalContext.Provider
      value={{
        upgradeModalOpen,
        openUpgradeModal: () => setUpgradeModalOpen(true),
        closeUpgradeModal: () => setUpgradeModalOpen(false),
      }}
    >
      {children}
    </UpgradeModalContext.Provider>
  );
};
