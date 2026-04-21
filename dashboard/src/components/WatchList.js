import React, { useState, useEffect, useCallback, useRef } from "react";
import WatchListItem from "./WatchListItem";
import { DoughnutChart } from "./DoughnutChart";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

const WatchList = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [filteredWatchlist, setFilteredWatchlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showChart, setShowChart] = useState(false);
  
  const { token } = useAuth();
  const abortControllerRef = useRef(null);
  const intervalRef = useRef(null);

  // Fetch watchlist from API
  const fetchWatchlist = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    setError(null);

    try {
      const authToken = token || localStorage.getItem("token");
      
      if (!authToken) {
        throw new Error("No authentication token found");
      }
      
      try {
        const response = await api.get('/watchlist', {
          signal: abortControllerRef.current.signal,
          timeout: 5000,
        });

        if (response.data && Array.isArray(response.data)) {
          setWatchlist(response.data);
          setFilteredWatchlist(response.data);
          setLastUpdated(new Date());
          setIsLoading(false);
          return;
        }
      } catch (apiError) {
        console.log("API not available, using mock data");
      }
      
      // Use mock data as fallback
      const mockWatchlist = [
        { id: 1, name: "RELIANCE", symbol: "RELIANCE", price: 2846.18, change: -1.55, changePercent: -0.65, qty: 10 },
        { id: 2, name: "TCS", symbol: "TCS", price: 3988.16, change: -0.06, changePercent: -0.31, qty: 5 },
        { id: 3, name: "HDFC BANK", symbol: "HDFCBANK", price: 1654.67, change: 2.41, changePercent: 0.50, qty: 15 },
        { id: 4, name: "INFOSYS", symbol: "INFY", price: 1525.21, change: -1.08, changePercent: -0.38, qty: 8 },
        { id: 5, name: "ICICI BANK", symbol: "ICICIBANK", price: 1125.15, change: 2.18, changePercent: 1.11, qty: 12 },
      ];
      
      setWatchlist(mockWatchlist);
      setFilteredWatchlist(mockWatchlist);
      setLastUpdated(new Date());
      
    } catch (err) {
      if (err.name === "AbortError") {
        console.log("Request cancelled");
        return;
      }
      
      console.error("Failed to fetch watchlist:", err);
      setError("Failed to load watchlist");
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [token]);

  // Real-time price updates (optional - can be disabled if not needed)
  const startRealTimeUpdates = useCallback(() => {
    // Comment out real-time updates to avoid unnecessary re-renders
    // You can enable this if you want simulated price changes
    return () => {};
  }, []);

  useEffect(() => {
    fetchWatchlist();
    const cleanup = startRealTimeUpdates();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (cleanup) cleanup();
    };
  }, [fetchWatchlist, startRealTimeUpdates]);

  // Filter watchlist based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredWatchlist(watchlist);
    } else {
      const filtered = watchlist.filter(stock =>
        stock.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.symbol?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredWatchlist(filtered);
    }
  }, [searchTerm, watchlist]);

  // Prepare chart data (showing portfolio distribution from watchlist)
  const getChartData = () => {
    if (!watchlist.length) return null;

    // Group by sector or just show top stocks
    const topStocks = [...watchlist]
      .sort((a, b) => (b.price * b.qty || 0) - (a.price * a.qty || 0))
      .slice(0, 8);

    return {
      labels: topStocks.map(stock => stock.name),
      datasets: [
        {
          label: "Value (₹)",
          data: topStocks.map(stock => stock.price * (stock.qty || 1)),
          backgroundColor: [
            "rgba(0, 196, 140, 0.7)",  // Green
            "rgba(59, 130, 246, 0.7)", // Blue
            "rgba(249, 115, 22, 0.7)", // Orange
            "rgba(168, 85, 247, 0.7)", // Purple
            "rgba(239, 68, 68, 0.7)",  // Red
            "rgba(139, 92, 246, 0.7)", // Violet
            "rgba(236, 72, 153, 0.7)", // Pink
            "rgba(20, 184, 166, 0.7)", // Teal
          ],
          borderColor: "#13171f",
          borderWidth: 2,
          borderRadius: 10,
          spacing: 5,
        },
      ],
    };
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRefresh = () => {
    fetchWatchlist();
  };

  const handleRemoveFromWatchlist = async (stockId) => {
    try {
      const authToken = token || localStorage.getItem("token");
      
      await api.delete(`/watchlist/${stockId}`);
      
      // Update local state
      const updatedWatchlist = watchlist.filter(stock => stock.id !== stockId);
      setWatchlist(updatedWatchlist);
      setFilteredWatchlist(updatedWatchlist);
    } catch (err) {
      console.error("Failed to remove from watchlist:", err);
    }
  };

  const chartData = getChartData();

  // Loading state
  if (isLoading) {
    return (
      <div className="watchlist-container" style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading watchlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="watchlist-container" style={styles.container}>
      {/* Search Header */}
      <div className="search-container" style={styles.searchContainer}>
        <input
          type="text"
          name="search"
          id="search"
          placeholder="🔍 Search eg: RELIANCE, TCS, NIFTY, GOLD..."
          className="search"
          style={styles.searchInput}
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div style={styles.headerStats}>
          <span className="counts" style={styles.counts}>
            {filteredWatchlist.length} / {watchlist.length}
          </span>
          <button onClick={handleRefresh} style={styles.refreshBtn} title="Refresh">
            ↻
          </button>
          <button 
            onClick={() => setShowChart(!showChart)} 
            style={styles.chartToggleBtn}
            title={showChart ? "Hide Chart" : "Show Chart"}
          >
            {showChart ? "📊" : "📈"}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={styles.errorBanner}>
          <span>⚠️</span>
          <span>{error}</span>
          <button onClick={fetchWatchlist} style={styles.retryBtn}>Retry</button>
        </div>
      )}

      {/* Watchlist Items */}
      {filteredWatchlist.length === 0 ? (
        <div style={styles.emptyContainer}>
          <div style={styles.emptyIcon}>📋</div>
          <p style={styles.emptyText}>
            {searchTerm ? "No matching stocks found" : "Your watchlist is empty"}
          </p>
          {searchTerm ? (
            <button onClick={() => setSearchTerm("")} style={styles.clearSearchBtn}>
              Clear Search
            </button>
          ) : (
            <button style={styles.addStockBtn}>+ Add Stocks</button>
          )}
        </div>
      ) : (
        <ul className="list" style={styles.list}>
          {filteredWatchlist.map((stock, index) => (
            <WatchListItem
              key={stock.id || stock._id || index}
              stock={stock}
              onRemove={() => handleRemoveFromWatchlist(stock.id || stock._id)}
            />
          ))}
        </ul>
      )}

      {/* Last Updated Timestamp */}
      {lastUpdated && watchlist.length > 0 && (
        <div style={styles.updateInfo}>
          <span style={styles.updateDot}></span>
          <span style={styles.updateText}>
            Updated: {lastUpdated.toLocaleTimeString()}
          </span>
        </div>
      )}

      {/* Doughnut Chart - Portfolio Distribution */}
      {showChart && chartData && watchlist.length > 0 && (
        <div style={styles.chartContainer}>
          <h4 style={styles.chartTitle}>Portfolio Distribution</h4>
          <DoughnutChart data={chartData} />
        </div>
      )}
    </div>
  );
};

