import React, { useState, useEffect } from "react";
import axios from "axios";

import { VerticalGraph } from "./VerticalGraph";

import "./Holdings.css";

const Holdings = () => {

  const [allHoldings, setAllHoldings] = useState([]);




  useEffect(() => {

    axios.get("https://stockersbackend.vercel.app/allHoldings")
      .then((res) => {
        setAllHoldings(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

  }, []);




  const labels = allHoldings.map(
    (stock) => stock.name
  );



  const data = {

    labels,

    datasets: [
      {
        label: "Stock Price",

        data: allHoldings.map(
          (stock) => stock.price
        ),

        backgroundColor:
          "rgba(59, 130, 246, 0.7)",

        borderRadius: 8,
      },
    ],
  };



  // ================= SUMMARY =================

  const totalInvestment =
    allHoldings.reduce(
      (acc, stock) =>
        acc + stock.avg * stock.qty,
      0
    );



  const currentValue =
    allHoldings.reduce(
      (acc, stock) =>
        acc + stock.price * stock.qty,
      0
    );



  const totalPnL =
    currentValue - totalInvestment;



  const pnlPercentage =
    (
      (totalPnL / totalInvestment) *
      100
    ).toFixed(2);




  return (

    <div className="holdings-page">

      {/* ================= HEADER ================= */}

      <div className="holdings-header">

        <div>

          <h1>Holdings</h1>

          <p>
            Track all your investments and market performance
          </p>

        </div>



        <div className="holdings-count">

          {allHoldings.length} Holdings

        </div>

      </div>



      {/* ================= SUMMARY CARDS ================= */}

      <div className="summary-grid">

        <div className="summary-card">

          <p>Total Investment</p>

          <h2>
            ₹{totalInvestment.toFixed(2)}
          </h2>

        </div>



        <div className="summary-card">

          <p>Current Value</p>

          <h2>
            ₹{currentValue.toFixed(2)}
          </h2>

        </div>



        <div
          className={`summary-card ${
            totalPnL >= 0
              ? "profit-card"
              : "loss-card"
          }`}
        >

          <p>Total P&L</p>

          <h2>

            {totalPnL >= 0 ? "+" : ""}

            ₹{totalPnL.toFixed(2)}

            <span>
              ({pnlPercentage}%)
            </span>

          </h2>

        </div>

      </div>



      {/* ================= TABLE ================= */}

      <div className="holdings-table-container">

        <table className="holdings-table">

          <thead>

            <tr>

              <th>Instrument</th>
              <th>Qty</th>
              <th>Avg Cost</th>
              <th>LTP</th>
              <th>Current Value</th>
              <th>P&L</th>
              <th>Net Change</th>
              <th>Day Change</th>

            </tr>

          </thead>



          <tbody>

            {allHoldings.map((stock, index) => {

              const curValue =
                stock.price * stock.qty;

              const pnl =
                curValue -
                stock.avg * stock.qty;

              const isProfit = pnl >= 0;

              const profClass =
                isProfit
                  ? "profit"
                  : "loss";

              const dayClass =
                stock.isLoss
                  ? "loss"
                  : "profit";



              return (

                <tr key={index}>

                  <td className="instrument-name">
                    {stock.name}
                  </td>

                  <td>{stock.qty}</td>

                  <td>
                    ₹{stock.avg.toFixed(2)}
                  </td>

                  <td>
                    ₹{stock.price.toFixed(2)}
                  </td>

                  <td>
                    ₹{curValue.toFixed(2)}
                  </td>

                  <td className={profClass}>

                    {isProfit ? "+" : ""}

                    ₹{pnl.toFixed(2)}

                  </td>

                  <td className={profClass}>
                    {stock.net}
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



      {/* ================= GRAPH ================= */}

      <div className="chart-card">

        <h2>Portfolio Analytics</h2>

        <VerticalGraph data={data} />

      </div>

    </div>
  );
};

export default Holdings;
