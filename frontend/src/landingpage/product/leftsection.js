import React from "react";

function LeftSection({
  imageURL,
  productName,
  productDescription,
  tryDemo,
  learnMore,
  googlePlay,
  appStore,
}) {
  return (
    <section
      className="container-fluid py-5"
      style={{ background: "#020617", color: "#f1f5f9" }}
    >
      <div className="container">
        <div className="row align-items-center">

          {/* IMAGE */}
          <div className="col-md-6 text-center mb-4 mb-md-0">
            <img
              src={imageURL}
              alt={productName}
              className="img-fluid"
              style={{
                maxWidth: "85%",
                filter: "drop-shadow(0px 20px 40px rgba(0,0,0,0.6))",
              }}
            />
          </div>

          {/* CONTENT */}
          <div className="col-md-6">

            <h2 className="fw-bold mb-3">{productName}</h2>

            <p style={{ color: "#94a3b8", fontSize: "1.05rem" }}>
              {productDescription}
            </p>

            {/* ACTION LINKS */}
            <div className="d-flex gap-4 mt-3 flex-wrap">

              <a
                href={tryDemo}
                style={{
                  color: "#3b82f6",
                  textDecoration: "none",
                  fontWeight: "500",
                }}
              >
                Try Demo →
              </a>

              <a
                href={learnMore}
                style={{
                  color: "#94a3b8",
                  textDecoration: "none",
                  fontWeight: "500",
                }}
              >
                Learn More →
              </a>

            </div>

            {/* APP BADGES */}
            <div className="mt-4 d-flex gap-3 flex-wrap">

              <a href={googlePlay}>
                <img
                  src="media/images/googlePlayBadge.svg"
                  alt="Google Play"
                  style={{ height: "45px" }}
                />
              </a>

              <a href={appStore}>
                <img
                  src="media/images/appstoreBadge.svg"
                  alt="App Store"
                  style={{ height: "45px" }}
                />
              </a>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default LeftSection;