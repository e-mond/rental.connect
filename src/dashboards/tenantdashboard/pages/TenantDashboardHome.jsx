import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import GlobalSkeleton from "../../../components/GlobalSkeleton";
import { FaHome, FaFileAlt, FaCreditCard } from "react-icons/fa";
import { useDarkMode } from "../../../context/DarkModeContext";
import Button from "../../../components/Button";
import RecentActivity from "../components/RecentActivity"; // Import the RecentActivity component

const TenantDashboardHome = () => {
  const { user, isLoading: contextLoading } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();

  const userName =
    user?.fullName ||
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    user?.name ||
    "Tenant";

  useEffect(() => {
    if (!contextLoading) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [contextLoading]);

  const activeApplications = 0;
  const paymentSetupComplete = false;

  const handleStartSearch = () => navigate("/dashboard/tenant/search");
  const handleViewApplications = () =>
    navigate("/dashboard/tenant/applications");
  const handleSetupPayments = () => navigate("/dashboard/tenant/payments");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  if (contextLoading) {
    return null;
  }

  if (loading) {
    return (
      <div className={`p-4 sm:p-6 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
        <GlobalSkeleton
          type="dashboard"
          bgColor={darkMode ? "bg-gray-700" : "bg-gray-300"}
          animationSpeed="2.5s"
        />
      </div>
    );
  }

  return (
    <div
      className={`p-4 sm:p-6 flex-1 overflow-y-auto ${
        darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-50 text-gray-800"
      }`}
    >
      <h2 className="text-xl sm:text-2xl font-bold mb-6">
        {getGreeting()},{" "}
        <span className={darkMode ? "text-teal-400" : "text-blue-600"}>
          {userName}
        </span>
        !
      </h2>
      <p
        className={`text-sm sm:text-base mb-6 ${
          darkMode ? "text-gray-400" : "text-gray-600"
        }`}
      >
        Welcome back! Manage your rentals, payments, and more from your
        dashboard.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div
          className={`p-4 rounded-lg shadow flex flex-col justify-between ${
            darkMode
              ? "bg-gray-900 shadow-gray-700"
              : "bg-blue-50 shadow-gray-200"
          }`}
        >
          <div>
            <div className="flex items-center mb-2">
              <FaHome
                className={
                  darkMode ? "text-teal-400 mr-2" : "text-blue-600 mr-2"
                }
                aria-hidden="true"
              />
              <h3 className="text-lg font-semibold">Find Your Home</h3>
            </div>
            <p
              className={`mb-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Browse available properties matching your criteria.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleStartSearch}
            className="w-full sm:w-auto"
          >
            Start Search
          </Button>
        </div>

        <div
          className={`p-4 rounded-lg shadow flex flex-col justify-between ${
            darkMode
              ? "bg-gray-900 shadow-gray-700"
              : "bg-blue-50 shadow-gray-200"
          }`}
        >
          <div>
            <div className="flex items-center mb-2">
              <FaFileAlt
                className={
                  darkMode ? "text-teal-400 mr-2" : "text-blue-600 mr-2"
                }
                aria-hidden="true"
              />
              <h3 className="text-lg font-semibold">Active Applications</h3>
            </div>
            <p
              className={`mb-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              You have {activeApplications} active rental applications.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleViewApplications}
            className="w-full sm:w-auto"
          >
            View All
          </Button>
        </div>

        <div
          className={`p-4 rounded-lg shadow flex flex-col justify-between ${
            darkMode
              ? "bg-gray-900 shadow-gray-700"
              : "bg-blue-50 shadow-gray-200"
          }`}
        >
          <div>
            <div className="flex items-center mb-2">
              <FaCreditCard
                className={
                  darkMode ? "text-teal-400 mr-2" : "text-blue-600 mr-2"
                }
                aria-hidden="true"
              />
              <h3 className="text-lg font-semibold">Payment Setup</h3>
            </div>
            <p
              className={`mb-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              {paymentSetupComplete
                ? "Your payment information is set."
                : "Complete your payment information."}
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleSetupPayments}
            className="w-full sm:w-auto"
          >
            {paymentSetupComplete ? "View Payments" : "Setup Now"}
          </Button>
        </div>
      </div>

      {/* Replace the static Recent Activity section with the RecentActivity component */}
      <RecentActivity />
    </div>
  );
};

TenantDashboardHome.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    profilePic: PropTypes.string,
    accountType: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
    createdAt: PropTypes.string,
  }),
};

export default TenantDashboardHome;
