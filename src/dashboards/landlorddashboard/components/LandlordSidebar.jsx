import PropTypes from "prop-types";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
  Bars3Icon,
  XMarkIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import GlobalSkeleton from "../../../components/GlobalSkeleton";
import { DASHBOARD_BASE_URL } from "../../../config";
import { useDarkMode } from "../../../context/DarkModeContext";
import Button from "../../../components/Button";

const LandlordSidebar = ({ isOpen, setIsOpen, user, isLoading }) => {
  const { darkMode } = useDarkMode();
  const location = useLocation();

  // Persist sidebar state in localStorage
  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(isOpen));
  }, [isOpen]);

  // Toggle sidebar with keyboard shortcut (Ctrl + B)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "b") {
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setIsOpen]);

  const menuItems = [
    {
      name: "Dashboard",
      path: `${DASHBOARD_BASE_URL}/landlord`,
      icon: HomeIcon,
    },
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
      hasNotification: true,
    },
    {
      name: "Messages",
      path: "/dashboard/landlord/messages",
      icon: EnvelopeIcon,
      hasNotification: true,
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
    {
      name: "Settings",
      path: "/dashboard/landlord/settings",
      icon: CogIcon,
      hasNotification: true,
    },
  ];

  // Function to generate initials from user name
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/landlordlogin";
  };

  return (
    <div
      className={`h-screen shadow-md flex flex-col transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      } ${darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-700"}`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4">
        <Button
          variant="icon"
          onClick={() => setIsOpen(!isOpen)}
          className={darkMode ? "text-gray-300" : "text-gray-500"}
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="mt-2 flex-1 overflow-y-auto">
        <ul>
          {menuItems.map(({ name, path, icon: Icon }) => (
            <li
              key={name}
              className={`mx-2 p-3 rounded-lg transition-colors duration-200 relative group ${
                location.pathname === path
                  ? darkMode
                    ? "bg-gray-700"
                    : "bg-gray-200"
                  : darkMode
                  ? "hover:bg-gray-600"
                  : "hover:bg-gray-100"
              }`}
            >
              <Link to={path} className="flex items-center space-x-3 relative">
                <Icon className="w-6 h-6" />
                {isOpen && <span className="text-sm">{name}</span>}
              </Link>
              {!isOpen && (
                <span
                  className={`absolute left-16 ${
                    darkMode
                      ? "bg-gray-600 text-gray-200"
                      : "bg-gray-800 text-white"
                  } text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity z-10`}
                >
                  {name}
                </span>
              )}
            </li>
          ))}
        </ul>

        {/* Divider */}
        <hr
          className={`my-2 ${darkMode ? "border-gray-600" : "border-gray-300"}`}
        />

        {/* Management Links */}
        <ul>
          {managementItems.map(
            ({ name, path, icon: Icon, hasNotification }) => (
              <li
                key={name}
                className={`mx-2 p-3 rounded-lg transition-colors duration-200 relative group ${
                  location.pathname === path
                    ? darkMode
                      ? "bg-gray-700"
                      : "bg-gray-200"
                    : darkMode
                    ? "hover:bg-gray-600"
                    : "hover:bg-gray-100"
                }`}
              >
                <Link
                  to={path}
                  className="flex items-center space-x-3 relative"
                >
                  <div className="relative">
                    <Icon className="w-6 h-6" />
                    {hasNotification && (
                      <span
                        className={`absolute -top-1 -right-1 w-3 h-3 ${
                          darkMode ? "bg-red-400" : "bg-red-500"
                        } rounded-full border-2 ${
                          darkMode ? "border-gray-800" : "border-white"
                        }`}
                      />
                    )}
                  </div>
                  {isOpen && <span className="text-sm">{name}</span>}
                </Link>
                {!isOpen && (
                  <span
                    className={`absolute left-16 ${
                      darkMode
                        ? "bg-gray-600 text-gray-200"
                        : "bg-gray-800 text-white"
                    } text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity z-10`}
                  >
                    {name}
                  </span>
                )}
              </li>
            )
          )}
        </ul>
      </nav>

      {/* User Info & Logout */}
      {isLoading ? (
        <div
          className={`p-4 border-t ${
            darkMode ? "border-gray-600" : "border-gray-300"
          }`}
        >
          <GlobalSkeleton
            type="sidebar-profile"
            bgColor={darkMode ? "bg-gray-700" : "bg-gray-300"}
            animationSpeed="1.2s"
          />
        </div>
      ) : (
        user && (
          <div
            className={`mx-2 p-4 flex items-center gap-2 border-t ${
              darkMode ? "border-gray-600" : "border-gray-300"
            }`}
          >
            <Link
              to="/dashboard/landlord/profile"
              className="flex items-center gap-3 flex-1 group focus:outline-none"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-lg ${
                  darkMode ? "bg-gray-600" : "bg-blue-500"
                }`}
              >
                {getInitials(user.name)}
              </div>
              {isOpen && (
                <div className="flex flex-col">
                  <p className="text-sm font-semibold truncate">
                    {user.name || "User"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {user.accountType || "Landlord"}
                  </p>
                </div>
              )}
            </Link>

            {/* Logout button */}
            {isOpen ? (
              <Button
                variant="danger"
                onClick={handleLogout}
                className="p-2 rounded-lg flex items-center justify-center"
                title="Logout"
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5" />
              </Button>
            ) : (
              <Button
                variant="icon"
                onClick={handleLogout}
                className="p-2 rounded-full"
                title="Logout"
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5" />
              </Button>
            )}
          </div>
        )
      )}
    </div>
  );
};

LandlordSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
    accountType: PropTypes.string,
  }),
  isLoading: PropTypes.bool,
};

export default LandlordSidebar;
