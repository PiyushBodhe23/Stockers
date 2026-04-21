import React from "react";

function Stats() {
  return (
    <section className="container py-5 stats-dark">
      <div className="row align-items-center">

        {/* LEFT */}
        <div className="col-md-6 mb-4 mb-md-0">

          <h2 className="fw-bold mb-4">
            Trade with <span className="highlight">Confidence</span>
          </h2>

          <div className="row g-3">

            <div className="col-6">
              <div className="stat-card">
                <h6>⚡ Fast Execution</h6>
                <p className="muted small mb-0">
                  Lightning-fast order placement & execution
                </p>
              </div>
            </div>

            <div className="col-6">
              <div className="stat-card">
                <h6>🔒 Secure Platform</h6>
                <p className="muted small mb-0">
                  Advanced security to protect your investments
                </p>
              </div>
            </div>

            <div className="col-6">
              <div className="stat-card">
                <h6>🚫 No Hidden Fees</h6>
                <p className="muted small mb-0">
                  Transparent pricing at every step
                </p>
              </div>
            </div>

            <div className="col-6">
              <div className="stat-card">
                <h6>📊 Smart Tools</h6>
                <p className="muted small mb-0">
                  Insights and analytics for better decisions
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT */}
        <div className="col-md-6 text-center">
          <img
            src="media/images/ecosystem.png"
            alt="Ecosystem"
            className="img-fluid mb-4"
            style={{
              maxWidth: "85%",
              filter: "drop-shadow(0px 15px 30px rgba(0,0,0,0.6))"
            }}
          />

          <button className="cta-main text-white">
            Start Trading →
          </button>

        </div>

      </div>
    </section>
  );
}

export default Stats;