import { useState, useEffect, useCallback } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaHome, FaFileAlt, FaCreditCard, FaStar } from "react-icons/fa";
import AnalyticsGraph from "../../components/AnalyticsGraph";
import { useDarkMode } from "../../../../context/DarkModeContext";
import Button from "../../../../components/Button";
import landlordApi from "../../../../api/landlord/landlordApi";
import GlobalSkeleton from "../../../../components/GlobalSkeleton";

// Rate-limit toast notifications
const toastId = "dashboard-error";
const showToast = (message) => {
  if (!toast.isActive(toastId)) {
    toast.error(message, {
      toastId,
      position: "top-right",
      autoClose: 3000,
    });
  }
};

const LandlordDashboardHome = () => {
  const { darkMode } = useDarkMode();
  const { user, properties, isLoading: contextLoading } = useOutletContext();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    activeRentals: 0,
    monthlyRevenue: 0,
    averageRating: 0,
    pendingIssues: 0,
  });
  const [leases, setLeases] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [currency, setCurrency] = useState("GH₵");
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("No authentication token found. Please log in.");
      navigate("/landlordlogin");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [
        dashboardResponse,
        leasesResponse,
        transactionsResponse,
        notificationsResponse,
      ] = await Promise.all([
        landlordApi.fetchDashboardData(token),
        landlordApi.fetchLeases(token),
        landlordApi.fetchTransactions(token),
        landlordApi.fetchNotifications(token),
      ]);

      setDashboardData({
        activeRentals: dashboardResponse.data?.activeRentals || 0,
        monthlyRevenue: dashboardResponse.data?.monthlyRevenue || 0,
        averageRating: dashboardResponse.data?.averageRating || 0,
        pendingIssues: dashboardResponse.data?.pendingIssues || 0,
      });
      setLeases(leasesResponse.data || []);
      setTransactions(transactionsResponse.data || []);
      setNotifications(notificationsResponse.data || []);
    } catch (error) {
      console.error(error);
      if (error.message.includes("401")) {
        localStorage.removeItem("token");
        showToast("Session expired. Please log in again.");
        navigate("/landlordlogin");
      } else {
        showToast("Failed to load dashboard data. Please try again.");
        setError("An unexpected error occurred. Please try again later.");
      }
      setDashboardData({
        activeRentals: 0,
        monthlyRevenue: 0,
        averageRating: 0,
        pendingIssues: 0,
      });
      setLeases([]);
      setTransactions([]);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (!contextLoading) {
      loadData();
    }
  }, [contextLoading, loadData]);

  const handleViewProperties = () => navigate("/dashboard/landlord/properties");
  const handleViewIssues = () => navigate("/dashboard/landlord/maintenance");
  const handleViewRatings = () => navigate("/dashboard/landlord/ratings");
  const handleViewLeaseRenewals = () =>
    navigate("/dashboard/landlord/lease-renewals");
  const handleViewRevenue = () => navigate("/dashboard/landlord/revenue");

  const convertCurrency = (amount) => {
    const rates = { "GH₵": 1, USD: 0.064, EUR: 0.059 };
    return (amount * (rates[currency] || 1)).toFixed(2);
  };

  const quickStats = {
    totalProperties: properties?.length || 0,
    totalTenants: dashboardData.activeRentals || 0,
    totalRevenueThisYear: convertCurrency(dashboardData.monthlyRevenue * 12),
  };

  const upcomingRenewals = leases.filter(
    (lease) =>
      lease.daysRemaining !== undefined &&
      parseInt(lease.daysRemaining, 10) <= 30
  );

  const userName =
    user?.fullName ||
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    user?.name ||
    "Landlord";

  if (contextLoading || loading) {
    return <GlobalSkeleton type="dashboard" />;
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button variant="primary" onClick={loadData}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`p-4 flex-1 overflow-y-auto bg-${
        darkMode ? "gray-900" : "gray-50"
      } text-${darkMode ? "gray-200" : "black"}`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">
            Welcome back,{" "}
            <span className={darkMode ? "text-teal-400" : "text-blue-600"}>
              {userName}
            </span>
            !
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Here’s an overview of your rental business.
          </p>
        </div>
        <Button variant="primary" onClick={handleViewProperties}>
          Add Property
        </Button>
      </div>

      {/* Currency Selector */}
      <div className="flex items-center mb-6">
        <label className="mr-2 font-medium" htmlFor="currency">
          Currency:
        </label>
        <select
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="GH₵">GH₵ (Cedis)</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            icon: FaHome,
            title: "Active Rentals",
            value: dashboardData.activeRentals,
            onClick: handleViewProperties,
          },
          {
            icon: FaFileAlt,
            title: "Pending Issues",
            value: dashboardData.pendingIssues,
            onClick: handleViewIssues,
          },
          {
            icon: FaCreditCard,
            title: "Monthly Revenue",
            value: `${currency} ${convertCurrency(
              dashboardData.monthlyRevenue
            )}`,
            onClick: handleViewRevenue,
          },
          {
            icon: FaStar,
            title: "Average Rating",
            value: `${dashboardData.averageRating.toFixed(1)}/5`,
            onClick: handleViewRatings,
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-lg shadow bg-${
              darkMode ? "gray-800" : "white"
            }`}
          >
            <stat.icon className="text-2xl mb-2 text-blue-500" />
            <h3 className="text-lg font-semibold">{stat.title}</h3>
            <p className="text-gray-500 text-sm mb-3">{stat.value}</p>
            <Button variant="primary" onClick={stat.onClick}>
              View
            </Button>
          </div>
        ))}
      </div>

      {/* Graph */}
      <div
        className={`p-4 rounded-lg shadow mb-8 bg-${
          darkMode ? "gray-800" : "white"
        }`}
      >
        <h3 className="text-lg font-bold mb-4">Key Metrics Overview</h3>
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

      {/* Lease Renewals */}
      <div
        className={`p-4 rounded-lg shadow mb-8 bg-${
          darkMode ? "gray-800" : "white"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Upcoming Lease Renewals</h3>
          <Button variant="secondary" onClick={handleViewLeaseRenewals}>
            View All
          </Button>
        </div>
        {upcomingRenewals.length ? (
          upcomingRenewals.map((lease, idx) => (
            <div key={idx} className="flex justify-between py-2 border-b">
              <div>{lease.property || "Unknown Property"}</div>
              <div>{lease.daysRemaining} days</div>
              <div>
                {currency} {convertCurrency(lease.rent || 0)}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No upcoming lease renewals.</p>
        )}
      </div>

      {/* Transactions */}
      <div
        className={`p-4 rounded-lg shadow bg-${
          darkMode ? "gray-800" : "white"
        }`}
      >
        <h3 className="text-lg font-bold mb-4">Recent Transactions</h3>
        {transactions.length ? (
          transactions.map((tx, idx) => (
            <div key={idx} className="flex justify-between py-2 border-b">
              <div className="flex items-center">
                <FaCreditCard className="text-blue-400 mr-2" />
                <span>
                  {tx.type} - {tx.tenant || tx.property}
                </span>
              </div>
              <div>
                {currency} {convertCurrency(tx.amount || 0)}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No recent transactions.</p>
        )}
      </div>
    </div>
  );
};

export default LandlordDashboardHome;
