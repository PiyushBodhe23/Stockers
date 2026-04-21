import React, { useState, useCallback, useRef, useEffect } from "react";
import BuyActionWindow from "./BuyActionWindow";
import SellActionWindow from "./SellActionWindow";

// Create the context
const GeneralContext = React.createContext({
  openBuyWindow: (uid, stockDetails) => {},
  openSellWindow: (uid, stockDetails) => {},
  closeWindows: () => {},
  isAnyWindowOpen: false,
  activeWindow: null,
});

// ✅ MAKE SURE THIS IS EXPORTED - This is the Provider component
export const GeneralContextProvider = ({ children }) => {
  const [buyWindowOpen, setBuyWindowOpen] = useState(false);
  const [sellWindowOpen, setSellWindowOpen] = useState(false);
  const [selectedUID, setSelectedUID] = useState("");
  const [selectedStockDetails, setSelectedStockDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const modalRef = useRef(null);

  // Close windows with ESC key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && (buyWindowOpen || sellWindowOpen)) {
        closeWindows();
      }
    };

    if (buyWindowOpen || sellWindowOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscKey);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      window.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [buyWindowOpen, sellWindowOpen]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeWindows();
      }
    };

    if (buyWindowOpen || sellWindowOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [buyWindowOpen, sellWindowOpen]);

  const openBuyWindow = useCallback((uid, stockDetails = {}) => {
    setSelectedUID(uid);
    setSelectedStockDetails(stockDetails);
    setSellWindowOpen(false);
    setBuyWindowOpen(true);
    setError(null);
  }, []);

  const openSellWindow = useCallback((uid, stockDetails = {}) => {
    setSelectedUID(uid);
    setSelectedStockDetails(stockDetails);
    setBuyWindowOpen(false);
    setSellWindowOpen(true);
    setError(null);
  }, []);

  const closeWindows = useCallback(() => {
    setBuyWindowOpen(false);
    setSellWindowOpen(false);
    setSelectedUID("");
    setSelectedStockDetails({});
    setError(null);
    setIsLoading(false);
  }, []);

  const value = {
    openBuyWindow,
    openSellWindow,
    closeWindows,
    isAnyWindowOpen: buyWindowOpen || sellWindowOpen,
    activeWindow: buyWindowOpen ? 'buy' : sellWindowOpen ? 'sell' : null,
    selectedUID,
    selectedStockDetails,
    isLoading,
    setIsLoading,
    error,
    setError,
  };

  return (
    <GeneralContext.Provider value={value}>
      {children}
      
      {/* Modals */}
      {(buyWindowOpen || sellWindowOpen) && (
        <div className="modal-overlay" style={styles.overlay}>
          <div ref={modalRef} className="modal-container" style={styles.modalContainer}>
            {buyWindowOpen && (
              <BuyActionWindow 
                uid={selectedUID} 
                stockDetails={selectedStockDetails}
              />
            )}
            {sellWindowOpen && (
              <SellActionWindow 
                uid={selectedUID} 
                stockDetails={selectedStockDetails}
              />
            )}
          </div>
        </div>
      )}
    </GeneralContext.Provider>
  );
};

// ✅ ALSO EXPORT THE CONTEXT ITSELF for use in other components
export default GeneralContext;

// Styles for the overlay
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    animation: 'fadeIn 0.2s ease-out',
  },
  modalContainer: {
    position: 'relative',
    maxWidth: '90vw',
    maxHeight: '90vh',
    animation: 'scaleIn 0.2s ease-out',
  },
};

// Add animations to global styles
const globalAnimations = `
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

// Inject global styles if not already present
if (typeof document !== 'undefined' && !document.querySelector('#general-context-styles')) {
  const styleSheet = document.createElement("style");
  styleSheet.id = "general-context-styles";
  styleSheet.textContent = globalAnimations;
  document.head.appendChild(styleSheet);
}