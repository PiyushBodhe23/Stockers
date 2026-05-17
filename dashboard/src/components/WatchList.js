import React, {
  useState,
  useContext,
} from "react";

import {
  Tooltip,
  Grow,
} from "@mui/material";

import {
  BarChartOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreHoriz,
  Search,
} from "@mui/icons-material";

import GeneralContext from "./GeneralContext";

import { watchlist } from "../data/data";

import { DoughnutChart } from "./DoughnoutChart";

import "./WatchList.css";



const labels = watchlist.map(
  (stock) => stock.name
);



const WatchList = () => {

  const [searchTerm, setSearchTerm] =
    useState("");



  const filteredWatchlist =
    watchlist.filter((stock) =>
      stock.name
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )
    );



  const data = {

    labels,

    datasets: [
      {
        label: "Stock Price",

        data: watchlist.map(
          (stock) => stock.price
        ),

        backgroundColor: [
          "#3b82f6",
          "#22c55e",
          "#a855f7",
          "#f59e0b",
          "#ef4444",
          "#06b6d4",
        ],

        borderWidth: 0,
      },
    ],
  };



  return (

    <div className="watchlist-container">

      {/* ================= HEADER ================= */}

      <div className="watchlist-header">

        <div>

          <h2>Watchlist</h2>

          <p>
            Track your favorite stocks
          </p>

        </div>



        <div className="watchlist-count">

          {filteredWatchlist.length}/50

        </div>

      </div>



      {/* ================= SEARCH ================= */}

      <div className="search-container">

        <Search className="search-icon" />

        <input
          type="text"
          placeholder="Search stocks..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />

      </div>



      {/* ================= WATCHLIST ================= */}

      <ul className="watchlist-list">

        {filteredWatchlist.map(
          (stock, index) => {

            return (
              <WatchListItem
                stock={stock}
                key={index}
              />
            );
          }
        )}

      </ul>



      {/* ================= CHART ================= */}

      <div className="watchlist-chart">

        <h3>Market Distribution</h3>

        <DoughnutChart data={data} />

      </div>

    </div>
  );
};

export default WatchList;





/* ================= WATCHLIST ITEM ================= */

const WatchListItem = ({
  stock,
}) => {

  const [
    showWatchlistActions,
    setShowWatchlistActions,
  ] = useState(false);



  return (

    <li
      className="watchlist-item"
      onMouseEnter={() =>
        setShowWatchlistActions(true)
      }
      onMouseLeave={() =>
        setShowWatchlistActions(false)
      }
    >

      <div className="watchlist-stock">

        <div>

          <h4
            className={
              stock.isDown
                ? "down"
                : "up"
            }
          >
            {stock.name}
          </h4>

          <p className="stock-company">
            NSE
          </p>

        </div>



        <div className="stock-info">

          <span
            className={
              stock.isDown
                ? "down"
                : "up"
            }
          >

            {stock.percent}

          </span>



          {stock.isDown ? (

            <KeyboardArrowDown className="down" />

          ) : (

            <KeyboardArrowUp className="up" />

          )}



          <span className="stock-price">

            ₹{stock.price}

          </span>

        </div>

      </div>



      {showWatchlistActions && (

        <WatchListActions
          uid={stock.name}
        />

      )}

    </li>
  );
};





/* ================= ACTIONS ================= */

const WatchListActions = ({
  uid,
}) => {

  const generalContext =
    useContext(GeneralContext);



  const handleBuyClick = () => {

    generalContext.openBuyWindow(uid);

  };



  const handleSellClick = () => {

    generalContext.openSellWindow(uid);

  };



  return (

    <div className="watchlist-actions">

      {/* ================= BUY ================= */}

      <Tooltip
        title="Buy (B)"
        placement="top"
        arrow
        TransitionComponent={Grow}
      >

        <button
          className="buy-btn"
          onClick={handleBuyClick}
        >

          Buy

        </button>

      </Tooltip>



      {/* ================= SELL ================= */}

      <Tooltip
        title="Sell (S)"
        placement="top"
        arrow
        TransitionComponent={Grow}
      >

        <button
          className="sell-btn"
          onClick={handleSellClick}
        >

          Sell

        </button>

      </Tooltip>



      {/* ================= ANALYTICS ================= */}

      <Tooltip
        title="Analytics"
        placement="top"
        arrow
        TransitionComponent={Grow}
      >

        <button className="icon-btn">

          <BarChartOutlined />

        </button>

      </Tooltip>



      {/* ================= MORE ================= */}

      <Tooltip
        title="More"
        placement="top"
        arrow
        TransitionComponent={Grow}
      >

        <button className="icon-btn">

          <MoreHoriz />

        </button>

      </Tooltip>

    </div>
  );
};