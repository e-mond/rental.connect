import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import GlobalSkeleton from "../../../components/GlobalSkeleton";
import {
  FaHome,
  FaFileAlt,
  FaCreditCard,
  FaUserPlus,
  FaUserEdit,
} from "react-icons/fa";
import { useDarkMode } from "../../../context/DarkModeContext"; // Import useDarkMode
import Button from "../../../components/Button"; // Import Button component

const TenantDashboardHome = () => {
  const { user, isLoading: contextLoading } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  const navigate = useNavigate();
  const { darkMode } = useDarkMode(); // Access dark mode state

  useEffect(() => {
    if (!contextLoading) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [contextLoading]);

  const calculateProgress = (userData) => {
    let completedFields = 0;
    const totalFields = 5;

    if (userData.profilePic) completedFields++;
    if (userData.name) completedFields++;
    if (userData.email) completedFields++;
    if (userData.phone) completedFields++;
    if (userData.address) completedFields++;

    return (completedFields / totalFields) * 100;
  };

  const getTimeDifference = (createdAt) => {
    if (!createdAt) return "Unknown time";

    const now = new Date();
    const createdDate = new Date(createdAt);
    const diffInMs = now - createdDate;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  };

  useEffect(() => {
    if (!user) return;

    const progress = calculateProgress(user);
    const activities = [];

    if (user.createdAt) {
      activities.push({
        type: "account_created",
        timestamp: getTimeDifference(user.createdAt),
      });
    }

    if (progress < 100) {
      activities.push({
        type: "profile_completion",
        timestamp: "2 min ago",
      });
    }

    setRecentActivity(activities);
  }, [user]);

  const activeApplications = 0;
  const paymentSetupComplete = false;

  const handleStartSearch = () => navigate("/dashboard/tenant/search");
  const handleViewApplications = () =>
    navigate("/dashboard/tenant/applications");
  const handleSetupPayments = () => navigate("/dashboard/tenant/payments");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
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
          {user?.name || "Tenant"}
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

      <div
        className={`p-4 rounded-lg shadow ${
          darkMode ? "bg-gray-900 shadow-gray-700" : "bg-white shadow-gray-200"
        }`}
      >
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <div
                key={index}
                className={`flex justify-between items-center border-b pb-2 ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="flex items-center">
                  {activity.type === "account_created" && (
                    <FaUserPlus
                      className={
                        darkMode ? "text-gray-400 mr-2" : "text-gray-500 mr-2"
                      }
                      aria-hidden="true"
                    />
                  )}
                  {activity.type === "profile_completion" && (
                    <FaUserEdit
                      className={
                        darkMode ? "text-gray-400 mr-2" : "text-gray-500 mr-2"
                      }
                      aria-hidden="true"
                    />
                  )}
                  <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                    {activity.type === "account_created"
                      ? "Account created"
                      : "Profile completion pending"}
                  </p>
                </div>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  {activity.timestamp}
                </p>
              </div>
            ))
          ) : (
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
              No recent activity.
            </p>
          )}
        </div>
      </div>
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
