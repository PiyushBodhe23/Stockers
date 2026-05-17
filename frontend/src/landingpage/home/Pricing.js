import React from "react";

function Pricing() {
  return (
    <section className="container py-5 pricing-dark">
      <div className="row align-items-center">

        {/* LEFT CONTENT */}
        <div className="col-md-5 mb-4 mb-md-0">
          <h2 className="fw-bold mb-3">
            Simple Pricing. <span className="price-highlight">No Surprises.</span>
          </h2>

          <p className="muted mb-4">
            Transparent fees that help you focus on trading—not worrying about costs.
          </p>

          <a href="https://tradexdashboard.vercel.app/login" className="price-highlight text-decoration-none fw-medium">
            Compare with others →
          </a>
        </div>

        {/* RIGHT CARDS */}
        <div className="col-md-7">
          <div className="row g-3 text-center">

            {/* ₹0 CARD (PRIMARY) */}
            <div className="col-md-6">
              <div className="pricing-card h-100">

                <h1 className="fw-bold display-5 price-highlight">₹0</h1>

                <p className="muted">
                  Invest in equities and mutual funds without paying brokerage.
                </p>

                <small className="text-success">
                  ✔ No hidden charges
                </small>

                <button className="cta-btn text-white w-100">
                  Start Free
                </button>

              </div>
            </div>

            {/* ₹20 CARD */}
            <div className="col-md-6">
              <div className="pricing-card h-100">

                <h1 className="fw-bold display-5">₹20</h1>

                <p className="muted">
                  Flat fee per trade for intraday & F&O — no matter the volume.
                </p>

                <small className="text-success">
                  ✔ Max per order
                </small>

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default Pricing;