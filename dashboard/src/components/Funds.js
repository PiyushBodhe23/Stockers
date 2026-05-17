import React from "react";
import "./Funds.css";

const Funds = () => {

  return (

    <div className="funds-page">

      {/* ================= TOP BAR ================= */}

      <div className="funds-topbar">

        <div>

          <h1>Funds</h1>

          <p>
            Manage your trading balance and margins instantly
          </p>

        </div>



        <div className="fund-buttons">

          <button className="btn btn-green">
            Add Funds
          </button>

          <button className="btn btn-blue">
            Withdraw
          </button>

        </div>

      </div>



      {/* ================= MAIN GRID ================= */}

      <div className="funds-grid">

        {/* ================= EQUITY CARD ================= */}

        <div className="fund-card">

          <div className="card-header">

            <h2>Equity</h2>

            <span className="live-dot">
              ● Active
            </span>

          </div>



          <div className="highlight-box">

            <div>

              <p>Available Margin</p>

              <h1>₹4,043.10</h1>

            </div>

          </div>



          <div className="fund-table">

            <div className="fund-row">
              <p>Used Margin</p>
              <span>₹3,757.30</span>
            </div>

            <div className="fund-row">
              <p>Available Cash</p>
              <span>₹4,043.10</span>
            </div>

            <div className="fund-row">
              <p>Opening Balance</p>
              <span>₹4,043.10</span>
            </div>

            <div className="fund-row">
              <p>Payin</p>
              <span>₹4,064.00</span>
            </div>

            <div className="fund-row">
              <p>SPAN</p>
              <span>₹0.00</span>
            </div>

            <div className="fund-row">
              <p>Delivery Margin</p>
              <span>₹0.00</span>
            </div>

            <div className="fund-row">
              <p>Exposure</p>
              <span>₹0.00</span>
            </div>

            <div className="fund-row">
              <p>Options Premium</p>
              <span>₹0.00</span>
            </div>

            <div className="fund-row">
              <p>Collateral (Liquid Funds)</p>
              <span>₹0.00</span>
            </div>

            <div className="fund-row">
              <p>Collateral (Equity)</p>
              <span>₹0.00</span>
            </div>

            <div className="fund-row total-row">
              <p>Total Collateral</p>
              <span>₹0.00</span>
            </div>

          </div>

        </div>



        {/* ================= COMMODITY CARD ================= */}

        <div className="fund-card commodity-card">

          <div className="commodity-icon">
            📦
          </div>

          <h2>No Commodity Account</h2>

          <p>
            Open a commodity account to start trading in commodities futures and derivatives.
          </p>

          <button className="btn btn-blue">
            Open Account
          </button>

        </div>

      </div>

    </div>
  );
};

export default Funds;