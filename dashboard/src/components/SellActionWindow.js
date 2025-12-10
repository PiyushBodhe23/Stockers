import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import GeneralContext from "./GeneralContext";

const SellActionWindow = ({ uid }) => {
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(0);
  const { closeWindows } = useContext(GeneralContext);

  const handleSellClick = () => {
    axios.post(
      "https://stockers-backend.vercel.app/orders",
      {
        name: uid,
        qty: Number(qty),
        price: Number(price),
        mode: "SELL",
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
    .then(res => {
      console.log("Sell Order:", res.data);
      closeWindows();
    })
    .catch(err => {
      console.error(err);
      closeWindows();
    });
  };

  return (
    <div className="container" id="sell-window">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty</legend>
            <input
              type="number"
              value={qty}
              onChange={e => setQty(e.target.value)}
            />
          </fieldset>

          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              step="0.05"
              value={price}
              onChange={e => setPrice(e.target.value)}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹140.65</span>
        <div>
          <Link className="btn btn-red" onClick={handleSellClick}>
            Sell
          </Link>
          <Link className="btn btn-grey" onClick={closeWindows}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SellActionWindow;
