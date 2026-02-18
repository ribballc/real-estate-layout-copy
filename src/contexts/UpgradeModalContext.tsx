import { createContext, useContext, useState, type ReactNode } from "react";
import { fbqEvent, generateEventId } from "@/lib/pixel";
import { sendCapiEvent } from "@/lib/capiEvent";

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
    // Event 6: InitiateCheckout
    const eventId = generateEventId();
    fbqEvent('track', 'InitiateCheckout', {
      content_name: 'Upgrade Modal Opened',
      currency: 'USD',
      num_items: 1,
    }, eventId);
    sendCapiEvent({
      eventName: 'InitiateCheckout',
      eventId,
      customData: { currency: 'USD' },
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
