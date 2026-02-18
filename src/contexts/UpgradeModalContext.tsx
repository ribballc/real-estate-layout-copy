import { createContext, useContext, useState, type ReactNode } from "react";
import { trackEvent } from "@/lib/tracking";

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

  const handleOpen = () => {
    setUpgradeModalOpen(true);
    trackEvent({
      eventName: 'InitiateCheckout',
      customData: { content_name: 'Upgrade Modal Opened', currency: 'USD', num_items: 1 },
    });
  };

  return (
    <UpgradeModalContext.Provider
      value={{
        upgradeModalOpen,
        openUpgradeModal: handleOpen,
        closeUpgradeModal: () => setUpgradeModalOpen(false),
      }}
    >
      {children}
    </UpgradeModalContext.Provider>
  );
};
