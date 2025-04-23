import PropTypes from "prop-types";
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ChatBubbleLeftIcon,
  CreditCardIcon,
  UserIcon,
  CogIcon,
  Bars3Icon,
  XMarkIcon,
  WrenchScrewdriverIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import GlobalSkeleton from "../../../components/skeletons/GlobalSkeleton";
import { DEFAULT_PROFILE_PIC, DASHBOARD_BASE_URL } from "../../../config";
import { useDarkMode } from "../../../context/DarkModeContext";


const TenantSidebar = ({ isOpen, setIsOpen, user, isLoading }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();

  useEffect(() => {
    const savedState = localStorage.getItem("sidebarOpen");
    try {
      if (savedState !== null) {
        setIsOpen(JSON.parse(savedState));
      }
    } catch {
      setIsOpen(false);
    }
  }, [setIsOpen]);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(isOpen));
  }, [isOpen]);

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
      path: `${DASHBOARD_BASE_URL}/dashboard/tenant`,
      icon: HomeIcon,
    },
    {
      name: "Search",
      path: `${DASHBOARD_BASE_URL}/tenant/search`,
      icon: MagnifyingGlassIcon,
    },
    {
      name: "Applications",
      path: `${DASHBOARD_BASE_URL}/tenant/applications`,
      icon: DocumentTextIcon,
    },
    {
      name: "Messages",
      path: `${DASHBOARD_BASE_URL}/tenant/messages`,
      icon: ChatBubbleLeftIcon,
    },
    {
      name: "Payments",
      path: `${DASHBOARD_BASE_URL}/tenant/payments`,
      icon: CreditCardIcon,
    },
    {
      name: "Maintenance",
      path: `${DASHBOARD_BASE_URL}/tenant/maintenance`,
      icon: WrenchScrewdriverIcon,
    },
    {
      name: "Profile",
      path: `${DASHBOARD_BASE_URL}/tenant/profile`,
      icon: UserIcon,
    },
    {
      name: "Settings",
      path: `${DASHBOARD_BASE_URL}/tenant/settings`, // Ensure this matches router
      icon: CogIcon,
    },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/tenantlogin");
  };

  const handleNavigation = (path, name) => {
    console.log(`Navigating to: ${path} (${name})`); // Debug navigation
    navigate(path);
  };

  return (
    <div
      className={`h-auto shadow-md flex flex-col transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      } ${darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-700"}`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`focus:ring-2 focus:ring-blue-500 rounded ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-2 flex-1 overflow-y-auto">
        <ul>
          {menuItems.map(({ name, path, icon: Icon }) => (
            <li
              key={name}
              className={`mx-1 p-6 rounded-lg transition-colors duration-200 relative group ${
                location.pathname === path
                  ? darkMode
                    ? "bg-gray-700"
                    : "bg-gray-200"
                  : darkMode
                  ? "hover:bg-gray-800"
                  : "hover:bg-gray-100"
              }`}
            >
              <Link
                to={path}
                onClick={() => handleNavigation(path, name)} // Debug navigation
                className="flex items-center space-x-5"
              >
                <Icon className="w-6 h-6" />
                {isOpen && <span className="text-sm sm:text-base">{name}</span>}
              </Link>
              {!isOpen && (
                <span
                  className={`absolute left-16 text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity z-50 ${
                    darkMode
                      ? "bg-gray-700 text-gray-200"
                      : "bg-black text-white"
                  }`}
                >
                  {name}
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile Section */}
      <div
        className={`relative mx-2 p-3 rounded-lg transition-colors duration-200 group ${
          location.pathname === `${DASHBOARD_BASE_URL}/tenant/profile`
            ? darkMode
              ? "bg-gray-700"
              : "bg-gray-200"
            : darkMode
            ? "hover:bg-gray-800"
            : "hover:bg-gray-100"
        }`}
      >
        {isLoading ? (
          <GlobalSkeleton
            type="tenant-sidebar-profile"
            bgColor={darkMode ? "bg-gray-700" : "bg-gray-300"}
            animationSpeed="1.2s"
          />
        ) : (
          <Link
            to={`${DASHBOARD_BASE_URL}/tenant/profile`}
            className="flex items-center space-x-5"
          >
            <img
              src={user?.profilePic || DEFAULT_PROFILE_PIC}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            {isOpen && (
              <div>
                <p className="text-sm sm:text-base font-semibold">
                  {user?.username || user?.name || "User"} {/* Use username */}
                </p>
                <p
                  className={`text-xs sm:text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {user?.accountType || "Tenant"}
                </p>
              </div>
            )}
          </Link>
        )}
      </div>

      {/* Logout Button */}
      {isOpen && (
        <button
          onClick={handleLogout}
          className={`mt-2 mx-2 p-2 rounded-lg flex items-center justify-center ${
            darkMode
              ? "bg-gray-800 text-red-400 hover:bg-gray-700"
              : "bg-black text-red-500 hover:bg-gray-900"
          }`}
          title="Logout"
        >
          <ArrowLeftOnRectangleIcon className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

TenantSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  user: PropTypes.shape({
    profilePic: PropTypes.string,
    name: PropTypes.string,
    username: PropTypes.string, // Added username to PropTypes
    accountType: PropTypes.string,
  }),
  isLoading: PropTypes.bool,
};

export default TenantSidebar;
