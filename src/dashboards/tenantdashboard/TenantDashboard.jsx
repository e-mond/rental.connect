import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useUser } from "../../context/useUser"; // Correct import for user context
import { useDarkMode } from "../../context/DarkModeContext"; // Updated import for consistency
import Sidebar from "./components/TenantSidebar";
import GlobalSkeleton from "../../components/GlobalSkeleton";
import Button from "../../components/Button";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const TenantDashboard = () => {
  const { user, loading: isLoading } = useUser();
  const { darkMode } = useDarkMode();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (isLoading) {
    return (
      <div className={`p-4 sm:p-6 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
        <GlobalSkeleton
          type="dashboard"
          bgColor={darkMode ? "bg-gray-700" : "bg-gray-300"}
          animationSpeed="1.2s"
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/tenantlogin" replace />;
  }

  // Role check: Ensure only users with role TENANT can access this dashboard
  if (user.role !== "TENANT") {
    return <Navigate to={user.role === "LANDLORD" ? "/dashboard/landlord" : "/"} replace />;
  }

  return (
    <div
      className={`flex min-h-screen ${
        darkMode ? "bg-gray-800" : "bg-gray-100"
      }`}
    >
      <Sidebar
        user={user}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        isLoading={isLoading}
      />
      <div className="flex-1 flex flex-col">
        <div className="p-4 sm:hidden">
          <Button
            variant="secondary"
            onClick={toggleSidebar}
            className="flex items-center space-x-2"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            aria-expanded={isSidebarOpen}
          >
            {isSidebarOpen ? (
              <XMarkIcon className="w-5 h-5" />
            ) : (
              <Bars3Icon className="w-5 h-5" />
            )}
            <span>{isSidebarOpen ? "Close" : "Menu"}</span>
          </Button>
        </div>
        <Outlet context={{ user, isLoading }} />
      </div>
    </div>
  );
};

export default TenantDashboard;