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
import { DEFAULT_PROFILE_PIC, DASHBOARD_BASE_URL } from "../../../config";
import { useDarkMode } from "../../../context/DarkModeContext"; // Import useDarkMode
import Button from "../../../components/Button"; // Import Button component

const LandlordSidebar = ({ isOpen, setIsOpen, user, isLoading }) => {
  const { darkMode } = useDarkMode(); // Access dark mode state
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

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Also clear user data
    window.location.href = "/landlordlogin";
  };

  return (
    <div
      className={`h-screen shadow-md flex flex-col transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      } ${darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-700"}`}
    >
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

      <nav className="mt-2 flex-1">
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
                <div className="relative">
                  <Icon className="w-6 h-6" />
                </div>
                {isOpen && <span className="text-sm sm:text-base">{name}</span>}
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
                        className={`absolute -top-1 -right-1 w-4 h-4 ${
                          darkMode ? "bg-red-400" : "bg-red-500"
                        } rounded-full border-2 ${
                          darkMode ? "border-gray-800" : "border-white"
                        }`}
                      />
                    )}
                  </div>
                  {isOpen && (
                    <span className="text-sm sm:text-base">{name}</span>
                  )}
                  {isOpen && hasNotification && (
                    <span
                      className={`ml-2 w-3 h-3 ${
                        darkMode ? "bg-red-400" : "bg-red-500"
                      } rounded-full`}
                    />
                  )}
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
                    {hasNotification && (
                      <span
                        className={`ml-1 w-3 h-3 ${
                          darkMode ? "bg-red-400" : "bg-red-500"
                        } rounded-full inline-block`}
                      />
                    )}
                  </span>
                )}
              </li>
            )
          )}
        </ul>
      </nav>

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
            className={`mx-2 p-4 flex items-center justify-between border-t ${
              darkMode ? "border-gray-600" : "border-gray-300"
            } rounded-lg transition-colors duration-200 relative group ${
              location.pathname === "/dashboard/landlord/profile"
                ? darkMode
                  ? "bg-gray-700"
                  : "bg-gray-200"
                : darkMode
                ? "hover:bg-gray-600"
                : "hover:bg-gray-100"
            }`}
          >
            <Link
              to="/dashboard/landlord/profile"
              className="flex items-center space-x-3 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  window.location.href = "/dashboard/landlord/profile";
                }
              }}
              aria-label={`View profile of ${user.name || "User"}`}
            >
              <img
                src={user.profilePic || DEFAULT_PROFILE_PIC}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              {isOpen && (
                <div>
                  <p className="text-sm sm:text-base font-semibold">
                    {user.name || "User"}
                  </p>
                  <p
                    className={`text-xs sm:text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {user.accountType || "Landlord"}
                  </p>
                </div>
              )}
            </Link>

            {/* Logout Button */}
            {isOpen && (
              <Button
                variant="danger"
                onClick={handleLogout}
                className="mt-2 mx-2 p-2 rounded-lg flex items-center justify-center"
                title="Logout"
              >
                <ArrowLeftOnRectangleIcon className="w-6 h-6" />
              </Button>
            )}
            {!isOpen && (
              <span
                className={`absolute left-16 ${
                  darkMode
                    ? "bg-gray-600 text-gray-200"
                    : "bg-gray-800 text-white"
                } text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity z-10`}
              >
                {user.name || "User"}
              </span>
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
    profilePic: PropTypes.string,
    name: PropTypes.string,
    accountType: PropTypes.string,
  }),
  isLoading: PropTypes.bool,
};

export default LandlordSidebar;
