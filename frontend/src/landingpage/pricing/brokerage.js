import React from "react";

function Brokerage() {
  return (
    <section className="container py-5" style={{ background: "#020617", color: "#f1f5f9" }}>

      {/* HEADER */}
      <div className="text-center mb-5">
        <h2 className="fw-bold">Charges Explained</h2>
        <p style={{ color: "#94a3b8" }}>
          Simple breakdown of all costs involved in trading
        </p>
      </div>

      {/* SUMMARY */}
      <div className="row text-center mb-5">

        <div className="col-md-4">
          <div className="p-4 rounded" style={{ background: "#1e293b" }}>
            <h3 style={{ color: "#3b82f6" }}>₹0</h3>
            <p>Equity Delivery</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="p-4 rounded" style={{ background: "#1e293b" }}>
            <h3>₹20</h3>
            <p>Intraday & F&O</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="p-4 rounded" style={{ background: "#1e293b" }}>
            <h3>Govt</h3>
            <p>Taxes & Charges</p>
          </div>
        </div>

      </div>

      {/* DETAILS */}
      <div className="row">

        {/* LEFT */}
        <div className="col-md-6">

          <h5 className="mb-3">Trading Charges</h5>
          <p style={{ color: "#94a3b8" }}>
            ₹20 per trade for intraday & F&O. ₹0 for delivery.
          </p>

          <h5 className="mt-4 mb-3">Government Charges</h5>
          <p style={{ color: "#94a3b8" }}>
            Includes STT, GST, SEBI charges applied as per regulations.
          </p>

        </div>

        {/* RIGHT */}
        <div className="col-md-6">

          <h5 className="mb-3">Account Charges</h5>
          <p style={{ color: "#94a3b8" }}>
            AMC, DP charges, and pledging charges may apply.
          </p>

          <h5 className="mt-4 mb-3">Other Charges</h5>
          <p style={{ color: "#94a3b8" }}>
            Call & trade, payment gateway, and delayed payment charges.
          </p>

        </div>

      </div>

      {/* DISCLAIMER */}
      <div className="mt-5" style={{ color: "#64748b", fontSize: "0.9rem" }}>
        <p>
          Investments are subject to market risks. All charges are applied as per regulations.
        </p>
      </div>

    </section>
  );
}

export default Brokerage;