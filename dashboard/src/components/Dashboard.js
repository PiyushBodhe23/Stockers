// ✅ ALL IMPORTS MUST BE AT THE TOP - No code before imports
import React, { Suspense, lazy } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { GeneralContextProvider } from "./GeneralContext";

// Lazy load components
const Summary = lazy(() => import("./Summary"));
const Orders = lazy(() => import("./Orders"));
const Holdings = lazy(() => import("./Holdings"));
const Positions = lazy(() => import("./Positions"));
const Funds = lazy(() => import("./Funds"));
const Apps = lazy(() => import("./Apps"));
const WatchList = lazy(() => import("./WatchList"));

// ✅ Styles and constants can come AFTER imports
const LoadingFallback = () => (
  <div style={styles.loadingContainer}>
    <div style={styles.spinner}></div>
    <p style={styles.loadingText}>Loading...</p>
  </div>
);

const Dashboard = () => {
  return (
    <div className="dashboard-container" style={styles.container}>
      <GeneralContextProvider>
        <div className="watchlist-wrapper" style={styles.watchlist}>
          <Suspense fallback={<LoadingFallback />}>
            <WatchList />
          </Suspense>
        </div>
      </GeneralContextProvider>
      
      <div className="content" style={styles.content}>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Summary />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/holdings" element={<Holdings />} />
            <Route path="/positions" element={<Positions />} />
            <Route path="/funds" element={<Funds />} />
            <Route path="/apps" element={<Apps />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    width: "100%",
    height: "100%",
    background: "var(--bg-main, #0a0c10)",
  },
  watchlist: {
    flexBasis: "360px",
    maxWidth: "400px",
    minWidth: "320px",
    height: "100%",
    overflowY: "auto",
    borderRight: "1px solid var(--border, #222733)",
    background: "var(--bg-card, #13171f)",
  },
  content: {
    flex: 1,
    overflowY: "auto",
    padding: "24px",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    padding: "60px",
  },
  spinner: {
    width: "40px",
    height: "40px",
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
};

export default Dashboard;