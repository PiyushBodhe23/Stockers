import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

const Summary = () => {
  const [summaryData, setSummaryData] = useState({
    user: { name: "" },
    equity: {
      marginAvailable: 0,
      marginUsed: 0,
      openingBalance: 0,
    },
    holdings: {
      count: 0,
      currentValue: 0,
      investment: 0,
      pnl: 0,
      pnlPercent: 0,
      holdings: [],
    },
    todayPerformance: {
      gainers: 0,
      losers: 0,
      dayChange: 0,
      dayChangePercent: 0,
    },
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const abortControllerRef = useRef(null);
  const { user: authUser } = useAuth();

  const loadSummaryData = useCallback(async () => {
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
      
      // Fetch holdings data
      const holdingsResponse = await api.get('/holdings', {
        signal: abortControllerRef.current.signal,
      });

      // Fetch funds data
      const fundsResponse = await api.get('/funds', {
        signal: abortControllerRef.current.signal,
      });

      const holdings = holdingsResponse.data || [];
      
      // Calculate holdings summary
      let totalCurrentValue = 0;
      let totalInvestment = 0;
      let totalPnl = 0;
      let gainers = 0;
      let losers = 0;
      let dayChange = 0;

      holdings.forEach(holding => {
        const currentValue = holding.price * holding.qty;
        const investment = holding.avg * holding.qty;
        const pnl = currentValue - investment;
        const dayPnl = (holding.day || 0) * holding.qty;
        
        totalCurrentValue += currentValue;
        totalInvestment += investment;
        totalPnl += pnl;
        dayChange += dayPnl;
        
        if (pnl >= 0) gainers++;
        else losers++;
      });

      const totalPnlPercent = totalInvestment > 0 ? (totalPnl / totalInvestment) * 100 : 0;
      const dayChangePercent = totalCurrentValue > 0 ? (dayChange / totalCurrentValue) * 100 : 0;

      // Get user name from auth
      const userName = authUser?.name || authUser?.email?.split('@')[0] || "Investor";

      setSummaryData({
        user: { name: userName },
        equity: {
          marginAvailable: fundsResponse.data?.availableMargin || 404310,
          marginUsed: fundsResponse.data?.usedMargin || 375730,
          openingBalance: fundsResponse.data?.openingBalance || 404310,
        },
        holdings: {
          count: holdings.length,
          currentValue: totalCurrentValue,
          investment: totalInvestment,
          pnl: totalPnl,
          pnlPercent: totalPnlPercent,
          holdings: holdings.slice(0, 5), // Top 5 holdings for quick view
        },
        todayPerformance: {
          gainers,
          losers,
          dayChange,
          dayChangePercent,
        },
      });
      
      setLastUpdated(new Date());
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
      } else {
        setError(err.response?.data?.error || "Failed to load summary data");
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [authUser]);

  useEffect(() => {
    loadSummaryData();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadSummaryData]);

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "₹0";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatCompactCurrency = (amount) => {
    if (!amount && amount !== 0) return "₹0";
    const absAmount = Math.abs(amount);
    if (absAmount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
    if (absAmount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
    if (absAmount >= 1000) return `₹${(amount / 1000).toFixed(1)}k`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatPercentage = (value) => {
    if (!value && value !== 0) return "0.00%";
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Loading state
  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading your portfolio summary...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorIcon}>⚠️</div>
        <h3 style={styles.errorTitle}>Unable to load summary</h3>
        <p style={styles.errorMessage}>{error}</p>
        <button onClick={loadSummaryData} style={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* User Greeting */}
      <div style={styles.greetingSection}>
        <div>
          <h6 style={styles.greeting}>
            {getGreeting()}, <span style={styles.userName}>{summaryData.user.name}!</span>
          </h6>
          <p style={styles.subGreeting}>Ready to trade? Markets are {new Date().getHours() >= 9 && new Date().getHours() <= 15 ? "🟢 Open" : "🔴 Closed"}</p>
        </div>
        {lastUpdated && (
          <p style={styles.lastUpdated}>
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>
      <hr style={styles.divider} />

      {/* Equity Section */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionIcon}>📊</span>
          <p style={styles.sectionTitle}>Equity Margin</p>
        </div>

        <div style={styles.dataContainer}>
          <div style={styles.firstColumn}>
            <h3 style={styles.mainValue}>{formatCompactCurrency(summaryData.equity.marginAvailable)}</h3>
            <p style={styles.label}>Margin available</p>
            {summaryData.equity.marginAvailable > 0 && (
              <div style={styles.progressBar}>
                <div 
                  style={{
                    ...styles.progressFill,
                    width: `${Math.min((summaryData.equity.marginUsed / summaryData.equity.marginAvailable) * 100, 100)}%`
                  }}
                />
              </div>
            )}
          </div>
          
          <div style={styles.dividerVertical} />

          <div style={styles.secondColumn}>
            <div style={styles.infoRow}>
              <span>Margins used</span>
              <span style={styles.infoValue}>{formatCompactCurrency(summaryData.equity.marginUsed)}</span>
            </div>
            <div style={styles.infoRow}>
              <span>Opening balance</span>
              <span style={styles.infoValue}>{formatCompactCurrency(summaryData.equity.openingBalance)}</span>
            </div>
            <div style={styles.infoRow}>
              <span>Available cash</span>
              <span style={styles.infoValue}>{formatCompactCurrency(summaryData.equity.marginAvailable)}</span>
            </div>
          </div>
        </div>
      </div>
      <hr style={styles.divider} />

      {/* Holdings Section */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionIcon}>💼</span>
          <p style={styles.sectionTitle}>Holdings ({summaryData.holdings.count})</p>
          <button 
            onClick={loadSummaryData} 
            style={styles.refreshIcon}
            title="Refresh data"
          >
            ↻
          </button>
        </div>

        <div style={styles.dataContainer}>
          <div style={styles.firstColumn}>
            <h3 style={{ ...styles.mainValue, color: summaryData.holdings.pnl >= 0 ? 'var(--green, #00c48c)' : 'var(--red, #ff5a5f)' }}>
              {formatCompactCurrency(summaryData.holdings.pnl)}
              <small style={styles.percentSmall}>
                {formatPercentage(summaryData.holdings.pnlPercent)}
              </small>
            </h3>
            <p style={styles.label}>Total P&L</p>
          </div>
          
          <div style={styles.dividerVertical} />

          <div style={styles.secondColumn}>
            <div style={styles.infoRow}>
              <span>Current Value</span>
              <span style={styles.infoValue}>{formatCompactCurrency(summaryData.holdings.currentValue)}</span>
            </div>
            <div style={styles.infoRow}>
              <span>Investment</span>
              <span style={styles.infoValue}>{formatCompactCurrency(summaryData.holdings.investment)}</span>
            </div>
            <div style={styles.infoRow}>
              <span>Today's Change</span>
              <span style={{ ...styles.infoValue, color: summaryData.todayPerformance.dayChange >= 0 ? 'var(--green, #00c48c)' : 'var(--red, #ff5a5f)' }}>
                {formatCompactCurrency(summaryData.todayPerformance.dayChange)} ({formatPercentage(summaryData.todayPerformance.dayChangePercent)})
              </span>
            </div>
          </div>
        </div>

        {/* Top Holdings Preview */}
        {summaryData.holdings.holdings.length > 0 && (
          <div style={styles.topHoldings}>
            <p style={styles.topHoldingsTitle}>📈 Top Holdings</p>
            {summaryData.holdings.holdings.map((holding, idx) => {
              const pnl = (holding.price - holding.avg) * holding.qty;
              return (
                <div key={idx} style={styles.holdingItem}>
                  <span style={styles.holdingName}>{holding.name}</span>
                  <span style={styles.holdingQty}>{holding.qty} shares</span>
                  <span style={{ ...styles.holdingPnl, color: pnl >= 0 ? 'var(--green, #00c48c)' : 'var(--red, #ff5a5f)' }}>
                    {formatCompactCurrency(pnl)}
                  </span>
                </div>
              );
            })}
            {summaryData.holdings.count > 5 && (
              <button style={styles.viewAllBtn}>View all {summaryData.holdings.count} holdings →</button>
            )}
          </div>
        )}
      </div>

      {/* Today's Performance Summary */}
      <div style={styles.performanceCard}>
        <div style={styles.performanceHeader}>
          <span>📈 Today's Performance</span>
        </div>
        <div style={styles.performanceStats}>
          <div style={styles.performanceStat}>
            <span style={{ ...styles.statValue, color: 'var(--green, #00c48c)' }}>{summaryData.todayPerformance.gainers}</span>
            <span style={styles.statLabel}>Gainers</span>
          </div>
          <div style={styles.performanceStat}>
            <span style={{ ...styles.statValue, color: 'var(--red, #ff5a5f)' }}>{summaryData.todayPerformance.losers}</span>
            <span style={styles.statLabel}>Losers</span>
          </div>
          <div style={styles.performanceStat}>
            <span style={{ ...styles.statValue, color: summaryData.todayPerformance.dayChange >= 0 ? 'var(--green, #00c48c)' : 'var(--red, #ff5a5f)' }}>
              {formatPercentage(summaryData.todayPerformance.dayChangePercent)}
            </span>
            <span style={styles.statLabel}>Day Change</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles for dark theme
const styles = {
  container: {
    padding: "0",
  },
  greetingSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "12px",
  },
  greeting: {
    fontSize: "1.5rem",
    fontWeight: "400",
    color: "var(--text-main, #eef2ff)",
    margin: 0,
  },
  userName: {
    fontWeight: "600",
    background: "linear-gradient(135deg, #3b82f6, #00c48c)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subGreeting: {
    fontSize: "0.8rem",
    color: "var(--text-muted, #8b9bb0)",
    marginTop: "8px",
  },
  lastUpdated: {
    fontSize: "0.7rem",
    color: "var(--text-dim, #5f6f84)",
  },
  divider: {
    border: "none",
    background: "var(--border, #222733)",
    height: "1px",
    margin: "20px 0",
  },
  dividerVertical: {
    width: "1px",
    background: "var(--border, #222733)",
    margin: "0 24px",
  },
  section: {
    marginBottom: "24px",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "16px",
    gap: "8px",
  },
  sectionIcon: {
    fontSize: "1.2rem",
  },
  sectionTitle: {
    fontSize: "1rem",
    fontWeight: "500",
    color: "var(--text-main, #eef2ff)",
    margin: 0,
  },
  refreshIcon: {
    background: "none",
    border: "none",
    color: "var(--text-muted, #8b9bb0)",
    cursor: "pointer",
    fontSize: "1.1rem",
    marginLeft: "auto",
    transition: "transform 0.2s",
  },
  dataContainer: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
  firstColumn: {
    flex: 1,
    textAlign: "center",
  },
  mainValue: {
    fontSize: "2rem",
    fontWeight: "600",
    color: "var(--text-main, #eef2ff)",
    margin: 0,
  },
  percentSmall: {
    fontSize: "0.8rem",
    marginLeft: "8px",
    fontWeight: "400",
  },
  label: {
    fontSize: "0.8rem",
    color: "var(--text-muted, #8b9bb0)",
    marginTop: "4px",
  },
  progressBar: {
    height: "4px",
    background: "var(--border, #222733)",
    borderRadius: "4px",
    marginTop: "12px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "var(--blue, #3b82f6)",
    borderRadius: "4px",
    transition: "width 0.3s",
  },
  secondColumn: {
    flex: 1,
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
    fontSize: "0.85rem",
    color: "var(--text-muted, #8b9bb0)",
  },
  infoValue: {
    color: "var(--text-main, #eef2ff)",
    fontWeight: "500",
  },
  topHoldings: {
    marginTop: "20px",
    padding: "16px",
    background: "var(--bg-elevated, #0f1219)",
    borderRadius: "12px",
  },
  topHoldingsTitle: {
    fontSize: "0.85rem",
    fontWeight: "500",
    color: "var(--text-main, #eef2ff)",
    marginBottom: "12px",
  },
  holdingItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid var(--border-light, #2a2f3c)",
    fontSize: "0.85rem",
  },
  holdingName: {
    fontWeight: "500",
    color: "var(--text-main, #eef2ff)",
  },
  holdingQty: {
    color: "var(--text-muted, #8b9bb0)",
    fontSize: "0.75rem",
  },
  holdingPnl: {
    fontWeight: "500",
  },
  viewAllBtn: {
    background: "none",
    border: "none",
    color: "var(--blue, #3b82f6)",
    cursor: "pointer",
    fontSize: "0.8rem",
    marginTop: "12px",
    padding: "8px",
    width: "100%",
    textAlign: "center",
  },
  performanceCard: {
    marginTop: "24px",
    padding: "16px",
    background: "var(--bg-card, #13171f)",
    borderRadius: "16px",
    border: "1px solid var(--border, #222733)",
  },
  performanceHeader: {
    fontSize: "0.85rem",
    fontWeight: "500",
    color: "var(--text-main, #eef2ff)",
    marginBottom: "12px",
  },
  performanceStats: {
    display: "flex",
    justifyContent: "space-around",
    gap: "16px",
  },
  performanceStat: {
    textAlign: "center",
    flex: 1,
  },
  statValue: {
    display: "block",
    fontSize: "1.3rem",
    fontWeight: "600",
    marginBottom: "4px",
  },
  statLabel: {
    fontSize: "0.7rem",
    color: "var(--text-muted, #8b9bb0)",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px",
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
    marginTop: "16px",
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
};

export default Summary;