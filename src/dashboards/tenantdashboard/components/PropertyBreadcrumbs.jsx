import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { FaChevronRight } from "react-icons/fa";

const PropertyBreadcrumbs = ({ darkMode, propertyTitle }) => (
  <nav
    className={`flex flex-wrap items-center gap-2 text-sm sm:text-base ${
      darkMode ? "text-gray-300" : "text-gray-700"
    } mb-6 lg:mb-10`}
    aria-label="Breadcrumb"
  >
    {/* Dashboard */}
    <Link
      to="/dashboard/tenant"
      className={`px-3 py-1 rounded-md transition-colors duration-150 ${
        darkMode
          ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
          : "bg-gray-100 hover:bg-gray-200 text-gray-800"
      }`}
    >
      Dashboard
    </Link>

    <FaChevronRight className="text-xs opacity-50" />

    {/* Property Search */}
    <Link
      to="/dashboard/tenant/search"
      className={`px-3 py-1 rounded-md transition-colors duration-150 ${
        darkMode
          ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
          : "bg-gray-100 hover:bg-gray-200 text-gray-800"
      }`}
    >
      Property Search
    </Link>

    <FaChevronRight className="text-xs opacity-50" />

    {/* Current Property Title */}
    <span
      className={`px-3 py-1 rounded-md font-semibold tracking-tight ${
        darkMode
          ? "bg-teal-500 text-white shadow-sm"
          : "bg-teal-100 text-teal-800"
      }`}
    >
      {propertyTitle}
    </span>
  </nav>
);

PropertyBreadcrumbs.propTypes = {
  darkMode: PropTypes.bool,
  propertyTitle: PropTypes.string.isRequired,
};

export default PropertyBreadcrumbs;
