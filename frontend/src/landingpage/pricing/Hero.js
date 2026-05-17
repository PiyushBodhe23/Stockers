import React from "react";

function Hero() {
  return (
    <section className="container py-5 pricing-hero-dark">

      {/* HEADER */}
      <div className="text-center mb-5">
        <h1 className="fw-bold display-6">
          Simple Pricing. <span className="pricing-highlight">No Hidden Costs.</span>
        </h1>

        <p className="pricing-muted">
          Transparent charges designed to keep more money in your pocket.
        </p>
      </div>

      {/* CARDS */}
      <div className="row text-center g-4">

        {/* CARD 1 - PRIMARY */}
        <div className="col-md-4">
          <div className="pricing-card">

            <img src="media/images/pricingEquity.svg" alt="" className="mb-3" />

            <h4 className="pricing-highlight">₹0</h4>

            <h5>Free equity delivery</h5>

            <p className="pricing-muted">
              Invest in stocks with zero brokerage charges.
            </p>

          </div>
        </div>

        {/* CARD 2 */}
        <div className="col-md-4">
          <div className="pricing-card">

            <img src="media/images/intradayTrades.svg" alt="" className="mb-3" />

            <h4>₹20</h4>

            <h5>Intraday & F&O</h5>

            <p className="pricing-muted">
              Flat fee per trade — no matter the size.
            </p>

          </div>
        </div>

        {/* CARD 3 */}
        <div className="col-md-4">
          <div className="pricing-card">

            <img src="media/images/pricingEquity.svg" alt="" className="mb-3" />

            <h4 className="pricing-highlight">₹0</h4>

            <h5>Direct Mutual Funds</h5>

            <p className="pricing-muted">
              Invest in mutual funds with zero commission.
            </p>

          </div>
        </div>

      </div>

      {/* CTA */}
      <div className="text-center">
        <button className="pricing-cta text-white">
          Start Investing →
        </button>
      </div>

    </section>
  );
}

export default Hero;