import React from "react";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaWallet,
  FaChartLine,
  FaShieldAlt,
  FaCog,
} from "react-icons/fa";

import "./Profile.css";

const Profile = () => {

  return (

    <div className="profile-page">

      {/* ================= HEADER ================= */}

      <div className="profile-header">

        <div className="profile-left">

          <div className="profile-avatar">
            PU
          </div>



          <div>

            <h1>Piyush User</h1>

            <p>
              Retail Investor • Premium Member
            </p>

          </div>

        </div>



        <button className="edit-btn">
          Edit Profile
        </button>

      </div>



      {/* ================= GRID ================= */}

      <div className="profile-grid">

        {/* ================= ACCOUNT INFO ================= */}

        <div className="profile-card">

          <h2>
            Account Information
          </h2>



          <div className="info-row">

            <FaUser className="info-icon" />

            <div>

              <p>Full Name</p>

              <h4>Piyush User</h4>

            </div>

          </div>



          <div className="info-row">

            <FaEnvelope className="info-icon" />

            <div>

              <p>Email</p>

              <h4>
                piyush@gmail.com
              </h4>

            </div>

          </div>



          <div className="info-row">

            <FaPhone className="info-icon" />

            <div>

              <p>Phone</p>

              <h4>
                +91 9876543210
              </h4>

            </div>

          </div>



          <div className="info-row">

            <FaMapMarkerAlt className="info-icon" />

            <div>

              <p>Location</p>

              <h4>
                Pune, Maharashtra
              </h4>

            </div>

          </div>

        </div>



        {/* ================= PORTFOLIO ================= */}

        <div className="profile-card">

          <h2>
            Portfolio Overview
          </h2>



          <div className="stats-grid">

            <div className="stat-box">

              <FaWallet className="stat-icon blue" />

              <h3>₹4.2L</h3>

              <p>Total Investment</p>

            </div>



            <div className="stat-box">

              <FaChartLine className="stat-icon green" />

              <h3>+12.8%</h3>

              <p>Total Return</p>

            </div>



            <div className="stat-box">

              <FaShieldAlt className="stat-icon purple" />

              <h3>Low</h3>

              <p>Risk Level</p>

            </div>



            <div className="stat-box">

              <FaCog className="stat-icon orange" />

              <h3>Pro</h3>

              <p>Account Type</p>

            </div>

          </div>

        </div>



        {/* ================= ACTIVITY ================= */}

        <div className="profile-card activity-card">

          <h2>
            Recent Activity
          </h2>



          <div className="activity-item">

            <div className="activity-dot green-bg"></div>

            <div>

              <h4>
                Bought INFY Shares
              </h4>

              <p>
                Today • 10:24 AM
              </p>

            </div>

          </div>



          <div className="activity-item">

            <div className="activity-dot red-bg"></div>

            <div>

              <h4>
                Sold TCS Shares
              </h4>

              <p>
                Yesterday • 2:10 PM
              </p>

            </div>

          </div>



          <div className="activity-item">

            <div className="activity-dot blue-bg"></div>

            <div>

              <h4>
                Added ₹10,000 Funds
              </h4>

              <p>
                2 Days Ago
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Profile;