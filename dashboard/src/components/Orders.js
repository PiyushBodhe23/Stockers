import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

const Orders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("https://stockers-backend.vercel.app/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAllOrders(res.data);
      })
      .catch((err) => console.log(err));

  }, []); // 🔥 important

  return (
    <>
      <h3 className="title">Orders ({allOrders.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Qty.</th>
              <th>Price</th>
              <th>Mode</th>
            </tr>
          </thead>

          <tbody>
            {allOrders.map((stock, index) => (
              <tr key={index}>
                <td>{stock.name}</td>
                <td>{stock.qty}</td>
                <td>{Number(stock.price)?.toFixed(2)}</td>
                <td>{stock.mode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Orders;
