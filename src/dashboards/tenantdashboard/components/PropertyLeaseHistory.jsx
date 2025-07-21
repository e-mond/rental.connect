import PropTypes from "prop-types";
import { FaUser, FaCalendarAlt, FaCheckCircle } from "react-icons/fa";

const PropertyLeaseHistory = ({ leasedProperties, propertyId, darkMode }) => {
  const currentPropertyLeases = leasedProperties.filter(
    (lease) => lease.propertyId === propertyId
  );

  return (
    <div
      className={`w-full rounded-xl border p-5 transition-all duration-200 ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } mb-6 lg:mb-8`}
    >
      <h2
        className={`text-lg font-semibold mb-4 lg:text-xl ${
          darkMode ? "text-gray-100" : "text-gray-800"
        }`}
      >
        📄 Lease History
      </h2>

      {currentPropertyLeases.length > 0 ? (
        <ul className="space-y-4">
          {currentPropertyLeases.map((lease, index) => (
            <li
              key={index}
              className={`p-4 rounded-lg border ${
                darkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-blue-50 border-gray-200"
              }`}
            >
              <p
                className={`flex items-center gap-2 mb-1 text-sm lg:text-base ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <FaUser className="text-blue-400" />
                <span className="font-medium">Tenant:</span>{" "}
                {lease.tenantName || "N/A"}
              </p>
              <p
                className={`flex items-center gap-2 mb-1 text-sm lg:text-base ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <FaCalendarAlt className="text-blue-400" />
                <span className="font-medium">Lease Start:</span>{" "}
                {lease.startDate || "N/A"}
              </p>
              <p
                className={`flex items-center gap-2 mb-1 text-sm lg:text-base ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <FaCalendarAlt className="text-blue-400" />
                <span className="font-medium">Lease End:</span>{" "}
                {lease.endDate || "N/A"}
              </p>
              <p
                className={`flex items-center gap-2 text-sm lg:text-base ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <FaCheckCircle className="text-blue-400" />
                <span className="font-medium">Status:</span>{" "}
                {lease.status || "N/A"}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p
          className={`${
            darkMode ? "text-gray-400" : "text-gray-600"
          } text-sm lg:text-base`}
        >
          No lease history available for this property.
        </p>
      )}
    </div>
  );
};

PropertyLeaseHistory.propTypes = {
  leasedProperties: PropTypes.arrayOf(
    PropTypes.shape({
      propertyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      tenantName: PropTypes.string,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
      status: PropTypes.string,
    })
  ).isRequired,
  propertyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  darkMode: PropTypes.bool.isRequired,
};

export default PropertyLeaseHistory;
