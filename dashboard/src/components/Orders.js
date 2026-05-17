import React, { useEffect, useState } from "react";
import axios from "axios";

import "./Orders.css";

const Orders = () => {

  const [allOrders, setAllOrders] = useState([]);




  useEffect(() => {

    axios.get("https://stockersbackend.vercel.app/allOrders")
      .then((res) => {
        setAllOrders(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

  }, []);




  // ================= SUMMARY =================

  const totalBuyOrders =
    allOrders.filter(
      (order) => order.mode === "BUY"
    ).length;



  const totalSellOrders =
    allOrders.filter(
      (order) => order.mode === "SELL"
    ).length;



  const totalTurnover =
    allOrders.reduce(
      (acc, order) =>
        acc + order.price * order.qty,
      0
    );




  return (

    <div className="orders-page">

      {/* ================= HEADER ================= */}

      <div className="orders-header">

        <div>

          <h1>Orders</h1>

          <p>
            View and manage all your executed market orders
          </p>

        </div>



        <div className="orders-count">

          {allOrders.length} Orders

        </div>

      </div>



      {/* ================= SUMMARY CARDS ================= */}

      <div className="orders-summary-grid">

        <div className="summary-card">

          <p>Total Orders</p>

          <h2>{allOrders.length}</h2>

        </div>



        <div className="summary-card buy-card">

          <p>Buy Orders</p>

          <h2>{totalBuyOrders}</h2>

        </div>



        <div className="summary-card sell-card">

          <p>Sell Orders</p>

          <h2>{totalSellOrders}</h2>

        </div>



        <div className="summary-card">

          <p>Total Turnover</p>

          <h2>
            ₹{totalTurnover.toFixed(2)}
          </h2>

        </div>

      </div>



      {/* ================= TABLE ================= */}

      <div className="orders-table-container">

        <table className="orders-table">

          <thead>

            <tr>

              <th>Instrument</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total Value</th>
              <th>Mode</th>
              <th>Status</th>

            </tr>

          </thead>



          <tbody>

            {allOrders.map((order, index) => {

              const totalValue =
                order.price * order.qty;

              const modeClass =
                order.mode === "BUY"
                  ? "profit"
                  : "loss";



              return (

                <tr key={index}>

                  <td className="instrument-name">
                    {order.name}
                  </td>



                  <td>
                    {order.qty}
                  </td>



                  <td>
                    ₹{Number(order.price).toFixed(2)}
                  </td>



                  <td>
                    ₹{totalValue.toFixed(2)}
                  </td>



                  <td className={modeClass}>

                    {order.mode}

                  </td>



                  <td>

                    <span className="status-badge">
                      Executed
                    </span>

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

export default Orders;
