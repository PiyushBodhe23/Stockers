import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

const Orders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [filter, setFilter] = useState("all"); // all, buy, sell
  const [sortBy, setSortBy] = useState("date"); // date, name, price, qty
  const [sortOrder, setSortOrder] = useState("desc"); // asc, desc
  
  const { token } = useAuth();
  const abortControllerRef = useRef(null);

  const loadOrders = useCallback(async () => {
    // Cancel previous request
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

      const response = await api.get('/orders', {
        signal: abortControllerRef.current.signal,
      });

      if (response.data) {
        // Sort orders by date (newest first)
        const sortedOrders = Array.isArray(response.data) 
          ? [...response.data].sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0))
          : [];
        setAllOrders(sortedOrders);
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
        setError("No orders found");
        setAllOrders([]);
      } else if (err.code === "ECONNABORTED") {
        setError("Request timeout. Please check your connection.");
      } else {
        setError(err.response?.data?.error || "Failed to load orders");
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [token]);

  useEffect(() => {
    loadOrders();
    
    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadOrders]);

  // Filter orders
  const getFilteredOrders = () => {
    let filtered = [...allOrders];
    
    if (filter === "buy") {
      filtered = filtered.filter(order => order.mode?.toUpperCase() === "BUY");
    } else if (filter === "sell") {
      filtered = filtered.filter(order => order.mode?.toUpperCase() === "SELL");
    }
    
    // Sort orders
    filtered.sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case "name":
          aVal = (a.name || "").toLowerCase();
          bVal = (b.name || "").toLowerCase();
          break;
        case "price":
          aVal = a.price || 0;
          bVal = b.price || 0;
          break;
        case "qty":
          aVal = a.qty || 0;
          bVal = b.qty || 0;
          break;
        case "date":
          aVal = new Date(a.createdAt || a.date || 0);
          bVal = new Date(b.createdAt || b.date || 0);
          break;
        default:
          aVal = (a.name || "").toLowerCase();
          bVal = (b.name || "").toLowerCase();
      }
      
      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    
    return filtered;
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "₹0.00";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getOrderStatus = (order) => {
    if (order.status) return order.status;
    if (order.completed) return "Completed";
    if (order.pending) return "Pending";
    return "Executed";
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "executed":
        return "var(--green, #00c48c)";
      case "pending":
        return "var(--accent-orange, #f97316)";
      case "cancelled":
      case "rejected":
        return "var(--red, #ff5a5f)";
      default:
        return "var(--text-muted, #8b9bb0)";
    }
  };

  const filteredOrders = getFilteredOrders();

  // Loading state
  if (isLoading) {
    return (
      <div className="orders-loading" style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading your orders...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="orders-error" style={styles.errorContainer}>
        <div style={styles.errorIcon}>⚠️</div>
        <h3 style={styles.errorTitle}>Unable to load orders</h3>
        <p style={styles.errorMessage}>{error}</p>
        <button onClick={loadOrders} style={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="orders-container" style={styles.container}>
      {/* Header */}
      <div className="orders-header" style={styles.header}>
        <h3 className="title" style={styles.title}>
          Orders ({filteredOrders.length})
        </h3>
        {lastUpdated && (
          <p style={styles.lastUpdated}>
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Filters and Controls */}
      <div className="orders-controls" style={styles.controls}>
        <div className="filter-buttons" style={styles.filterButtons}>
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
            style={{ ...styles.filterBtn, ...(filter === "all" ? styles.filterBtnActive : {}) }}
          >
            All Orders
          </button>
          <button
            className={`filter-btn ${filter === "buy" ? "active" : ""}`}
            onClick={() => setFilter("buy")}
            style={{ ...styles.filterBtn, ...(filter === "buy" ? styles.filterBtnActive : {}) }}
          >
            Buy Orders
          </button>
          <button
            className={`filter-btn ${filter === "sell" ? "active" : ""}`}
            onClick={() => setFilter("sell")}
            style={{ ...styles.filterBtn, ...(filter === "sell" ? styles.filterBtnActive : {}) }}
          >
            Sell Orders
          </button>
        </div>

        <div className="sort-controls" style={styles.sortControls}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={styles.select}
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="qty">Sort by Quantity</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            style={styles.sortOrderBtn}
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
          <button onClick={loadOrders} style={styles.refreshBtn}>
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="no-orders" style={styles.emptyContainer}>
          <div style={styles.emptyIcon}>📋</div>
          <h3 style={styles.emptyTitle}>No Orders Found</h3>
          <p style={styles.emptyMessage}>
            {filter !== "all" 
              ? `You don't have any ${filter} orders yet.` 
              : "You haven't placed any orders yet."}
          </p>
          <button 
            onClick={() => window.location.href = '/'} 
            style={styles.tradeButton}
          >
            Start Trading →
          </button>
        </div>
      ) : (
        <div className="order-table" style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Instrument</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Qty.</th>
                <th style={styles.th}>Price (₹)</th>
                <th style={styles.th}>Total Value</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Date & Time</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order, index) => {
                const totalValue = (order.price || 0) * (order.qty || 0);
                const orderType = order.mode?.toUpperCase();
                const isBuy = orderType === "BUY";
                const status = getOrderStatus(order);
                
                return (
                  <tr key={order.id || order._id || index} style={styles.tableRow}>
                    <td style={styles.td}>
                      <strong>{order.name || order.symbol || "N/A"}</strong>
                      {order.exchange && <small style={styles.exchange}>{order.exchange}</small>}
                    </td>
                    <td style={{ ...styles.td, color: isBuy ? "var(--green, #00c48c)" : "var(--red, #ff5a5f)" }}>
                      {orderType || "N/A"}
                    </td>
                    <td style={styles.td}>{order.qty?.toLocaleString() || 0}</td>
                    <td style={styles.td}>{formatCurrency(order.price)}</td>
                    <td style={styles.td}>{formatCurrency(totalValue)}</td>
                    <td style={{ ...styles.td, color: getStatusColor(status) }}>
                      <span style={styles.statusBadge}>{status}</span>
                    </td>
                    <td style={styles.td}>
                      <div>{formatDate(order.createdAt || order.date)}</div>
                      {order.orderId && <small style={styles.orderId}>ID: {order.orderId}</small>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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
  controls: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "16px",
  },
  filterButtons: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  filterBtn: {
    padding: "8px 16px",
    background: "var(--bg-card, #13171f)",
    border: "1px solid var(--border, #222733)",
    borderRadius: "8px",
    color: "var(--text-muted, #8b9bb0)",
    cursor: "pointer",
    fontSize: "0.85rem",
    transition: "all 0.2s",
  },
  filterBtnActive: {
    background: "var(--blue, #3b82f6)",
    color: "white",
    borderColor: "var(--blue, #3b82f6)",
  },
  sortControls: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  select: {
    padding: "8px 12px",
    background: "var(--bg-card, #13171f)",
    border: "1px solid var(--border, #222733)",
    borderRadius: "8px",
    color: "var(--text-main, #eef2ff)",
    cursor: "pointer",
    fontSize: "0.85rem",
  },
  sortOrderBtn: {
    padding: "8px 12px",
    background: "var(--bg-card, #13171f)",
    border: "1px solid var(--border, #222733)",
    borderRadius: "8px",
    color: "var(--text-main, #eef2ff)",
    cursor: "pointer",
    fontSize: "1rem",
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
  exchange: {
    display: "block",
    fontSize: "0.7rem",
    color: "var(--text-dim, #5f6f84)",
  },
  orderId: {
    display: "block",
    fontSize: "0.65rem",
    color: "var(--text-dim, #5f6f84)",
    marginTop: "4px",
  },
  statusBadge: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: "500",
    background: "rgba(255, 255, 255, 0.05)",
  },
};

export default Orders;