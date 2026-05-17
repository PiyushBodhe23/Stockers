import React from "react";

import {
  FaWallet,
  FaChartLine,
  FaArrowUp,
} from "react-icons/fa";

import "./Summary.css";
let user = null;

try {

  const storedUser =
    localStorage.getItem("user");

  if (
    storedUser &&
    storedUser !== "undefined"
  ) {

    user = JSON.parse(storedUser);

  }

} catch (err) {

  console.log(err);

}


const Summary = () => {

  return (

    <div className="summary-page">

      {/* ================= WELCOME ================= */}

      <div className="welcome-card">

        <div className="dashboard-header">

          <div>

            <h2>

              Welcome,
              {" "}
              {user?.username || "User"}

            </h2>

            <p>
              Track your portfolio and trades
            </p>

          </div>

        </div>



        <div className="market-status">

          <span className="live-dot"></span>

          Market Open

        </div>

      </div>



      {/* ================= SUMMARY GRID ================= */}

      <div className="summary-grid">

        {/* ================= EQUITY CARD ================= */}

        <div className="summary-card">

          <div className="card-top">

            <div className="icon-box blue-box">

              <FaWallet />

            </div>

            <p>Equity</p>

          </div>



          <div className="card-main">

            <h2>₹3.74k</h2>

            <span>
              Margin Available
            </span>

          </div>



          <div className="card-bottom">

            <div>

              <p>Margins Used</p>

              <h4>₹0</h4>

            </div>



            <div>

              <p>Opening Balance</p>

              <h4>₹3.74k</h4>

            </div>

          </div>

        </div>



        {/* ================= HOLDINGS CARD ================= */}

        <div className="summary-card">

          <div className="card-top">

            <div className="icon-box green-box">

              <FaChartLine />

            </div>

            <p>Holdings</p>

          </div>



          <div className="card-main">

            <h2 className="profit-text">

              +₹1.55k

              <small>
                +5.20%
              </small>

            </h2>

            <span>
              Total Profit & Loss
            </span>

          </div>



          <div className="card-bottom">

            <div>

              <p>Current Value</p>

              <h4>₹31.43k</h4>

            </div>



            <div>

              <p>Investment</p>

              <h4>₹29.88k</h4>

            </div>

          </div>

        </div>



        {/* ================= PERFORMANCE CARD ================= */}

        <div className="summary-card">

          <div className="card-top">

            <div className="icon-box purple-box">

              <FaArrowUp />

            </div>

            <p>Performance</p>

          </div>



          <div className="performance-data">

            <div className="performance-row">

              <span>Today's Gain</span>

              <strong className="profit-text">
                +₹845
              </strong>

            </div>



            <div className="performance-row">

              <span>Weekly Return</span>

              <strong className="profit-text">
                +8.42%
              </strong>

            </div>



            <div className="performance-row">

              <span>Portfolio Health</span>

              <strong>
                Excellent
              </strong>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Summary;