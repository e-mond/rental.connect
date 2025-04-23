import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { FaCreditCard, FaChartLine } from "react-icons/fa";
import AnalyticsGraph from "../../components/AnalyticsGraph";
import { useDarkMode } from "../../../../context/DarkModeContext";
import Button from "../../../../components/Button";
import GlobalSkeleton from "../../../../components/GlobalSkeleton";
import ErrorDisplay from "../../../../components/ErrorDisplay";
import landlordApi from "../../../../api/landlord";

const Revenue = () => {
  const { darkMode } = useDarkMode();
  const { user, properties } = useOutletContext(); // Added properties from context
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState({
    monthlyRevenue: 0,
    yearlyRevenue: 0,
    revenueByProperty: [],
    recentTransactions: [],
  });
  const [currency, setCurrency] = useState("GH₵");

  // Fetch revenue data
  const { error, isLoading } = useQuery({
    queryKey: ["revenue", user?.id],
    queryFn: () => landlordApi.fetchRevenue(localStorage.getItem("token")),
    enabled: !!user,
    onSuccess: (data) => {
      setRevenueData(data);
    },
  });

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Derive quickStats for AnalyticsGraph
  const quickStats = {
    totalProperties: properties ? properties.length : 0,
    totalTenants: properties
      ? properties.reduce(
          (sum, property) => sum + (property.tenantCount || 0),
          0
        )
      : 0,
    totalRevenueThisYear: revenueData.yearlyRevenue.toFixed(2),
  };

  // Currency conversion rates
  const conversionRates = {
    "GH₵": 1,
    USD: 0.064,
    EUR: 0.059,
  };

  const convertCurrency = (amount) => {
    const rate = conversionRates[currency] || 1;
    return (amount * rate).toFixed(2);
  };

  const handleBack = () => {
    navigate("/dashboard/landlord");
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <div
          className={`p-4 sm:p-6 ${
            darkMode ? "bg-gray-800" : "bg-gray-50"
          } flex-1 overflow-y-auto`}
        >
          <GlobalSkeleton
            type="revenue"
            bgColor={darkMode ? "bg-gray-700" : "bg-gray-300"}
            animationSpeed="1.5s"
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen">
        <div
          className={`p-4 sm:p-6 ${
            darkMode ? "bg-gray-800" : "bg-gray-50"
          } flex-1 overflow-y-auto`}
        >
          <ErrorDisplay
            error={error}
            className={darkMode ? "text-red-400" : "text-red-500"}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-4 sm:p-6 ${
        darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-50 text-gray-800"
      } flex-1 overflow-y-auto`}
    >
      {/* Header Section: Title, Back Button, and Currency Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <Button
            variant="secondary"
            onClick={handleBack}
            className="text-sm sm:text-base"
            aria-label="Back to dashboard"
          >
            Back
          </Button>
          <h2 className="text-xl sm:text-2xl font-bold">Revenue Overview</h2>
        </div>
        <div
          className={`flex items-center gap-2 ${
            darkMode ? "bg-gray-700" : "bg-red-300"
          } w-48 p-2 rounded-md`}
        >
          <label
            htmlFor="currency"
            className={`text-sm font-medium ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Currency:
          </label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className={`border ${
              darkMode
                ? "bg-gray-600 text-gray-200 border-gray-500"
                : "bg-white text-black border-gray-300"
            } rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
            aria-label="Select currency"
          >
            <option value="GH₵">GH₵ (Cedis)</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
      </div>

      {/* Summary Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div
          className={`p-4 sm:p-6 rounded-lg shadow ${
            darkMode
              ? "bg-gray-900 shadow-gray-700"
              : "bg-white shadow-gray-200"
          }`}
        >
          <div className="flex items-center mb-2">
            <FaCreditCard
              className={`text-lg sm:text-xl ${
                darkMode ? "text-teal-500" : "text-blue-600"
              } mr-2`}
            />
            <h3 className="text-base sm:text-lg font-semibold">
              Monthly Revenue
            </h3>
          </div>
          <p className="text-lg sm:text-xl">
            {currency} {convertCurrency(revenueData.monthlyRevenue)}
          </p>
        </div>
        <div
          className={`p-4 sm:p-6 rounded-lg shadow ${
            darkMode
              ? "bg-gray-900 shadow-gray-700"
              : "bg-white shadow-gray-200"
          }`}
        >
          <div className="flex items-center mb-2">
            <FaChartLine
              className={`text-lg sm:text-xl ${
                darkMode ? "text-teal-500" : "text-blue-600"
              } mr-2`}
            />
            <h3 className="text-base sm:text-lg font-semibold">
              Yearly Revenue
            </h3>
          </div>
          <p className="text-lg sm:text-xl">
            {currency} {convertCurrency(revenueData.yearlyRevenue)}
          </p>
        </div>
      </div>

      {/* Analytics Graph Section */}
      <div
        className={`p-4 sm:p-6 rounded-lg shadow mb-6 ${
          darkMode ? "bg-gray-900 shadow-gray-700" : "bg-white shadow-gray-200"
        }`}
      >
        <h3 className="text-base sm:text-lg font-semibold mb-4">
          Revenue Trends
        </h3>
        <AnalyticsGraph
          numberOfTenants={quickStats.totalTenants}
          maintenanceIssues={0} // Adjust based on your data
          averageRating={0} // Adjust based on your data
          quickStats={quickStats}
          notifications={[]} // Adjust based on your data
          onResolveIssues={() => {}} // Adjust based on your requirements
          currency={currency}
        />
      </div>

      {/* Revenue by Property Section */}
      <div
        className={`p-4 sm:p-6 rounded-lg shadow mb-6 ${
          darkMode ? "bg-gray-900 shadow-gray-700" : "bg-white shadow-gray-200"
        }`}
      >
        <h3 className="text-base sm:text-lg font-semibold mb-4">
          Revenue by Property
        </h3>
        {revenueData.revenueByProperty.length > 0 ? (
          <div className="space-y-4">
            {revenueData.revenueByProperty.map((property, index) => (
              <div
                key={index}
                className={`flex justify-between items-center border-b pb-2 ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <p className="text-sm sm:text-base">{property.propertyName}</p>
                <p className="text-sm sm:text-base">
                  {currency} {convertCurrency(property.revenue)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p
            className={`text-sm sm:text-base ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            No revenue data available.
          </p>
        )}
      </div>

      {/* Recent Transactions Section */}
      <div
        className={`p-4 sm:p-6 rounded-lg shadow ${
          darkMode ? "bg-gray-900 shadow-gray-700" : "bg-white shadow-gray-200"
        }`} // Fixed background color
      >
        <h3 className="text-base sm:text-lg font-semibold mb-4">
          Recent Transactions
        </h3>
        {revenueData.recentTransactions.length > 0 ? (
          <div className="space-y-4">
            {revenueData.recentTransactions.map((transaction, index) => (
              <div
                key={index}
                className={`flex justify-between items-center border-b pb-2 ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="flex items-center">
                  <FaCreditCard
                    className={`text-sm sm:text-base ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    } mr-2`}
                  />
                  <p className="text-sm sm:text-base">
                    Payment from {transaction.tenant} for {transaction.property}
                  </p>
                </div>
                <p
                  className={`text-sm sm:text-base ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {currency} {convertCurrency(transaction.amount)} -{" "}
                  {transaction.date}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p
            className={`text-sm sm:text-base ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            No recent transactions.
          </p>
        )}
      </div>
    </div>
  );
};

Revenue.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
  }),
};

Revenue.defaultProps = {
  user: {
    id: "",
    name: "",
    email: "",
    role: "LANDLORD",
  },
};

export default Revenue;
