import { useDarkMode } from "../../../../../context/DarkModeContext";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import landlordApi from "../../../../../api/landlordApi";
import Button from "../../../../../components/Button";
import GlobalSkeleton from "../../../../../components/GlobalSkeleton";
import ErrorDisplay from "../../../../../components/ErrorDisplay";
import { useState, useEffect } from "react";

/**
 * LoginActivity Component
 *
 * Displays recent login activity for the landlord.
 * Features:
 * - Dark mode support for consistent UI theming.
 * - Uses the Button component for navigation.
 * - Placeholder for BASE_URL usage in API calls.
 */
const LoginActivity = () => {
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Placeholder: Fetch login activity
  const {
    data: loginActivity = [],
    error,
    isLoading: activityLoading,
    refetch,
  } = useQuery({
    queryKey: ["loginActivity"],
    queryFn: () =>
      landlordApi.fetchLoginActivity(localStorage.getItem("token")),
    enabled: !!localStorage.getItem("token"),
  });

  // Ensure minimum 2-second loading for UX consistency
  useEffect(() => {
    if (!activityLoading) {
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [activityLoading]);

  const handleBack = () => {
    navigate("/dashboard/landlord/settings");
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <div
          className={`p-4 sm:p-8 w-full ${
            darkMode ? "bg-gray-800" : "bg-gray-50"
          }`}
        >
          <GlobalSkeleton
            type="settings"
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
          className={`p-4 sm:p-8 w-full ${
            darkMode ? "bg-gray-800" : "bg-gray-50"
          }`}
        >
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <ErrorDisplay
              error={error}
              className={darkMode ? "text-red-400" : "text-red-500"}
            />
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
      className={`p-4 sm:p-8 ${
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
        </span>{" "}
        &gt;{" "}
        <span
          className={`font-semibold ${
            darkMode ? "text-gray-200" : "text-black"
          }`}
        >
          Settings
        </span>{" "}
        &gt; Login Activity
      </nav>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Login Activity</h1>
        <Button
          variant="secondary"
          onClick={handleBack}
          className="text-sm sm:text-base"
        >
          Back
        </Button>
      </div>
      <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
        View your recent login activity here.
      </p>
      {/* Placeholder for login activity list */}
      {loginActivity.length === 0 ? (
        <p className={`mt-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          No recent login activity found.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {loginActivity.map((activity) => (
            <li
              key={activity.id}
              className={`p-2 rounded-md ${
                darkMode ? "bg-gray-900" : "bg-white"
              } shadow`}
            >
              {activity.timestamp} - {activity.device} ({activity.ip})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LoginActivity;
