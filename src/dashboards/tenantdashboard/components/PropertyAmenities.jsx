import { GiWashingMachine } from "react-icons/gi";
import { FaParking, FaSnowflake } from "react-icons/fa";
import PropTypes from "prop-types";

const ICON_MAP = {
  "In-unit Laundry": GiWashingMachine,
  "Central AC": FaSnowflake,
  "Parking Included": FaParking,
};

const PropertyAmenities = ({ amenities, darkMode }) => (
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
      🛠️ Amenities
    </h2>

    {amenities && amenities.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5">
        {amenities.map((amenity, index) => {
          const Icon = ICON_MAP[amenity];

          return (
            <div
              key={index}
              className={`flex items-center rounded-lg border p-3 lg:p-4 transition ${
                darkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-blue-50 border-gray-200"
              }`}
            >
              {Icon && (
                <Icon
                  className={`w-6 h-6 mr-3 ${
                    darkMode ? "text-blue-400" : "text-blue-600"
                  }`}
                />
              )}
              <span
                className={`text-sm lg:text-base ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {amenity}
              </span>
            </div>
          );
        })}
      </div>
    ) : (
      <p
        className={`${
          darkMode ? "text-gray-400" : "text-gray-600"
        } text-sm lg:text-base`}
      >
        No amenities listed.
      </p>
    )}
  </div>
);

PropertyAmenities.propTypes = {
  amenities: PropTypes.arrayOf(PropTypes.string),
  darkMode: PropTypes.bool.isRequired,
};

export default PropertyAmenities;
