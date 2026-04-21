import React from "react";

function Hero() {
  return (
    <section className="container py-5 about-dark">

      {/* TOP STATEMENT */}
      <div className="text-center mb-5">
        <h1 className="fw-bold display-6">
          Building a <span className="about-highlight">simpler</span> way to invest.
        </h1>

        <p className="about-muted mt-3">
          We’re focused on making investing accessible, transparent, and efficient for everyone.
        </p>
      </div>

      {/* CONTENT */}
      <div className="row border-top pt-5 about-muted" style={{ lineHeight: "1.8" }}>

        {/* LEFT */}
        <div className="col-md-6 mb-4">
          <p>
            Stockers was created with a simple goal — remove complexity from investing and give users a clean, intuitive platform.
          </p>

          <p>
            We focus on building technology that helps users make better financial decisions without distractions or hidden costs.
          </p>

          <p>
            Our platform combines powerful tools with a minimal experience so you can focus on what matters — your investments.
          </p>
        </div>

        {/* RIGHT */}
        <div className="col-md-6">
          <p>
            Beyond trading, we aim to build an ecosystem that supports learning, growth, and long-term investing.
          </p>

          <p>
            From educational platforms like <span className="about-highlight">Learnexa</span> to smart tools and analytics, we are constantly evolving.
          </p>

          <p>
            This is just the beginning — we’re building something bigger every day.
          </p>
        </div>

      </div>

    </section>
  );
}

export default Hero;