import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Menu = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  // profile dropdown toggle
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Orders", path: "/orders" },
    { name: "Holdings", path: "/holdings" },
    { name: "Positions", path: "/positions" },
    { name: "Funds", path: "/funds" },
    { name: "Apps", path: "/apps" },
  ];

  const toggleProfile = () => {
    setProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const getInitials = () => {
    if (!user) return "U";
    if (user.name) return user.name[0].toUpperCase();
    return user.email[0].toUpperCase();
  };

  return (
    <div className="menu-container">
      <img src="/logo.png" style={{ width: "50px" }} alt="logo" />

      <div className="menus">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path} style={{ textDecoration: "none" }}>
                <p className={location.pathname === item.path ? "menu selected" : "menu"}>
                  {item.name}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <hr />

        {/* USER PROFILE */}
        <div className="profile" onClick={toggleProfile}>
          <div className="avatar">{getInitials()}</div>
          <p className="username">{user?.name}</p>
        </div>
      </div>

      {/* PROFILE DROPDOWN */}
      {isProfileDropdownOpen && (
        <div className="profile-dropdown">
          <ul>
            <li onClick={logout}><button>Log Out</button></li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Menu;
