import { Link, useLocation } from "react-router-dom";
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
} from "@heroicons/react/24/outline";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/tenant-dashboard/dashboard", icon: HomeIcon },
    {
      name: "Search",
      path: "/tenant-dashboard/search",
      icon: MagnifyingGlassIcon,
    },
    {
      name: "Applications",
      path: "/tenant-dashboard/applications",
      icon: DocumentTextIcon,
    },
    {
      name: "Messages",
      path: "/tenant-dashboard/messages",
      icon: ChatBubbleLeftIcon,
    },
    {
      name: "Payments",
      path: "/tenant-dashboard/payments",
      icon: CreditCardIcon,
    },
  ];

  const accountItems = [
    { name: "Profile", path: "/tenant-dashboard/profile", icon: UserIcon },
    { name: "Settings", path: "/tenant-dashboard/settings", icon: CogIcon },
  ];

  const user = {
    name: "Kiky Kendrick",
    accountType: "Tenant",
    profilePic: "https://via.placeholder.com/40",
  };

  return (
    <div
      className={`bg-white h-screen shadow-md flex flex-col justify-between transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Sidebar Header with Toggle Button */}
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
          {accountItems.map(({ name, path, icon: Icon }) => (
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
