import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  PlusCircle,
  AlertTriangle,
  Clock,
  CheckCircle,
} from "lucide-react";
import GlobalSkeleton from "../../../../components/GlobalSkeleton";
import Button from "../../../../components/Button";
import landlordApi from "../../../../api/landlord/landlordApi";
import { useDarkMode } from "../../../../context/DarkModeContext";

/**
 * Maintenance Component
 *
 * Displays a list of maintenance requests for the landlord's properties, with options to filter by status (All, Open, In Progress, Completed)
 * and search by type or address. Fetches maintenance request data from the backend and provides a responsive, accessible interface.
 * Includes a skeleton loader during data fetching to improve user experience, with a minimum 2-second display to match the LandlordDashboardHome component.
 * If no requests are found after loading, displays a "No requests found" message.
 * Features:
 * - Dark mode support for consistent UI theming.
 * - Uses the Button component for consistent button styling.
 * - Verifies BASE_URL usage in API calls via landlordApi.
 */
const Maintenance = () => {
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Requests");
  const [loading, setLoading] = useState(true);

  // Fetch maintenance requests using react-query
  const {
    data: maintenanceRequests = [],
    error,
    isLoading: requestsLoading,
    refetch,
  } = useQuery({
    queryKey: ["maintenanceRequests"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await landlordApi.fetchMaintenanceRequests(token);
      console.log("[Maintenance] Fetched maintenance requests:", response);
      return response;
    },
    enabled: !!localStorage.getItem("token"),
    onError: (error) => {
      console.error("[Maintenance] Fetch error:", error);
    },
    retry: 1,
    retryDelay: 2000,
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false, // Prevent bounces
  });

  // Ensure minimum 2-second loading for UX consistency
  useEffect(() => {
    if (!requestsLoading) {
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [requestsLoading]);

  // Filter requests based on search term and status
  const filteredRequests = maintenanceRequests.filter((request) => {
    const matchesSearch =
      (request.type?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (request.address?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "All Requests" ||
      (filterStatus === "Open" && request.status === "Open") ||
      (filterStatus === "In Progress" && request.status === "In Progress") ||
      (filterStatus === "Completed" && request.status === "Completed");

    return matchesSearch && matchesFilter;
  });

  // Navigate to the new maintenance request form
  const handleScheduleMaintenance = () => {
    navigate("/dashboard/landlord/maintenance/new");
  };

  // Show skeleton while loading
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

  // Show error message if fetching requests failed
  if (error || !localStorage.getItem("token")) {
    const errorMessage = error
      ? error.message ||
        "Failed to load maintenance requests. Please try again."
      : "No token found. Please log in.";
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
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
    );
  }

  // Show message if no requests are found after loading
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-3 sm:space-y-0">
            <h2 className="text-xl sm:text-2xl font-bold">
              Maintenance Requests
            </h2>
            <Button
              variant="primary"
              onClick={handleScheduleMaintenance}
              className="flex items-center gap-2 text-sm sm:text-base"
              aria-label="Schedule a new maintenance event"
            >
              <PlusCircle className="w-5 h-5" /> Schedule Maintenance
            </Button>
          </div>
          <p
            className={`text-center py-4 text-sm sm:text-base ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            No maintenance requests found.
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
        {/* Header Section: Title and Schedule Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-3 sm:space-y-0">
          <h2 className="text-xl sm:text-2xl font-bold">
            Maintenance Requests
          </h2>
          <Button
            variant="primary"
            onClick={handleScheduleMaintenance}
            className="flex items-center gap-2 text-sm sm:text-base"
            aria-label="Schedule a new maintenance event"
          >
            <PlusCircle className="w-5 h-5" /> Schedule Maintenance
          </Button>
        </div>

        {/* Search Bar Section */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search requests..."
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-sm ${
              darkMode
                ? "border-gray-600 bg-gray-800 text-gray-200"
                : "border-gray-300 bg-white text-gray-800"
            }`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search maintenance requests by type or address"
          />
          <Search
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              darkMode ? "text-gray-400" : "text-gray-400"
            }`}
          />
        </div>

        {/* Filter Tabs Section */}
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

        {/* Maintenance Requests Section */}
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
                  {request.icon || "🔧"} {/* Fallback icon if none provided */}
                </span>
                <div>
                  <h3 className="font-medium text-sm sm:text-base">
                    {request.type || "Unknown Type"} -{" "}
                    {request.address || "Unknown Address"}
                  </h3>
                  <p
                    className={`text-xs sm:text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {request.details || "No details provided"}
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
                  aria-label={`Select options for ${
                    request.type || "maintenance"
                  } at ${request.address || "this address"}`}
                >
                  Select ▼
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
              No requests found for the selected criteria.
            </p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Maintenance;
