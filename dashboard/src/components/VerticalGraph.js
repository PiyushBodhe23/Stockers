import React, { useMemo } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Dark theme chart options
export const createChartOptions = (title, isDarkTheme = true) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      labels: {
        color: isDarkTheme ? "#eef2ff" : "#333333",
        font: {
          size: 11,
          family: "'Inter', -apple-system, sans-serif",
          weight: "500",
        },
        usePointStyle: true,
        pointStyle: "circle",
        padding: 15,
      },
    },
    title: {
      display: !!title,
      text: title || "Portfolio Distribution",
      color: isDarkTheme ? "#eef2ff" : "#333333",
      font: {
        size: 14,
        family: "'Inter', -apple-system, sans-serif",
        weight: "600",
      },
      padding: {
        top: 10,
        bottom: 20,
      },
    },
    tooltip: {
      backgroundColor: isDarkTheme ? "#13171f" : "#ffffff",
      titleColor: isDarkTheme ? "#eef2ff" : "#333333",
      bodyColor: isDarkTheme ? "#8b9bb0" : "#666666",
      borderColor: isDarkTheme ? "#222733" : "#e0e0e0",
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || "";
          let value = context.raw;
          let formattedValue = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(value);
          
          if (label) {
            return `${label}: ${formattedValue}`;
          }
          return formattedValue;
        },
      },
    },
  },
  scales: {
    y: {
      grid: {
        color: isDarkTheme ? "#222733" : "#e0e0e0",
        drawBorder: false,
      },
      ticks: {
        color: isDarkTheme ? "#8b9bb0" : "#666666",
        font: {
          size: 10,
        },
        callback: function(value) {
          if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
          if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
          if (value >= 1000) return `₹${(value / 1000).toFixed(0)}k`;
          return `₹${value}`;
        },
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: isDarkTheme ? "#8b9bb0" : "#666666",
        font: {
          size: 10,
        },
        maxRotation: 45,
        minRotation: 45,
      },
    },
  },
  elements: {
    bar: {
      borderRadius: 6,
      borderSkipped: false,
    },
  },
  animation: {
    duration: 800,
    easing: 'easeInOutQuart',
  },
  interaction: {
    intersect: false,
    mode: 'index',
  },
});

// Default dark theme color palette for trading platform
const defaultColors = [
  "#00c48c", // Green - Profit/Equity
  "#3b82f6", // Blue - Holdings
  "#f97316", // Orange - Commodities
  "#a855f7", // Purple - Derivatives
  "#ef4444", // Red - Loss
  "#8b5cf6", // Violet - Others
  "#ec4899", // Pink - F&O
  "#14b8a6", // Teal - Currency
  "#f59e0b", // Amber - Debt
  "#6b7280", // Gray - Cash
];

// Process data with validation and dark theme colors
const processChartData = (data, customColors = null) => {
  if (!data || !data.datasets || !data.datasets.length) {
    return {
      labels: ["No Data Available"],
      datasets: [
        {
          label: "Value",
          data: [0],
          backgroundColor: ["#2a2f3c"],
          borderColor: ["#13171f"],
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    };
  }

  const colors = customColors || defaultColors;
  
  const processedDatasets = data.datasets.map((dataset, index) => ({
    ...dataset,
    backgroundColor: dataset.backgroundColor || colors,
    borderColor: dataset.borderColor || "#13171f",
    borderWidth: dataset.borderWidth || 1,
    borderRadius: dataset.borderRadius || 6,
    hoverBackgroundColor: dataset.hoverBackgroundColor || colors.map(c => c + "cc"),
    barPercentage: dataset.barPercentage || 0.7,
    categoryPercentage: dataset.categoryPercentage || 0.8,
  }));

  return {
    ...data,
    datasets: processedDatasets,
  };
};

export function VerticalGraph({ 
  data, 
  title = "Holdings Distribution", 
  height = 300, 
  width = "100%",
  isDarkTheme = true,
  customColors = null,
  showLoading = true,
}) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    // Simulate loading for better UX
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, [data]);

  // Process data with memoization for performance
  const chartData = useMemo(() => {
    try {
      return processChartData(data, customColors);
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [data, customColors]);

  const chartOptions = useMemo(() => {
    return createChartOptions(title, isDarkTheme);
  }, [title, isDarkTheme]);

  // Check if data is valid
  const hasValidData = () => {
    if (!chartData) return false;
    if (!chartData.labels || chartData.labels.length === 0) return false;
    if (!chartData.datasets || chartData.datasets.length === 0) return false;
    if (!chartData.datasets[0].data || chartData.datasets[0].data.length === 0) return false;
    // Check if the only data point is the "No Data Available" placeholder
    if (chartData.labels.length === 1 && chartData.labels[0] === "No Data Available") return false;
    return true;
  };

  // Loading state
  if (isLoading && showLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading chart...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorIcon}>📊</div>
        <p style={styles.errorText}>Failed to load chart</p>
        <p style={styles.errorDetail}>{error}</p>
      </div>
    );
  }

  // Empty state
  if (!hasValidData()) {
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.emptyIcon}>📉</div>
        <p style={styles.emptyText}>No data available to display</p>
        <p style={styles.emptySubtext}>Start trading to see your portfolio distribution</p>
      </div>
    );
  }

  return (
    <div style={{ ...styles.container, height, width }}>
      <Bar 
        data={chartData} 
        options={chartOptions}
        fallbackContent={<div style={styles.fallback}>Chart failed to load</div>}
      />
    </div>
  );
}

