import {
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaDollarSign,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaRegImages,
  FaCalendarAlt,
  FaRulerCombined,
  FaHome,
} from "react-icons/fa";
import PropTypes from "prop-types";

const statusColor = (status, darkMode) => {
  const baseOpacity = darkMode ? "bg-opacity-20" : "bg-opacity-10";
  switch (status?.toLowerCase()) {
    case "active":
      return `border-green-400 ${baseOpacity} ${darkMode ? "bg-green-950" : "bg-green-100"}`;
    case "vacant":
      return `border-gray-300 ${baseOpacity} ${darkMode ? "bg-gray-900" : "bg-gray-100"}`;
    case "maintenance":
    case "under maintenance":
      return `border-yellow-400 ${baseOpacity} ${darkMode ? "bg-yellow-950" : "bg-yellow-100"}`;
    default:
      return `border-gray-400 ${baseOpacity} ${darkMode ? "bg-gray-800" : "bg-gray-200"}`;
  }
};

const PropertyCard = ({
  darkMode,
  property,
  normalizeImageUrl,
  handleEditProperty,
  handleDeleteProperty,
  deletePropertyMutation,
}) => {
  const isDark = darkMode;
  const textColor = isDark ? "text-gray-100" : "text-gray-800";
  const borderColor = statusColor(property.status, isDark);
  const imageCount =
    Array.isArray(property.imageUrls) && property.imageUrls.length > 0
      ? property.imageUrls.length
      : 0; // Fallback to 0 if no images

  return (
    <div
      className={`relative flex flex-col sm:flex-row gap-4 items-start p-4 rounded-2xl ${textColor} ${borderColor} border-l-4 shadow-md w-full max-w-5xl mx-auto transition-all`}
    >
      {/* Image Section */}
      <div className="relative w-full sm:w-48 h-40 sm:h-32 flex-shrink-0 overflow-hidden rounded-xl">
        <img
          src={
            normalizeImageUrl(property.primaryImageUrl) ||
            "https://via.placeholder.com/300"
          }
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <div className={`absolute bottom-2 left-2 ${isDark ? "bg-black bg-opacity-70" : "bg-gray-800 bg-opacity-50"} text-white text-xs px-2 py-0.5 rounded shadow`}>
          <FaRegImages className="inline mr-1" />
          {imageCount} photo{imageCount !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 w-full">
        <div className="flex justify-between items-start">
          <h3 className={`text-xl font-semibold truncate mb-1 ${textColor}`}>
            {property.title}
          </h3>
        </div>
        <p className={`text-sm mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          {property.description || "A modern property with premium features"}
        </p>

        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mb-3 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          <span className="flex items-center gap-2">
            <FaMapMarkerAlt className={isDark ? "text-blue-400" : "text-blue-600"} />
            {property.location}
          </span>
          <span className="flex items-center gap-2">
            <FaDollarSign className={isDark ? "text-green-400" : "text-green-600"} />
            {property.currency} {property.rent}
          </span>
          <span className="flex items-center gap-2">
            <FaBed className={isDark ? "text-purple-400" : "text-purple-600"} />
            {property.bedrooms} Bedrooms
          </span>
          <span className="flex items-center gap-2">
            <FaBath className={isDark ? "text-indigo-400" : "text-indigo-600"} />
            {property.bathrooms} Bathrooms
          </span>
          {property.squareFeet && (
            <span className="flex items-center gap-2">
              <FaRulerCombined className={isDark ? "text-gray-400" : "text-gray-600"} />
              {property.squareFeet} sq ft
            </span>
          )}
          {property.builtYear && (
            <span className="flex items-center gap-2">
              <FaCalendarAlt className={isDark ? "text-gray-400" : "text-gray-600"} />
              Built {property.builtYear}
            </span>
          )}
          {property.availableFrom && (
            <span className="flex items-center gap-2">
              <FaCalendarAlt className={isDark ? "text-gray-400" : "text-gray-600"} />
              Available from{" "}
              {new Date(property.availableFrom).toLocaleDateString()}
            </span>
          )}
          {property.propertyType && (
            <span className="flex items-center gap-2">
              <FaHome className={isDark ? "text-gray-400" : "text-gray-600"} />
              {property.propertyType}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {property.inUnitLaundry && (
            <span className={`${isDark ? "bg-teal-600 text-white" : "bg-teal-500 text-white"} px-3 py-1 rounded-full`}>
              In-unit Laundry
            </span>
          )}
          {property.centralAC && (
            <span className={`${isDark ? "bg-teal-600 text-white" : "bg-teal-500 text-white"} px-3 py-1 rounded-full`}>
              Central AC
            </span>
          )}
          {property.parkingIncluded && (
            <span className={`${isDark ? "bg-teal-600 text-white" : "bg-teal-500 text-white"} px-3 py-1 rounded-full`}>
              Parking Included
            </span>
          )}
          {property.amenities &&
            property.amenities.map((amenity, index) => (
              <span
                key={index}
                className={`${isDark ? "bg-teal-600 text-white" : "bg-teal-500 text-white"} px-3 py-1 rounded-full`}
              >
                {amenity}
              </span>
            ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex sm:flex-col gap-3 self-start sm:self-center ml-auto">
        <button
          onClick={() => handleEditProperty(property)}
          className={`p-2 rounded-full transition ${isDark ? "bg-blue-500 text-white" : "bg-blue-500 text-white"}`}
          aria-label={`Edit ${property.title}`}
        >
          <FaEdit className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleDeleteProperty(property.id)}
          disabled={deletePropertyMutation.isLoading}
          className={`p-2 rounded-full transition ${isDark ? "bg-red-500 text-white" : "bg-red-500 text-white"} disabled:opacity-50`}
          aria-label={`Delete ${property.title}`}
        >
          {deletePropertyMutation.isLoading ? (
            <FaSpinner className="animate-spin w-5 h-5" />
          ) : (
            <FaTrash className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

PropertyCard.propTypes = {
  darkMode: PropTypes.bool,
  property: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    location: PropTypes.string,
    bedrooms: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    bathrooms: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rent: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    currency: PropTypes.string,
    squareFeet: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    builtYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    availableFrom: PropTypes.string,
    propertyType: PropTypes.string,
    status: PropTypes.string,
    inUnitLaundry: PropTypes.bool,
    centralAC: PropTypes.bool,
    parkingIncluded: PropTypes.bool,
    photos: PropTypes.number,
    imageUrls: PropTypes.arrayOf(PropTypes.string),
    primaryImageUrl: PropTypes.string,
    amenities: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  normalizeImageUrl: PropTypes.func.isRequired,
  handleEditProperty: PropTypes.func.isRequired,
  handleDeleteProperty: PropTypes.func.isRequired,
  deletePropertyMutation: PropTypes.shape({
    isLoading: PropTypes.bool,
  }).isRequired,
};

export default PropertyCard;