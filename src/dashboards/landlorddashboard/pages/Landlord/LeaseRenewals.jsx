import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import landlordApi from "../../../../api/landlord";
import Button from "../../../../components/Button";
import GlobalSkeleton from "../../../../components/GlobalSkeleton";
import { useDarkMode } from "../../../../context/DarkModeContext";

/**
 * LeaseRenewals component displays a list of upcoming lease renewals for the landlord.
 * Features:
 * - Dark mode support for consistent UI theming.
 * - Uses the Button component for navigation and retry actions.
 * - Verifies BASE_URL usage in API calls via landlordApi.
 */
const LeaseRenewals = () => {
  const { user } = useOutletContext();
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Placeholder: Fetch lease renewals
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
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <p
              className={`text-sm sm:text-base ${
                darkMode ? "text-red-400" : "text-red-500"
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
        </span>{" "}
        &apos;{">"}&apos; Lease Renewals
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
        <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
          This section will display all upcoming lease renewals. (Under
          construction)
        </p>
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
              <h3 className="font-semibold">
                {renewal.tenantName} - {renewal.propertyAddress}
              </h3>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Renewal Date: {renewal.renewalDate}
              </p>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Status: {renewal.status}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LeaseRenewals;
