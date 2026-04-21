import React from "react";

function Hero() {
  return (
    <section
      className="container-fluid py-5"
      style={{
        background: "radial-gradient(circle at top, #1e293b, #020617)",
        color: "#f1f5f9",
      }}
    >
      <div className="container">

        {/* TOP BAR */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="fw-semibold mb-0">Support Portal</h5>

          <a
            href="#"
            style={{
              color: "#3b82f6",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            Track Tickets →
          </a>
        </div>

        {/* MAIN CONTENT */}
        <div className="row align-items-start g-4">

          {/* LEFT SIDE */}
          <div className="col-md-6">

            <h2 className="fw-bold mb-3">
              How can we help you today?
            </h2>

            {/* SEARCH */}
            <div
              style={{
                background: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "10px",
                padding: "10px",
              }}
            >
              <input
                type="text"
                placeholder="Search: e.g. How to activate F&O?"
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#f1f5f9",
                }}
              />
            </div>

            {/* QUICK LINKS */}
            <div className="mt-4 d-flex flex-wrap gap-3">
              {[
                "Track account opening",
                "Segment activation",
                "Intraday margin",
                "Kite user manual",
              ].map((item, index) => (
                <a
                  key={index}
                  href="#"
                  style={{
                    background: "#1e293b",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    color: "#94a3b8",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                  }}
                >
                  {item}
                </a>
              ))}
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="col-md-6">

            <h5 className="fw-semibold mb-3">Featured</h5>

            <div className="d-flex flex-column gap-3">

              <a
                href="#"
                style={{
                  background: "#1e293b",
                  padding: "12px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  color: "#f1f5f9",
                  border: "1px solid #334155",
                }}
              >
                Current Takeovers and Delisting – January 2024
              </a>

              <a
                href="#"
                style={{
                  background: "#1e293b",
                  padding: "12px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  color: "#f1f5f9",
                  border: "1px solid #334155",
                }}
              >
                Latest Intraday leverages – MIS & CO
              </a>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;