import {
  FaHome,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaStar,
  FaListUl,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaCalendarAlt,
  FaDoorOpen,
  FaCar,
  FaSnowflake,
  FaTshirt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

// Reusable InfoCard component
const InfoCard = ({ icon: Icon, title, children, darkMode }) => (
  <motion.div
    whileHover={{
      boxShadow: darkMode
        ? "0 0 20px rgba(59, 130, 246, 0.4)"
        : "0 0 20px rgba(59, 130, 246, 0.3)",
    }}
    className={`flex flex-col items-start gap-5 rounded-xl border p-6 transition-all duration-300 w-full sm:w-[300px] ${
      darkMode
        ? "bg-gray-800 border-gray-600 hover:bg-gray-700"
        : "bg-white border-blue-200 hover:bg-gray-50"
    }`}
  >
    <motion.div
      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
      transition={{ duration: 0.6 }}
      className={`flex items-center justify-center w-14 h-14 rounded-xl ${
        darkMode
          ? "bg-gradient-to-br from-gray-700 to-gray-900 text-blue-400"
          : "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600"
      }`}
    >
      <Icon className="w-6 h-6" />
    </motion.div>

    <div className="flex-1">
      <h3
        className={`text-xl font-bold mb-3 ${
          darkMode ? "text-gray-100" : "text-gray-900"
        }`}
      >
        {title}
      </h3>
      <div
        className={`text-base leading-relaxed space-y-2 ${
          darkMode ? "text-gray-300" : "text-gray-700"
        }`}
      >
        {children}
      </div>
    </div>
  </motion.div>
);

// Main component
const PropertyDetailsCard = ({ property, darkMode }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5">
    <InfoCard icon={FaHome} title="Property Details" darkMode={darkMode}>
      <div className="flex items-center gap-2">
        <FaBed className="text-blue-400" /> {property.bedrooms}{" "}
        {property.isSharedBedrooms ? "Shared Bedrooms" : "Bedrooms"}
      </div>
      <div className="flex items-center gap-2">
        <FaBath className="text-blue-400" /> {property.bathrooms}{" "}
        {property.isSharedBathrooms ? "Shared Bathrooms" : "Bathrooms"}
      </div>
      <div className="flex items-center gap-2">
        <FaRulerCombined className="text-blue-400" />{" "}
        {property.squareFeet ? `${property.squareFeet} sq ft` : "Size N/A"}
      </div>
      <div className="flex items-center gap-2">
        <FaCalendarAlt className="text-blue-400" /> Built in{" "}
        {property.builtYear || "N/A"}
      </div>
      <div className="flex items-center gap-2">
        <FaDoorOpen className="text-blue-400" /> Available from{" "}
        {property.availableFrom || "N/A"}
      </div>
    </InfoCard>

    <InfoCard icon={FaMoneyBillWave} title="Monthly Rent" darkMode={darkMode}>
      <div className="text-lg font-medium">
        {property.currency || "$"}
        {property.rent?.toLocaleString() || "N/A"}/month
      </div>
      <div className="text-sm">
        {property.utilitiesIncluded
          ? "Utilities Included"
          : "Utilities not included"}
      </div>
    </InfoCard>

    <InfoCard icon={FaMapMarkerAlt} title="Location" darkMode={darkMode}>
      <div className="text-lg">
        {property.address || property.location || "Not specified"}
      </div>
    </InfoCard>

    <InfoCard icon={FaListUl} title="Amenities & Type" darkMode={darkMode}>
      <div className="text-lg">
        {property.amenities?.length > 0
          ? property.amenities.join(", ")
          : "No amenities listed"}
      </div>
      <div className="text-sm">Type: {property.propertyType || "N/A"}</div>
    </InfoCard>

    <InfoCard icon={FaHome} title="Additional Features" darkMode={darkMode}>
      <div className="flex items-center gap-2">
        <FaCar className="text-blue-400" /> Parking:{" "}
        {property.parkingIncluded ? "Yes" : "No"}
      </div>
      <div className="flex items-center gap-2">
        <FaSnowflake className="text-blue-400" /> AC:{" "}
        {property.centralAC ? "Yes" : "No"}
      </div>
      <div className="flex items-center gap-2">
        <FaTshirt className="text-blue-400" /> Laundry:{" "}
        {property.inUnitLaundry ? "Yes" : "No"}
      </div>
    </InfoCard>

    <InfoCard icon={FaStar} title="Rating" darkMode={darkMode}>
      <div className="text-lg font-medium">
        {property.rating ? `${property.rating.toFixed(1)} / 5.0` : "N/A / 5.0"}
      </div>
    </InfoCard>
  </div>
);

InfoCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  darkMode: PropTypes.bool.isRequired,
};

PropertyDetailsCard.propTypes = {
  property: PropTypes.shape({
    bedrooms: PropTypes.number,
    isSharedBedrooms: PropTypes.bool,
    bathrooms: PropTypes.number,
    isSharedBathrooms: PropTypes.bool,
    squareFeet: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    builtYear: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    availableFrom: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
    currency: PropTypes.string,
    rent: PropTypes.number,
    utilitiesIncluded: PropTypes.bool,
    address: PropTypes.string,
    location: PropTypes.string,
    amenities: PropTypes.arrayOf(PropTypes.string),
    propertyType: PropTypes.string,
    parkingIncluded: PropTypes.bool,
    centralAC: PropTypes.bool,
    inUnitLaundry: PropTypes.bool,
    rating: PropTypes.number,
  }).isRequired,
  darkMode: PropTypes.bool.isRequired,
};

export default PropertyDetailsCard;
