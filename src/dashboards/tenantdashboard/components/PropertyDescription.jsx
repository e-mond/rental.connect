import PropTypes from "prop-types";

const PropertyDescription = ({ description, darkMode }) => (
  <div
    className={`w-full rounded-xl border p-5 transition-all duration-200 ${
      darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
    } mb-6 lg:mb-8`}
  >
    <h2
      className={`text-lg font-semibold mb-3 lg:text-xl ${
        darkMode ? "text-gray-100" : "text-gray-800"
      }`}
    >
      📄 Description
    </h2>
    <p
      className={`leading-relaxed text-sm lg:text-base ${
        darkMode ? "text-gray-300" : "text-gray-700"
      }`}
    >
      {description?.trim() || "No description available."}
    </p>
  </div>
);

PropertyDescription.propTypes = {
  description: PropTypes.string,
  darkMode: PropTypes.bool.isRequired,
};

export default PropertyDescription;
