import { useState, useEffect, useCallback } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import LandlordSidebar from "../../components/LandlordSidebar";
import GlobalSkeleton from "../../../../components/GlobalSkeleton";
import { DEFAULT_PROFILE_PIC } from "../../../../config";
import { useUser } from "../../../../context/useUser";
import {
  HomeIcon,
  BuildingOfficeIcon,
  UsersIcon,
  StarIcon,
  WrenchIcon,
  EnvelopeIcon,
  CreditCardIcon,
  DocumentTextIcon,
  CogIcon,
} from "@heroicons/react/24/outline";
import { useDarkMode } from "../../../../context/DarkModeContext";
import Button from "../../../../components/Button";
import landlordApi from "../../../../api/landlord/landlordApi";
import { toast } from "react-toastify";
import {
  FaHome,
  FaFileAlt,
  FaCreditCard,
  FaStar,
  FaTools,
  FaWarehouse,
} from "react-icons/fa";
import AnalyticsGraph from "../../components/AnalyticsGraph";

// Rate-limit toast notifications
const toastId = "dashboard-error";
const showToast = (message) => {
  if (!toast.isActive(toastId)) {
    toast.error(message, {
      toastId,
      position: "top-right",
      autoClose: 3000,
    });
  }
};

/**
 * Fetches dashboard data for the landlord from the backend API.
 *
 * @param {string} token - The authentication token
 * @returns {Promise<Object>} The dashboard data
 * @throws {Error} If the fetch fails
 */
const fetchDashboardData = async (token) => {
  if (!token) throw new Error("Authentication token is required");
  const response = await landlordApi.fetchDashboardData(token);
  console.log(
    "[LandlordDashboard] fetchDashboardData: Fetched dashboard data:",
    response
  );
  return response;
};

/**
 * LandlordDashboard Component
 *
 * The main dashboard layout for landlords, providing a sidebar for navigation
 * and rendering child routes (e.g., dashboard home, properties, tenants).
 * Fetches properties and dashboard data from the backend and passes them to child components via Outlet context.
 *
 * @returns {JSX.Element} The rendered LandlordDashboard component
 */
