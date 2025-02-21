import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="bg-gray-100 w-64 h-screen p-6 shadow-lg">
     

      {/* Navigation Links */}
      <nav>
        <ul className="space-y-4">
          <li>
            <Link
              to="/dashboard"
              className="flex items-center hover:text-blue-600"
            >
              <span className="material-icons-outlined mr-2"></span>
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/search"
              className="flex items-center hover:text-blue-600"
            >
              <span className="material-icons-outlined mr-2"></span>
              Search
            </Link>
          </li>
          <li>
            <Link
              to="/applications"
              className="flex items-center hover:text-blue-600"
            >
              <span className="material-icons-outlined mr-2"></span>
              Applications
            </Link>
          </li>
          <li>
            <Link
              to="/messages"
              className="flex items-center hover:text-blue-600"
            >
              <span className="material-icons-outlined mr-2"></span>
              Messages
            </Link>
          </li>
          <li>
            <Link
              to="/payments"
              className="flex items-center hover:text-blue-600"
            >
              <span className="material-icons-outlined mr-2"></span>
              Payments
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mt-10">
        <p className="font-semibold text-gray-600 mb-4"></p>
        <ul className="space-y-4">
          <li>
            <Link
              to="/profile"
              className="flex items-center hover:text-blue-600"
            >
              <span className="material-icons-outlined mr-2"></span>
              Profile
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className="flex items-center hover:text-blue-600"
            >
              <span className="material-icons-outlined mr-2"></span>
              Settings
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
