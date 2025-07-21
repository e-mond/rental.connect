import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import landlordApi from "../../../../api/landlord/landlordApi";
import Notifications from "../../../../components/Notifications";
import Button from "../../../../components/Button";
import GlobalSkeleton from "../../../../components/GlobalSkeleton";
import { useDarkMode } from "../../../../context/DarkModeContext";
import { FaExclamationCircle } from "react-icons/fa";

/**
 * LandlordNotifications Component
 *
 * Displays a list of notifications for the landlord user using the shared Notifications component.
 * Fetches notifications from the backend and maps them to the expected format.
 *
 * Features:
 * - Fetches notifications using landlordApi with Tanstack Query.
 * - Dark mode support for consistent UI theming.
 * - Uses Button component for navigation and retry actions.
 * - Enhanced empty and error states with icon and message.
 * - Minimum 2-second loading for UX consistency.
 * - Retries with refreshed token on 401 errors.
 *
 * @returns {JSX.Element} The rendered LandlordNotifications component
 */
const LandlordNotifications = () => {
  const { user } = useOutletContext();
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Fetch notifications using Tanstack Query with retry logic
  const {
    data: notificationsData = [],
    error,
    isLoading: notificationsLoading,
    refetch,
  } = useQuery({
    queryKey: ["landlordNotifications"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");
      try {
        const response = await landlordApi.fetchNotifications(token);
        return response;
      } catch (err) {
        if (err.response?.status === 401) {
          console.log(
            "[LandlordNotifications] 401 error, attempting refresh..."
          );
          const newToken = await landlordApi.refreshToken(token);
          const refreshedResponse = await landlordApi.fetchNotifications(
            newToken
          );
          return refreshedResponse;
        }
        throw err;
      }
    },
    enabled: !!localStorage.getItem("token"),
    retry: false, // Disable automatic retries to handle manually
  });

  // Ensure minimum 2-second loading for UX consistency
  useEffect(() => {
    if (!notificationsLoading) {
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [notificationsLoading]);

  // Map API response to the format expected by Notifications component
  const notifications = notificationsData.map((notification) => {
    const messageLower = notification.message.toLowerCase();
    let type = "other";
    let status = "info";
    let title = notification.message.split(" ").slice(0, 3).join(" ") + "...";

    // Determine type
    if (messageLower.includes("rent")) type = "rent";
    else if (messageLower.includes("maintenance")) type = "maintenance";
    else if (messageLower.includes("lease")) type = "lease";

    // Determine status
    if (messageLower.includes("received")) status = "received";
    else if (messageLower.includes("due")) status = "due";
    else if (messageLower.includes("overdue")) status = "overdue";

    // Extract details (simplified; enhance based on message parsing if needed)
    const details = messageLower.includes("unit")
      ? `Unit: ${notification.message.split("Unit: ")[1] || "Unknown"}`
      : "N/A";

    return {
      id: notification.id,
      title,
      message: notification.message,
      timestamp: notification.createdAt,
      type,
      isRead: notification.isRead,
      status,
      details,
    };
  });

  const handleBack = () => {
    navigate("/dashboard/landlord");
  };

  // Show skeleton while loading
  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row">
        <div
          className={`p-4 sm:p-6 flex-1 overflow-y-auto ${
            darkMode ? "bg-gray-800" : "bg-gray-50"
          }`}
        >
          <GlobalSkeleton
            type="notifications"
            bgColor={darkMode ? "bg-gray-700" : "bg-gray-300"}
            animationSpeed="1.5s"
          />
        </div>
      </div>
    );
  }

  // Show error message if fetching notifications failed
  if (error || !localStorage.getItem("token")) {
    const errorMessage = error
      ? error.message || "Failed to load notifications. Please try again."
      : "No token found. Please log in.";
    return (
      <div className="flex flex-col lg:flex-row">
        <div
          className={`p-4 sm:p-6 flex-1 overflow-y-auto ${
            darkMode ? "bg-gray-800" : "bg-gray-50"
          }`}
        >
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <FaExclamationCircle
              size={40}
              className={darkMode ? "text-red-400" : "text-red-500"}
            />
            <p
              className={`text-lg font-semibold ${
                darkMode ? "text-red-400" : "text-red-500"
              }`}
            >
              Error
            </p>
            <p
              className={`text-sm text-center ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {errorMessage}
            </p>
            <Button
              variant="primary"
              onClick={() => {
                setLoading(true);
                refetch();
              }}
              className="text-sm sm:text-base"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-4 sm:p-6 flex-1 overflow-y-auto ${
        darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-50 text-gray-800"
      }`}
    >
      <nav
        className={`mb-4 text-sm sm:text-base ${
          darkMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        <span
          className={`font-semibold ${
            darkMode ? "text-gray-200" : "text-black"
          }`}
        >
          Dashboard
        </span>
        <span className="mx-1">{">"}</span>
        Notifications
      </nav>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">
          Notifications for {user?.name || "Landlord"}
        </h2>
        <Button
          variant="secondary"
          onClick={handleBack}
          className="text-sm sm:text-base"
        >
          Back
        </Button>
      </div>
      <Notifications initialNotifications={notifications} userType="landlord" />
    </div>
  );
};

export default LandlordNotifications;
