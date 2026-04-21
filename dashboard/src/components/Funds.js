import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Funds = () => {
  const [fundsData, setFundsData] = useState({
    availableMargin: 0,
    usedMargin: 0,
    availableCash: 0,
    openingBalance: 0,
    dayBalance: 0,
    payin: 0,
    span: 0,
    deliveryMargin: 0,
    exposure: 0,
    optionsPremium: 0,
    collateralLiquid: 0,
    collateralEquity: 0,
    totalCollateral: 0,
    isLoading: true,
    error: null,
  });

  // Fetch real data from API
  useEffect(() => {
    fetchFundsData();
  }, []);

  const fetchFundsData = async () => {
    setFundsData(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await api.get('/funds');
      setFundsData({
        ...response.data,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Failed to load funds:", error);
      setFundsData(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.response?.data?.error || "Failed to load funds data" 
      }));
    }
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

  const formatCompactCurrency = (amount) => {
    if (!amount && amount !== 0) return "₹0";
    const num = amount;
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)}Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)}L`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  if (fundsData.isLoading) {
    return (
      <div className="funds-loading" style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading funds data...</p>
      </div>
    );
  }

  if (fundsData.error) {
    return (
      <div className="funds-error" style={styles.errorContainer}>
        <p style={styles.errorText}>⚠️ {fundsData.error}</p>
        <button onClick={fetchFundsData} style={styles.retryButton}>Retry</button>
      </div>
    );
  }

  return (
    <>
      <div className="funds">
        <p>💳 Instant, zero-cost fund transfers with UPI</p>
        <Link to="/add-funds" className="btn btn-green">+ Add funds</Link>
        <Link to="/withdraw" className="btn btn-blue">- Withdraw</Link>
      </div>

      <div className="row">
        {/* Equity Section */}
        <div className="col">
          <span className="section-header">
            <span className="section-icon">📈</span>
            <p>Equity Margin</p>
          </span>

          <div className="table funds-table">
            {/* Key Metrics */}
            <div className="data metric-card">
              <div className="metric-label">
                <span>💰 Available margin</span>
                <span className="info-icon" title="Total margin available for trading">ⓘ</span>
              </div>
              <p className="imp colored">{formatCurrency(fundsData.availableMargin)}</p>
            </div>
            
            <div className="data metric-card">
              <div className="metric-label">🔒 Used margin</div>
              <p className="imp">{formatCurrency(fundsData.usedMargin)}</p>
              {fundsData.availableMargin > 0 && (
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${Math.min((fundsData.usedMargin / fundsData.availableMargin) * 100, 100)}%` }}
                  ></div>
                </div>
              )}
            </div>
            
            <div className="data metric-card">
              <div className="metric-label">💵 Available cash</div>
              <p className="imp">{formatCurrency(fundsData.availableCash)}</p>
            </div>

            <hr className="divider" />

            {/* Balance Details */}
            <div className="data-group">
              <h4 className="group-title">Balance Summary</h4>
              <div className="data-row">
                <span>Opening Balance</span>
                <span>{formatCurrency(fundsData.openingBalance)}</span>
              </div>
              <div className="data-row">
                <span>Day's Balance</span>
                <span className={fundsData.dayBalance >= 0 ? 'profit' : 'loss'}>
                  {formatCurrency(fundsData.dayBalance)}
                </span>
              </div>
              <div className="data-row">
                <span>Pay-in</span>
                <span>{formatCurrency(fundsData.payin)}</span>
              </div>
            </div>

            <hr className="divider" />

            {/* Margin Details */}
            <div className="data-group">
              <h4 className="group-title">Margin Utilization</h4>
              <div className="data-row">
                <span>SPAN Margin</span>
                <span>{formatCurrency(fundsData.span)}</span>
              </div>
              <div className="data-row">
                <span>Delivery Margin</span>
                <span>{formatCurrency(fundsData.deliveryMargin)}</span>
              </div>
              <div className="data-row">
                <span>Exposure</span>
                <span>{formatCurrency(fundsData.exposure)}</span>
              </div>
              <div className="data-row">
                <span>Options Premium</span>
                <span>{formatCurrency(fundsData.optionsPremium)}</span>
              </div>
            </div>

            <hr className="divider" />

            {/* Collateral Section */}
            <div className="data-group">
              <h4 className="group-title">Collateral Details</h4>
              <div className="data-row">
                <span>Liquid Funds</span>
                <span>{formatCurrency(fundsData.collateralLiquid)}</span>
              </div>
              <div className="data-row">
                <span>Equity</span>
                <span>{formatCurrency(fundsData.collateralEquity)}</span>
              </div>
              <div className="data-row total">
                <span>Total Collateral</span>
                <span className="colored">{formatCurrency(fundsData.totalCollateral)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Commodity Section - Enhanced */}
        <div className="col">
          <div className="commodity-card">
            <div className="commodity-icon">🛢️</div>
            <p className="commodity-title">Commodity Trading</p>
            <p className="commodity-description">
              Trade in Gold, Silver, Crude Oil, Natural Gas & more
            </p>
            
            <div className="commodity-benefits">
              <div className="benefit-item">
                <span>✅</span>
                <span>Competitive margins</span>
              </div>
              <div className="benefit-item">
                <span>⚡</span>
                <span>Real-time pricing</span>
              </div>
              <div className="benefit-item">
                <span>📊</span>
                <span>Advanced charts</span>
              </div>
            </div>

            <Link to="/open-commodity" className="btn btn-blue open-account-btn">
              Open Commodity Account →
            </Link>
            
            <p className="commodity-note">
              *T&C apply. Commodity trading involves risk.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

// Styles object
const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px',
    background: '#13171f',
    borderRadius: '20px',
    margin: '20px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #222733',
    borderTopColor: '#3b82f6',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: {
    marginTop: '16px',
    color: '#8b9bb0',
  },
  errorContainer: {
    textAlign: 'center',
    padding: '40px',
    background: '#13171f',
    borderRadius: '20px',
    margin: '20px',
  },
  errorText: {
    color: '#ff5a5f',
    marginBottom: '16px',
  },
  retryButton: {
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '8px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};

export default Funds;