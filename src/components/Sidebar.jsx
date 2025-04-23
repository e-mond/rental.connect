import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Bars3Icon,
  XMarkIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { DEFAULT_PROFILE_PIC } from "../config";

const Sidebar = ({ menuItems, managementItems, user, isLoading }) => {
  const [isOpen, setIsOpen] = useState(
    JSON.parse(localStorage.getItem("sidebarOpen")) || true
  );
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(isOpen));
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "b") setIsOpen((prev) => !prev);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href =
      user.accountType === "landlord" ? "/landlordlogin" : "/tenantlogin";
  };

  return (
    <div
      className={`h-screen shadow-md flex flex-col transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      } bg-white text-gray-700`}
    >
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="focus:ring-2 focus:ring-blue-500 rounded text-gray-500"
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      </div>
      <nav className="mt-2 flex-1">
        <ul>
          {menuItems.map(({ name, path, icon: Icon }) => (
            <li
              key={name}
              className={`mx-2 p-3 rounded-lg transition-colors duration-200 relative group ${
                location.pathname === path ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
            >
              <Link to={path} className="flex items-center space-x-3 relative">
                <Icon className="w-6 h-6" />
                {isOpen && <span className="text-sm">{name}</span>}
              </Link>
              {!isOpen && (
                <span className="absolute left-16 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  {name}
                </span>
              )}
            </li>
          ))}
        </ul>
        <hr className="my-2 border-gray-300" />
        <ul>
          {managementItems.map(({ name, path, icon: Icon }) => (
            <li
              key={name}
              className={`mx-2 p-3 rounded-lg transition-colors duration-200 relative group ${
                location.pathname === path ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
            >
              <Link to={path} className="flex items-center space-x-3 relative">
                <Icon className="w-6 h-6" />
                {isOpen && <span className="text-sm">{name}</span>}
              </Link>
              {!isOpen && (
                <span className="absolute left-16 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  {name}
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>
      {isLoading ? (
        <div className="p-4 border-t border-gray-300">Loading...</div>
      ) : (
        user && (
          <div
            className={`mx-2 p-4 flex items-center justify-between border-t border-gray-300 rounded-lg transition-colors duration-200 relative group ${
              location.pathname.includes("profile")
                ? "bg-gray-200"
                : "hover:bg-gray-100"
            }`}
          >
            <Link
              to={`/${user.accountType}/profile`}
              className="flex items-center space-x-3 flex-1"
              aria-label={`View profile of ${user.name || "User"}`}
            >
              <img
                src={user.profilePic || DEFAULT_PROFILE_PIC}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              {isOpen && (
                <div>
                  <p className="text-sm font-semibold">{user.name || "User"}</p>
                  <p className="text-xs text-gray-500">{user.accountType}</p>
                </div>
              )}
            </Link>
            {isOpen && (
              <button
                onClick={handleLogout}
                className="p-2 text-red-500 hover:bg-gray-200 rounded-lg"
                aria-label="Logout"
              >
                <ArrowLeftOnRectangleIcon className="w-6 h-6" />
              </button>
            )}
          </div>
        )
      )}
    </div>
  );
};

Sidebar.propTypes = {
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      icon: PropTypes.elementType.isRequired,
    })
  ).isRequired,
  managementItems: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      icon: PropTypes.elementType.isRequired,
    })
  ).isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
    accountType: PropTypes.string,
    profilePic: PropTypes.string,
  }),
  isLoading: PropTypes.bool,
};

export default Sidebar;
