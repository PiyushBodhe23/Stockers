import React from "react";

function Universe() {
  const items = [
    {
      img: "media/images/zerodhaFundhouse.png",
      desc: "Simple and transparent index funds to help you achieve your long-term goals.",
    },
    {
      img: "media/images/sensibullLogo.svg",
      desc: "Create and analyze options strategies with powerful tools and insights.",
    },
    {
      img: "media/images/Tijori.png",
      desc: "Deep research platform for stocks, sectors, and investment insights.",
    },
    {
      img: "media/images/streakLogo.png",
      desc: "Build and backtest trading strategies without coding.",
    },
    {
      img: "media/images/smallcaseLogo.png",
      desc: "Invest in curated baskets of stocks and ETFs with ease.",
    },
    {
      img: "media/images/dittoLogo.png",
      desc: "Get personalized insurance advice with zero spam or mis-selling.",
    },
  ];

  return (
    <section
      className="container-fluid py-5"
      style={{ background: "#020617", color: "#f1f5f9" }}
    >
      <div className="container text-center">

        {/* HEADER */}
        <h2 className="fw-bold mb-3">The Stockers Universe</h2>
        <p style={{ color: "#94a3b8", maxWidth: "600px", margin: "0 auto" }}>
          Extend your investing experience with our ecosystem of powerful partner platforms.
        </p>

        {/* GRID */}
        <div className="row mt-5 g-4">

          {items.map((item, index) => (
            <div className="col-md-4" key={index}>
              <div
                style={{
                  background: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "14px",
                  padding: "25px",
                  height: "100%",
                  transition: "0.3s",
                }}
              >
                <img
                  src={item.img}
                  alt="partner"
                  style={{
                    height: "60px",
                    objectFit: "contain",
                    marginBottom: "15px",
                  }}
                />

                <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}

        </div>

        {/* CTA */}
        <div className="mt-5">
          <button
            style={{
              background: "#3b82f6",
              border: "none",
              padding: "12px 28px",
              borderRadius: "8px",
              color: "#fff",
              fontWeight: "500",
            }}
          >
            Get Started →
          </button>
        </div>

      </div>
    </section>
  );
}

export default Universe;