import React from "react";

function Footer() {
  return (
    <footer className="footer-dark py-5">
      <div className="container">

        <div className="row">

          {/* LOGO */}
          <div className="col-md-3 mb-4">
            <img
              src="media/images/logo.png"
              alt="Logo"
              className="footer-logo mb-3"
              style={{ width: "120px" }}
            />
            <p className="footer-muted">
              © 2025 Stockers Broking Ltd. <br />
              All rights reserved.
            </p>
          </div>

          {/* ACCOUNT */}
          <div className="col-md-2 mb-4">
            <p className="footer-title">Account</p>
            <a href="https://zite-stockers-dashboard.vercel.app/login" className="footer-link">Open demat account</a>
            <a href="https://zite-stockers-dashboard.vercel.app/login" className="footer-link">Minor account</a>
            <a href="https://zite-stockers-dashboard.vercel.app/login" className="footer-link">NRI account</a>
            <a href="https://zite-stockers-dashboard.vercel.app/login" className="footer-link">Fund transfer</a>
          </div>

          {/* SUPPORT */}
          <div className="col-md-2 mb-4">
            <p className="footer-title">Support</p>
            <a href="https://zite-stockers-dashboard.vercel.app/login" className="footer-link">Contact</a>
            <a href="https://zite-stockers-dashboard.vercel.app/login" className="footer-link">Help center</a>
            <a href="https://zite-stockers-dashboard.vercel.app/login" className="footer-link">Downloads</a>
            <a href="https://zite-stockers-dashboard.vercel.app/login" className="footer-link">Blog</a>
          </div>

          {/* COMPANY */}
          <div className="col-md-2 mb-4">
            <p className="footer-title">Company</p>
            <a href="https://zite-stockers-dashboard.vercel.app/login" className="footer-link">About</a>
            <a href="https://zite-stockers-dashboard.vercel.app/login" className="footer-link">Careers</a>
            <a href="https://zite-stockers-dashboard.vercel.app/login" className="footer-link">Press</a>
          </div>

          {/* QUICK LINKS */}
          <div className="col-md-3 mb-4">
            <p className="footer-title">Quick Links</p>
            <a href="https://zite-stockers-dashboard.vercel.app/login" className="footer-link">IPO</a>
            <a href="https://zite-stockers-dashboard.vercel.app/login" className="footer-link">Charges</a>
            <a href="https://zite-stockers-dashboard.vercel.app/login" className="footer-link">Markets</a>
            <a href="https://zite-stockers-dashboard.vercel.app/login" className="footer-link">Calculators</a>
          </div>

        </div>

        {/* DIVIDER */}
        <hr style={{ borderColor: "#1e293b" }} />

        {/* LEGAL TEXT (CLEANED) */}
        <div className="footer-muted">
          <p>
            Investments in securities market are subject to market risks. Read all related documents carefully before investing.
          </p>
          <p>
            Prevent unauthorised transactions by updating your contact details and monitoring your account regularly.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;