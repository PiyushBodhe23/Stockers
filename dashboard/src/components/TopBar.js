import React, { useState, useEffect, useCallback, useRef } from "react";
import api from "../services/api";
import Menu from "./Menu";

const TopBar = () => {
  const [indices, setIndices] = useState({
    nifty: {
      value: 0,
      change: 0,
      percent: 0,
      isPositive: true,
      loading: true,
    },
    sensex: {
      value: 0,
      change: 0,
      percent: 0,
      isPositive: true,
      loading: true,
    },
  });
  
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Format number with Indian comma system
  const formatIndexValue = (value) => {
    if (!value && value !== 0) return "0";
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatChange = (change) => {
    if (!change && change !== 0) return "0";
    const formatted = Math.abs(change).toFixed(2);
    return change >= 0 ? `+${formatted}` : `-${formatted}`;
  };

  const formatPercent = (percent) => {
    if (!percent && percent !== 0) return "0";
    const formatted = Math.abs(percent).toFixed(2);
    return `${percent >= 0 ? '+' : '-'}${formatted}%`;
  };

  const fetchIndicesData = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const response = await api.get('/market/indices', {
        signal: abortControllerRef.current.signal,
        timeout: 5000,
      });

      if (response.data) {
        setIndices({
          nifty: {
            value: response.data.nifty?.value || 0,
            change: response.data.nifty?.change || 0,
            percent: response.data.nifty?.percent || 0,
            isPositive: (response.data.nifty?.change || 0) >= 0,
            loading: false,
          },
          sensex: {
            value: response.data.sensex?.value || 0,
            change: response.data.sensex?.change || 0,
            percent: response.data.sensex?.percent || 0,
            isPositive: (response.data.sensex?.change || 0) >= 0,
            loading: false,
          },
        });
        setLastUpdated(new Date());
        setError(null);
        return;
      }
    } catch (apiError) {
      console.log("API not available, using mock data");
    }
    
    // Mock data fallback
    setIndices({
      nifty: {
        value: 24123.45,
        change: 187.30,
        percent: 0.78,
        isPositive: true,
        loading: false,
      },
      sensex: {
        value: 79243.67,
        change: 456.23,
        percent: 0.58,
        isPositive: true,
        loading: false,
      },
    });
    setLastUpdated(new Date());
    
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchIndicesData();

    // Set up auto-refresh every 5 seconds
    intervalRef.current = setInterval(() => {
      fetchIndicesData();
    }, 5000);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchIndicesData]);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div style={styles.skeletonContainer}>
      <div style={styles.skeletonLine}></div>
      <div style={styles.skeletonLineSmall}></div>
    </div>
  );

  return (
    <div className="topbar-container" style={styles.container}>
      <div className="indices-container" style={styles.indicesContainer}>
        {/* NIFTY 50 */}
        <div className="nifty" style={styles.indexCard}>
          <p className="index" style={styles.indexLabel}>NIFTY 50</p>
          {indices.nifty.loading ? (
            <LoadingSkeleton />
          ) : (
            <>
              <p 
                className="index-points" 
                style={{
                  ...styles.indexValue,
                  color: indices.nifty.isPositive ? 'var(--green, #00c48c)' : 'var(--red, #ff5a5f)'
                }}
              >
                {formatIndexValue(indices.nifty.value)}
              </p>
              <p 
                className="percent" 
                style={{
                  ...styles.indexPercent,
                  color: indices.nifty.isPositive ? 'var(--green, #00c48c)' : 'var(--red, #ff5a5f)'
                }}
              >
                {formatChange(indices.nifty.change)} ({formatPercent(indices.nifty.percent)})
              </p>
            </>
          )}
        </div>

        {/* SENSEX */}
        <div className="sensex" style={styles.indexCard}>
          <p className="index" style={styles.indexLabel}>SENSEX</p>
          {indices.sensex.loading ? (
            <LoadingSkeleton />
          ) : (
            <>
              <p 
                className="index-points" 
                style={{
                  ...styles.indexValue,
                  color: indices.sensex.isPositive ? 'var(--green, #00c48c)' : 'var(--red, #ff5a5f)'
                }}
              >
                {formatIndexValue(indices.sensex.value)}
              </p>
              <p 
                className="percent" 
                style={{
                  ...styles.indexPercent,
                  color: indices.sensex.isPositive ? 'var(--green, #00c48c)' : 'var(--red, #ff5a5f)'
                }}
              >
                {formatChange(indices.sensex.change)} ({formatPercent(indices.sensex.percent)})
              </p>
            </>
          )}
        </div>

        {/* Error indicator */}
        {error && (
          <div style={styles.errorBadge} title={error}>
            ⚠️
          </div>
        )}

        {/* Last updated indicator */}
        {lastUpdated && !indices.nifty.loading && (
          <div style={styles.updateIndicator}>
            <span style={styles.updateDot}></span>
            <span style={styles.updateText}>
              {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>

      <Menu />
    </div>
  );
};

// Styles for dark theme
const styles = {
  container: {
    width: "100%",
    height: "70px",
    display: "flex",
    alignItems: "center",
    background: "var(--bg-card, #13171f)",
    borderBottom: "1px solid var(--border, #222733)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  indicesContainer: {
    flexBasis: "32%",
    height: "100%",
    padding: "0 24px",
    borderRight: "1px solid var(--border, #222733)",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    position: "relative",
  },
  indexCard: {
    flex: 1,
    display: "flex",
    alignItems: "baseline",
    gap: "10px",
    background: "var(--bg-elevated, #0f1219)",
    padding: "8px 16px",
    borderRadius: "40px",
    flexWrap: "wrap",
  },
  indexLabel: {
    fontSize: "0.8rem",
    fontWeight: "600",
    letterSpacing: "0.5px",
    color: "var(--text-muted, #8b9bb0)",
    margin: 0,
  },
  indexValue: {
    fontSize: "0.9rem",
    fontWeight: "600",
    margin: 0,
    transition: "color 0.3s ease",
  },
  indexPercent: {
    fontSize: "0.75rem",
    fontWeight: "500",
    margin: 0,
    transition: "color 0.3s ease",
  },
  skeletonContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  skeletonLine: {
    width: "80px",
    height: "16px",
    background: "linear-gradient(90deg, var(--border, #222733) 25%, var(--bg-hover, #1e2530) 50%, var(--border, #222733) 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
    borderRadius: "4px",
  },
  skeletonLineSmall: {
    width: "60px",
    height: "12px",
    background: "linear-gradient(90deg, var(--border, #222733) 25%, var(--bg-hover, #1e2530) 50%, var(--border, #222733) 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
    borderRadius: "4px",
  },
  errorBadge: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "16px",
    cursor: "pointer",
    opacity: 0.7,
  },
  updateIndicator: {
    position: "absolute",
    right: "10px",
    bottom: "8px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  updateDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "var(--green, #00c48c)",
    animation: "pulse 2s infinite",
  },
  updateText: {
    fontSize: "0.6rem",
    color: "var(--text-dim, #5f6f84)",
  },
};

// Add animations to global styles (only once)
if (typeof document !== 'undefined' && !document.querySelector('#topbar-styles')) {
  const styleSheet = document.createElement("style");
  styleSheet.id = "topbar-styles";
  styleSheet.textContent = `
    @keyframes shimmer {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.3;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default TopBar;