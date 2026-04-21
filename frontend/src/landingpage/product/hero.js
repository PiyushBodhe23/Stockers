import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section
      className="container-fluid border-bottom"
      style={{
        background: "radial-gradient(circle at top, #1e293b, #020617)",
        color: "#f1f5f9",
      }}
    >
      <div className="container py-5 text-center">

        <h1 className="fw-bold display-5 mb-3">
          Powerful Tools for{" "}
          <span style={{ color: "#3b82f6" }}>Smarter Investing</span>
        </h1>

        <p
          className="mt-3 mb-4"
          style={{ color: "#94a3b8", fontSize: "1.1rem" }}
        >
          Analyze markets, execute trades, and manage your portfolio — all in one place.
        </p>

        {/* CTA */}
        <Link to="/product">
          <button
            style={{
              background: "#3b82f6",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              color: "#fff",
              fontWeight: "500",
              transition: "0.3s",
            }}
          >
            Explore Products →
          </button>
        </Link>

        {/* TRUST STRIP */}
        <div className="d-flex justify-content-center gap-4 mt-4 flex-wrap">

          <div>
            <strong>₹0</strong>
            <p style={{ color: "#94a3b8", margin: 0, fontSize: "0.85rem" }}>
              Delivery
            </p>
          </div>

          <div>
            <strong>₹20</strong>
            <p style={{ color: "#94a3b8", margin: 0, fontSize: "0.85rem" }}>
              Per Trade
            </p>
          </div>

          <div>
            <strong>Fast</strong>
            <p style={{ color: "#94a3b8", margin: 0, fontSize: "0.85rem" }}>
              Execution
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;