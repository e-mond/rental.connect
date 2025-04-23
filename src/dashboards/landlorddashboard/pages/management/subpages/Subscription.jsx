import { useDarkMode } from "../../../../../context/DarkModeContext";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import landlordApi from "../../../../../api/landlord";
import Button from "../../../../../components/Button";
import GlobalSkeleton from "../../../../../components/GlobalSkeleton";
import ErrorDisplay from "../../../../../components/ErrorDisplay";
import { useState, useEffect } from "react";

/**
 * Subscription Component
 *
 * Displays subscription plan details and upgrade options for the landlord.
 * Features:
 * - Dark mode support for consistent UI theming.
 * - Uses the Button component for navigation.
 * - Placeholder for BASE_URL usage in API calls.
 */
const Subscription = () => {
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Placeholder: Fetch subscription details
  const {
    data: subscription = { plan: "Basic", status: "Active" },
    error,
    isLoading: subscriptionLoading,
    refetch,
  } = useQuery({
    queryKey: ["subscription"],
    queryFn: () => landlordApi.fetchSubscription(localStorage.getItem("token")),
    enabled: !!localStorage.getItem("token"),
  });

  // Ensure minimum 2-second loading for UX consistency
  useEffect(() => {
    if (!subscriptionLoading) {
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [subscriptionLoading]);

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
        &gt; Subscription Plan
      </nav>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Subscription Plan</h1>
        <Button
          variant="secondary"
          onClick={handleBack}
          className="text-sm sm:text-base"
        >
          Back
        </Button>
      </div>
      <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
        Upgrade your plan to access premium features.
      </p>
      {/* Placeholder for subscription details */}
      <div
        className={`mt-4 p-4 rounded-md shadow ${
          darkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        <h2 className="text-lg font-semibold">
          Current Plan: {subscription.plan}
        </h2>
        <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          Status: {subscription.status}
        </p>
      </div>
    </div>
  );
};

export default Subscription;
