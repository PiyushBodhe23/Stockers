// Add React import at the top - THIS IS CRITICAL!
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Loading spinner component
const LoadingSpinner = () => (
  <div style={styles.loadingContainer}>
    <div style={styles.spinner}></div>
    <p style={styles.loadingText}>Authenticating...</p>
  </div>
);

export const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Wait until auth is resolved
  if (loading) {
    return <LoadingSpinner />;
  }

  // Not logged in
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Role-based access control
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return (
      <div style={styles.unauthorizedContainer}>
        <div style={styles.unauthorizedIcon}>🔒</div>
        <h2 style={styles.unauthorizedTitle}>Access Denied</h2>
        <p style={styles.unauthorizedMessage}>
          You don't have permission to access this page.
        </p>
        <button onClick={() => window.location.href = '/'} style={styles.goHomeButton}>
          Go to Dashboard
        </button>
      </div>
    );
  }

  // Authorized
  return children;
};

const styles = {
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "var(--bg-main, #0a0c10)",
  },
  spinner: {
    width: "48px",
    height: "48px",
    border: "3px solid var(--border, #222733)",
    borderTopColor: "var(--blue, #3b82f6)",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: {
    marginTop: "16px",
    color: "var(--text-muted, #8b9bb0)",
    fontSize: "0.9rem",
  },
  unauthorizedContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "var(--bg-main, #0a0c10)",
    color: "var(--text-main, #eef2ff)",
    textAlign: "center",
    padding: "20px",
  },
  unauthorizedIcon: {
    fontSize: "64px",
    marginBottom: "24px",
  },
  unauthorizedTitle: {
    fontSize: "1.8rem",
    marginBottom: "16px",
    color: "var(--text-main, #eef2ff)",
  },
  unauthorizedMessage: {
    fontSize: "1rem",
    color: "var(--text-muted, #8b9bb0)",
    marginBottom: "32px",
    maxWidth: "400px",
  },
  goHomeButton: {
    background: "var(--blue, #3b82f6)",
    color: "white",
    border: "none",
    padding: "12px 28px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "all 0.2s",
  },
};

// Add animation to global styles (only once)
if (typeof document !== 'undefined' && !document.querySelector('#protected-route-styles')) {
  const styleSheet = document.createElement("style");
  styleSheet.id = "protected-route-styles";
  styleSheet.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .go-home-button:hover {
      transform: translateY(-2px);
      background: #609cff;
    }
    
    .go-home-button:active {
      transform: translateY(0);
    }
  `;
  document.head.appendChild(styleSheet);
}

export default ProtectedRoute;