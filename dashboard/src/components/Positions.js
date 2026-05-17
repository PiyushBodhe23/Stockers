import React, { useEffect, useState } from "react";
import axios from "axios";

import "./Positions.css";

const Positions = () => {

  const [positions, setPositions] = useState([]);

  useEffect(() => {

    axios.get("https://stockersbackend.vercel.app/allPositions")
      .then((res) => {
        setPositions(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

  }, []);




  return (

    <div className="positions-page">

      {/* ================= HEADER ================= */}

      <div className="positions-header">

        <div>

          <h1>Positions</h1>

          <p>
            Monitor your active market positions and live profit/loss
          </p>

        </div>



        <div className="position-count">

          {positions.length} Active

        </div>

      </div>



      {/* ================= SUMMARY CARDS ================= */}

      <div className="summary-grid">

        <div className="summary-card">

          <p>Total Investment</p>

          <h2>₹2,45,000</h2>

        </div>



        <div className="summary-card">

          <p>Current Value</p>

          <h2>₹2,67,450</h2>

        </div>



        <div className="summary-card profit-card">

          <p>Total P&L</p>

          <h2>+₹22,450</h2>

        </div>

      </div>



      {/* ================= TABLE ================= */}

      <div className="positions-table-container">

        <table className="positions-table">

          <thead>

            <tr>

              <th>Product</th>
              <th>Instrument</th>
              <th>Qty</th>
              <th>Avg</th>
              <th>LTP</th>
              <th>P&L</th>
              <th>Change</th>

            </tr>

          </thead>



          <tbody>

            {positions.map((stock, index) => {

              const curValue = stock.price * stock.qty;

              const pnl =
                curValue - stock.avg * stock.qty;

              const isProfit = pnl >= 0;

              const profClass =
                isProfit ? "profit" : "loss";

              const dayClass =
                stock.isLoss ? "loss" : "profit";



              return (

                <tr key={index}>

                  <td>

                    <span className="product-badge">
                      {stock.product}
                    </span>

                  </td>



                  <td className="instrument-name">
                    {stock.name}
                  </td>



                  <td>{stock.qty}</td>

                  <td>₹{stock.avg.toFixed(2)}</td>

                  <td>₹{stock.price.toFixed(2)}</td>



                  <td className={profClass}>

                    {isProfit ? "+" : ""}
                    ₹{pnl.toFixed(2)}

                  </td>



                  <td className={dayClass}>

                    {stock.day}

                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Positions;
