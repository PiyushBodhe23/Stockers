import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark-custom sticky-top">
      <div className="container">

        {/* LOGO */}
        <Link className="navbar-brand" to="/">
          <img
            src="media/images/logo.png"
            alt="logo"
            style={{ width: "120px" }}
          />
        </Link>

        {/* TOGGLER */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* NAV ITEMS */}
        <div className="collapse navbar-collapse justify-content-end" id="nav">
          <ul className="navbar-nav align-items-center">

            <li className="nav-item">
              <Link className="nav-link nav-link-custom" to="/">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link nav-link-custom" to="/about">
                About
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link nav-link-custom" to="/product">
                Product
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link nav-link-custom" to="/pricing">
                Pricing
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link nav-link-custom" to="/support">
                Support
              </Link>
            </li>

            {/* LOGIN */}
            <li className="nav-item">
              <a
                className="nav-link nav-link-custom"
                href="https://zite-stockers-dashboard.vercel.app/login"
              >
                Login
              </a>
            </li>

            {/* CTA */}
            <li className="nav-item ms-3">
              <a href="https://zite-stockers-dashboard.vercel.app/login/register">
                <button className="nav-cta">
                  Open Account
                </button>
              </a>
            </li>

          </ul>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;