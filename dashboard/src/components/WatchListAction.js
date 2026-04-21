import { BarChartOutlined, MoreHoriz } from "@mui/icons-material";
import { Grow, Tooltip, Menu, MenuItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import React, { useContext, useState, useCallback, useEffect } from "react";
import GeneralContext from "./GeneralContext";

function WatchListAction({ uid, stockDetails = {} }) {
  const generalContext = useContext(GeneralContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState({ buy: false, sell: false });
  const open = Boolean(anchorEl);

  const handleBuyClick = useCallback(async () => {
    setIsLoading(prev => ({ ...prev, buy: true }));
    try {
      // Pass full stock details to buy window
      generalContext.openBuyWindow(uid, stockDetails);
    } catch (error) {
      console.error("Buy action error:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, buy: false }));
    }
  }, [uid, stockDetails, generalContext]);

  const handleSellClick = useCallback(async () => {
    setIsLoading(prev => ({ ...prev, sell: true }));
    try {
      generalContext.openSellWindow(uid, stockDetails);
    } catch (error) {
      console.error("Sell action error:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, sell: false }));
    }
  }, [uid, stockDetails, generalContext]);

  const handleAnalyticsClick = useCallback(() => {
    // Open analytics modal or navigate to stock details page
    console.log("Open analytics for:", uid, stockDetails);
    alert(`📊 Analytics for ${stockDetails.name || uid}\n\nFeature coming soon!`);
  }, [uid, stockDetails]);

  const handleMoreClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddToWatchlist = () => {
    console.log("Add to watchlist:", uid);
    handleMenuClose();
  };

  const handleViewDetails = () => {
    console.log("View details for:", uid);
    handleMenuClose();
  };

  const handleSetAlert = () => {
    console.log("Set price alert for:", uid);
    handleMenuClose();
  };

  const handleViewOrderHistory = () => {
    console.log("View order history for:", uid);
    handleMenuClose();
  };

  // Check if market is open (9:15 AM to 3:30 PM IST)
  const isMarketOpen = useCallback(() => {
    const now = new Date();
    // Convert to IST (UTC+5:30)
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(now.getTime() + istOffset);
    const hours = istTime.getUTCHours();
    const minutes = istTime.getUTCMinutes();
    const currentTime = hours + minutes / 60;
    return currentTime >= 9.25 && currentTime <= 15.30;
  }, []);

  const marketOpen = isMarketOpen();
  const isBuyDisabled = isLoading.buy || !marketOpen;
  const isSellDisabled = isLoading.sell || !marketOpen;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Don't trigger if typing in input fields
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.tagName === 'SELECT') {
        return;
      }
      
      switch (event.key.toLowerCase()) {
        case 'b':
          if (!isBuyDisabled) {
            event.preventDefault();
            handleBuyClick();
          }
          break;
        case 's':
          if (!isSellDisabled) {
            event.preventDefault();
            handleSellClick();
          }
          break;
        case 'a':
          event.preventDefault();
          handleAnalyticsClick();
          break;
        case 'm':
          event.preventDefault();
          handleMoreClick(event);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isBuyDisabled, isSellDisabled, handleBuyClick, handleSellClick, handleAnalyticsClick]);

  return (
    <span className="actions" style={styles.container}>
      {/* BUY Button */}
      <span>
        <Tooltip 
          title={marketOpen ? "Buy (B)" : "Market Closed"} 
          placement="top" 
          arrow 
          TransitionComponent={Grow}
        >
          <button 
            className="buy" 
            onClick={handleBuyClick}
            disabled={isBuyDisabled}
            style={{
              ...styles.buyBtn,
              ...(isBuyDisabled ? styles.disabledBtn : {}),
              ...(isLoading.buy ? styles.loadingBtn : {}),
            }}
          >
            {isLoading.buy ? "..." : "Buy"}
          </button>
        </Tooltip>
      </span>

      {/* SELL Button */}
      <span>
        <Tooltip 
          title={marketOpen ? "Sell (S)" : "Market Closed"} 
          placement="top" 
          arrow 
          TransitionComponent={Grow}
        >
          <button 
            className="sell" 
            onClick={handleSellClick}
            disabled={isSellDisabled}
            style={{
              ...styles.sellBtn,
              ...(isSellDisabled ? styles.disabledBtn : {}),
              ...(isLoading.sell ? styles.loadingBtn : {}),
            }}
          >
            {isLoading.sell ? "..." : "Sell"}
          </button>
        </Tooltip>
      </span>

      {/* ANALYTICS Button */}
      <span>
        <Tooltip title="Analytics (A)" placement="top" arrow TransitionComponent={Grow}>
          <button className="action" onClick={handleAnalyticsClick} style={styles.actionBtn}>
            <BarChartOutlined className="icon" style={styles.icon} />
          </button>
        </Tooltip>
      </span>

      {/* MORE Button with Dropdown Menu */}
      <span>
        <Tooltip title="More (M)" placement="top" arrow TransitionComponent={Grow}>
          <button className="action" onClick={handleMoreClick} style={styles.actionBtn}>
            <MoreHoriz className="icon" style={styles.icon} />
          </button>
        </Tooltip>
      </span>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        TransitionComponent={Grow}
        PaperProps={{
          style: styles.menuPaper,
        }}
      >
        <MenuItem onClick={handleViewDetails} style={styles.menuItem}>
          <ListItemIcon>
            <BarChartOutlined fontSize="small" style={styles.menuIcon} />
          </ListItemIcon>
          <ListItemText primary="View Details" />
        </MenuItem>
        
        <MenuItem onClick={handleAddToWatchlist} style={styles.menuItem}>
          <ListItemIcon>
            <span style={styles.menuIcon}>⭐</span>
          </ListItemIcon>
          <ListItemText primary="Add to Watchlist" />
        </MenuItem>
        
        <MenuItem onClick={handleSetAlert} style={styles.menuItem}>
          <ListItemIcon>
            <span style={styles.menuIcon}>🔔</span>
          </ListItemIcon>
          <ListItemText primary="Set Price Alert" />
        </MenuItem>
        
        <MenuItem onClick={handleViewOrderHistory} style={styles.menuItem}>
          <ListItemIcon>
            <span style={styles.menuIcon}>📜</span>
          </ListItemIcon>
          <ListItemText primary="Order History" />
        </MenuItem>
        
        <Divider style={styles.divider} />
        
        <MenuItem onClick={handleMenuClose} style={styles.menuItem}>
          <ListItemIcon>
            <span style={styles.menuIcon}>❌</span>
          </ListItemIcon>
          <ListItemText primary="Close" />
        </MenuItem>
      </Menu>

      {/* Market Status Indicator */}
      {!marketOpen && (
        <Tooltip title="Market is currently closed" placement="top">
          <span style={styles.marketClosedBadge}>🔒</span>
        </Tooltip>
      )}
    </span>
  );
}

// Styles for dark theme
const styles = {
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "6px",
    background: "linear-gradient(90deg, transparent, var(--bg-hover, #1e2530) 15%)",
    paddingRight: "12px",
    opacity: 0,
    transition: "opacity 0.2s",
  },
  buyBtn: {
    background: "var(--blue, #3b82f6)",
    color: "white",
    border: "none",
    padding: "5px 12px",
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
    padding: "5px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.7rem",
    fontWeight: "600",
    transition: "all 0.2s",
  },
  actionBtn: {
    background: "var(--bg-elevated, #0f1219)",
    color: "var(--text-muted, #8b9bb0)",
    border: "1px solid var(--border, #222733)",
    borderRadius: "6px",
    width: "28px",
    height: "28px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
  },
  icon: {
    fontSize: "16px",
  },
  disabledBtn: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  loadingBtn: {
    opacity: 0.7,
    cursor: "wait",
  },
  menuPaper: {
    background: "var(--bg-card, #13171f)",
    border: "1px solid var(--border, #222733)",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)",
    marginTop: "8px",
  },
  menuItem: {
    color: "var(--text-main, #eef2ff)",
    fontSize: "0.85rem",
    padding: "8px 16px",
    minWidth: "180px",
    transition: "background 0.2s",
  },
  menuIcon: {
    color: "var(--text-muted, #8b9bb0)",
    fontSize: "18px",
  },
  divider: {
    background: "var(--border, #222733)",
    margin: "4px 0",
  },
  marketClosedBadge: {
    position: "absolute",
    left: "8px",
    fontSize: "12px",
    opacity: 0.6,
    cursor: "help",
  },
};

// CSS hover effect (add to your global CSS only once)
if (typeof document !== 'undefined' && !document.querySelector('#watchlist-action-styles')) {
  const styleSheet = document.createElement("style");
  styleSheet.id = "watchlist-action-styles";
  styleSheet.textContent = `
    .watchlist-item:hover .actions {
      opacity: 1 !important;
    }
    
    .buy:hover:not(:disabled) {
      background: #609cff !important;
      transform: translateY(-1px);
    }
    
    .sell:hover:not(:disabled) {
      background: #ff7a7f !important;
      transform: translateY(-1px);
    }
    
    .action:hover {
      background: var(--bg-hover, #1e2530) !important;
      color: var(--text-main, #eef2ff) !important;
    }
    
    .MuiMenuItem-root:hover {
      background: var(--bg-hover, #1e2530) !important;
    }
  `;
  document.head.appendChild(styleSheet);
}

export default WatchListAction;