import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Chart from "chart.js/auto";
import { FaBell } from "react-icons/fa";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useDarkMode } from "../../../context/DarkModeContext";
import Button from "../../../components/Button";

/**
 * AnalyticsGraph displays a pie chart, quick stats, summary table, and notifications
 * for the landlord dashboard, visualizing key metrics.
 *
 * @component
 * @param {Object} props - Component props
 * @param {number} props.numberOfTenants - Number of active tenants
 * @param {number} props.maintenanceIssues - Number of pending maintenance issues
 * @param {number} props.averageRating - Average rating from tenants
 * @param {Object} props.quickStats - Quick stats for properties, tenants, and revenue
 * @param {Array} props.notifications - List of notifications
 * @param {Function} props.onResolveIssues - Handler for resolving urgent issues
 * @param {string} props.currency - Selected currency for displaying amounts
 * @returns {JSX.Element} The rendered AnalyticsGraph component
 */
const AnalyticsGraph = ({
  numberOfTenants,
  maintenanceIssues,
  averageRating,
  quickStats,
  notifications,
  onResolveIssues,
  currency,
}) => {
  const { darkMode } = useDarkMode();
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // Ensure quickStats has fallback values to prevent undefined errors
  const safeQuickStats = quickStats || {
    totalProperties: 0,
    totalTenants: 0,
    totalRevenueThisYear: "0.00",
  };

  // Initialize and update pie chart
  useEffect(() => {
    // Ensure data is non-negative and handle edge cases
    const data = [
      Math.max(numberOfTenants || 0, 0),
      Math.max(maintenanceIssues || 0, 0),
      Math.max(averageRating || 0, 0),
    ];

    // Check if all values are 0 to avoid division by zero
    const total = data.reduce((sum, value) => sum + value, 0);
    const percentages =
      total > 0
        ? data.map((value) => ((value / total) * 100).toFixed(1))
        : [33.3, 33.3, 33.4]; // Equal distribution if all values are 0

    // Destroy existing chart to prevent memory leaks
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Create new pie chart
    const ctx = chartRef.current.getContext("2d");
    chartInstanceRef.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Tenants", "Maintenance Issues", "Average Rating"],
        datasets: [
          {
            label: "Key Metrics",
            data: total > 0 ? data : [1, 1, 1], // Avoid empty chart by using minimal values
            backgroundColor: [
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 99, 132, 0.6)",
              "rgba(255, 206, 86, 0.6)",
            ],
            borderColor: [
              "rgba(54, 162, 235, 1)",
              "rgba(255, 99, 132, 1)",
              "rgba(255, 206, 86, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          },
        },
        plugins: {
          legend: {
            position: "top",
            labels: {
              font: {
                size: 12,
              },
              color: darkMode ? "#d1d5db" : "#4b5563",
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || "";
                const value = context.raw || 0;
                const percentage = percentages[context.dataIndex];
                if (label === "Average Rating") {
                  return `${label}: ${value.toFixed(1)}/5 (${percentage}%)`;
                }
                return `${label}: ${value} (${percentage}%)`;
              },
            },
            backgroundColor: darkMode
              ? "rgba(55, 65, 81, 0.9)"
              : "rgba(229, 231, 235, 0.9)",
            titleColor: darkMode ? "#f9fafb" : "#1f2937",
            bodyColor: darkMode ? "#f9fafb" : "#1f2937",
          },
          datalabels: {
            color: darkMode ? "#ffffff" : "#000000",
            formatter: (value, ctx) => {
              const percentage = percentages[ctx.dataIndex];
              return total > 0 ? `${percentage}%` : "0%";
            },
            font: {
              weight: "bold",
              size: 10,
            },
          },
        },
      },
      plugins: [ChartDataLabels],
    });

    // Cleanup chart on component unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [numberOfTenants, maintenanceIssues, averageRating, darkMode]);

  return (
    <div
      className={`mb-4 sm:mb-6 ${darkMode ? "text-gray-200" : "text-black"}`}
    >
      {/* Quick Stats Section */}
      <div
        className={`mb-4 sm:mb-6 p-4 rounded-lg shadow ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h4
          className={`text-sm sm:text-md font-semibold mb-2 ${
            darkMode ? "text-gray-300" : "text-gray-800"
          }`}
        >
          Quick Stats
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="text-center">
            <p
              className={`text-lg sm:text-xl font-bold ${
                darkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              {safeQuickStats.totalProperties}
            </p>
            <p
              className={`text-xs sm:text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Total Properties
            </p>
          </div>
          <div className="text-center">
            <p
              className={`text-lg sm:text-xl font-bold ${
                darkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              {safeQuickStats.totalTenants}
            </p>
            <p
              className={`text-xs sm:text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Total Tenants
            </p>
          </div>
          <div className="text-center">
            <p
              className={`text-lg sm:text-xl font-bold ${
                darkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              {currency} {safeQuickStats.totalRevenueThisYear}
            </p>
            <p
              className={`text-xs sm:text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Revenue This Year
            </p>
          </div>
        </div>
      </div>

      {/* Pie Chart Section */}
      <div className="chart-container w-full max-w-md sm:max-w-lg mx-auto h-64 mb-4 sm:mb-6">
        <canvas ref={chartRef} aria-label="Key metrics pie chart" />
      </div>

      {/* Summary Table Section */}
      <div
        className={`overflow-x-auto mb-4 sm:mb-6 scrollbar-hidden ${
          darkMode ? "text-gray-400" : "text-gray-600"
        }`}
        style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE and Edge
        }}
      >
        <table
          className={`w-full text-left text-xs sm:text-sm ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          <thead>
            <tr className="border-b">
              <th
                className={`py-1 sm:py-2 px-2 sm:px-4 ${
                  darkMode ? "text-gray-300" : "text-gray-800"
                }`}
              >
                Metric
              </th>
              <th
                className={`py-1 sm:py-2 px-2 sm:px-4 ${
                  darkMode ? "text-gray-300" : "text-gray-800"
                }`}
              >
                Value
              </th>
              <th
                className={`py-1 sm:py-2 px-2 sm:px-4 ${
                  darkMode ? "text-gray-300" : "text-gray-800"
                }`}
              >
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td
                className={`py-1 sm:py-2 px-2 sm:px-4 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Tenants
              </td>
              <td
                className={`py-1 sm:py-2 px-2 sm:px-4 ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {numberOfTenants || 0}
              </td>
              <td
                className={`py-1 sm:py-2 px-2 sm:px-4 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {numberOfTenants || 0} active tenants across your properties.
              </td>
            </tr>
            <tr className="border-b">
              <td
                className={`py-1 sm:py-2 px-2 sm:px-4 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Maintenance Issues
              </td>
              <td
                className={`py-1 sm:py-2 px-2 sm:px-4 ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {maintenanceIssues || 0}
              </td>
              <td
                className={`py-1 sm:py-2 px-2 sm:px-4 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {maintenanceIssues || 0} pending issues awaiting resolution.
              </td>
            </tr>
            <tr>
              <td
                className={`py-1 sm:py-2 px-2 sm:px-4 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Average Rating
              </td>
              <td
                className={`py-1 sm:py-2 px-2 sm:px-4 ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {(averageRating || 0).toFixed(1)}/5
              </td>
              <td
                className={`py-1 sm:py-2 px-2 sm:px-4 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Average rating based on tenant feedback.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Notifications Section */}
      <div>
        <h4
          className={`text-sm sm:text-md font-semibold mb-2 flex items-center ${
            darkMode ? "text-gray-300" : "text-gray-800"
          }`}
        >
          <FaBell
            className={`${
              darkMode ? "text-yellow-300" : "text-yellow-500"
            } mr-2`}
            aria-hidden="true"
          />
          Notifications
        </h4>
        <div className="space-y-3 sm:space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div
                key={index}
                className={`flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-2 gap-2 ${
                  notification.urgent
                    ? darkMode
                      ? "text-red-400"
                      : "text-red-600"
                    : darkMode
                    ? "text-gray-400"
                    : "text-gray-600"
                }`}
              >
                <p
                  className={`text-xs sm:text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {notification.message}
                </p>
                {notification.urgent && (
                  <Button
                    variant="danger"
                    onClick={onResolveIssues}
                    className="text-xs sm:text-sm"
                    aria-label="Resolve urgent maintenance requests"
                  >
                    Resolve Now
                  </Button>
                )}
              </div>
            ))
          ) : (
            <p
              className={`text-xs sm:text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              No notifications at this time.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// PropTypes for type checking
AnalyticsGraph.propTypes = {
  numberOfTenants: PropTypes.number,
  maintenanceIssues: PropTypes.number,
  averageRating: PropTypes.number,
  quickStats: PropTypes.shape({
    totalProperties: PropTypes.number,
    totalTenants: PropTypes.number,
    totalRevenueThisYear: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
  }),
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      message: PropTypes.string,
      urgent: PropTypes.bool,
    })
  ),
  onResolveIssues: PropTypes.func,
  currency: PropTypes.string,
};

AnalyticsGraph.defaultProps = {
  numberOfTenants: 0,
  maintenanceIssues: 0,
  averageRating: 0,
  quickStats: {
    totalProperties: 0,
    totalTenants: 0,
    totalRevenueThisYear: "0.00",
  },
  notifications: [],
  onResolveIssues: () => {},
  currency: "GH₵",
};

// Inline CSS to hide scrollbar for Webkit browsers
const styles = `
  .scrollbar-hidden::-webkit-scrollbar {
    display: none;
  }
`;

// Inject styles into the document (if not already present)
if (!document.querySelector("style[data-analytics-graph]")) {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.setAttribute("data-analytics-graph", "true");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default AnalyticsGraph;
