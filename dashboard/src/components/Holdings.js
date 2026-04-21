import React, { useEffect, useState, useRef, useCallback } from "react";
import { VerticalGraph } from "./VerticalGraph";
import api from '../services/api';

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const abortControllerRef = useRef(null);

  // Calculate portfolio summary
  const portfolioSummary = useCallback(() => {
    if (!allHoldings.length) {
      return {
        totalInvestment: 0,
        totalCurrentValue: 0,
        totalProfitLoss: 0,
        totalProfitLossPercent: 0,
        totalDayChange: 0,
      };
    }

    const totalInvestment = allHoldings.reduce((sum, stock) => sum + (stock.avg * stock.qty), 0);
    const totalCurrentValue = allHoldings.reduce((sum, stock) => sum + (stock.price * stock.qty), 0);
    const totalProfitLoss = totalCurrentValue - totalInvestment;
    const totalProfitLossPercent = totalInvestment > 0 ? (totalProfitLoss / totalInvestment) * 100 : 0;
    const totalDayChange = allHoldings.reduce((sum, stock) => sum + ((stock.day || 0) * stock.qty), 0);

    return {
      totalInvestment,
      totalCurrentValue,
      totalProfitLoss,
      totalProfitLossPercent,
      totalDayChange,
    };
  }, [allHoldings]);

  const loadHoldings = useCallback(async () => {
    // Cancel previous request if exists
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

      const res = await api.get('/holdings', {
        signal: abortControllerRef.current.signal,
      });

      if (res.data) {
        setAllHoldings(Array.isArray(res.data) ? res.data : []);
        setLastUpdated(new Date());
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Request cancelled");
        return;
      }
      
      if (error.response?.status === 401) {
        setError("Session expired. Please login again.");
        localStorage.removeItem("token");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else if (error.response?.status === 404) {
        setError("Holdings data not found");
      } else if (error.code === "ECONNABORTED") {
        setError("Request timeout. Please check your connection.");
      } else {
        setError(error.response?.data?.error || "Failed to load holdings");
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    loadHoldings();

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadHoldings]);

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

  // Prepare chart data for portfolio distribution
  const getChartData = () => {
    if (!allHoldings.length) return null;

    const labels = allHoldings.map((stock) => stock.name);
    const currentValues = allHoldings.map((stock) => stock.price * stock.qty);
    
    // Sort by value for better visualization
    const sortedData = labels.map((label, index) => ({
      label,
      value: currentValues[index],
    })).sort((a, b) => b.value - a.value).slice(0, 10); // Show top 10 holdings

    return {
      labels: sortedData.map(item => item.label),
      datasets: [
        {
          label: "Current Value (₹)",
          data: sortedData.map(item => item.value),
          backgroundColor: "rgba(59, 130, 246, 0.7)",
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };
  };

  const summary = portfolioSummary();
  const chartData = getChartData();

  // Loading state
  if (isLoading) {
    return (
      <div className="holdings-loading" style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading your portfolio...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="holdings-error" style={styles.errorContainer}>
        <div style={styles.errorIcon}>⚠️</div>
        <h3 style={styles.errorTitle}>Unable to load holdings</h3>
        <p style={styles.errorMessage}>{error}</p>
        <button onClick={loadHoldings} style={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  // Empty state
  if (!allHoldings.length) {
    return (
      <div className="holdings-empty" style={styles.emptyContainer}>
        <div style={styles.emptyIcon}>📊</div>
        <h3 style={styles.emptyTitle}>No Holdings Yet</h3>
        <p style={styles.emptyMessage}>
          Start your investment journey by buying your first stock.
        </p>
        <button 
          onClick={() => window.location.href = '/'} 
          style={styles.buyButton}
        >
          Explore Markets →
        </button>
      </div>
    );
  }

  return (
    <div className="holdings-container">
      {/* Header */}
      <div className="holdings-header" style={styles.header}>
        <h3 className="title" style={styles.title}>
          Holdings ({allHoldings.length})
        </h3>
        {lastUpdated && (
          <p style={styles.lastUpdated}>
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Portfolio Summary Cards */}
      <div className="portfolio-summary" style={styles.summaryGrid}>
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
          <p style={styles.summaryLabel}>Today's Change</p>
          <p style={{ ...styles.summaryValue, color: summary.totalDayChange >= 0 ? 'var(--green, #00c48c)' : 'var(--red, #ff5a5f)' }}>
            {formatCurrency(summary.totalDayChange)}
          </p>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="order-table" style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>Instrument</th>
              <th style={styles.th}>Qty.</th>
              <th style={styles.th}>Avg. cost (₹)</th>
              <th style={styles.th}>LTP (₹)</th>
              <th style={styles.th}>Cur. val (₹)</th>
              <th style={styles.th}>P&L (₹)</th>
              <th style={styles.th}>Returns</th>
              <th style={styles.th}>Day chg. (₹)</th>
            </tr>
          </thead>

          <tbody>
            {allHoldings.map((stock, index) => {
              const currValue = stock.price * stock.qty;
              const investment = stock.avg * stock.qty;
              const profit = currValue - investment;
              const returnsPercent = investment > 0 ? (profit / investment) * 100 : 0;

              return (
                <tr key={index} style={styles.tableRow}>
                  <td style={styles.td}>
                    <strong>{stock.name}</strong>
                    {stock.symbol && <small style={styles.symbol}>{stock.symbol}</small>}
                  </td>
                  <td style={styles.td}>{stock.qty.toLocaleString()}</td>
                  <td style={styles.td}>{formatCompactCurrency(stock.avg)}</td>
                  <td style={styles.td}>{formatCompactCurrency(stock.price)}</td>
                  <td style={styles.td}>{formatCompactCurrency(currValue)}</td>
                  <td style={{ ...styles.td, color: profit >= 0 ? 'var(--green, #00c48c)' : 'var(--red, #ff5a5f)' }}>
                    {formatCompactCurrency(profit)}
                  </td>
                  <td style={{ ...styles.td, color: profit >= 0 ? 'var(--green, #00c48c)' : 'var(--red, #ff5a5f)' }}>
                    {formatPercentage(returnsPercent)}
                  </td>
                  <td style={{ ...styles.td, color: (stock.day || 0) >= 0 ? 'var(--green, #00c48c)' : 'var(--red, #ff5a5f)' }}>
                    {formatCompactCurrency((stock.day || 0) * stock.qty)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Portfolio Distribution Chart */}
      {chartData && chartData.labels.length > 0 && (
        <div className="holdings-chart" style={styles.chartContainer}>
          <h4 style={styles.chartTitle}>Portfolio Distribution</h4>
          <VerticalGraph data={chartData} />
        </div>
      )}
    </div>
  );
};

// Styles for dark theme
const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px',
    background: 'var(--bg-card, #13171f)',
    borderRadius: '20px',
    margin: '20px',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '3px solid var(--border, #222733)',
    borderTopColor: 'var(--blue, #3b82f6)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: {
    marginTop: '20px',
    color: 'var(--text-muted, #8b9bb0)',
  },
  errorContainer: {
    textAlign: 'center',
    padding: '60px',
    background: 'var(--bg-card, #13171f)',
    borderRadius: '20px',
    margin: '20px',
  },
  errorIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  errorTitle: {
    color: 'var(--text-main, #eef2ff)',
    fontSize: '1.3rem',
    marginBottom: '12px',
  },
  errorMessage: {
    color: 'var(--text-muted, #8b9bb0)',
    marginBottom: '24px',
  },
  retryButton: {
    background: 'var(--blue, #3b82f6)',
    color: 'white',
    border: 'none',
    padding: '10px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  emptyContainer: {
    textAlign: 'center',
    padding: '80px 40px',
    background: 'var(--bg-card, #13171f)',
    borderRadius: '20px',
    margin: '20px',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '20px',
  },
  emptyTitle: {
    color: 'var(--text-main, #eef2ff)',
    fontSize: '1.5rem',
    marginBottom: '12px',
  },
  emptyMessage: {
    color: 'var(--text-muted, #8b9bb0)',
    marginBottom: '32px',
  },
  buyButton: {
    background: 'var(--green, #00c48c)',
    color: '#000',
    border: 'none',
    padding: '12px 32px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '500',
    color: 'var(--text-main, #eef2ff)',
    margin: 0,
  },
  lastUpdated: {
    fontSize: '0.7rem',
    color: 'var(--text-dim, #5f6f84)',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  summaryCard: {
    background: 'var(--bg-card, #13171f)',
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid var(--border, #222733)',
  },
  summaryLabel: {
    color: 'var(--text-muted, #8b9bb0)',
    fontSize: '0.8rem',
    marginBottom: '8px',
  },
  summaryValue: {
    color: 'var(--text-main, #eef2ff)',
    fontSize: '1.5rem',
    fontWeight: '600',
  },
  summaryPercent: {
    fontSize: '0.8rem',
    marginLeft: '8px',
    fontWeight: '400',
  },
  tableContainer: {
    overflowX: 'auto',
    marginBottom: '32px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    background: 'var(--bg-card, #13171f)',
    borderRadius: '16px',
    overflow: 'hidden',
  },
  tableHeader: {
    background: 'var(--bg-elevated, #0f1219)',
    borderBottom: '1px solid var(--border, #222733)',
  },
  th: {
    padding: '16px 12px',
    textAlign: 'left',
    color: 'var(--text-muted, #8b9bb0)',
    fontSize: '0.75rem',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tableRow: {
    borderBottom: '1px solid var(--border-light, #2a2f3c)',
    transition: 'background 0.2s',
  },
  td: {
    padding: '14px 12px',
    color: 'var(--text-main, #eef2ff)',
    fontSize: '0.85rem',
  },
  symbol: {
    display: 'block',
    fontSize: '0.7rem',
    color: 'var(--text-dim, #5f6f84)',
  },
  chartContainer: {
    background: 'var(--bg-card, #13171f)',
    padding: '24px',
    borderRadius: '20px',
    border: '1px solid var(--border, #222733)',
  },
  chartTitle: {
    color: 'var(--text-main, #eef2ff)',
    fontSize: '1rem',
    marginBottom: '20px',
  },
};

export default Holdings;