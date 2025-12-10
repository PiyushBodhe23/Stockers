import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";
import { useAuth } from "../hooks/useAuth";

const BuyActionWindow = ({ uid }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0);
  const { closeBuyWindow } = useContext(GeneralContext);

  const handleBuyClick = () => {
  const token = localStorage.getItem("token");

  axios.post(
  "https://stockers-backend.vercel.app/orders",
  {
    name: uid,
    qty: Number(stockQuantity),
    price: Number(stockPrice),
    mode: "BUY",
  },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
)

  .then((res) => {
    console.log("Order Created:", res.data);
    closeBuyWindow();
  })
  .catch((error) => {
    console.error("Order Failed:", error.response?.data || error.message);
    closeBuyWindow();
  });
};


  return (
    <div className="container" id="buy-window">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
            />
          </fieldset>

          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              step="0.05"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹140.65</span>
        <div>
          <Link className="btn btn-blue" onClick={handleBuyClick}>Buy</Link>
          <Link className="btn btn-grey" onClick={closeBuyWindow}>Cancel</Link>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;
