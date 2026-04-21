import React, { useState, useContext, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid, stockDetails = {} }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [marginRequired, setMarginRequired] = useState(0);
  const abortControllerRef = useRef(null);
  
  const { closeWindows } = useContext(GeneralContext);
  const { token, isAuthenticated } = useAuth();

  // Calculate margin when quantity or price changes
  useEffect(() => {
    if (stockQuantity > 0 && stockPrice > 0) {
      const totalValue = stockQuantity * stockPrice;
      const margin = totalValue * 0.2; // 20% margin
      setMarginRequired(margin);
    } else {
      setMarginRequired(0);
    }
  }, [stockQuantity, stockPrice]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const validateInputs = () => {
    if (!stockQuantity || stockQuantity <= 0) {
      setError("Please enter a valid quantity (minimum 1)");
      return false;
    }
    
    if (!Number.isInteger(Number(stockQuantity))) {
      setError("Quantity must be a whole number");
      return false;
    }
    
    if (!stockPrice || stockPrice <= 0) {
      setError("Please enter a valid price");
      return false;
    }
    
    if (stockPrice < 0.05) {
      setError("Minimum price is ₹0.05");
      return false;
    }
    
    return true;
  };

  const handleBuyClick = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!validateInputs()) {
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    // Check authentication
    if (!isAuthenticated || !token) {
      setError("Please login to continue");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
      return;
    }
    
    // Prevent multiple submissions
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    // Create abort controller for this request
    abortControllerRef.current = new AbortController();
    
    try {
      const response = await api.post('/orders', {
        name: uid,
        qty: Number(stockQuantity),
        price: Number(stockPrice),
        mode: "BUY",
        timestamp: new Date().toISOString(),
      }, {
        signal: abortControllerRef.current.signal,
      });
      
      if (response.data) {
        console.log("Order Created:", response.data);
        
        // Show success message
        alert(`✅ Order placed successfully!\n\nStock: ${uid}\nQuantity: ${stockQuantity}\nPrice: ₹${stockPrice}\nTotal: ₹${(stockQuantity * stockPrice).toLocaleString('en-IN')}`);
        
        // Close window after successful order
        closeWindows();
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
      } else if (error.response?.status === 400) {
        setError(error.response.data?.message || "Invalid order details");
      } else if (error.response?.status === 429) {
        setError("Too many requests. Please try again in a few seconds.");
      } else if (error.code === "ECONNABORTED") {
        setError("Request timeout. Please check your connection.");
      } else {
        setError(error.response?.data?.message || "Failed to place order. Please try again.");
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

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (isNaN(value)) {
      setStockQuantity(1);
    } else if (value > 999999) {
      setStockQuantity(999999);
      setError("Maximum quantity limit is 999,999");
      setTimeout(() => setError(null), 2000);
    } else {
      setStockQuantity(Math.max(1, value));
    }
  };

  const handlePriceChange = (e) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value)) {
      setStockPrice(0);
    } else if (value > 9999999) {
      setStockPrice(9999999);
      setError("Maximum price limit is ₹99,99,999");
      setTimeout(() => setError(null), 2000);
    } else {
      setStockPrice(Math.max(0, value));
    }
  };

  const totalValue = stockQuantity * stockPrice;
  const isBuyDisabled = isLoading || !stockQuantity || !stockPrice || stockQuantity <= 0 || stockPrice <= 0;

  return (
    <div className="buy-window-container" id="buy-window">
      <div className="buy-window-header">
        <h3>Buy {uid || 'Stock'}</h3>
        <button className="close-btn" onClick={handleCancel} disabled={isLoading}>
          ×
        </button>
      </div>
      
      <div className="regular-order">
        <div className="inputs">
          <fieldset className="input-fieldset">
            <legend>Quantity</legend>
            <input
              type="number"
              onChange={handleQuantityChange}
              value={stockQuantity}
              min="1"
              max="999999"
              step="1"
              disabled={isLoading}
              placeholder="Enter quantity"
              autoFocus
            />
          </fieldset>

          <fieldset className="input-fieldset">
            <legend>Price (₹)</legend>
            <input
              type="number"
              step="0.05"
              onChange={handlePriceChange}
              value={stockPrice}
              min="0.05"
              max="9999999"
              disabled={isLoading}
              placeholder="Enter price"
            />
          </fieldset>
        </div>
        
        {/* Order Summary */}
        {stockQuantity > 0 && stockPrice > 0 && (
          <div className="order-summary">
            <div className="summary-row">
              <span>Total Value:</span>
              <span className="total-value">₹{totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="summary-row">
              <span>Margin Required (20%):</span>
              <span className="margin-value">₹{marginRequired.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{error}</span>
        </div>
      )}

      <div className="buttons">
        <div className="margin-info">
          <span className="margin-label">Available Margin:</span>
          <span className="margin-amount">₹1,40,000.00</span>
        </div>
        <div className="action-buttons">
          <button 
            className={`btn btn-blue ${isLoading ? 'loading' : ''}`} 
            onClick={handleBuyClick}
            disabled={isBuyDisabled}
          >
            {isLoading ? (
              <>
                <span className="spinner-small"></span>
                Processing...
              </>
            ) : (
              'Buy'
            )}
          </button>
          <button 
            className="btn btn-grey" 
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;