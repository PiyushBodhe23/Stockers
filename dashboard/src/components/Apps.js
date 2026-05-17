import React from "react";

import "./Apps.css";

const Apps = () => {

  const appsData = [

    {
      name: "Dashboard",
      description: "Track portfolio performance and investments.",
      icon: "📊",
    },

    {
      name: "Watchlist",
      description: "Monitor your favorite stocks in real time.",
      icon: "⭐",
    },

    {
      name: "Orders",
      description: "View all buy and sell orders instantly.",
      icon: "📝",
    },

    {
      name: "Portfolio",
      description: "Analyze holdings, positions and profits.",
      icon: "💼",
    },

    {
      name: "Analytics",
      description: "Visualize stock trends and market movement.",
      icon: "📈",
    },

    {
      name: "Funds",
      description: "Manage balance and transactions securely.",
      icon: "💰",
    },

  ];



  return (

    <div className="apps-container">

      <div className="apps-header">

        <h1>Apps</h1>

        <p>
          Access all trading tools and services from one place.
        </p>

      </div>



      <div className="apps-grid">

        {appsData.map((app, index) => {

          return (

            <div className="app-card" key={index}>

              <div className="app-icon">
                {app.icon}
              </div>

              <h3>{app.name}</h3>

              <p>{app.description}</p>

              <button className="open-btn">
                Open
              </button>

            </div>
          );
        })}

      </div>

    </div>
  );
};

export default Apps;