import React from "react";

function Team() {
  return (
    <section className="container py-5 team-dark">

      {/* TITLE */}
      <div className="text-center mb-5">
        <h2 className="fw-bold">Built by a Trader, for Traders</h2>
        <p className="team-muted">
          Focused on solving real problems in investing.
        </p>
      </div>

      {/* CARD */}
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="team-card">

            <div className="row align-items-center">

              {/* IMAGE */}
              <div className="col-md-4 text-center mb-4 mb-md-0">
                <img
                  src="media/images/PB.jpg"
                  alt="Piyush"
                  style={{
                    width: "160px",
                    height: "160px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "3px solid #3b82f6"
                  }}
                />

                <h5 className="mt-3">Piyush Bodhe</h5>
                <p className="team-muted small">Founder, Stockers</p>
              </div>

              {/* CONTENT */}
              <div className="col-md-8 team-muted">

                <p>
                  I started Stockers to simplify investing for people like me—students and beginners who find trading platforms complex and overwhelming.
                </p>

                <p>
                  Instead of adding more noise, the focus is on building a clean, intuitive experience that helps users make better decisions.
                </p>

                <p>
                  This project is still evolving, but the goal is clear — make investing simple, accessible, and transparent.
                </p>

                <p>
                  Outside of building Stockers, I enjoy playing volleyball and continuously learning about markets and technology.
                </p>

                <p>
                  Connect:
                  <span className="team-highlight"> Homepage</span> ·{" "}
                  <span className="team-highlight"> Twitter</span>
                </p>

              </div>

            </div>

          </div>
        </div>
      </div>

    </section>
  );
}

export default Team;