import React, { useEffect, useState, useCallback, useRef } from "react";
import { VerticalGraph } from "./VerticalGraph";
import api from "../services/api";

const Positions = () => {
  const [allPositions, setAllPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [viewMode, setViewMode] = useState("all"); // all, day, intraday
  const abortControllerRef = useRef(null);

  const loadPositions = useCallback(async () => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await api.get('/positions', {
        signal: abortControllerRef.current.signal,
      });

      if (response.data) {
        const positionsData = Array.isArray(response.data) ? response.data : [];
        setAllPositions(positionsData);
        setLastUpdated(new Date());
      }
    } catch (err) {
      if (err.name === "AbortError") {
        console.log("Request cancelled");
        return;
      }
      
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        localStorage.removeItem("token");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else if (err.response?.status === 404) {
        setError("No positions found");
        setAllPositions([]);
      } else if (err.code === "ECONNABORTED") {
        setError("Request timeout. Please check your connection.");
      } else {
        setError(err.response?.data?.error || "Failed to load positions");
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    loadPositions();
    
    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadPositions]);

  // Calculate position summary
  const positionSummary = useCallback(() => {
    if (!allPositions.length) {
      return {
        totalInvestment: 0,
        totalCurrentValue: 0,
        totalProfitLoss: 0,
        totalProfitLossPercent: 0,
        totalDayChange: 0,
        winningPositions: 0,
        losingPositions: 0,
      };
    }

    let totalInvestment = 0;
    let totalCurrentValue = 0;
    let totalDayChange = 0;
    let winningPositions = 0;
    let losingPositions = 0;

    allPositions.forEach(position => {
      const investment = position.avg * position.qty;
      const currentValue = position.price * position.qty;
      const profit = currentValue - investment;
      const dayChange = (position.day || 0) * position.qty;
      
      totalInvestment += investment;
      totalCurrentValue += currentValue;
      totalDayChange += dayChange;
      
      if (profit >= 0) winningPositions++;
      else losingPositions++;
    });

    const totalProfitLoss = totalCurrentValue - totalInvestment;
    const totalProfitLossPercent = totalInvestment > 0 ? (totalProfitLoss / totalInvestment) * 100 : 0;

    return {
      totalInvestment,
      totalCurrentValue,
      totalProfitLoss,
      totalProfitLossPercent,
      totalDayChange,
      winningPositions,
      losingPositions,
    };
  }, [allPositions]);

  // Filter positions based on view mode
  const getFilteredPositions = useCallback(() => {
    if (viewMode === "all") return allPositions;
    
    // For demo purposes - you can implement actual filtering logic
    // based on your position types (delivery, intraday, etc.)
    return allPositions;
  }, [allPositions, viewMode]);

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "₹0.00";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatCompactCurrency = (amount) => {
    if (!amount && amount !== 0) return "₹0";
    const absAmount = Math.abs(amount);
    if (absAmount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
    if (absAmount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatPercentage = (value) => {
    if (!value && value !== 0) return "0.00%";
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  // Prepare chart data for position distribution
  const getChartData = () => {
    if (!allPositions.length) return null;

    const currentValues = allPositions.map(position => position.price * position.qty);
    const labels = allPositions.map(position => position.name);
    
    // Sort by value for better visualization
    const sortedData = labels.map((label, index) => ({
      label,
      value: currentValues[index],
    })).sort((a, b) => b.value - a.value).slice(0, 10);

    return {
      labels: sortedData.map(item => item.label),
      datasets: [
        {
          label: "Position Value (₹)",
          data: sortedData.map(item => item.value),
          backgroundColor: "rgba(0, 196, 140, 0.7)",
          borderColor: "rgba(0, 196, 140, 1)",
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };
  };

  const summary = positionSummary();
  const filteredPositions = getFilteredPositions();
  const chartData = getChartData();

  // Loading state
  if (isLoading) {
    return (
      <div className="positions-loading" style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading your positions...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="positions-error" style={styles.errorContainer}>
        <div style={styles.errorIcon}>⚠️</div>
        <h3 style={styles.errorTitle}>Unable to load positions</h3>
        <p style={styles.errorMessage}>{error}</p>
        <button onClick={loadPositions} style={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="positions-container" style={styles.container}>
      {/* Header */}
      <div className="positions-header" style={styles.header}>
        <h3 className="title" style={styles.title}>
          Positions ({filteredPositions.length})
        </h3>
        {lastUpdated && (
          <p style={styles.lastUpdated}>
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Position Summary Cards */}
      {filteredPositions.length > 0 && (
        <div className="position-summary" style={styles.summaryGrid}>
          <div className="summary-card" style={styles.summaryCard}>
            <p style={styles.summaryLabel}>Total Investment</p>
            <p style={styles.summaryValue}>{formatCurrency(summary.totalInvestment)}</p>
          </div>
          <div className="summary-card" style={styles.summaryCard}>
            <p style={styles.summaryLabel}>Current Value</p>
            <p style={styles.summaryValue}>{formatCurrency(summary.totalCurrentValue)}</p>
          </div>
          <div className="summary-card" style={styles.summaryCard}>
            <p style={styles.summaryLabel}>Total P&L</p>
            <p style={{ ...styles.summaryValue, color: summary.totalProfitLoss >= 0 ? 'var(--green, #00c48c)' : 'var(--red, #ff5a5f)' }}>
              {formatCurrency(summary.totalProfitLoss)}
              <span style={styles.summaryPercent}>
                {formatPercentage(summary.totalProfitLossPercent)}
              </span>
            </p>
          </div>
          <div className="summary-card" style={styles.summaryCard}>
            <p style={styles.summaryLabel}>Today's P&L</p>
            <p style={{ ...styles.summaryValue, color: summary.totalDayChange >= 0 ? 'var(--green, #00c48c)' : 'var(--red, #ff5a5f)' }}>
              {formatCurrency(summary.totalDayChange)}
            </p>
          </div>
          <div className="summary-card" style={styles.summaryCard}>
            <p style={styles.summaryLabel}>Winning / Losing</p>
            <p style={styles.summaryValue}>
              <span style={{ color: 'var(--green, #00c48c)' }}>{summary.winningPositions}</span>
              <span style={{ color: 'var(--text-muted, #8b9bb0)' }}> / </span>
              <span style={{ color: 'var(--red, #ff5a5f)' }}>{summary.losingPositions}</span>
            </p>
          </div>
        </div>
      )}

      {/* View Controls */}
      <div className="positions-controls" style={styles.controls}>
        <div className="view-buttons" style={styles.viewButtons}>
          <button
            className={`view-btn ${viewMode === "all" ? "active" : ""}`}
            onClick={() => setViewMode("all")}
            style={{ ...styles.viewBtn, ...(viewMode === "all" ? styles.viewBtnActive : {}) }}
          >
            All Positions
          </button>
          <button
            className={`view-btn ${viewMode === "day" ? "active" : ""}`}
            onClick={() => setViewMode("day")}
            style={{ ...styles.viewBtn, ...(viewMode === "day" ? styles.viewBtnActive : {}) }}
          >
            Day Positions
          </button>
          <button
            className={`view-btn ${viewMode === "intraday" ? "active" : ""}`}
            onClick={() => setViewMode("intraday")}
            style={{ ...styles.viewBtn, ...(viewMode === "intraday" ? styles.viewBtnActive : {}) }}
          >
            Intraday
          </button>
        </div>
        
        <button onClick={loadPositions} style={styles.refreshBtn}>
          ↻ Refresh
        </button>
      </div>

      {/* Positions Table */}
      {filteredPositions.length === 0 ? (
        <div className="no-positions" style={styles.emptyContainer}>
          <div style={styles.emptyIcon}>📊</div>
          <h3 style={styles.emptyTitle}>No Open Positions</h3>
          <p style={styles.emptyMessage}>
            You don't have any active positions at the moment.
          </p>
          <button 
            onClick={() => window.location.href = '/'} 
            style={styles.tradeButton}
          >
            Explore Markets →
          </button>
        </div>
      ) : (
        <>
          <div className="order-table" style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Product</th>
                  <th style={styles.th}>Instrument</th>
                  <th style={styles.th}>Qty.</th>
                  <th style={styles.th}>Avg. (₹)</th>
                  <th style={styles.th}>LTP (₹)</th>
                  <th style={styles.th}>Cur. Val (₹)</th>
                  <th style={styles.th}>P&L (₹)</th>
                  <th style={styles.th}>Returns</th>
                  <th style={styles.th}>Day Chg. (₹)</th>
                </tr>
              </thead>

              <tbody>
                {filteredPositions.map((position, index) => {
                  const currValue = position.price * position.qty;
                  const investment = position.avg * position.qty;
                  const profit = currValue - investment;
                  const returnsPercent = investment > 0 ? (profit / investment) * 100 : 0;
                  const dayChange = (position.day || 0) * position.qty;
                  const isLong = position.position_type === "LONG" || profit >= 0;

                  return (
                    <tr key={position._id || index} style={styles.tableRow}>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.productBadge,
                          background: position.product === "NRML" ? "rgba(59, 130, 246, 0.15)" : "rgba(249, 115, 22, 0.15)",
                          color: position.product === "NRML" ? "var(--blue, #3b82f6)" : "var(--accent-orange, #f97316)",
                        }}>
                          {position.product || "MIS"}
                        </span>
                       </td>
                      <td style={styles.td}>
                        <strong>{position.name}</strong>
                        <small style={styles.positionType}>
                          {isLong ? "📈 LONG" : "📉 SHORT"}
                        </small>
                       </td>
                      <td style={styles.td}>{position.qty.toLocaleString()}</td>
                      <td style={styles.td}>{formatCompactCurrency(position.avg)}</td>
                      <td style={styles.td}>{formatCompactCurrency(position.price)}</td>
                      <td style={styles.td}>{formatCompactCurrency(currValue)}</td>
                      <td style={{ ...styles.td, color: profit >= 0 ? 'var(--green, #00c48c)' : 'var(--red, #ff5a5f)' }}>
                        <strong>{formatCompactCurrency(profit)}</strong>
                       </td>
                      <td style={{ ...styles.td, color: profit >= 0 ? 'var(--green, #00c48c)' : 'var(--red, #ff5a5f)' }}>
                        {formatPercentage(returnsPercent)}
                       </td>
                      <td style={{ ...styles.td, color: dayChange >= 0 ? 'var(--green, #00c48c)' : 'var(--red, #ff5a5f)' }}>
                        {formatCompactCurrency(dayChange)}
                       </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Chart Section */}
          {chartData && chartData.labels.length > 0 && (
            <div className="positions-chart" style={styles.chartContainer}>
              <h4 style={styles.chartTitle}>Position Value Distribution</h4>
              <VerticalGraph data={chartData} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Styles for dark theme
const styles = {
  container: {
    padding: "0",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "12px",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "500",
    color: "var(--text-main, #eef2ff)",
    margin: 0,
  },
  lastUpdated: {
    fontSize: "0.7rem",
    color: "var(--text-dim, #5f6f84)",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "32px",
  },
  summaryCard: {
    background: "var(--bg-card, #13171f)",
    padding: "20px",
    borderRadius: "16px",
    border: "1px solid var(--border, #222733)",
  },
  summaryLabel: {
    color: "var(--text-muted, #8b9bb0)",
    fontSize: "0.8rem",
    marginBottom: "8px",
  },
  summaryValue: {
    color: "var(--text-main, #eef2ff)",
    fontSize: "1.3rem",
    fontWeight: "600",
  },
  summaryPercent: {
    fontSize: "0.8rem",
    marginLeft: "8px",
    fontWeight: "400",
  },
  controls: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "16px",
  },
  viewButtons: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  viewBtn: {
    padding: "8px 16px",
    background: "var(--bg-card, #13171f)",
    border: "1px solid var(--border, #222733)",
    borderRadius: "8px",
    color: "var(--text-muted, #8b9bb0)",
    cursor: "pointer",
    fontSize: "0.85rem",
    transition: "all 0.2s",
  },
  viewBtnActive: {
    background: "var(--blue, #3b82f6)",
    color: "white",
    borderColor: "var(--blue, #3b82f6)",
  },
  refreshBtn: {
    padding: "8px 16px",
    background: "var(--bg-card, #13171f)",
    border: "1px solid var(--border, #222733)",
    borderRadius: "8px",
    color: "var(--text-main, #eef2ff)",
    cursor: "pointer",
    fontSize: "0.85rem",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px",
    background: "var(--bg-card, #13171f)",
    borderRadius: "20px",
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
    marginTop: "20px",
    color: "var(--text-muted, #8b9bb0)",
  },
  errorContainer: {
    textAlign: "center",
    padding: "60px",
    background: "var(--bg-card, #13171f)",
    borderRadius: "20px",
  },
  errorIcon: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  errorTitle: {
    color: "var(--text-main, #eef2ff)",
    fontSize: "1.3rem",
    marginBottom: "12px",
  },
  errorMessage: {
    color: "var(--text-muted, #8b9bb0)",
    marginBottom: "24px",
  },
  retryButton: {
    background: "var(--blue, #3b82f6)",
    color: "white",
    border: "none",
    padding: "10px 24px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  emptyContainer: {
    textAlign: "center",
    padding: "80px 40px",
    background: "var(--bg-card, #13171f)",
    borderRadius: "20px",
  },
  emptyIcon: {
    fontSize: "64px",
    marginBottom: "20px",
  },
  emptyTitle: {
    color: "var(--text-main, #eef2ff)",
    fontSize: "1.5rem",
    marginBottom: "12px",
  },
  emptyMessage: {
    color: "var(--text-muted, #8b9bb0)",
    marginBottom: "32px",
  },
  tradeButton: {
    background: "var(--green, #00c48c)",
    color: "#000",
    border: "none",
    padding: "12px 32px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
  },
  tableContainer: {
    overflowX: "auto",
    borderRadius: "16px",
    marginBottom: "32px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "var(--bg-card, #13171f)",
    borderRadius: "16px",
    overflow: "hidden",
  },
  tableHeader: {
    background: "var(--bg-elevated, #0f1219)",
    borderBottom: "1px solid var(--border, #222733)",
  },
  th: {
    padding: "16px 12px",
    textAlign: "left",
    color: "var(--text-muted, #8b9bb0)",
    fontSize: "0.75rem",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  tableRow: {
    borderBottom: "1px solid var(--border-light, #2a2f3c)",
    transition: "background 0.2s",
  },
  td: {
    padding: "14px 12px",
    color: "var(--text-main, #eef2ff)",
    fontSize: "0.85rem",
  },
  productBadge: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "0.7rem",
    fontWeight: "600",
  },
  positionType: {
    display: "block",
    fontSize: "0.65rem",
    color: "var(--text-dim, #5f6f84)",
    marginTop: "4px",
  },
  chartContainer: {
    background: "var(--bg-card, #13171f)",
    padding: "24px",
    borderRadius: "20px",
    border: "1px solid var(--border, #222733)",
  },
  chartTitle: {
    color: "var(--text-main, #eef2ff)",
    fontSize: "1rem",
    marginBottom: "20px",
  },
};

export default Positions;