import React from "react";

function Awards() {
  return (
    <section className="container py-5 dark-section">
      <div className="row align-items-center">

        {/* LEFT IMAGE */}
        <div className="col-md-6 text-center mb-4 mb-md-0">
          <img
            src="media/images/largetBroker.png"
            alt="Largest Broker"
            className="img-fluid"
            style={{ maxWidth: "80%", filter: "brightness(0.9)" }}
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="col-md-6">

          <h2 className="fw-bold mb-3">
            Trusted by <span className="highlight">Millions</span> of Investors
          </h2>

          <p className="muted-text mb-4">
            Over <strong className="highlight">2+ million</strong> investors use our platform,
            contributing to <strong className="highlight">15%</strong> of daily retail trading volume.
          </p>

          {/* FEATURES */}
          <div className="row mb-4 g-3">

            <div className="col-6">
              <div className="dark-card">
                <p className="mb-2">📈 Futures & Options</p>
                <p className="mb-2">🛢 Commodity</p>
                <p className="mb-0">💱 Currency</p>
              </div>
            </div>

            <div className="col-6">
              <div className="dark-card">
                <p className="mb-2">📊 Stocks & IPOs</p>
                <p className="mb-2">💼 Mutual Funds</p>
                <p className="mb-0">🏦 Bonds</p>
              </div>
            </div>

          </div>

          {/* PRESS LOGOS */}
          <div className="mt-3">
            <img
              src="media/images/pressLogos.png"
              alt="Press Coverage"
              className="img-fluid"
              style={{ opacity: 0.7, maxWidth: "85%" }}
            />
          </div>

        </div>
      </div>
    </section>
  );
}

export default Awards;