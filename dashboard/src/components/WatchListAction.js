import { BarChartOutlined, MoreHoriz } from "@mui/icons-material";
import { Grow, Tooltip } from "@mui/material";
import React, { useContext } from "react";

import GeneralContext from "./GeneralContext";

function WatchListAction({ uid }) {
  const generalContext = useContext(GeneralContext);

  const handleBuyClick = () => {
    generalContext.openBuyWindow(uid);
  };

  const handleSellClick = () => {
    generalContext.openSellWindow(uid);
  };

  return (
    <span className="actions">
      {/* BUY */}
      <span>
        <Tooltip title="Buy (B)" placement="top" arrow TransitionComponent={Grow}>
          <button className="buy" onClick={handleBuyClick}>Buy</button>
        </Tooltip>
      </span>

      {/* SELL */}
      <span>
        <Tooltip title="Sell (S)" placement="top" arrow TransitionComponent={Grow}>
          <button className="sell" onClick={handleSellClick}>Sell</button>
        </Tooltip>
      </span>

      {/* ANALYTICS */}
      <span>
        <Tooltip title="Analytics (A)" placement="top" arrow TransitionComponent={Grow}>
          <button className="action">
            <BarChartOutlined className="icon" />
          </button>
        </Tooltip>
      </span>

      {/* MORE */}
      <span>
        <Tooltip title="More" placement="top" arrow TransitionComponent={Grow}>
          <button className="action">
            <MoreHoriz className="icon" />
          </button>
        </Tooltip>
      </span>
    </span>
  );
}

export default WatchListAction;