const LandlordDashboard = () => {
  const { darkMode } = useDarkMode();
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const sidebarOpen = localStorage.getItem("sidebarOpen");
    if (!sidebarOpen) return false;
    try {
      return JSON.parse(sidebarOpen);
    } catch {
      localStorage.removeItem("sidebarOpen");
      return false;
    }
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: userLoading, error: userError } = useUser();
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();

  // Define sidebar menu items
  const menuItems = [
    { name: "Dashboard", path: "/dashboard/landlord", icon: HomeIcon },
    {
      name: "Properties",
      path: "/dashboard/landlord/properties",
      icon: BuildingOfficeIcon,
    },
    { name: "Tenants", path: "/dashboard/landlord/tenants", icon: UsersIcon },
    { name: "Reviews", path: "/dashboard/landlord/reviews", icon: StarIcon },
    {
      name: "Maintenance",
      path: "/dashboard/landlord/maintenance",
      icon: WrenchIcon,
    },
    {
      name: "Messages",
      path: "/dashboard/landlord/messages",
      icon: EnvelopeIcon,
    },
    {
      name: "Revenue",
      path: "/dashboard/landlord/revenue",
      icon: CreditCardIcon,
    },
  ];

  const managementItems = [
    {
      name: "Payments",
      path: "/dashboard/landlord/payments",
      icon: CreditCardIcon,
    },
    {
      name: "Documents",
      path: "/dashboard/landlord/documents",
      icon: DocumentTextIcon,
    },
    { name: "Settings", path: "/dashboard/landlord/settings", icon: CogIcon },
  ];

  // Fetch properties using React Query
  const {
    data: properties = [],
    isLoading: isPropertiesLoading,
    error: propertiesError,
    refetch: refetchProperties,
  } = useQuery({
    queryKey: ["properties", user?._id],
    queryFn: async () => {
      console.log(
        "[LandlordDashboard] Fetching properties for user:",
        user?._id
      );
      const data = await landlordApi.fetchProperties(token);
      if (!Array.isArray(data)) {
        console.error(
          "[LandlordDashboard] Properties response is not an array:",
          data
        );
        return [];
      }
      return data.map((prop) => ({
        ...prop,
        id: prop.id || prop._id || `temp-id-${Math.random()}`,
        status: prop.status || "Active",
      }));
    },
    enabled: !!user && !!user._id && !!token,
    onSuccess: (data) => {
      console.log("[LandlordDashboard] Properties fetched successfully:", data);
    },
    onError: (err) => {
      console.error("[LandlordDashboard] Failed to fetch properties:", err);
      showToast("Failed to fetch properties: " + err.message);
    },
    retry: 1,
    staleTime: 0,
  });

  // Fetch dashboard data using React Query
  const {
    data: dashboardData = {},
    isLoading: isDashboardLoading,
    error: dashboardError,
    refetch: refetchDashboardData,
  } = useQuery({
    queryKey: ["dashboardData", user?._id],
    queryFn: () => fetchDashboardData(token),
    enabled: !!user && !!user._id && !!token,
    onSuccess: (data) => {
      console.log(
        "[LandlordDashboard] Dashboard data fetched successfully:",
        data
      );
    },
    onError: (err) => {
      console.error("[LandlordDashboard] Failed to fetch dashboard data:", err);
      showToast("Failed to fetch dashboard data: " + err.message);
    },
    retry: 1,
    staleTime: 0,
  });

  // Additional data for dashboard (leases, transactions, notifications)
  const [leases, setLeases] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [currency, setCurrency] = useState("GH₵");
  const [additionalLoading, setAdditionalLoading] = useState(true);
  const [additionalError, setAdditionalError] = useState(null);

  // Fetch additional data (leases, transactions, notifications)
  const loadAdditionalData = useCallback(async () => {
    if (!token) {
      showToast("No authentication token found. Please log in.");
      navigate("/landlordlogin");
      return;
    }

    setAdditionalLoading(true);
    setAdditionalError(null);

    try {
      const [leasesResponse, transactionsResponse, notificationsResponse] =
        await Promise.all([
          landlordApi.fetchLeases(token),
          landlordApi.fetchTransactions(token),
          landlordApi.fetchNotifications(token),
        ]);

      setLeases(leasesResponse.data || []);
      setTransactions(transactionsResponse.data || []);
      setNotifications(notificationsResponse.data || []);
    } catch (error) {
      console.error(
        "[LandlordDashboard] Failed to load additional data:",
        error
      );
      if (error.message.includes("401")) {
        localStorage.removeItem("token");
        showToast("Session expired. Please log in again.");
        navigate("/landlordlogin");
      } else {
        showToast(
          "Failed to load additional dashboard data. Please try again."
        );
        setAdditionalError(
          "An unexpected error occurred. Please try again later."
        );
      }
      setLeases([]);
      setTransactions([]);
      setNotifications([]);
    } finally {
      setAdditionalLoading(false);
    }
  }, [navigate, token]);

  useEffect(() => {
    if (!isDashboardLoading) {
      loadAdditionalData();
    }
  }, [isDashboardLoading, loadAdditionalData]);

  // Function to invalidate and refetch queries
  const invalidateQueries = useCallback(async () => {
    console.log(
      "[LandlordDashboard] Invalidating queries for user:",
      user?._id
    );
    await Promise.all([
      queryClient.invalidateQueries(["properties", user?._id], { exact: true }),
      queryClient.invalidateQueries(["dashboardData", user?._id], {
        exact: true,
      }),
    ]);
    await Promise.all([refetchProperties(), refetchDashboardData()]);
    console.log("[LandlordDashboard] Queries refetched after invalidation.");
  }, [queryClient, user?._id, refetchProperties, refetchDashboardData]);

  // Persist sidebar state in localStorage
  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  // Determine the skeleton type based on the current route
  const getSkeletonType = () => {
    const path = location.pathname;
    if (path.includes("dashboard")) return "dashboard";
    if (path.includes("properties")) return "cards";
    if (path.includes("tenants")) return "list";
    if (path.includes("reviews")) return "list";
    if (path.includes("maintenance")) return "list";
    if (path.includes("messages")) return "list";
    if (path.includes("payments")) return "table";
    if (path.includes("documents")) return "list";
    if (path.includes("settings")) return "form";
    if (path.includes("profile")) return "profile";
    if (path.includes("revenue")) return "revenue";
    return "list";
  };

  // Redirect if no token
  if (!token) {
    navigate("/landlordlogin");
    return null;
  }

  // Loading state
  if (
    userLoading ||
    isPropertiesLoading ||
    isDashboardLoading ||
    additionalLoading
  ) {
    return (
      <div
        className={`flex h-screen ${
          darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-black"
        }`}
      >
        <LandlordSidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          user={null}
          isLoading={true}
          menuItems={menuItems}
          managementItems={managementItems}
        />
        <div className="flex-1 p-6 overflow-auto">
          <GlobalSkeleton
            type={getSkeletonType()}
            bgColor={darkMode ? "bg-gray-700" : "bg-gray-300"}
            animationSpeed="1.2s"
          />
        </div>
      </div>
    );
  }

  // User error state
  if (userError) {
    return (
      <div
        className={`flex h-screen ${
          darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-black"
        }`}
      >
        <LandlordSidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          user={null}
          isLoading={false}
          menuItems={menuItems}
          managementItems={managementItems}
        />
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <p className={darkMode ? "text-red-400" : "text-red-500"}>
              {userError}
            </p>
            <Button
              variant="primary"
              onClick={() => navigate("/landlordlogin")}
            >
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Properties error state
  if (propertiesError) {
    return (
      <div
        className={`flex h-screen ${
          darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-black"
        }`}
      >
        <LandlordSidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          user={null}
          isLoading={false}
          menuItems={menuItems}
          managementItems={managementItems}
        />
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <p className={darkMode ? "text-red-400" : "text-red-500"}>
              Error fetching properties: {propertiesError.message}
            </p>
            <Button variant="primary" onClick={() => refetchProperties()}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard error state
  if (dashboardError || additionalError) {
    return (
      <div
        className={`flex h-screen ${
          darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-black"
        }`}
      >
        <LandlordSidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          user={null}
          isLoading={false}
          menuItems={managementItems}
        />
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <p className={darkMode ? "text-red-400" : "text-red-500"}>
              {dashboardError?.message ||
                additionalError ||
                "Error fetching dashboard data"}
            </p>
            <Button variant="primary" onClick={() => refetchDashboardData()}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Redirect if user is a tenant
  if (user && user.role && user.role.toUpperCase() === "TENANT") {
    navigate("/dashboard/tenant/dashboard");
    return null;
  }

  // Format user data for display
  const formattedUser = user
    ? {
        ...user,
        profilePic: user.profilePic || DEFAULT_PROFILE_PIC,
        accountType: user.role || "Landlord",
      }
    : null;

  // Dashboard Home UI
  const handleViewProperties = () => navigate("/dashboard/landlord/properties");
  const handleViewIssues = () => navigate("/dashboard/landlord/maintenance");
  const handleViewRatings = () => navigate("/dashboard/landlord/reviews");
  const handleViewLeaseRenewals = () =>
    navigate("/dashboard/landlord/lease-renewals");
  const handleViewRevenue = () => navigate("/dashboard/landlord/revenue");

  const convertCurrency = (amount) => {
    const rates = { "GH₵": 1, USD: 0.064, EUR: 0.059 };
    return (amount * (rates[currency] || 1)).toFixed(2);
  };

  const quickStats = {
    totalProperties: properties?.length || 0,
    totalTenants: dashboardData.activeRentals || 0,
    totalRevenueThisYear: convertCurrency(dashboardData.monthlyRevenue * 12),
  };

  const upcomingRenewals = leases.filter(
    (lease) =>
      lease.daysRemaining !== undefined &&
      parseInt(lease.daysRemaining, 10) <= 30
  );

  const userName =
    user?.fullName ||
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    user?.name ||
    "Landlord";

  // Render the dashboard home if on the main dashboard route
  if (location.pathname === "/dashboard/landlord") {
    return (
      <div
        className={`flex h-screen ${
          darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-black"
        }`}
      >
        <LandlordSidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          user={formattedUser}
          isLoading={false}
          menuItems={menuItems}
          managementItems={managementItems}
        />
        <div
          className={`p-4 flex-1 overflow-y-auto bg-${
            darkMode ? "gray-900" : "gray-50"
          } text-${darkMode ? "gray-200" : "black"}`}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">
                Welcome back,{" "}
                <span className={darkMode ? "text-teal-400" : "text-blue-600"}>
                  {userName}
                </span>
                !
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Here’s an overview of your rental business.
              </p>
            </div>
            <Button variant="primary" onClick={handleViewProperties}>
              Add Property
            </Button>
          </div>

          {/* Currency Selector */}
          <div className="flex items-center mb-6">
            <label className="mr-2 font-medium" htmlFor="currency">
              Currency:
            </label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="GH₵">GH₵ (Cedis)</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>

          {/* Stats Cards - Horizontal Scroll with Hidden Scrollbar */}
          <div
            className="flex overflow-x-auto space-x-4 mb-8 scrollbar-hidden"
            style={{
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE and Edge
            }}
          >
            {[
              {
                icon: FaHome,
                title: "Active Rentals",
                value: dashboardData.activeRentals || 0,
                onClick: handleViewProperties,
              },
              {
                icon: FaFileAlt,
                title: "Pending Issues",
                value: dashboardData.pendingIssues || 0,
                onClick: handleViewIssues,
              },
              {
                icon: FaCreditCard,
                title: "Monthly Revenue",
                value: `${currency} ${convertCurrency(
                  dashboardData.monthlyRevenue || 0
                )}`,
                onClick: handleViewRevenue,
              },
              {
                icon: FaStar,
                title: "Average Rating",
                value: `${dashboardData.averageRating?.toFixed(1) || 0}/5`,
                onClick: handleViewRatings,
              },
              {
                icon: FaWarehouse,
                title: "Total Properties",
                value: dashboardData.totalProperties || 0,
                onClick: handleViewProperties,
              },
              {
                icon: FaHome,
                title: "Vacant Properties",
                value: dashboardData.vacantProperties || 0,
                onClick: handleViewProperties,
              },
              {
                icon: FaTools,
                title: "Under Maintenance",
                value: dashboardData.underMaintenance || 0,
                onClick: handleViewIssues,
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg shadow bg-${
                  darkMode ? "gray-800" : "white"
                } min-w-[300px]`}
              >
                <stat.icon className="text-2xl mb-2 text-blue-500" />
                <h3 className="text-lg font-semibold">{stat.title}</h3>
                <p className="text-gray-500 text-sm mb-3">{stat.value}</p>
                <Button variant="primary" onClick={stat.onClick}>
                  View
                </Button>
              </div>
            ))}
          </div>

          {/* Graph */}
          <div
            className={`p-4 rounded-lg shadow mb-8 bg-${
              darkMode ? "gray-800" : "white"
            }`}
          >
            <h3 className="text-lg font-bold mb-4">Key Metrics Overview</h3>
            <AnalyticsGraph
              numberOfTenants={dashboardData.activeRentals || 0}
              maintenanceIssues={dashboardData.pendingIssues || 0}
              averageRating={dashboardData.averageRating || 0}
              quickStats={quickStats}
              notifications={notifications}
              onResolveIssues={handleViewIssues}
              currency={currency}
            />
          </div>

          {/* Lease Renewals */}
          <div
            className={`p-4 rounded-lg shadow mb-8 bg-${
              darkMode ? "gray-800" : "white"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Upcoming Lease Renewals</h3>
              <Button variant="secondary" onClick={handleViewLeaseRenewals}>
                View All
              </Button>
            </div>
            {upcomingRenewals.length ? (
              upcomingRenewals.map((lease, idx) => (
                <div key={idx} className="flex justify-between py-2 border-b">
                  <div>{lease.property || "Unknown Property"}</div>
                  <div>{lease.daysRemaining} days</div>
                  <div>
                    {currency} {convertCurrency(lease.rent || 0)}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No upcoming lease renewals.</p>
            )}
          </div>

          {/* Transactions */}
          <div
            className={`p-4 rounded-lg shadow bg-${
              darkMode ? "gray-800" : "white"
            }`}
          >
            <h3 className="text-lg font-bold mb-4">Recent Transactions</h3>
            {transactions.length ? (
              transactions.map((tx, idx) => (
                <div key={idx} className="flex justify-between py-2 border-b">
                  <div className="flex items-center">
                    <FaCreditCard className="text-blue-400 mr-2" />
                    <span>
                      {tx.type} - {tx.tenant || tx.property}
                    </span>
                  </div>
                  <div>
                    {currency} {convertCurrency(tx.amount || 0)}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No recent transactions.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render child routes
  return (
    <div
      className={`flex h-screen ${
        darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-black"
      }`}
    >
      <LandlordSidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        user={formattedUser}
        isLoading={false}
        menuItems={menuItems}
        managementItems={managementItems}
      />
      <div className="flex-1 p-6 overflow-auto space-y-6">
        <Outlet
          context={{
            user: formattedUser,
            properties,
            isLoading: isPropertiesLoading,
            invalidateProperties: invalidateQueries,
            refetchProperties,
            dashboardData,
            refetchDashboardData,
          }}
        />
      </div>
    </div>
  );
};

// Inline CSS to hide scrollbar for Webkit browsers
const styles = `
  .scrollbar-hidden::-webkit-scrollbar {
    display: none;
  }
`;

// Inject styles into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default LandlordDashboard;
