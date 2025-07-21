import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import landlordApi from "../../../../api/landlord/landlordApi";
import Button from "../../../../components/Button";
import GlobalSkeleton from "../../../../components/GlobalSkeleton";
import { useDarkMode } from "../../../../context/DarkModeContext";
import { FaExclamationCircle } from "react-icons/fa";

/**
 * LeaseRenewals component displays a list of upcoming lease renewals for the landlord.
 * Features:
 * - Fetches lease renewals using landlordApi with Tanstack Query.
 * - Dark mode support for consistent UI theming.
 * - Uses Button component for navigation and retry actions.
 * - Enhanced empty and error states with icon and message.
 * - Minimum 2-second loading for UX consistency.
 * - Displays tenant, property, renewal date, days remaining, rent, and status.
 */
const LeaseRenewals = () => {
  const { user } = useOutletContext();
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Fetch lease renewals using Tanstack Query
  const {
    data: leaseRenewals = [],
    error,
    isLoading: renewalsLoading,
    refetch,
  } = useQuery({
    queryKey: ["leaseRenewals"],
    queryFn: () =>
      landlordApi.fetchLeaseRenewals(localStorage.getItem("token")),
    enabled: !!localStorage.getItem("token"),
  });

  // Ensure minimum 2-second loading for UX consistency
  useEffect(() => {
    if (!renewalsLoading) {
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [renewalsLoading]);

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
            type="leaseRenewals"
            bgColor={darkMode ? "bg-gray-700" : "bg-gray-300"}
            animationSpeed="1.5s"
          />
        </div>
      </div>
    );
  }

  // Show error message if fetching lease renewals failed
  if (error || !localStorage.getItem("token")) {
    const errorMessage = error
      ? error.message || "Failed to load lease renewals. Please try again."
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
        <span className="mx-1">&gt;</span>
        Lease Renewals
      </nav>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">
          Lease Renewals for {user?.name || "Landlord"}
        </h2>
        <Button
          variant="secondary"
          onClick={handleBack}
          className="text-sm sm:text-base"
        >
          Back
        </Button>
      </div>
      {leaseRenewals.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <FaExclamationCircle
            size={40}
            className={darkMode ? "text-gray-500" : "text-gray-400"}
          />
          <p
            className={`text-lg font-semibold ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            No Upcoming Lease Renewals
          </p>
          <p
            className={`text-sm text-center ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Leases with 30 or fewer days remaining will appear here.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {leaseRenewals.map((renewal) => (
            <li
              key={renewal.id}
              className={`p-4 rounded-lg shadow ${
                darkMode
                  ? "bg-gray-900 shadow-gray-700"
                  : "bg-white shadow-gray-200"
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <h3 className="font-semibold">
                    {renewal.tenant} - {renewal.property}
                  </h3>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Renewal Date: {renewal.renewalDate}
                  </p>
                </div>
                <div>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Days Remaining: {renewal.daysRemaining}
                  </p>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Rent: $
                    {renewal.rent != null ? renewal.rent.toFixed(2) : "N/A"}
                  </p>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Status: {renewal.status}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LeaseRenewals;
