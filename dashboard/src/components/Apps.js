import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../hooks/useAuth";
import { ProtectedRoute } from "./ProtectedRoute";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";

// Simple Error Boundary Component
class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App Error:", error, errorInfo);
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
          <h1 style={styles.errorTitle}>Something went wrong</h1>
          <p style={styles.errorMessage}>{this.state.error?.message || "An unexpected error occurred"}</p>
          <div style={styles.buttonGroup}>
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

function App() {
  return (
    <AppErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </AppErrorBoundary>
  );
}

const styles = {
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "#0a0c10",
    color: "#eef2ff",
    textAlign: "center",
    padding: "20px",
  },
  errorIcon: {
    fontSize: "64px",
    marginBottom: "24px",
  },
  errorTitle: {
    fontSize: "1.8rem",
    marginBottom: "16px",
    color: "#eef2ff",
  },
  errorMessage: {
    fontSize: "1rem",
    color: "#8b9bb0",
    marginBottom: "32px",
    maxWidth: "500px",
  },
  buttonGroup: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  retryButton: {
    background: "#3b82f6",
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
    color: "#8b9bb0",
    border: "1px solid #222733",
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
    background: "#13171f",
    padding: "16px",
    borderRadius: "8px",
    maxWidth: "600px",
    overflow: "auto",
    border: "1px solid #222733",
  },
  errorSummary: {
    color: "#8b9bb0",
    cursor: "pointer",
    marginBottom: "8px",
  },
  errorPre: {
    color: "#ff5a5f",
    fontSize: "0.75rem",
    overflow: "auto",
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
  },
};

export default App;