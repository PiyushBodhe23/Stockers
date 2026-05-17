import React from "react";

function Education() {
  return (
    <section className="container py-5 dark-section">
      <div className="row align-items-center">

        {/* LEFT IMAGE */}
        <div className="col-md-6 text-center mb-4 mb-md-0">
          <img
            src="media/images/education.png"
            alt="Education"
            className="img-fluid"
            style={{ maxWidth: "75%", filter: "brightness(0.9)" }}
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="col-md-6">

          <h2 className="fw-bold mb-3">
            Learn Before You <span className="highlight">Trade</span>
          </h2>

          <p className="muted mb-4">
            Master the markets with structured learning and real community insights.
          </p>

          {/* CARD 1 - PRIMARY */}
          <div className="dark-card mb-4">
            <h5 className="fw-semibold">📘 Learnexa</h5>
            <p className="muted small">
              Step-by-step guides from basics to advanced strategies.
            </p>
            <a href="https://tradexdashboard.vercel.app/login" className="highlight text-decoration-none fw-medium">
              Start Learning →
            </a>
          </div>

          {/* CARD 2 - SECONDARY */}
          <div className="dark-card">
            <h5 className="fw-semibold">💬 Trading Q&A</h5>
            <p className="muted small">
              Ask questions and learn from experienced traders.
            </p>
            <a href="https://tradexdashboard.vercel.app/login" className="highlight text-decoration-none fw-medium">
              Join Community →
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Education;