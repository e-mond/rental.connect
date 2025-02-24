import { useState } from "react";
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
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: HomeIcon,
    },
    {
      name: "Properties",
      path: "/dashboard/properties",
      icon: BuildingOfficeIcon,
    },
    { name: "Tenants", path: "/dashboard/tenants", icon: UsersIcon },
    { name: "Reviews", path: "/dashboard/reviews", icon: StarIcon },
    {
      name: "Maintenance",
      path: "/dashboard/maintenance",
      icon: WrenchIcon,
    },
    {
      name: "Messages",
      path: "/dashboard/messages",
      icon: EnvelopeIcon,
    },
  ];

  const managementItems = [
    {
      name: "Payments",
      path: "/dashboard/payments",
      icon: CreditCardIcon,
    },
    {
      name: "Documents",
      path: "/dashboard/documents",
      icon: DocumentTextIcon,
    },
    { name: "Settings", path: "/dashboard/settings", icon: CogIcon },
  ];

  const user = {
    name: "Johnny Quayson",
    accountType: "Landlord",
    profilePic: "https://via.placeholder.com/40",
  };

  return (
    <div
      className={`bg-white h-full shadow-md flex flex-col justify-between transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={toggleSidebar}
          className="text-gray-500 focus:outline-none"
        >
          {isOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <nav className="mt-5 flex-1">
        <ul>
          {menuItems.map(({ name, path, icon: Icon }) => (
            <li
              key={name}
              className={`p-3 rounded-lg ${
                location.pathname === path ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
            >
              <Link to={path} className="flex items-center space-x-3">
                <Icon className="w-6 h-6 text-gray-700" />
                {isOpen && <span>{name}</span>}
              </Link>
            </li>
          ))}
        </ul>

        <hr className="my-4 border-gray-300" />

        <ul>
          {managementItems.map(({ name, path, icon: Icon }) => (
            <li
              key={name}
              className={`p-3 rounded-lg ${
                location.pathname === path ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
            >
              <Link to={path} className="flex items-center space-x-3">
                <Icon className="w-6 h-6 text-gray-700" />
                {isOpen && <span>{name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 flex items-center space-x-3 border-t border-gray-300">
        <img
          src={user.profilePic}
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
        {isOpen && (
          <div>
            <p className="text-gray-800 font-semibold">{user.name}</p>
            <p className="text-gray-500 text-sm">{user.accountType}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
