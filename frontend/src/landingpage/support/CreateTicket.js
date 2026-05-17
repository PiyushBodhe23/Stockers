import React from "react";

function CreateTicket() {
  const sections = [
    {
      title: "Account Opening",
      items: [
        "Resident individual",
        "Minor",
        "Non Resident Indian (NRI)",
        "Company, Partnership, HUF and LLP",
        "Glossary",
      ],
    },
    {
      title: "Your Stockers Account",
      items: [
        "Your Profile",
        "Account modification",
        "Client Master Report (CMR)",
        "Nomination",
        "Transfer & conversion",
      ],
    },
    {
      title: "Kite",
      items: [
        "IPO",
        "Trading FAQs",
        "Margins & MTF",
        "Charts and orders",
        "Alerts and Nudges",
      ],
    },
    {
      title: "Funds",
      items: [
        "Add money",
        "Add bank accounts",
        "eMandates",
        "Withdraw money",
      ],
    },
    {
      title: "Console",
      items: [
        "Portfolio",
        "Corporate actions",
        "Funds statement",
        "Reports",
        "Profile & Segments",
      ],
    },
    {
      title: "Coin",
      items: [
        "Mutual funds",
        "NPS",
        "Features",
        "Payments & Orders",
        "General",
      ],
    },
  ];

  return (
    <section
      className="container-fluid py-5"
      style={{ background: "#020617", color: "#f1f5f9" }}
    >
      <div className="container">

        {/* HEADER */}
        <div className="text-center mb-5">
          <h2 className="fw-bold">
            Create a Support Ticket
          </h2>
          <p style={{ color: "#94a3b8" }}>
            Choose a topic and get help quickly
          </p>
        </div>

        {/* GRID */}
        <div className="row g-4">

          {sections.map((section, index) => (
            <div className="col-md-4" key={index}>
              <div
                style={{
                  background: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "14px",
                  padding: "20px",
                  height: "100%",
                  transition: "0.3s",
                }}
              >
                <h5 className="mb-3" style={{ color: "#3b82f6" }}>
                  {section.title}
                </h5>

                {section.items.map((item, i) => (
                  <a
                    key={i}
                    href="https://tradexdashboard.vercel.app/login"
                    style={{
                      display: "block",
                      color: "#94a3b8",
                      textDecoration: "none",
                      marginBottom: "8px",
                      transition: "0.2s",
                    }}
                    onMouseOver={(e) =>
                      (e.target.style.color = "#f1f5f9")
                    }
                    onMouseOut={(e) =>
                      (e.target.style.color = "#94a3b8")
                    }
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default CreateTicket;