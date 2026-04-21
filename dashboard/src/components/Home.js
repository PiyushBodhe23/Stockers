import React, { Suspense, lazy, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

// Lazy load components for better performance
const TopBar = lazy(() => import("./TopBar"));
const Dashboard = lazy(() => import("./Dashboard"));

// Loading component with professional spinner
const LoadingFallback = () => (
  <div style={styles.loadingContainer}>
    <div style={styles.spinner}></div>
    <p style={styles.loadingText}>Loading your trading platform...</p>
    <p style={styles.loadingSubtext}>Please wait while we prepare your dashboard</p>
  </div>
);

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Home Component Error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>⚠️</div>
          <h2 style={styles.errorTitle}>Something went wrong</h2>
          <p style={styles.errorMessage}>
            {this.state.error?.message || "Failed to load the dashboard"}
          </p>
          <div style={styles.errorActions}>
            <button onClick={this.handleRetry} style={styles.retryButton}>
              Refresh Page
            </button>
            <button onClick={() => window.location.href = "/"} style={styles.homeButton}>
              Go to Home
            </button>
          </div>
          {process.env.NODE_ENV === "development" && this.state.errorInfo && (
            <details style={styles.errorDetails}>
              <summary style={styles.errorSummary}>Error Details</summary>
              <pre style={styles.errorPre}>{this.state.errorInfo.componentStack}</pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

const Home = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  // Set page title and meta tags
  useEffect(() => {
    document.title = "Trading Dashboard | NexusTrade";
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute(
      "content",
      "Professional trading platform dashboard with real-time market data, portfolio tracking, and advanced charting tools."
    );
    
    setIsMounted(true);
    
    // Track page view (analytics)
    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_title: "Dashboard",
        page_location: window.location.href,
      });
    }
    
    // Cleanup
    return () => {
      setIsMounted(false);
    };
  }, []);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Verifying credentials...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Prevent flash of content during hydration
  if (!isMounted) {
    return <LoadingFallback />;
  }

  return (
    <ErrorBoundary>
      <div className="home-container" style={styles.container}>
        <Suspense fallback={<LoadingFallback />}>
          <TopBar />
        </Suspense>
        
        <Suspense fallback={<LoadingFallback />}>
          <Dashboard />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};

// Styles for dark theme
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    background: "var(--bg-main, #0a0c10)",
    color: "var(--text-main, #eef2ff)",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "var(--bg-main, #0a0c10)",
    gap: "16px",
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
    color: "var(--text-main, #eef2ff)",
    fontSize: "1rem",
    fontWeight: "500",
    margin: 0,
  },
  loadingSubtext: {
    color: "var(--text-muted, #8b9bb0)",
    fontSize: "0.85rem",
    margin: 0,
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "var(--bg-main, #0a0c10)",
    padding: "20px",
    textAlign: "center",
  },
  errorIcon: {
    fontSize: "64px",
    marginBottom: "24px",
  },
  errorTitle: {
    color: "var(--text-main, #eef2ff)",
    fontSize: "1.8rem",
    marginBottom: "16px",
  },
  errorMessage: {
    color: "var(--text-muted, #8b9bb0)",
    fontSize: "1rem",
    marginBottom: "32px",
    maxWidth: "500px",
  },
  errorActions: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  retryButton: {
    background: "var(--blue, #3b82f6)",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "all 0.2s",
  },
  homeButton: {
    background: "transparent",
    color: "var(--text-muted, #8b9bb0)",
    border: "1px solid var(--border, #222733)",
    padding: "12px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "all 0.2s",
  },
  errorDetails: {
    marginTop: "32px",
    textAlign: "left",
    background: "var(--bg-card, #13171f)",
    padding: "16px",
    borderRadius: "8px",
    maxWidth: "600px",
    overflow: "auto",
  },
  errorSummary: {
    color: "var(--text-muted, #8b9bb0)",
    cursor: "pointer",
    marginBottom: "8px",
  },
  errorPre: {
    color: "var(--red, #ff5a5f)",
    fontSize: "0.75rem",
    overflow: "auto",
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
  },
};

// Add animation to global styles (only once)
if (typeof document !== 'undefined' && !document.querySelector('#home-styles')) {
  const styleSheet = document.createElement("style");
  styleSheet.id = "home-styles";
  styleSheet.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .home-container {
      animation: fadeIn 0.3s ease-out;
    }
    
    .retry-button:hover,
    .home-button:hover {
      transform: translateY(-2px);
    }
    
    .retry-button:active,
    .home-button:active {
      transform: translateY(0);
    }
  `;
  document.head.appendChild(styleSheet);
}

export default Home;