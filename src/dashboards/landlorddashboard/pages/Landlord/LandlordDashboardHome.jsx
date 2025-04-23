import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { BASE_URL } from "../../../../config";
import {
  FaHome,
  FaFileAlt,
  FaCreditCard,
  FaUserEdit,
  FaStar,
} from "react-icons/fa";
import AnalyticsGraph from "../../components/AnalyticsGraph";
import { useDarkMode } from "../../../../context/DarkModeContext";
import Button from "../../../../components/Button";

/**
 * LandlordDashboardHome component displays the main dashboard page for landlords.
 * Shows a greeting, dashboard cards, analytics (including quick stats and notifications), and recent transactions.
 */
const LandlordDashboardHome = () => {
  const { darkMode } = useDarkMode();
  const { user, properties, isLoading: contextLoading } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    activeRentals: 0,
    monthlyRevenue: 0,
    averageRating: 0,
    pendingIssues: 0,
  });
  const [leases, setLeases] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [currency, setCurrency] = useState("GH₵");
  const navigate = useNavigate();

  useEffect(() => {
    if (!contextLoading) {
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [contextLoading]);

  useEffect(() => {
    if (!contextLoading && !loading) {
      const fetchDashboardData = async () => {
        try {
          const token = localStorage.getItem("token");
          console.log("Token for dashboard fetch:", token);
          const response = await fetch(`${BASE_URL}/api/landlord/dashboard`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) throw new Error("Failed to fetch dashboard data");
          const data = await response.json();
          setDashboardData(data);
          console.log("LandlordDashboardHome - fetched dashboard data:", data);
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
          setDashboardData({
            activeRentals: 0,
            monthlyRevenue: 0,
            averageRating: 0,
            pendingIssues: 0,
          });
        }
      };
      fetchDashboardData();
    }
  }, [contextLoading, loading]);

  useEffect(() => {
    if (!contextLoading && !loading) {
      const fetchLeases = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`${BASE_URL}/api/landlord/leases`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) throw new Error("Failed to fetch lease data");
          const data = await response.json();
          setLeases(data);
          console.log("LandlordDashboardHome - fetched lease data:", data);
        } catch (error) {
          console.error("Error fetching lease data:", error);
          setLeases([]);
        }
      };
      fetchLeases();
    }
  }, [contextLoading, loading]);

  useEffect(() => {
    if (!contextLoading && !loading) {
      const fetchTransactions = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `${BASE_URL}/api/landlord/transactions`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!response.ok) throw new Error("Failed to fetch transactions");
          const data = await response.json();
          setTransactions(data);
          console.log("LandlordDashboardHome - fetched transactions:", data);
        } catch (error) {
          console.error("Error fetching transactions:", error);
          setTransactions([]);
        }
      };
      fetchTransactions();
    }
  }, [contextLoading, loading]);

  const handleViewProperties = () => navigate("/dashboard/landlord/properties");
  const handleViewIssues = () => navigate("/dashboard/landlord/maintenance");
  const handleViewRatings = () => navigate("/dashboard/landlord/ratings");
  const handleViewLeaseRenewals = () =>
    navigate("/dashboard/landlord/lease-renewals");
  const handleViewRevenue = () => navigate("/dashboard/landlord/revenue");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const conversionRates = {
    "GH₵": 1,
    USD: 0.064,
    EUR: 0.059,
  };

  const convertCurrency = (amount) => {
    const rate = conversionRates[currency] || 1;
    return (amount * rate).toFixed(2);
  };

  const quickStats = {
    totalProperties: properties?.length || 0,
    totalTenants: dashboardData.activeRentals,
    totalRevenueThisYear: convertCurrency(dashboardData.monthlyRevenue * 12),
  };

  const notifications = [
    { message: "You have 2 urgent maintenance requests.", urgent: true },
    {
      message: "Lease renewal for Property A is due in 5 days.",
      urgent: false,
    },
  ];

  const upcomingRenewals = leases.filter(
    (lease) => parseInt(lease.daysRemaining, 10) <= 30
  );

  if (contextLoading) return null;

  return (
    <div
      className={`p-2 sm:p-4 md:p-6 bg-${
        darkMode ? "gray-900" : "gray-50"
      } flex-1 overflow-y-auto text-${darkMode ? "gray-200" : "black"}`}
    >
      {/* Greeting, Add Property Button, and Currency Selector */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
              {getGreeting()},{" "}
              <span className={darkMode ? "text-blue-300" : "text-blue-600"}>
                {user?.fullName ||
                  user?.name ||
                  user?.firstName ||
                  user?.lastName ||
                  "User"}
              </span>
              !
            </h2>
            <p
              className={`text-xs sm:text-sm md:text-base mt-1 sm:mt-2 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Here&apos;s an overview of your rental business.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleViewProperties}
            aria-label="Add a new property"
          >
            Add Property
          </Button>
        </div>
        <div
          className={`flex items-center gap-2 ${
            darkMode ? "bg-gray-700" : "bg-red-300"
          } w-48 m-2 p-2 rounded-md`}
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

      {/* Dashboard Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div
          className={`bg-${
            darkMode ? "gray-800" : "gray-800"
          } text-white p-3 sm:p-4 rounded-lg shadow transform transition hover:scale-105 hover:shadow-lg`}
        >
          <div>
            <div className="flex items-center mb-2">
              <FaHome className="text-blue-400 mr-2" aria-hidden="true" />
              <h3 className="text-base sm:text-lg font-semibold">
                Active Rentals
              </h3>
            </div>
            <p className="text-sm sm:text-base mb-3 sm:mb-4">
              You have {dashboardData.activeRentals} active rentals.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleViewProperties}
            aria-label="View all rentals"
          >
            View Rentals
          </Button>
        </div>

        <div
          className={`bg-${
            darkMode ? "gray-800" : "gray-800"
          } text-white p-3 sm:p-4 rounded-lg shadow transform transition hover:scale-105 hover:shadow-lg`}
        >
          <div>
            <div className="flex items-center mb-2">
              <FaFileAlt className="text-blue-400 mr-2" aria-hidden="true" />
              <h3 className="text-base sm:text-lg font-semibold">
                Pending Issues
              </h3>
            </div>
            <p className="text-sm sm:text-base mb-3 sm:mb-4">
              You have {dashboardData.pendingIssues} pending maintenance issues.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleViewIssues}
            aria-label="View all issues"
          >
            View Issues
          </Button>
        </div>

        <div
          className={`bg-${
            darkMode ? "gray-800" : "gray-800"
          } text-white p-3 sm:p-4 rounded-lg shadow transform transition hover:scale-105 hover:shadow-lg`}
        >
          <div>
            <div className="flex items-center mb-2">
              <FaCreditCard className="text-blue-400 mr-2" aria-hidden="true" />
              <h3 className="text-base sm:text-lg font-semibold">
                Monthly Revenue
              </h3>
            </div>
            <p className="text-sm sm:text-base mb-3 sm:mb-4">
              {currency} {convertCurrency(dashboardData.monthlyRevenue)}
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleViewRevenue}
            aria-label="View revenue details"
          >
            View Revenue
          </Button>
        </div>

        <div
          className={`bg-${
            darkMode ? "gray-800" : "gray-800"
          } text-white p-3 sm:p-4 rounded-lg shadow transform transition hover:scale-105 hover:shadow-lg`}
        >
          <div>
            <div className="flex items-center mb-2">
              <FaStar className="text-blue-400 mr-2" aria-hidden="true" />
              <h3 className="text-base sm:text-lg font-semibold">
                Average Rating
              </h3>
            </div>
            <p className="text-sm sm:text-base mb-3 sm:mb-4">
              {dashboardData.averageRating.toFixed(1)}/5
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleViewRatings}
            aria-label="View ratings"
          >
            View Ratings
          </Button>
        </div>
      </div>

      {/* Analytics Section (includes Quick Stats and Notifications) */}
      <div
        className={`bg-${
          darkMode ? "gray-700" : "lime-100"
        } p-3 sm:p-4 rounded-lg shadow mb-4 sm:mb-6`}
      >
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
          Key Metrics Overview
        </h3>
        <AnalyticsGraph
          numberOfTenants={dashboardData.activeRentals}
          maintenanceIssues={dashboardData.pendingIssues}
          averageRating={dashboardData.averageRating}
          quickStats={quickStats}
          notifications={notifications}
          onResolveIssues={handleViewIssues}
          currency={currency}
        />
      </div>

      {/* Upcoming Lease Renewals Section */}
      <div
        className={`bg-${
          darkMode ? "green-900" : "green-100"
        } p-3 sm:p-4 rounded-lg shadow mb-4 sm:mb-6`}
      >
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-semibold">
            Upcoming Lease Renewals
          </h3>
          <Button
            variant="secondary"
            onClick={handleViewLeaseRenewals}
            className={darkMode ? "text-blue-300" : "text-blue-600"}
            aria-label="View all lease renewals"
          >
            View All
          </Button>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {upcomingRenewals.length > 0 ? (
            upcomingRenewals.map((lease, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-2 gap-2"
              >
                <div className="flex-1">
                  <p
                    className={`text-${
                      darkMode ? "gray-400" : "gray-600"
                    } font-medium text-sm sm:text-base`}
                  >
                    {lease.property}
                  </p>
                  <p
                    className={`text-${
                      darkMode ? "gray-500" : "gray-500"
                    } text-xs sm:text-sm`}
                  >
                    Tenant: {lease.tenant}
                  </p>
                </div>
                <div className="flex-1 text-left sm:text-center">
                  <p
                    className={`text-${
                      darkMode ? "gray-400" : "gray-600"
                    } text-sm sm:text-base`}
                  >
                    {lease.daysRemaining}
                  </p>
                </div>
                <div className="flex-1 text-left sm:text-right">
                  <p
                    className={`text-${
                      darkMode ? "gray-400" : "gray-600"
                    } text-sm sm:text-base`}
                  >
                    {currency} {convertCurrency(parseFloat(lease.rent))}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p
              className={`text-${
                darkMode ? "gray-500" : "gray-600"
              } text-sm sm:text-base`}
            >
              No upcoming lease renewals.
            </p>
          )}
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div
        className={`p-3 sm:p-4 rounded-lg shadow bg-${
          darkMode ? "red-900" : "red-100"
        }`}
      >
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
          Recent Transactions
        </h3>
        <div className="space-y-3 sm:space-y-4">
          {transactions.length > 0 ? (
            transactions.map((transaction, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-2 gap-2"
              >
                <div className="flex items-center">
                  {transaction.type === "Payment Received" && (
                    <FaCreditCard
                      className={`text-${
                        darkMode ? "gray-400" : "gray-500"
                      } mr-2`}
                      aria-hidden="true"
                    />
                  )}
                  {transaction.type === "Lease Renewal" && (
                    <FaUserEdit
                      className={`text-${
                        darkMode ? "gray-400" : "gray-500"
                      } mr-2`}
                      aria-hidden="true"
                    />
                  )}
                  <p
                    className={`text-${
                      darkMode ? "gray-400" : "gray-600"
                    } text-sm sm:text-base`}
                  >
                    {transaction.type === "Payment Received"
                      ? `${transaction.type} from ${transaction.tenant}`
                      : `${transaction.type} for ${transaction.property}`}
                  </p>
                </div>
                <p
                  className={`text-${
                    darkMode ? "gray-500" : "gray-500"
                  } text-xs sm:text-sm`}
                >
                  {transaction.type === "Payment Received"
                    ? `${currency} ${convertCurrency(
                        parseFloat(transaction.amount.replace(/[^0-9.-]+/g, ""))
                      )}`
                    : transaction.tenant}{" "}
                  - {transaction.date}
                </p>
              </div>
            ))
          ) : (
            <p
              className={`text-${
                darkMode ? "gray-500" : "gray-600"
              } text-sm sm:text-base`}
            >
              No recent payments.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// PropTypes and default props
LandlordDashboardHome.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    createdAt: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    fullName: PropTypes.string,
  }),
  properties: PropTypes.array,
};

LandlordDashboardHome.defaultProps = {
  user: {
    name: "",
    email: "",
    role: "LANDLORD",
    createdAt: "",
    firstName: "",
    lastName: "",
    fullName: "",
  },
  properties: [],
};

export default LandlordDashboardHome;
