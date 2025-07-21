import { useState, useEffect, useCallback } from "react";
import { useDarkMode } from "../../../context/DarkModeContext";
import tenantApi from "../../../api/tenant/tenantApi";
import GlobalSkeleton from "../../../components/GlobalSkeleton";

const RecentActivity = () => {
  const { darkMode } = useDarkMode();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRecentActivity = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const controller = new AbortController();
      const data = await tenantApi.withRetry(
        tenantApi.fetchRecentActivity,
        [token, controller.signal],
        3,
        2000
      );

      console.log("Recent Activity API response:", data);
      setActivities(data || []);
    } catch (err) {
      console.error("Failed to fetch recent activity:", err);
      setError(
        err.type === "auth"
          ? "Your session appears to be invalid. Please log in again to continue."
          : err.type === "network"
          ? "We’re having trouble connecting. Please check your network and try again."
          : err.type === "server"
          ? "The server is currently unavailable. Please try again later."
          : err.message || "Failed to fetch recent activity."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecentActivity();
  }, [fetchRecentActivity]);

  // Map activity type to badge color and shorthand
  const getTypeBadge = (type) => {
    const typeMap = {
      SCHEDULED_VIEWING: {
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        shorthand: "SV",
      },
      VIEWING_RESCHEDULED: {
        color:
          "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
        shorthand: "VR",
      },
      VIEWING_CANCELLED: {
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        shorthand: "VC",
      },
      MAINTENANCE_REQUEST: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        shorthand: "MREQ",
      },
      MESSAGE: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        shorthand: "MSG",
      },
      PROFILE_UPDATE: {
        color:
          "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
        shorthand: "PROF",
      },
    };

    const defaultBadge = {
      color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
      shorthand: type?.substring(0, 4).toUpperCase() || "ACT",
    };
    return typeMap[type] || defaultBadge;
  };

  if (loading) {
    return <GlobalSkeleton />;
  }

  return (
    <div
      className={`p-6 rounded-xl shadow-lg transition-all duration-300 ${
        darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
      }`}
      role="region"
      aria-label="Recent Activity"
    >
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="material-icons">history</span> Recent Activity
      </h3>

      {error && (
        <div
          className={`p-4 rounded-lg mb-6 flex items-center justify-between ${
            darkMode ? "bg-red-900 text-red-200" : "bg-red-50 text-red-700"
          }`}
          role="alert"
          aria-live="assertive"
        >
          <span>{error}</span>
          <button
            onClick={fetchRecentActivity}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              darkMode
                ? "bg-red-700 text-white hover:bg-red-600"
                : "bg-red-200 text-red-800 hover:bg-red-300"
            }`}
            aria-label="Retry fetching recent activity"
          >
            Retry
          </button>
        </div>
      )}

      {activities.length === 0 && !error ? (
        <div
          className={`p-4 rounded-lg text-center ${
            darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
          }`}
          role="status"
        >
          <p>No recent activity to display.</p>
        </div>
      ) : (
        <ul className="space-y-4" role="list">
          {activities.map((activity, index) => {
            const { color, shorthand } = getTypeBadge(activity.type);
            return (
              <li
                key={activity.id || index}
                className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg transition-all duration-200 hover:shadow-md ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
                role="listitem"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  console.log("View details for:", activity.id)
                }
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}
                      aria-label={`Activity type: ${activity.type}`}
                    >
                      {shorthand}
                    </span>
                    <p className="text-sm font-medium">{activity.message}</p>
                  </div>
                  {(activity.type === "SCHEDULED_VIEWING" ||
                    activity.type === "VIEWING_RESCHEDULED" ||
                    activity.type === "VIEWING_CANCELLED") && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <p aria-label={`Schedule ID: ${activity.entityId}`}>
                        Schedule ID: {activity.entityId}
                      </p>
                      <p aria-label={`Property ID: ${activity.propertyId}`}>
                        Property ID: {activity.propertyId}
                      </p>
                    </div>
                  )}
                </div>
                <p
                  className="text-xs text-gray-500 dark:text-gray-400 mt-2 sm:mt-0"
                  aria-label={`Activity time: ${activity.time}`}
                >
                  {activity.time}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default RecentActivity;
