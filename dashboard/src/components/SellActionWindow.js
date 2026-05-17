import React, { useState } from "react";
import { Link } from "react-router-dom";

import axios from "axios";

import GeneralContext from "./GeneralContext";

import "./SellActionWindow.css";

const SellActionWindow = ({ uid }) => {

  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);

  const handleSellClick = async () => {

    try {

      await axios.post("https://stockersbackend.vercel.app/newOrder", {

        name: uid,
        qty: stockQuantity,
        price: stockPrice,
        mode: "SELL",

      });

      GeneralContext.closeSellWindow();

    } catch (err) {

      console.log(err);

    }
  };



  const handleCancelClick = () => {

    GeneralContext.closeSellWindow();

  };



  return (

    <div className="container" id="sell-window" draggable="true">

      <div className="regular-order">

        <div className="inputs">

          <fieldset>

            <legend>Qty.</legend>

            <input
              type="number"
              name="qty"
              id="qty"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
            />

          </fieldset>



          <fieldset>

            <legend>Price</legend>

            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              value={stockPrice}
              onChange={(e) => setStockPrice(e.target.value)}
            />

          </fieldset>

        </div>

      </div>



      <div className="buttons">

        <span>Margin required ₹140.65</span>

        <div>

          <Link
            className="btn btn-red"
            onClick={handleSellClick}
          >
            Sell
          </Link>

          <Link
            to=""
            className="btn btn-grey"
            onClick={handleCancelClick}
          >
            Cancel
          </Link>

        </div>

      </div>

    </div>
  );
};

export default SellActionWindow;
