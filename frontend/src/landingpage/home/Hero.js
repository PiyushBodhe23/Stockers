import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="container-fluid hero-dark">
      <div className="container py-5">
        <div className="row align-items-center">

          {/* LEFT CONTENT */}
          <div className="col-md-6 text-center text-md-start">

            <h1 className="fw-bold display-4 mb-4">
              Trade Smarter. <br />
              <span className="hero-highlight">Grow Faster.</span>
            </h1>

            <p className="hero-muted fs-5 mb-4">
              All your investments — stocks, F&O, mutual funds — in one
              powerful and intuitive platform.
            </p>

            <Link to="https://tradexdashboard.vercel.app/login">
              <button className="hero-btn">
                Start Investing →
              </button>
            </Link>

            {/* TRUST SIGNALS */}
            <div className="mt-4 d-flex gap-4 justify-content-center justify-content-md-start">

              <div>
                <strong>₹0</strong>
                <p className="hero-muted small mb-0">Account Opening</p>
              </div>

              <div>
                <strong>₹20</strong>
                <p className="hero-muted small mb-0">Per Trade</p>
              </div>

              <div>
                <strong>Fast</strong>
                <p className="hero-muted small mb-0">Execution</p>
              </div>

            </div>

          </div>

          {/* RIGHT IMAGE */}
          <div className="col-md-6 text-center mt-5 mt-md-0">
            <img
              src="media/images/homeHero.png"
              alt="Trading Dashboard"
              className="img-fluid"
              style={{
                maxWidth: "95%",
                filter: "drop-shadow(0px 20px 40px rgba(0,0,0,0.6))"
              }}
            />
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;