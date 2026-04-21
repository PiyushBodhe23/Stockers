import React, { useState, useContext, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import GeneralContext from "./GeneralContext";
import api from "../services/api";

const SellActionWindow = ({ uid, stockDetails = {} }) => {
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [marginRequired, setMarginRequired] = useState(0);
  const [maxQty, setMaxQty] = useState(0);
  const [availableQty, setAvailableQty] = useState(0);
  
  const { closeWindows } = useContext(GeneralContext);
  const abortControllerRef = useRef(null);

  // Fetch available quantity from holdings
  useEffect(() => {
    const fetchAvailableQty = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        
        const response = await api.get('/holdings');
        
        const holding = response.data.find(h => h.name === uid);
        if (holding) {
          const available = holding.qty || 0;
          setAvailableQty(available);
          setMaxQty(available);
        }
      } catch (err) {
        console.error("Failed to fetch holdings:", err);
      }
    };
    
    fetchAvailableQty();
  }, [uid]);

  // Calculate margin when quantity or price changes
  useEffect(() => {
    if (qty > 0 && price > 0) {
      const totalValue = qty * price;
      // Calculate margin (example: 20% of total value for selling)
      const margin = totalValue * 0.2;
      setMarginRequired(margin);
    } else {
      setMarginRequired(0);
    }
  }, [qty, price]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const validateInputs = useCallback(() => {
    if (!qty || qty <= 0) {
      setError("Please enter a valid quantity (minimum 1)");
      return false;
    }
    
    if (!Number.isInteger(Number(qty))) {
      setError("Quantity must be a whole number");
      return false;
    }
    
    if (qty > maxQty && maxQty > 0) {
      setError(`Cannot sell more than ${maxQty} shares. You only have ${maxQty} shares available.`);
      return false;
    }
    
    if (!price || price <= 0) {
      setError("Please enter a valid price");
      return false;
    }
    
    if (price < 0.05) {
      setError("Minimum price is ₹0.05");
      return false;
    }
    
    return true;
  }, [qty, price, maxQty]);

  const handleSellClick = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!validateInputs()) {
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    // Confirm sell action
    const confirmed = window.confirm(
      `⚠️ Confirm Sell Order\n\n` +
      `Stock: ${uid}\n` +
      `Quantity: ${qty}\n` +
      `Price: ₹${price.toFixed(2)}\n` +
      `Total Value: ₹${(qty * price).toLocaleString('en-IN')}\n\n` +
      `Are you sure you want to sell?`
    );
    
    if (!confirmed) return;
    
    // Prevent multiple submissions
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    // Create abort controller for this request
    abortControllerRef.current = new AbortController();
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      
      const response = await api.post('/orders', {
        name: uid,
        qty: Number(qty),
        price: Number(price),
        mode: "SELL",
        timestamp: new Date().toISOString(),
      }, {
        signal: abortControllerRef.current.signal,
      });
      
      if (response.data) {
        console.log("Sell Order Created:", response.data);
        
        // Show success message
        alert(
          `✅ Sell Order Placed Successfully!\n\n` +
          `Stock: ${uid}\n` +
          `Quantity: ${qty}\n` +
          `Price: ₹${price.toFixed(2)}\n` +
          `Total: ₹${(qty * price).toLocaleString('en-IN')}`
        );
        
        closeWindows();
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
      } else if (err.response?.status === 400) {
        setError(err.response.data?.message || "Invalid sell order details");
      } else if (err.response?.status === 403) {
        setError("Insufficient holdings to sell");
      } else if (err.code === "ECONNABORTED") {
        setError("Request timeout. Please check your connection.");
      } else {
        setError(err.response?.data?.message || "Failed to place sell order. Please try again.");
      }
      
      // Auto-clear error after 3 seconds
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    closeWindows();
  };

  const handleQtyChange = (e) => {
    const value = parseInt(e.target.value);
    if (isNaN(value)) {
      setQty(1);
    } else if (value > maxQty && maxQty > 0) {
      setQty(maxQty);
      setError(`Maximum quantity is ${maxQty} shares`);
      setTimeout(() => setError(null), 2000);
    } else {
      setQty(Math.max(1, value));
    }
  };

  const handleMaxQty = () => {
    if (maxQty > 0) {
      setQty(maxQty);
    }
  };

  const handlePriceChange = (e) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value)) {
      setPrice(0);
    } else {
      setPrice(Math.max(0, value));
    }
  };

  const totalValue = qty * price;
  const isSellDisabled = isLoading || !qty || !price || qty <= 0 || price <= 0 || qty > maxQty;

  return (
    <div className="sell-window-container" id="sell-window" style={styles.window}>
      <div className="sell-window-header" style={styles.header}>
        <h3 style={styles.title}>Sell {uid || 'Stock'}</h3>
        <button 
          className="close-btn" 
          onClick={handleCancel} 
          disabled={isLoading}
          style={styles.closeBtn}
        >
          ×
        </button>
      </div>
      
      <div className="regular-order" style={styles.body}>
        {/* Available Quantity Display */}
        {availableQty > 0 && (
          <div style={styles.availableQty}>
            <span>Available to sell:</span>
            <strong>{availableQty.toLocaleString()} shares</strong>
            <button onClick={handleMaxQty} style={styles.maxBtn} disabled={isLoading}>
              Max
            </button>
          </div>
        )}
        
        <div className="inputs" style={styles.inputsRow}>
          <fieldset style={styles.fieldset}>
            <legend style={styles.legend}>Quantity</legend>
            <input
              type="number"
              value={qty}
              onChange={handleQtyChange}
              min="1"
              max={maxQty || undefined}
              step="1"
              disabled={isLoading}
              placeholder="Enter quantity"
              style={styles.input}
              autoFocus
            />
          </fieldset>

          <fieldset style={styles.fieldset}>
            <legend style={styles.legend}>Price (₹)</legend>
            <input
              type="number"
              step="0.05"
              value={price}
              onChange={handlePriceChange}
              min="0.05"
              disabled={isLoading}
              placeholder="Enter price"
              style={styles.input}
            />
          </fieldset>
        </div>
        
        {/* Order Summary */}
        {qty > 0 && price > 0 && (
          <div style={styles.orderSummary}>
            <div style={styles.summaryRow}>
              <span>Total Value:</span>
              <span style={styles.totalValue}>₹{totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Margin Impact (20%):</span>
              <span style={styles.marginValue}>₹{marginRequired.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Estimated Credit:</span>
              <span style={styles.creditValue}>₹{(totalValue - marginRequired).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        )}
        
        {/* Available Holdings Warning */}
        {maxQty > 0 && qty > maxQty && (
          <div style={styles.warningBox}>
            ⚠️ Insufficient holdings. You have only {maxQty} shares available.
          </div>
        )}
        
        {/* Low Quantity Warning */}
        {availableQty > 0 && availableQty <= 10 && (
          <div style={styles.warningBox}>
            ⚠️ Low inventory warning: Only {availableQty} shares remaining.
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div style={styles.errorMessage}>
          <span style={styles.errorIcon}>⚠️</span>
          <span style={styles.errorText}>{error}</span>
        </div>
      )}

      <div className="buttons" style={styles.buttons}>
        <div style={styles.marginInfo}>
          <span style={styles.marginLabel}>Available Balance:</span>
          <span style={styles.marginAmount}>₹1,40,000.00</span>
        </div>
        <div style={styles.actionButtons}>
          <button 
            className={`btn btn-red ${isLoading ? 'loading' : ''}`} 
            onClick={handleSellClick}
            disabled={isSellDisabled}
            style={{ ...styles.sellButton, ...(isSellDisabled ? styles.disabledButton : {}) }}
          >
            {isLoading ? (
              <>
                <span style={styles.spinnerSmall}></span>
                Processing...
              </>
            ) : (
              'Sell'
            )}
          </button>
          <button 
            className="btn btn-grey" 
            onClick={handleCancel}
            disabled={isLoading}
            style={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Styles for dark theme
const styles = {
  window: {
    background: "var(--bg-card, #13171f)",
    borderRadius: "20px",
    width: "450px",
    maxWidth: "90vw",
    border: "1px solid var(--border, #222733)",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
    animation: "slideUp 0.3s ease-out",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 24px",
    background: "var(--bg-elevated, #0f1219)",
    borderBottom: "1px solid var(--border, #222733)",
  },
  title: {
    color: "var(--text-main, #eef2ff)",
    fontSize: "1.2rem",
    fontWeight: "600",
    margin: 0,
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "var(--text-muted, #8b9bb0)",
    fontSize: "1.8rem",
    cursor: "pointer",
    padding: 0,
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px",
    transition: "all 0.2s",
  },
  body: {
    padding: "24px",
  },
  availableQty: {
    background: "rgba(59, 130, 246, 0.1)",
    borderRadius: "8px",
    padding: "10px 12px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "0.85rem",
    color: "var(--text-main, #eef2ff)",
  },
  maxBtn: {
    background: "var(--blue, #3b82f6)",
    color: "white",
    border: "none",
    padding: "4px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.75rem",
    fontWeight: "600",
  },
  inputsRow: {
    display: "flex",
    gap: "16px",
    marginBottom: "24px",
  },
  fieldset: {
    flex: 1,
    border: "1px solid var(--border, #222733)",
    borderRadius: "12px",
    padding: "8px 12px",
    background: "var(--bg-elevated, #0f1219)",
  },
  legend: {
    color: "var(--text-muted, #8b9bb0)",
    fontSize: "0.7rem",
    padding: "0 8px",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    border: "none",
    background: "transparent",
    color: "var(--text-main, #eef2ff)",
    fontSize: "1rem",
    padding: "4px 0",
    outline: "none",
  },
  orderSummary: {
    background: "rgba(255, 90, 95, 0.05)",
    borderRadius: "12px",
    padding: "16px",
    marginTop: "16px",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    color: "var(--text-main, #eef2ff)",
    fontSize: "0.85rem",
  },
  totalValue: {
    color: "var(--red, #ff5a5f)",
    fontWeight: "600",
  },
  marginValue: {
    color: "var(--accent-orange, #f97316)",
    fontWeight: "600",
  },
  creditValue: {
    color: "var(--green, #00c48c)",
    fontWeight: "600",
  },
  warningBox: {
    background: "rgba(255, 90, 95, 0.1)",
    border: "1px solid var(--red, #ff5a5f)",
    borderRadius: "8px",
    padding: "10px",
    marginTop: "16px",
    fontSize: "0.8rem",
    color: "var(--red, #ff5a5f)",
    textAlign: "center",
  },
  errorMessage: {
    margin: "0 24px 16px 24px",
    padding: "12px",
    background: "rgba(255, 90, 95, 0.1)",
    border: "1px solid var(--red, #ff5a5f)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "var(--red, #ff5a5f)",
    fontSize: "0.85rem",
    animation: "shake 0.3s ease-out",
  },
  errorIcon: {
    fontSize: "1rem",
  },
  errorText: {
    flex: 1,
  },
  buttons: {
    padding: "20px 24px",
    background: "var(--bg-elevated, #0f1219)",
    borderTop: "1px solid var(--border, #222733)",
  },
  marginInfo: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "16px",
    paddingBottom: "12px",
    borderBottom: "1px solid var(--border-light, #2a2f3c)",
  },
  marginLabel: {
    color: "var(--text-muted, #8b9bb0)",
    fontSize: "0.8rem",
  },
  marginAmount: {
    color: "var(--text-main, #eef2ff)",
    fontWeight: "600",
    fontSize: "0.9rem",
  },
  actionButtons: {
    display: "flex",
    gap: "12px",
  },
  sellButton: {
    flex: 1,
    background: "var(--red, #ff5a5f)",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "all 0.2s",
  },
  cancelButton: {
    flex: 1,
    background: "var(--bg-hover, #1e2530)",
    color: "var(--text-muted, #8b9bb0)",
    border: "1px solid var(--border, #222733)",
    padding: "12px",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "all 0.2s",
  },
  disabledButton: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  spinnerSmall: {
    display: "inline-block",
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "white",
    borderRadius: "50%",
    animation: "spin 0.6s linear infinite",
    marginRight: "8px",
  },
};

export default SellActionWindow;