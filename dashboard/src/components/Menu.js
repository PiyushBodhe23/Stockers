import React, { useState } from "react";

import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  FaChartLine,
  FaClipboardList,
  FaWallet,
  FaBriefcase,
  FaMoneyBillWave,
  FaThLarge,
  FaBell,
  FaSearch,
} from "react-icons/fa";

import "./Menu.css";

const Menu = () => {

  const [isProfileDropdownOpen,
    setIsProfileDropdownOpen] =
    useState(false);

  const location = useLocation();



  // ================= SAFE USER =================

  let user = null;

  try {

    const storedUser =
      localStorage.getItem("user");

    if (
      storedUser &&
      storedUser !== "undefined"
    ) {

      user = JSON.parse(storedUser);

    }

  } catch (err) {

    console.log(err);

  }



  // ================= PROFILE =================

  const handleProfileClick = () => {

    setIsProfileDropdownOpen(
      !isProfileDropdownOpen
    );

  };



  // ================= MENUS =================

  const menus = [

    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaChartLine />,
    },

    {
      name: "Orders",
      path: "/dashboard/orders",
      icon: <FaClipboardList />,
    },

    {
      name: "Holdings",
      path: "/dashboard/holdings",
      icon: <FaWallet />,
    },

    {
      name: "Positions",
      path: "/dashboard/positions",
      icon: <FaBriefcase />,
    },

    {
      name: "Funds",
      path: "/dashboard/funds",
      icon: <FaMoneyBillWave />,
    },

    {
      name: "Apps",
      path: "/dashboard/apps",
      icon: <FaThLarge />,
    },

  ];



  return (

    <nav className="topbar">

      {/* ================= LEFT ================= */}

      <div className="topbar-left">

        <div className="logo-section">

          <img
            src="logo.png"
            alt="logo"
            className="logo"
          />

          <h2>
            Trade<span>X</span>
          </h2>

        </div>



        <div className="search-box">

          <FaSearch className="search-icon" />

          <input
            type="text"
            placeholder="Search stocks, indices..."
          />

        </div>

      </div>



      {/* ================= CENTER ================= */}

      <div className="topbar-center">

        {menus.map((menu, index) => {

          const isActive =
            location.pathname.startsWith(
              menu.path
            );



          return (

            <Link
              key={index}
              to={menu.path}
              className={
                isActive
                  ? "menu-item active-menu"
                  : "menu-item"
              }
            >

              <span className="menu-icon">
                {menu.icon}
              </span>

              <p>{menu.name}</p>

            </Link>

          );
        })}

      </div>



      {/* ================= RIGHT ================= */}

      <div className="topbar-right">

        <div className="notification-icon">

          <FaBell />

          <span className="notification-dot"></span>

        </div>



        {/* ================= PROFILE ================= */}

        <div className="profile-wrapper">

          <div
            className="profile-section"
            onClick={handleProfileClick}
          >

            {/* ================= AVATAR ================= */}

            <div className="avatar">

              {

                user?.username

                  ?.split(" ")

                  .map((word) => word[0])

                  .join("")

                  .toUpperCase()

                  .slice(0, 2)

                || "U"

              }

            </div>



            {/* ================= USER INFO ================= */}

            <div className="profile-info">

              <h4>
                {user?.username || "User"}
              </h4>

              <p>
                Retail Investor
              </p>

            </div>

          </div>



          {/* ================= DROPDOWN ================= */}

          {isProfileDropdownOpen && (

            <div className="profile-dropdown">

               <p className="dropdown-item" style={{ textDecoration: "none" }}>
              <Link
                to="/dashboard/profile"
                className="dropdown-link"
                onClick={() =>
                  setIsProfileDropdownOpen(false)
                }
              >

                My Profile

              </Link>

              </p>

              <p className="dropdown-item">
                Account Settings
              </p>



              <p className="dropdown-item">
                Support
              </p>



              <hr />



              <p

                className="logout"

                onClick={() => {

                  localStorage.removeItem("token");

                  localStorage.removeItem("user");

                  window.location.href =
                    "/login";

                }}

              >

                Logout

              </p>

            </div>

          )}

        </div>

      </div>

    </nav>
  );
};

export default Menu;