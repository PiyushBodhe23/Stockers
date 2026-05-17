import React, { useState } from "react";

import BuyActionWindow from "./BuyActionWindow";
import SellActionWindow from "./SellActionWindow";

const GeneralContext = React.createContext({

  openBuyWindow: (uid) => {},
  closeBuyWindow: () => {},

  openSellWindow: (uid) => {},
  closeSellWindow: () => {},

});



export const GeneralContextProvider = (props) => {

  // ================= BUY =================

  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);

  // ================= SELL =================

  const [isSellWindowOpen, setIsSellWindowOpen] = useState(false);

  // ================= COMMON =================

  const [selectedStockUID, setSelectedStockUID] = useState("");



  // ================= BUY FUNCTIONS =================

  const handleOpenBuyWindow = (uid) => {

    setIsBuyWindowOpen(true);
    setSelectedStockUID(uid);

  };



  const handleCloseBuyWindow = () => {

    setIsBuyWindowOpen(false);
    setSelectedStockUID("");

  };



  // ================= SELL FUNCTIONS =================

  const handleOpenSellWindow = (uid) => {

    setIsSellWindowOpen(true);
    setSelectedStockUID(uid);

  };



  const handleCloseSellWindow = () => {

    setIsSellWindowOpen(false);
    setSelectedStockUID("");

  };



  return (

    <GeneralContext.Provider
      value={{

        openBuyWindow: handleOpenBuyWindow,
        closeBuyWindow: handleCloseBuyWindow,

        openSellWindow: handleOpenSellWindow,
        closeSellWindow: handleCloseSellWindow,

      }}
    >

      {props.children}



      {isBuyWindowOpen && (
        <BuyActionWindow uid={selectedStockUID} />
      )}



      {isSellWindowOpen && (
        <SellActionWindow uid={selectedStockUID} />
      )}

    </GeneralContext.Provider>
  );
};

export default GeneralContext;