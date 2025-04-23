import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  CreditCard,
  User,
  Star,
  MessageSquare,
  Eye,
  FileText,
} from "lucide-react";
import PropTypes from "prop-types";
import GlobalSkeleton from "../../../../components/GlobalSkeleton";
import ErrorDisplay from "../../../../components/ErrorDisplay";
import landlordApi from "../../../../api/landlord";
import { useDarkMode } from "../../../../context/DarkModeContext";
import Button from "../../../../components/Button";

/**
 * Tenants Component
 *
 * Displays a list of tenants for the landlord, with details and actions such as viewing lease terms,
 * payment status, and contact information. Fetches tenant data using react-query and provides a responsive,
 * accessible interface. Includes a skeleton loader with a minimum 2-second display to match the
 * LandlordDashboardHome component. Shows an error message or "No tenants found" if applicable.
 * Features:
 * - Dark mode support for consistent UI theming.
 * - Uses the Button component for consistent button styling.
 * - Verifies BASE_URL usage in API calls via landlordApi.
 *
 * @param {Object} props - Component props
 * @param {Object} props.userData - User data containing the landlord's information
 */
const Tenants = ({ userData }) => {
  const { darkMode } = useDarkMode();
  const [search, setSearch] = useState("");
  const [activeTenant, setActiveTenant] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [loading, setLoading] = useState(true);

  const {
    data: tenantsData = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["tenants", userData?.id],
    queryFn: () => landlordApi.fetchTenants(localStorage.getItem("token")),
    enabled: !!userData,
    onSuccess: (data) => {
      if (data.length > 0 && !activeTenant) setActiveTenant(data[0]);
    },
  });

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const filteredTenants = tenantsData.filter((tenant) =>
    tenant.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-screen">
        <div
          className={`p-4 sm:p-6 ${
            darkMode ? "bg-gray-800" : "bg-gray-50"
          } flex-1 overflow-y-auto`}
        >
          <GlobalSkeleton
            type="tenants"
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
          className={`p-4 sm:p-6 ${
            darkMode ? "bg-gray-800" : "bg-gray-50"
          } flex-1 overflow-y-auto`}
        >
          <ErrorDisplay
            error={error}
            className={darkMode ? "text-red-400" : "text-red-500"}
          />
        </div>
      </div>
    );
  }

  if (filteredTenants.length === 0) {
    return (
      <div className="flex h-screen">
        <div
          className={`p-4 sm:p-6 ${
            darkMode ? "bg-gray-800" : "bg-gray-50"
          } flex-1 overflow-y-auto flex items-center justify-center h-screen`}
        >
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            No tenants found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div
        className={`p-4 sm:p-6 ${
          darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-50 text-gray-800"
        } flex-1 overflow-y-auto`}
      >
        {/* Header Section: Title */}
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Tenants</h2>

        {/* Search Input Section */}
        <div className="mb-4">
          <label htmlFor="tenant-search" className="sr-only">
            Search Tenant
          </label>
          <input
            id="tenant-search"
            type="text"
            placeholder="Search Tenant..."
            className={`border px-4 py-2 rounded w-full text-sm sm:text-base focus:ring-2 focus:ring-blue-500 ${
              darkMode
                ? "border-gray-600 bg-gray-800 text-gray-200"
                : "border-gray-300 bg-white text-gray-800"
            }`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search for a tenant by name"
          />
        </div>

        {/* Tenant List Section - Stack on mobile, grid on larger screens */}
        <section aria-labelledby="tenants-list-heading">
          <h3 id="tenants-list-heading" className="sr-only">
            Tenant List
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
            {filteredTenants.map((tenant) => (
              <div
                key={tenant.id}
                role="button"
                tabIndex={0}
                onClick={() => setActiveTenant(tenant)}
                onKeyDown={(e) => e.key === "Enter" && setActiveTenant(tenant)}
                className={`p-4 sm:p-6 rounded-lg shadow flex flex-col items-start cursor-pointer transition ${
                  activeTenant?.id === tenant.id
                    ? darkMode
                      ? "bg-gray-900 border-2 border-teal-500"
                      : "bg-white border-2 border-blue-600"
                    : darkMode
                    ? "bg-gray-900 hover:bg-gray-800"
                    : "bg-white hover:bg-gray-50"
                }`}
                aria-label={`Select tenant ${tenant.name}`}
              >
                <User
                  className={`h-8 sm:h-10 w-8 sm:w-10 mb-2 ${
                    darkMode ? "text-teal-500" : "text-blue-600"
                  }`}
                />
                <h3 className="font-semibold text-base sm:text-lg">
                  {tenant.name}
                </h3>
                <p
                  className={`text-sm sm:text-base ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {tenant.status}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Tenant Details Section */}
        <section aria-labelledby="tenant-details-heading">
          <h3 id="tenant-details-heading" className="sr-only">
            Tenant Details
          </h3>
          {/* Tabs */}
          <div
            role="tablist"
            className={`flex space-x-4 sm:space-x-6 border-b pb-2 mb-4 text-sm sm:text-base font-medium ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            {["Overview", "Payments", "Documents", "History"].map((tab) => (
              <span
                key={tab}
                role="tab"
                tabIndex={0}
                onClick={() => setActiveTab(tab)}
                onKeyDown={(e) => e.key === "Enter" && setActiveTab(tab)}
                className={`cursor-pointer transition ${
                  activeTab === tab
                    ? darkMode
                      ? "text-teal-500 border-b-2 border-teal-500"
                      : "text-blue-600 border-b-2 border-blue-600"
                    : darkMode
                    ? "text-gray-400 hover:text-teal-400"
                    : "text-gray-600 hover:text-blue-500"
                }`}
                aria-selected={activeTab === tab}
                aria-controls={`tabpanel-${tab.toLowerCase()}`}
              >
                {tab}
              </span>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "Overview" && activeTenant && (
            <div
              id="tabpanel-overview"
              role="tabpanel"
              className={`p-4 sm:p-6 rounded-lg shadow ${
                darkMode
                  ? "bg-gray-900 shadow-gray-700"
                  : "bg-white shadow-gray-200"
              }`}
            >
              <div className="flex items-center space-x-4 mb-4">
                <Calendar
                  className={`h-5 sm:h-6 w-5 sm:w-6 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                />
                <div>
                  <h4 className="font-semibold text-sm sm:text-base">
                    Lease Term
                  </h4>
                  <p
                    className={`text-xs sm:text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {activeTenant.lease.term}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <CreditCard
                  className={`h-5 sm:h-6 w-5 sm:w-6 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                />
                <div>
                  <h4 className="font-semibold text-sm sm:text-base">
                    Payment Status
                  </h4>
                  <p
                    className={`text-xs sm:text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Last payment of {activeTenant.lease.amountPaid} received on{" "}
                    {activeTenant.lease.lastPayment}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <User
                  className={`h-5 sm:h-6 w-5 sm:w-6 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                />
                <div>
                  <h4 className="font-semibold text-sm sm:text-base">
                    Contact Information
                  </h4>
                  <p
                    className={`text-xs sm:text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {activeTenant.email} • {activeTenant.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <Star
                  className={`h-5 sm:h-6 w-5 sm:w-6 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                />
                <div>
                  <h4 className="font-semibold text-sm sm:text-base">
                    Emergency Contact
                  </h4>
                  <p
                    className={`text-xs sm:text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {activeTenant.emergencyContact.name} •{" "}
                    {activeTenant.emergencyContact.phone}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 sm:gap-4 mt-4">
                <Button
                  variant="primary"
                  className="flex items-center text-sm sm:text-base"
                  onClick={() => alert("Rate Tenant feature coming soon!")}
                >
                  <Star className="h-4 sm:h-5 w-4 sm:w-5 mr-2" /> Rate Tenant
                </Button>
                <Button
                  variant="primary"
                  className="flex items-center text-sm sm:text-base"
                  onClick={() => alert("Messaging feature coming soon!")}
                >
                  <MessageSquare className="h-4 sm:h-5 w-4 sm:w-5 mr-2" /> Send
                  Message
                </Button>
                <Button
                  variant="secondary"
                  className="flex items-center text-sm sm:text-base"
                  onClick={() => alert("View Property feature coming soon!")}
                >
                  <Eye className="h-4 sm:h-5 w-4 sm:w-5 mr-2" /> View Property
                </Button>
                <Button
                  variant="secondary"
                  className="flex items-center text-sm sm:text-base"
                  onClick={() => alert("Lease Details feature coming soon!")}
                >
                  <FileText className="h-4 sm:h-5 w-4 sm:w-5 mr-2" /> Lease
                  Details
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

// Define PropTypes for type safety and validation
Tenants.propTypes = {
  userData: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    accountType: PropTypes.string,
    profilePic: PropTypes.string,
  }),
};

export default Tenants;