// Styles for dark theme
const styles = {
  container: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: "var(--bg-card, #13171f)",
    borderRight: "1px solid var(--border, #222733)",
    overflow: "hidden",
  },
  searchContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderBottom: "1px solid var(--border, #222733)",
    gap: "12px",
    flexWrap: "wrap",
  },
  searchInput: {
    flex: 1,
    background: "var(--bg-elevated, #0f1219)",
    border: "1px solid var(--border, #222733)",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "var(--text-main, #eef2ff)",
    fontSize: "0.85rem",
    outline: "none",
  },
  headerStats: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  counts: {
    fontSize: "0.75rem",
    color: "var(--text-muted, #8b9bb0)",
    background: "var(--bg-elevated, #0f1219)",
    padding: "4px 8px",
    borderRadius: "12px",
  },
  refreshBtn: {
    background: "var(--bg-elevated, #0f1219)",
    border: "1px solid var(--border, #222733)",
    borderRadius: "6px",
    padding: "6px 10px",
    color: "var(--text-muted, #8b9bb0)",
    cursor: "pointer",
    fontSize: "1rem",
  },
  chartToggleBtn: {
    background: "var(--bg-elevated, #0f1219)",
    border: "1px solid var(--border, #222733)",
    borderRadius: "6px",
    padding: "6px 10px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  errorBanner: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    background: "rgba(255, 90, 95, 0.1)",
    borderBottom: "1px solid var(--red, #ff5a5f)",
    color: "var(--red, #ff5a5f)",
    fontSize: "0.85rem",
  },
  retryBtn: {
    marginLeft: "auto",
    background: "var(--red, #ff5a5f)",
    color: "white",
    border: "none",
    padding: "4px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  list: {
    flex: 1,
    overflowY: "auto",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  emptyContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    textAlign: "center",
  },
  emptyIcon: {
    fontSize: "48px",
    marginBottom: "16px",
    opacity: 0.5,
  },
  emptyText: {
    color: "var(--text-muted, #8b9bb0)",
    fontSize: "0.9rem",
    marginBottom: "16px",
  },
  clearSearchBtn: {
    background: "var(--blue, #3b82f6)",
    color: "white",
    border: "none",
    padding: "8px 20px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  addStockBtn: {
    background: "var(--blue, #3b82f6)",
    color: "white",
    border: "none",
    padding: "8px 20px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  updateInfo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "8px",
    borderTop: "1px solid var(--border, #222733)",
    fontSize: "0.7rem",
    color: "var(--text-dim, #5f6f84)",
  },
  updateDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "var(--green, #00c48c)",
    animation: "pulse 2s infinite",
  },
  updateText: {
    fontSize: "0.7rem",
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
  },
  chartContainer: {
    padding: "16px",
    borderTop: "1px solid var(--border, #222733)",
    background: "var(--bg-elevated, #0f1219)",
  },
  chartTitle: {
    color: "var(--text-main, #eef2ff)",
    fontSize: "0.85rem",
    marginBottom: "12px",
    textAlign: "center",
  },
};

export default WatchList;