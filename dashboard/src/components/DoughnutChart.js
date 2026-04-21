import React, { useMemo } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export function DoughnutChart({ data, title, height = 200, width = 200 }) {
  
  // Default empty chart data with dark theme colors
  const defaultData = {
    labels: ["No Data Available"],
    datasets: [
      {
        data: [1],
        backgroundColor: ["#2a2f3c"],
        borderColor: ["#13171f"],
        borderWidth: 2,
        borderRadius: 10,
        spacing: 5,
      },
    ],
  };

  // Chart configuration for dark theme
  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: true,
      cutout: "65%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#eef2ff",
            font: {
              size: 11,
              family: "'Inter', -apple-system, sans-serif",
              weight: "400",
            },
            padding: 15,
            usePointStyle: true,
            pointStyle: "circle",
          },
        },
        tooltip: {
          backgroundColor: "#13171f",
          titleColor: "#eef2ff",
          bodyColor: "#8b9bb0",
          borderColor: "#222733",
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: function (context) {
              const label = context.label || "";
              const value = context.raw || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ₹${value.toLocaleString("en-IN")} (${percentage}%)`;
            },
          },
        },
      },
      elements: {
        arc: {
          borderWidth: 2,
          borderColor: "#13171f",
          hoverOffset: 15,
        },
      },
      layout: {
        padding: {
          top: 10,
          bottom: 10,
          left: 10,
          right: 10,
        },
      },
    }),
    []
  );

  // Process and validate input data
  const processedData = useMemo(() => {
    if (!data || !data.datasets || !data.datasets[0]?.data?.length) {
      return defaultData;
    }

    // Dark theme color palette for trading platform
    const darkThemeColors = [
      "#00c48c", // Green - Profit
      "#3b82f6", // Blue - Holdings
      "#f97316", // Orange - Commodities
      "#a855f7", // Purple - Derivatives
      "#ef4444", // Red - Loss
      "#8b5cf6", // Violet - Others
      "#ec4899", // Pink - F&O
      "#14b8a6", // Teal - Currency
    ];

    // Use provided colors or apply dark theme colors
    const datasets = data.datasets.map((dataset, idx) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || darkThemeColors,
      borderColor: dataset.borderColor || "#13171f",
      borderWidth: dataset.borderWidth || 2,
      borderRadius: dataset.borderRadius || 8,
      spacing: dataset.spacing || 4,
      hoverOffset: dataset.hoverOffset || 15,
    }));

    return {
      ...data,
      datasets,
    };
  }, [data]);

  // Loading state
  if (!data) {
    return (
      <div className="doughnut-chart-placeholder" style={styles.placeholder}>
        <div style={styles.noData}>📊 No chart data available</div>
      </div>
    );
  }

  return (
    <div className="doughnut-chart-container" style={styles.container}>
      {title && <h3 style={styles.title}>{title}</h3>}
      <div style={{ height, width, margin: "0 auto" }}>
        <Doughnut 
          data={processedData} 
          options={chartOptions}
          fallbackContent={<div style={styles.noData}>Chart failed to load</div>}
        />
      </div>
    </div>
  );
}

// Optional: Add center text plugin for doughnut chart
export function DoughnutChartWithCenter({ data, title, centerText, ...props }) {
  const centerTextPlugin = useMemo(() => ({
    id: "centerText",
    afterDraw(chart) {
      const { ctx, chartArea } = chart;
      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;
      
      ctx.save();
      ctx.font = "bold 20px 'Inter', sans-serif";
      ctx.fillStyle = "#eef2ff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(centerText || "Total", centerX, centerY - 10);
      
      ctx.font = "14px 'Inter', sans-serif";
      ctx.fillStyle = "#8b9bb0";
      ctx.fillText("Portfolio", centerX, centerY + 15);
      ctx.restore();
    },
  }), [centerText]);

  // Register and cleanup plugin
  React.useEffect(() => {
    ChartJS.register(centerTextPlugin);
    return () => {
      // Optional: Unregister if needed
      // ChartJS.unregister(centerTextPlugin);
    };
  }, [centerTextPlugin]);

  return <DoughnutChart data={data} title={title} {...props} />;
}

// Styles for the component
const styles = {
  container: {
    background: "#13171f",
    borderRadius: "20px",
    padding: "20px",
    border: "1px solid #222733",
    position: "relative",
  },
  title: {
    color: "#eef2ff",
    fontSize: "1rem",
    fontWeight: "500",
    marginBottom: "20px",
    textAlign: "center",
    letterSpacing: "0.3px",
  },
  placeholder: {
    background: "#13171f",
    borderRadius: "20px",
    padding: "40px",
    border: "1px solid #222733",
    textAlign: "center",
    minHeight: "200px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  noData: {
    color: "#5f6f84",
    fontSize: "0.9rem",
  },
};

// Example usage with sample data
export const ExampleDoughnutChart = () => {
  const sampleData = {
    labels: ["Equity", "Debt", "Commodity", "Derivatives", "Cash"],
    datasets: [
      {
        data: [450000, 230000, 180000, 95000, 45000],
        backgroundColor: ["#00c48c", "#3b82f6", "#f97316", "#a855f7", "#ef4444"],
        borderWidth: 0,
        borderRadius: 10,
        spacing: 8,
      },
    ],
  };

  return (
    <DoughnutChart 
      data={sampleData} 
      title="Portfolio Distribution"
      height={250}
      width={250}
    />
  );
};

export default DoughnutChart;