// Styles for dark theme
const styles = {
  container: {
    position: "relative",
    background: "var(--bg-card, #13171f)",
    borderRadius: "16px",
    padding: "16px",
    border: "1px solid var(--border, #222733)",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "300px",
    background: "var(--bg-card, #13171f)",
    borderRadius: "16px",
    border: "1px solid var(--border, #222733)",
  },
  spinner: {
    width: "32px",
    height: "32px",
    border: "3px solid var(--border, #222733)",
    borderTopColor: "var(--blue, #3b82f6)",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: {
    marginTop: "12px",
    color: "var(--text-muted, #8b9bb0)",
    fontSize: "0.85rem",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "300px",
    background: "var(--bg-card, #13171f)",
    borderRadius: "16px",
    border: "1px solid var(--border, #222733)",
  },
  errorIcon: {
    fontSize: "32px",
    marginBottom: "12px",
  },
  errorText: {
    color: "var(--red, #ff5a5f)",
    fontSize: "0.9rem",
    marginBottom: "4px",
  },
  errorDetail: {
    color: "var(--text-muted, #8b9bb0)",
    fontSize: "0.75rem",
  },
  emptyContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "300px",
    background: "var(--bg-card, #13171f)",
    borderRadius: "16px",
    border: "1px solid var(--border, #222733)",
  },
  emptyIcon: {
    fontSize: "48px",
    marginBottom: "16px",
    opacity: 0.5,
  },
  emptyText: {
    color: "var(--text-muted, #8b9bb0)",
    fontSize: "0.9rem",
    marginBottom: "4px",
  },
  emptySubtext: {
    color: "var(--text-dim, #5f6f84)",
    fontSize: "0.75rem",
  },
  fallback: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "300px",
    color: "var(--red, #ff5a5f)",
  },
};

// Helper component for portfolio distribution chart
export const PortfolioDistributionChart = ({ holdings, title = "Portfolio Distribution" }) => {
  const chartData = useMemo(() => {
    if (!holdings || holdings.length === 0) {
      return null;
    }

    // Sort by value and take top 10
    const sortedHoldings = [...holdings]
      .sort((a, b) => (b.price * b.qty) - (a.price * a.qty))
      .slice(0, 10);

    return {
      labels: sortedHoldings.map(h => h.name),
      datasets: [
        {
          label: "Current Value (₹)",
          data: sortedHoldings.map(h => h.price * h.qty),
          backgroundColor: defaultColors,
        },
      ],
    };
  }, [holdings]);

  if (!chartData) {
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.emptyIcon}>📊</div>
        <p style={styles.emptyText}>No holdings to display</p>
      </div>
    );
  }

  return <VerticalGraph data={chartData} title={title} />;
};

// Helper component for sector allocation chart
export const SectorAllocationChart = ({ sectors, title = "Sector Allocation" }) => {
  const chartData = useMemo(() => {
    if (!sectors || sectors.length === 0) {
      return null;
    }

    return {
      labels: sectors.map(s => s.name),
      datasets: [
        {
          label: "Allocation (%)",
          data: sectors.map(s => s.percentage),
          backgroundColor: defaultColors,
        },
      ],
    };
  }, [sectors]);

  if (!chartData) {
    return null;
  }

  return <VerticalGraph data={chartData} title={title} />;
};

// Add animation to global styles (only once)
if (typeof document !== 'undefined' && !document.querySelector('#vertical-graph-styles')) {
  const styleSheet = document.createElement("style");
  styleSheet.id = "vertical-graph-styles";
  styleSheet.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default VerticalGraph;