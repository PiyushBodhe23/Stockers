import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Menu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const dropdownRef = useRef(null);
  const profileButtonRef = useRef(null);

  // profile dropdown toggle
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/", icon: "📊" },
    { name: "Orders", path: "/orders", icon: "📝" },
    { name: "Holdings", path: "/holdings", icon: "💼" },
    { name: "Positions", path: "/positions", icon: "📈" },
    { name: "Funds", path: "/funds", icon: "💰" },
    { name: "Apps", path: "/apps", icon: "🛠️" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isProfileDropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    // Close dropdown on ESC key
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isProfileDropdownOpen) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isProfileDropdownOpen]);

  // Close dropdown on route change
  useEffect(() => {
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  const toggleProfile = () => {
    setProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const getInitials = () => {
    if (!user) return "U";
    if (user.name && user.name.trim()) {
      const names = user.name.trim().split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[1][0]).toUpperCase();
      }
      return user.name[0].toUpperCase();
    }
    if (user.email) return user.email[0].toUpperCase();
    return "U";
  };

  const getFullName = () => {
    if (!user) return "User";
    if (user.name && user.name.trim()) return user.name;
    if (user.email) return user.email.split('@')[0];
    return "User";
  };

  const handleLogout = async () => {
    // Confirm logout
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (!confirmed) return;

    setIsLoggingOut(true);
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if API fails
      localStorage.removeItem("token");
      navigate("/login");
    } finally {
      setIsLoggingOut(false);
      setProfileDropdownOpen(false);
    }
  };

  const isActivePath = (path) => {
    if (path === "/") return location.pathname === "/";
    // Case-insensitive comparison for paths
    return location.pathname.toLowerCase().startsWith(path.toLowerCase());
  };

  return (
    <div className="menu-container" style={styles.container}>
      <div className="logo-container" style={styles.logoContainer}>
        <img 
          src="/logo.png" 
          style={styles.logo} 
          alt="Trading Platform Logo"
          onClick={() => navigate("/")}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <span style={styles.logoText}>NexusTrade</span>
      </div>

      <div className="menus" style={styles.menusContainer}>
        <ul style={styles.navList}>
          {menuItems.map((item) => (
            <li key={item.path} style={styles.navItem}>
              <Link 
                to={item.path} 
                style={{ textDecoration: "none" }}
                className={isActivePath(item.path) ? "active-link" : ""}
              >
                <p 
                  className={isActivePath(item.path) ? "menu selected" : "menu"}
                  style={isActivePath(item.path) ? styles.activeMenu : styles.menu}
                >
                  <span style={styles.menuIcon}>{item.icon}</span>
                  <span>{item.name}</span>
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <div className="divider" style={styles.divider} />

        {/* USER PROFILE */}
        <div 
          className="profile" 
          onClick={toggleProfile}
          ref={profileButtonRef}
          style={styles.profile}
          role="button"
          aria-haspopup="true"
          aria-expanded={isProfileDropdownOpen}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleProfile();
            }
          }}
        >
          <div className="avatar" style={styles.avatar}>
            {getInitials()}
          </div>
          <div className="profile-info" style={styles.profileInfo}>
            <p className="username" style={styles.username}>
              {getFullName()}
            </p>
            <p className="user-role" style={styles.userRole}>
              {user?.role || "Trader"}
            </p>
          </div>
          <span className="dropdown-arrow" style={{ ...styles.dropdownArrow, transform: isProfileDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            ▼
          </span>
        </div>
      </div>

      {/* PROFILE DROPDOWN */}
      {isProfileDropdownOpen && (
        <div 
          className="profile-dropdown" 
          ref={dropdownRef}
          style={styles.dropdown}
          role="menu"
          aria-label="Profile menu"
        >
          <ul style={styles.dropdownList}>
            {/* User Info Section */}
            <li style={styles.dropdownHeader}>
              <div style={styles.dropdownAvatar}>
                {getInitials()}
              </div>
              <div>
                <p style={styles.dropdownName}>{getFullName()}</p>
                <p style={styles.dropdownEmail}>{user?.email || "user@example.com"}</p>
              </div>
            </li>
            
            <li style={styles.dropdownDivider} />
            
            {/* Profile Link */}
            <li 
              style={styles.dropdownItem}
              onClick={() => {
                setProfileDropdownOpen(false);
                navigate("/profile");
              }}
            >
              <span style={styles.dropdownIcon}>👤</span>
              <span>My Profile</span>
            </li>
            
            {/* Settings Link */}
            <li 
              style={styles.dropdownItem}
              onClick={() => {
                setProfileDropdownOpen(false);
                navigate("/settings");
              }}
            >
              <span style={styles.dropdownIcon}>⚙️</span>
              <span>Settings</span>
            </li>
            
            {/* Support Link */}
            <li 
              style={styles.dropdownItem}
              onClick={() => {
                setProfileDropdownOpen(false);
                navigate("/support");
              }}
            >
              <span style={styles.dropdownIcon}>❓</span>
              <span>Help & Support</span>
            </li>
            
            <li style={styles.dropdownDivider} />
            
            {/* Logout Button */}
            <li 
              style={{ ...styles.dropdownItem, ...styles.dropdownLogout }}
              onClick={handleLogout}
            >
              <span style={styles.dropdownIcon}>🚪</span>
              <span>{isLoggingOut ? "Logging out..." : "Log Out"}</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

// Styles for dark theme
const styles = {
  container: {
    flexBasis: "68%",
    height: "100%",
    padding: "0 24px",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
  },
  logo: {
    width: "36px",
    height: "36px",
    objectFit: "contain",
  },
  logoText: {
    fontSize: "1.2rem",
    fontWeight: "600",
    background: "linear-gradient(135deg, #3b82f6, #00c48c)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "-0.5px",
  },
  menusContainer: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
  },
  navList: {
    display: "flex",
    listStyle: "none",
    gap: "8px",
    margin: 0,
    padding: 0,
  },
  navItem: {
    display: "inline-block",
  },
  menu: {
    fontSize: "0.85rem",
    fontWeight: "500",
    color: "var(--text-muted, #8b9bb0)",
    textDecoration: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    margin: 0,
    cursor: "pointer",
  },
  activeMenu: {
    color: "var(--accent-orange, #f97316)",
    background: "rgba(249, 115, 22, 0.1)",
  },
  menuIcon: {
    fontSize: "1rem",
  },
  divider: {
    width: "1px",
    height: "30px",
    background: "var(--border, #222733)",
    margin: "0 8px",
  },
  profile: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "6px 12px",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.2s",
    position: "relative",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #3b82f6, #00c48c)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "600",
    fontSize: "0.9rem",
  },
  profileInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  username: {
    fontSize: "0.85rem",
    fontWeight: "500",
    color: "var(--text-main, #eef2ff)",
    margin: 0,
  },
  userRole: {
    fontSize: "0.7rem",
    color: "var(--text-muted, #8b9bb0)",
    margin: 0,
  },
  dropdownArrow: {
    fontSize: "0.7rem",
    color: "var(--text-muted, #8b9bb0)",
    transition: "transform 0.2s",
  },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: "24px",
    background: "var(--bg-card, #13171f)",
    border: "1px solid var(--border, #222733)",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
    minWidth: "260px",
    zIndex: 1000,
    animation: "slideDown 0.2s ease-out",
    overflow: "hidden",
  },
  dropdownList: {
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  dropdownHeader: {
    padding: "16px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "var(--bg-elevated, #0f1219)",
  },
  dropdownAvatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #3b82f6, #00c48c)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "600",
    fontSize: "1.2rem",
  },
  dropdownName: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "var(--text-main, #eef2ff)",
    margin: 0,
  },
  dropdownEmail: {
    fontSize: "0.75rem",
    color: "var(--text-muted, #8b9bb0)",
    margin: "4px 0 0 0",
  },
  dropdownDivider: {
    height: "1px",
    background: "var(--border, #222733)",
    margin: "8px 0",
  },
  dropdownItem: {
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
    transition: "background 0.2s",
    fontSize: "0.85rem",
    color: "var(--text-main, #eef2ff)",
  },
  dropdownLogout: {
    color: "var(--red, #ff5a5f)",
  },
  dropdownIcon: {
    fontSize: "1.1rem",
    width: "20px",
  },
};

// Add animation to global CSS (only once)
if (typeof document !== 'undefined' && !document.querySelector('#menu-styles')) {
  const styleSheet = document.createElement("style");
  styleSheet.id = "menu-styles";
  styleSheet.textContent = `
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .profile-dropdown li:hover:not(.dropdown-header) {
      background: var(--bg-hover, #1e2530);
    }
    
    .menu:hover {
      color: var(--accent-orange, #f97316);
      background: rgba(249, 115, 22, 0.05);
    }
    
    .profile:hover {
      background: var(--bg-hover, #1e2530);
    }
    
    .active-link .menu {
      color: var(--accent-orange, #f97316);
      background: rgba(249, 115, 22, 0.1);
    }
  `;
  document.head.appendChild(styleSheet);
}

export default Menu;