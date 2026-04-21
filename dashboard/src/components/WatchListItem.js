import React, { useContext, useCallback } from "react";
import GeneralContext from "./GeneralContext";

const WatchListItem = ({ stock, onRemove }) => {
  const { openBuyWindow, openSellWindow } = useContext(GeneralContext);
  
  const isPositive = (stock.change || 0) >= 0;
  
  const handleBuyClick = useCallback(() => {
    openBuyWindow(stock.name, stock);
  }, [openBuyWindow, stock]);
  
  const handleSellClick = useCallback(() => {
    openSellWindow(stock.name, stock);
  }, [openSellWindow, stock]);
  
  const handleRemoveClick = useCallback((e) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove();
    }
  }, [onRemove]);
  
  return (
    <li className="watchlist-item" style={styles.listItem}>
      <div className="item" style={styles.item}>
        <div className="item-info" style={styles.itemInfo}>
          <div style={styles.stockInfo}>
            <span style={styles.stockName}>{stock.name || "N/A"}</span>
            <span style={styles.stockSymbol}>{stock.symbol || stock.name || "N/A"}</span>
          </div>
          <div style={styles.priceInfo}>
            <span style={styles.stockPrice}>
              ₹{(stock.price || 0).toFixed(2)}
            </span>
            <span style={{ 
              ...styles.stockChange, 
              color: isPositive ? 'var(--green, #00c48c)' : 'var(--red, #ff5a5f)' 
            }}>
              {isPositive ? '+' : ''}{(stock.change || 0).toFixed(2)} 
              ({isPositive ? '+' : ''}{(stock.changePercent || 0).toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="actions" style={styles.actions}>
          <button 
            className="buy" 
            style={styles.buyBtn} 
            onClick={handleBuyClick}
            aria-label={`Buy ${stock.name}`}
          >
            BUY
          </button>
          <button 
            className="sell" 
            style={styles.sellBtn} 
            onClick={handleSellClick}
            aria-label={`Sell ${stock.name}`}
          >
            SELL
          </button>
          {onRemove && (
            <button 
              className="remove" 
              style={styles.removeBtn} 
              onClick={handleRemoveClick}
              aria-label={`Remove ${stock.name} from watchlist`}
            >
              ×
            </button>
          )}
        </div>
      </div>
    </li>
  );
};

const styles = {
  listItem: {
    borderBottom: "1px solid var(--border-light, #2a2f3c)",
    padding: "12px 16px",
    position: "relative",
    transition: "background 0.2s",
    listStyle: "none",
    cursor: "default",
  },
  item: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    gap: "16px",
  },
  stockInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    flex: 1,
  },
  stockName: {
    fontWeight: "600",
    color: "var(--text-main, #eef2ff)",
    fontSize: "0.9rem",
  },
  stockSymbol: {
    fontSize: "0.7rem",
    color: "var(--text-dim, #5f6f84)",
  },
  priceInfo: {
    textAlign: "right",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    minWidth: "100px",
  },
  stockPrice: {
    fontWeight: "500",
    color: "var(--text-main, #eef2ff)",
    fontSize: "0.9rem",
  },
  stockChange: {
    fontSize: "0.75rem",
  },
  actions: {
    display: "none",
    position: "absolute",
    right: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    gap: "8px",
    background: "linear-gradient(90deg, transparent, var(--bg-hover, #1e2530) 20%)",
    paddingLeft: "40px",
  },
  buyBtn: {
    background: "var(--blue, #3b82f6)",
    color: "white",
    border: "none",
    padding: "6px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.7rem",
    fontWeight: "600",
    transition: "all 0.2s",
  },
  sellBtn: {
    background: "var(--red, #ff5a5f)",
    color: "white",
    border: "none",
    padding: "6px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.7rem",
    fontWeight: "600",
    transition: "all 0.2s",
  },
  removeBtn: {
    background: "var(--bg-elevated, #0f1219)",
    color: "var(--text-muted, #8b9bb0)",
    border: "1px solid var(--border, #222733)",
    borderRadius: "6px",
    width: "28px",
    height: "28px",
    cursor: "pointer",
    fontSize: "1.2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
  },
};

// Add hover styles to global CSS
if (typeof document !== 'undefined' && !document.querySelector('#watchlist-item-styles')) {
  const styleSheet = document.createElement("style");
  styleSheet.id = "watchlist-item-styles";
  styleSheet.textContent = `
    .watchlist-item:hover {
      background: var(--bg-hover, #1e2530);
    }
    
    .watchlist-item:hover .actions {
      display: flex !important;
    }
    
    .buy:hover {
      background: #609cff !important;
      transform: translateY(-1px);
    }
    
    .sell:hover {
      background: #ff7a7f !important;
      transform: translateY(-1px);
    }
    
    .remove:hover {
      background: var(--bg-hover, #1e2530) !important;
      color: var(--red, #ff5a5f) !important;
      border-color: var(--red, #ff5a5f) !important;
    }
    
    .buy:active, .sell:active, .remove:active {
      transform: translateY(0);
    }
  `;
  document.head.appendChild(styleSheet);
}

export default WatchListItem;