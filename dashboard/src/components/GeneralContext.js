import React, { useState } from "react";

import BuyActionWindow from "./BuyActionWindow";
import SellActionWindow from "./SellActionWindow";

const GeneralContext = React.createContext({
  openBuyWindow: (uid) => {},
  openSellWindow: (uid) => {},
  closeWindows: () => {},
});

export const GeneralContextProvider = ({ children }) => {
  const [buyWindowOpen, setBuyWindowOpen] = useState(false);
  const [sellWindowOpen, setSellWindowOpen] = useState(false);
  const [selectedUID, setSelectedUID] = useState("");

  const openBuyWindow = (uid) => {
    setSelectedUID(uid);
    setSellWindowOpen(false);
    setBuyWindowOpen(true);
  };

  const openSellWindow = (uid) => {
    setSelectedUID(uid);
    setBuyWindowOpen(false);
    setSellWindowOpen(true);
  };

  const closeWindows = () => {
    setBuyWindowOpen(false);
    setSellWindowOpen(false);
    setSelectedUID("");
  };

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow,
        openSellWindow,
        closeWindows,
      }}
    >
      {children}

      {buyWindowOpen && <BuyActionWindow uid={selectedUID} />}
      {sellWindowOpen && <SellActionWindow uid={selectedUID} />}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
