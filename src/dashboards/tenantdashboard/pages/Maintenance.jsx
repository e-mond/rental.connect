import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
// import { FiTool, FiSend } from "react-icons/fi";
import Button from "../../../components/Button";
import GlobalSkeleton from "../../../components/GlobalSkeleton";
import { useDarkMode } from "../../../context/DarkModeContext";


import { useQuery } from "@tanstack/react-query";
import {
  Search,
  PlusCircle,
  AlertTriangle,
  Clock,
  CheckCircle,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import debounce from "lodash.debounce";

 import tenantApi from "../../../api/tenantApi"; // Hypothetical tenant API

import "react-toastify/dist/ReactToastify.css";

// Toast ID to prevent duplicate notifications
const TOAST_ID = "maintenance-error";

// Utility to show toast notifications with rate-limiting
const showToast = (message) => {
  if (!toast.isActive(TOAST_ID)) {
    toast.error(message, {
      toastId: TOAST_ID,
      position: "top-right",
      autoClose: 5000,
    });
  }
};

/**
 * Maintenance Component (Tenant Dashboard)
 *
 * Displays a list of maintenance requests submitted by the tenant, allowing filtering by status (All, Open, In Progress, Completed)
 * and searching by type or address. Fetches data using tenantApi and provides a responsive, accessible UI with dark mode support.
 * Features a skeleton loader during data fetching (minimum 2-second display for UX consistency) and handles errors with user-friendly
 * messages, retries with exponential backoff, and toast notifications. Shows a clear message when no requests are found, with suggestions
 * to submit new requests or adjust filters.
 *
 * @returns {JSX.Element} The rendered Maintenance component
 */
const Maintenance = () => {
  // Access dark mode context for consistent theming
  const { darkMode } = useDarkMode();
  // Navigation hook for redirecting to other routes
  const navigate = useNavigate();

  // State for search input to filter requests by type or address
  const [searchTerm, setSearchTerm] = useState("");
  // State for selected filter tab (All Requests, Open, In Progress, Completed)
  const [filterStatus, setFilterStatus] = useState("All Requests");
  // State to control skeleton loading delay for UX consistency
  const [loading, setLoading] = useState(true);
  // State to track retry attempts for exponential backoff
  const [retryCount, setRetryCount] = useState(0);

  // Fetch maintenance requests using react-query with enhanced error handling
  const {
    data: maintenanceRequests = [],
    error,
    isLoading: requestsLoading,
    refetch,
  } = useQuery({
    queryKey: ["maintenanceRequests"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("authentication_required");
      }
      return tenantApi.fetchMaintenanceRequests(token); // Tenant-specific API
    },
    enabled: !!localStorage.getItem("token"),
    retry: false, // Disable default retry; handle manually with backoff
    onError: (err) => {
      // Log error for debugging, avoiding sensitive data
      console.error("[Maintenance] Fetch error:", {
        message: err.message,
        stack: err.stack,
      });
      // Determine user-friendly error message based on error type
      const errorMessage =
        err.message === "authentication_required"
          ? "Please log in to view maintenance requests."
          : err.message.includes("network")
          ? "Network error. Please check your internet connection."
          : "Unable to load maintenance requests. Please try again.";
      showToast(errorMessage);
    },
  });

  // Ensure minimum 2-second loading for UX consistency
  useEffect(() => {
    if (!requestsLoading) {
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [requestsLoading]);

  // Memoize the debounced search function to prevent recreation on each render
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setSearchTerm(value);
      }, 300),
    [] // Empty deps since setSearchTerm is stable
  );

  // Memoize the handleSearch function to satisfy react-hooks/exhaustive-deps
  const handleSearch = useCallback(
    (value) => {
      debouncedSearch(value);
    },
    [debouncedSearch] // Include debouncedSearch as a dependency
  );

  // Filter requests based on search term and status
  const filteredRequests = maintenanceRequests.filter((request) => {
    // Case-insensitive search for type or address
    const matchesSearch =
      request.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.address.toLowerCase().includes(searchTerm.toLowerCase());

    // Match filter status; "All Requests" shows all statuses
    const matchesFilter =
      filterStatus === "All Requests" || request.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  // Navigate to the new maintenance request form
  const handleSubmitMaintenance = () => {
    navigate("/dashboard/tenant/maintenance/new"); // Tenant-specific route
  };

  // Retry fetching with exponential backoff
  const handleRetry = useCallback(() => {
    setLoading(true);
    // Calculate delay: 1s, 2s, 4s, 8s max
    const delay = Math.min(1000 * 2 ** retryCount, 8000);
    setTimeout(() => {
      refetch();
      setRetryCount((prev) => prev + 1);
    }, delay);
  }, [retryCount, refetch]);

  // Render skeleton loader during initial load or retry
  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row">
        <div
          className={`p-4 sm:p-6 rounded-lg shadow-md flex-1 ${
            darkMode
              ? "bg-gray-900 shadow-gray-700"
              : "bg-white shadow-gray-200"
          }`}
        >
          <GlobalSkeleton
            type="maintenance"
            bgColor={darkMode ? "bg-gray-700" : "bg-gray-300"}
            animationSpeed="1.5s"
          />
        </div>
      </div>
    );
  }

  // Render error state with retry and login options
  if (error || !localStorage.getItem("token")) {
    const errorMessage = error
      ? error.message === "authentication_required"
        ? "Please log in to view maintenance requests."
        : error.message.includes("network")
        ? "Network error. Please check your internet connection."
        : "Failed to load maintenance requests. Please try again."
      : "No token found. Please log in.";
    return (
      <div
        className={`flex flex-col items-center justify-center h-screen space-y-4 ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        <ToastContainer />
        <p
          className={`text-sm sm:text-base ${
            darkMode ? "text-red-400" : "text-red-500"
          }`}
        >
          {errorMessage}
        </p>
        <div className="flex gap-4">
          <Button
            variant="primary"
            onClick={handleRetry}
            className="text-sm sm:text-base flex items-center gap-2"
            disabled={loading}
            aria-label="Retry loading maintenance requests"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Retrying...
              </>
            ) : (
              "Retry"
            )}
          </Button>
          {errorMessage.includes("log in") && (
            <Button
              variant="secondary"
              onClick={() => navigate("/tenantlogin")} // Tenant-specific login route
              className="text-sm sm:text-base"
              aria-label="Go to login page"
            >
              Log In
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Render message if no requests are found after loading
  if (maintenanceRequests.length === 0) {
    return (
      <div className="flex flex-col lg:flex-row">
        <div
          className={`p-4 sm:p-6 rounded-lg shadow-md flex-1 ${
            darkMode
              ? "bg-gray-900 shadow-gray-700"
              : "bg-white shadow-gray-200"
          }`}
        >
          <ToastContainer />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-3 sm:space-y-0">
            <h2 className="text-xl sm:text-2xl font-bold">
              Maintenance Requests
            </h2>
            <Button
              variant="primary"
              onClick={handleSubmitMaintenance}
              className="flex items-center gap-2 text-sm sm:text-base"
              aria-label="Submit a new maintenance request"
            >
              <PlusCircle className="w-5 h-5" /> Submit Request
            </Button>
          </div>
          <p
            className={`text-center py-4 text-sm sm:text-base ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            No maintenance requests found. Try submitting a new one!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row">
      <div
        className={`p-4 sm:p-6 rounded-lg shadow-md flex-1 ${
          darkMode ? "bg-gray-900 shadow-gray-700" : "bg-white shadow-gray-200"
        }`}
      >
        <ToastContainer />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-3 sm:space-y-0">
          <h2 className="text-xl sm:text-2xl font-bold">
            Maintenance Requests
          </h2>
          <Button
            variant="primary"
            onClick={handleSubmitMaintenance}
            className="flex items-center gap-2 text-sm sm:text-base"
            aria-label="Submit a new maintenance request"
          >
            <PlusCircle className="w-5 h-5" /> Submit Request
          </Button>
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search requests..."
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-sm ${
              darkMode
                ? "border-gray-600 bg-gray-800 text-gray-200"
                : "border-gray-300 bg-white text-gray-800"
            }`}
            onChange={(e) => handleSearch(e.target.value)}
            aria-label="Search maintenance requests by type or address"
          />
          <Search
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              darkMode ? "text-gray-400" : "text-gray-400"
            }`}
            aria-hidden="true"
          />
        </div>

        <nav
          className={`flex gap-2 border-b pb-2 mb-4 overflow-x-auto scrollbar-thin ${
            darkMode
              ? "border-gray-700 text-gray-400 scrollbar-thumb-gray-600 scrollbar-track-gray-800"
              : "border-gray-200 text-gray-600 scrollbar-thumb-gray-400 scrollbar-track-gray-100"
          }`}
        >
          {["All Requests", "Open", "In Progress", "Completed"].map(
            (status) => (
              <button
                key={status}
                className={`cursor-pointer font-medium px-3 py-1 rounded text-sm sm:text-base whitespace-nowrap transition-colors ${
                  filterStatus === status
                    ? darkMode
                      ? "bg-teal-500 text-white"
                      : "bg-blue-600 text-white"
                    : darkMode
                    ? "hover:bg-gray-700 focus:bg-gray-600"
                    : "hover:bg-gray-100 focus:bg-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                onClick={() => setFilterStatus(status)}
                aria-current={filterStatus === status ? "true" : undefined}
                aria-label={`Filter by ${status} status`}
              >
                {status}
              </button>
            )
          )}
        </nav>

        <ul className="space-y-2">
          {filteredRequests.map((request) => (
            <li
              key={request.id}
              className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg shadow-sm transition-colors ${
                darkMode
                  ? "border-gray-700 hover:bg-gray-800"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                <span
                  className={`text-2xl sm:text-3xl ${
                    darkMode ? "text-teal-500" : "text-blue-500"
                  }`}
                  aria-hidden="true"
                >
                  {request.icon}
                </span>
                <div>
                  <h3 className="font-medium text-sm sm:text-base">
                    {request.type} - {request.address}
                  </h3>
                  <p
                    className={`text-xs sm:text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {request.details}
                  </p>
                  {request.scheduledDate && (
                    <p
                      className={`text-xs sm:text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Scheduled for: {request.scheduledDate}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                {request.status === "Urgent" && (
                  <AlertTriangle
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      darkMode ? "text-red-400" : "text-red-500"
                    }`}
                    aria-label="Urgent status"
                  />
                )}
                {request.status === "In Progress" && (
                  <Clock
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      darkMode ? "text-yellow-400" : "text-yellow-500"
                    }`}
                    aria-label="In Progress status"
                  />
                )}
                {request.status === "Open" && (
                  <CheckCircle
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      darkMode ? "text-teal-500" : "text-blue-500"
                    }`}
                    aria-label="Open status"
                  />
                )}
                <Button
                  variant="secondary"
                  className="text-xs sm:text-sm"
                  aria-label={`View details for ${request.type} at ${request.address}`}
                >
                  View Details
                </Button>
              </div>
            </li>
          ))}
          {filteredRequests.length === 0 && (
            <p
              className={`text-center py-4 text-sm sm:text-base ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              No requests match your search or filter. Try adjusting the
              criteria or submitting a new request.
            </p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Maintenance;