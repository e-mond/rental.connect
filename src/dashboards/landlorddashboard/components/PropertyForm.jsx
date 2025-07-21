import {
  FaHome,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaDollarSign,
  FaMoneyBillWave,
  FaRulerCombined,
  FaCalendarAlt,
  FaCheckCircle,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";
import Button from "../../../components/Button";
import PropTypes from "prop-types";

const PropertyForm = ({
  darkMode,
  isEditing,
  newProperty,
  handleInputChange,
  handleAmenitiesChange,
  customAmenity,
  handleCustomAmenity,
  addCustomAmenity,
  handleImageChange,
  imagePreviews,
  removeImage,
  primaryImageIndex,
  handleSetPrimaryImage,
  handleAddProperty,
  handleUpdateProperty,
  addPropertyMutation,
  updatePropertyMutation,
  resetForm,
}) => (
  <div
    className={`p-4 sm:p-6 mb-6 rounded-lg shadow-lg ${
      darkMode ? "bg-gray-800" : "bg-white"
    }`}
  >
    <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
      <FaHome className="mr-2" />
      {isEditing ? "Edit Property" : "Add New Property"}
    </h3>
    <form
      onSubmit={isEditing ? handleUpdateProperty : handleAddProperty}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      <div className="relative">
        <label className="flex items-center text-sm font-medium mb-1">
          <FaHome className="mr-1 text-gray-500" />
          Title
        </label>
        <input
          type="text"
          name="title"
          value={newProperty.title || ""}
          onChange={handleInputChange}
          className={`w-full p-2 rounded-lg text-sm sm:text-base ${
            darkMode
              ? "bg-gray-700 text-gray-200 border-gray-600"
              : "bg-white text-gray-800 border-gray-300"
          } border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
          required
          aria-label="Property title"
        />
      </div>
      <div className="relative">
        <label className="flex items-center text-sm font-medium mb-1">
          <FaMapMarkerAlt className="mr-1 text-gray-500" />
          Location
        </label>
        <input
          type="text"
          name="location"
          value={newProperty.location || ""}
          onChange={handleInputChange}
          className={`w-full p-2 rounded-lg text-sm sm:text-base ${
            darkMode
              ? "bg-gray-700 text-gray-200 border-gray-600"
              : "bg-white text-gray-800 border-gray-300"
          } border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
          required
          aria-label="Property location"
        />
      </div>
      <div className="relative">
        <label className="flex items-center text-sm font-medium mb-1">
          <FaBed className="mr-1 text-gray-500" />
          Bedrooms
        </label>
        <input
          type="number"
          name="bedrooms"
          value={newProperty.bedrooms || ""}
          onChange={handleInputChange}
          className={`w-full p-2 rounded-lg text-sm sm:text-base ${
            darkMode
              ? "bg-gray-700 text-gray-200 border-gray-600"
              : "bg-white text-gray-800 border-gray-300"
          } border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
          min="0"
          required
          aria-label="Number of bedrooms"
        />
      </div>
      <div className="relative">
        <label className="flex items-center text-sm font-medium mb-1">
          <FaBath className="mr-1 text-gray-500" />
          Bathrooms
        </label>
        <input
          type="number"
          name="bathrooms"
          value={newProperty.bathrooms || ""}
          onChange={handleInputChange}
          className={`w-full p-2 rounded-lg text-sm sm:text-base ${
            darkMode
              ? "bg-gray-700 text-gray-200 border-gray-600"
              : "bg-white text-gray-800 border-gray-300"
          } border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
          min="0"
          required
          aria-label="Number of bathrooms"
        />
      </div>
      <div className="relative">
        <label className="flex items-center text-sm font-medium mb-1">
          <FaDollarSign className="mr-1 text-gray-500" />
          Price
        </label>
        <input
          type="number"
          name="price"
          value={newProperty.price || ""}
          onChange={handleInputChange}
          className={`w-full p-2 rounded-lg text-sm sm:text-base ${
            darkMode
              ? "bg-gray-700 text-gray-200 border-gray-600"
              : "bg-white text-gray-800 border-gray-300"
          } border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
          min="0"
          step="0.01"
          required
          aria-label="Property price"
        />
      </div>
      <div className="relative">
        <label className="flex items-center text-sm font-medium mb-1">
          <FaMoneyBillWave className="mr-1 text-gray-500" />
          Currency
        </label>
        <select
          name="currency"
          value={newProperty.currency || "GHS"}
          onChange={handleInputChange}
          className={`w-full p-2 rounded-lg text-sm sm:text-base ${
            darkMode
              ? "bg-gray-700 text-gray-200 border-gray-600"
              : "bg-white text-gray-800 border-gray-300"
          } border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
          required
          aria-label="Currency selection"
        >
          <option value="GHS">GHS</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
      </div>
      <div className="relative">
        <label className="flex items-center text-sm font-medium mb-1">
          <FaRulerCombined className="mr-1 text-gray-500" />
          Square Feet
        </label>
        <input
          type="number"
          name="squareFeet"
          value={newProperty.squareFeet || ""}
          onChange={handleInputChange}
          className={`w-full p-2 rounded-lg text-sm sm:text-base ${
            darkMode
              ? "bg-gray-700 text-gray-200 border-gray-600"
              : "bg-white text-gray-800 border-gray-300"
          } border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
          min="0"
          aria-label="Square footage"
        />
      </div>
      <div className="relative">
        <label className="flex items-center text-sm font-medium mb-1">
          <FaCalendarAlt className="mr-1 text-gray-500" />
          Built Year
        </label>
        <input
          type="number"
          name="builtYear"
          value={newProperty.builtYear || ""}
          onChange={handleInputChange}
          className={`w-full p-2 rounded-lg text-sm sm:text-base ${
            darkMode
              ? "bg-gray-700 text-gray-200 border-gray-600"
              : "bg-white text-gray-800 border-gray-300"
          } border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
          min="1900"
          max={new Date().getFullYear()}
          aria-label="Year built"
        />
      </div>
      <div className="relative">
        <label className="flex items-center text-sm font-medium mb-1">
          <FaCalendarAlt className="mr-1 text-gray-500" />
          Available From
        </label>
        <input
          type="date"
          name="availableFrom"
          value={newProperty.availableFrom || ""}
          onChange={handleInputChange}
          className={`w-full p-2 rounded-lg text-sm sm:text-base ${
            darkMode
              ? "bg-gray-700 text-gray-200 border-gray-600"
              : "bg-white text-gray-800 border-gray-300"
          } border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
          aria-label="Availability date"
        />
      </div>
      <div className="relative">
        <label className="flex items-center text-sm font-medium mb-1">
          <FaHome className="mr-1 text-gray-500" />
          Property Type
        </label>
        <select
          name="propertyType"
          value={newProperty.propertyType || "Apartment"}
          onChange={handleInputChange}
          className={`w-full p-2 rounded-lg text-sm sm:text-base ${
            darkMode
              ? "bg-gray-700 text-gray-200 border-gray-600"
              : "bg-white text-gray-800 border-gray-300"
          } border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
          required
          aria-label="Property type"
        >
          <option value="Apartment">Apartment</option>
          <option value="House">House</option>
          <option value="Condo">Condo</option>
          <option value="Townhouse">Townhouse</option>
        </select>
      </div>
      <div className="relative">
        <label className="flex items-center text-sm font-medium mb-1">
          <FaCheckCircle className="mr-1 text-gray-500" />
          Status
        </label>
        <select
          name="status"
          value={newProperty.status || "Active"}
          onChange={handleInputChange}
          className={`w-full p-2 rounded-md text-sm sm:text-base ${
            darkMode
              ? "bg-gray-700 text-gray-200 border-gray-600"
              : "bg-white text-gray-800 border-gray-300"
          } border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
          required
          aria-label="Property status"
        >
          <option value="Active">Active</option>
          <option value="Vacant">Vacant</option>
          <option value="Under Maintenance">Under Maintenance</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="flex items-center text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={newProperty.description || ""}
          onChange={handleInputChange}
          className={`w-full p-2 rounded-md text-sm sm:text-base ${
            darkMode
              ? "bg-gray-700 text-gray-200 border-gray-600"
              : "bg-white text-gray-800 border-gray-300"
          } border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
          rows="4"
          aria-label="Property description"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="flex items-center text-sm font-medium mb-1">
          Amenities
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4">
          {[
            "Wi-Fi",
            "Parking",
            "Air Conditioning",
            "Gym",
            "Pool",
            "Laundry",
          ].map((amenity) => (
            <label
              key={amenity}
              className="flex items-center text-sm sm:text-base"
            >
              <input
                type="checkbox"
                value={amenity}
                checked={newProperty.amenities.includes(amenity)}
                onChange={handleAmenitiesChange}
                className={`mr-2 h-4 w-4 sm:h-5 sm:w-5 ${
                  darkMode ? "text-blue-600" : "text-blue-500"
                } focus:ring-blue-500`}
                aria-label={`Select ${amenity}`}
              />
              {amenity}
            </label>
          ))}
        </div>
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2">
          <input
            type="text"
            value={customAmenity}
            onChange={handleCustomAmenity}
            placeholder="Add custom amenity"
            className={`flex-1 p-2 rounded-md text-sm sm:text-base ${
              darkMode
                ? "bg-gray-700 text-gray-200 border-gray-600"
                : "bg-white text-gray-800 border-gray-300"
            } border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
            aria-label="Custom amenity input"
          />
          <Button
            type="button"
            onClick={addCustomAmenity}
            className="px-4 py-2 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
            aria-label="Add custom amenity"
          >
            Add
          </Button>
        </div>
        {newProperty.amenities.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {newProperty.amenities.map((amenity) => (
              <span
                key={amenity}
                className={`px-2 py-1 rounded-full text-xs sm:text-sm ${
                  darkMode
                    ? "bg-blue-700 text-blue-200"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {amenity}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="sm:col-span-2">
        <label className="flex items-center text-sm sm:text-base">
          <input
            type="checkbox"
            name="inUnitLaundry"
            checked={newProperty.inUnitLaundry || false}
            onChange={handleInputChange}
            className={`mr-2 h-4 w-4 sm:h-5 sm:w-5 ${
              darkMode ? "text-blue-600" : "text-blue-500"
            } focus:ring-blue-500`}
            aria-label="In-unit laundry"
          />
          In-unit Laundry
        </label>
        <label className="flex items-center text-sm sm:text-base ml-4">
          <input
            type="checkbox"
            name="centralAC"
            checked={newProperty.centralAC || false}
            onChange={handleInputChange}
            className={`mr-2 h-4 w-4 sm:h-5 sm:w-5 ${
              darkMode ? "text-blue-600" : "text-blue-500"
            } focus:ring-blue-500`}
            aria-label="Central AC"
          />
          Central AC
        </label>
        <label className="flex items-center text-sm sm:text-base ml-4">
          <input
            type="checkbox"
            name="parkingIncluded"
            checked={newProperty.parkingIncluded || false}
            onChange={handleInputChange}
            className={`mr-2 h-4 w-4 sm:h-5 sm:w-5 ${
              darkMode ? "text-blue-600" : "text-blue-500"
            } focus:ring-blue-500`}
            aria-label="Parking included"
          />
          Parking Included
        </label>
      </div>
      <div className="sm:col-span-2">
        <label className="flex items-center text-sm font-medium mb-1">
          Images (Max 5)
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className={`w-full p-2 rounded-md text-sm sm:text-base ${
            darkMode
              ? "bg-gray-700 text-gray-200 border-gray-600"
              : "bg-white text-gray-800 border-gray-300"
          } border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
          aria-label="Upload property images"
        />
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 sm:h-40 object-cover rounded-md"
              />
              <Button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full text-xs"
                aria-label={`Remove image ${index + 1}`}
              >
                <FaTimes />
              </Button>
              <Button
                type="button"
                onClick={() => handleSetPrimaryImage(index)}
                className={`absolute bottom-1 right-1 px-2 py-1 text-xs rounded-md ${
                  primaryImageIndex === index
                    ? "bg-green-500 text-white"
                    : darkMode
                    ? "bg-gray-700 text-gray-200"
                    : "bg-gray-200 text-gray-800"
                }`}
                aria-label={
                  primaryImageIndex === index
                    ? "Primary image"
                    : `Set image ${index + 1} as primary`
                }
              >
                {primaryImageIndex === index ? "Primary" : "Set Primary"}
              </Button>
            </div>
          ))}
        </div>
      </div>
      <div className="sm:col-span-2 flex justify-end gap-4">
        <Button
          type="button"
          onClick={resetForm}
          className="px-4 py-2 text-sm sm:text-base bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all"
          aria-label="Cancel form"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={
            addPropertyMutation.isLoading || updatePropertyMutation.isLoading
          }
          className="px-4 py-2 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center transition-all"
          aria-label={isEditing ? "Update property" : "Add property"}
        >
          {(addPropertyMutation.isLoading ||
            updatePropertyMutation.isLoading) && (
            <FaSpinner className="animate-spin mr-2" />
          )}
          {isEditing ? "Update Property" : "Add Property"}
        </Button>
      </div>
    </form>
  </div>
);

PropertyForm.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool,
  newProperty: PropTypes.shape({
    title: PropTypes.string,
    location: PropTypes.string,
    bedrooms: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    bathrooms: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    currency: PropTypes.string,
    squareFeet: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    builtYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    availableFrom: PropTypes.string,
    propertyType: PropTypes.string,
    status: PropTypes.string,
    description: PropTypes.string,
    amenities: PropTypes.arrayOf(PropTypes.string),
    inUnitLaundry: PropTypes.bool,
    centralAC: PropTypes.bool,
    parkingIncluded: PropTypes.bool,
    images: PropTypes.array,
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleAmenitiesChange: PropTypes.func.isRequired,
  customAmenity: PropTypes.string.isRequired,
  handleCustomAmenity: PropTypes.func.isRequired,
  addCustomAmenity: PropTypes.func.isRequired,
  handleImageChange: PropTypes.func.isRequired,
  imagePreviews: PropTypes.arrayOf(PropTypes.string).isRequired,
  removeImage: PropTypes.func.isRequired,
  primaryImageIndex: PropTypes.number.isRequired,
  handleSetPrimaryImage: PropTypes.func.isRequired,
  handleAddProperty: PropTypes.func.isRequired,
  handleUpdateProperty: PropTypes.func.isRequired,
  addPropertyMutation: PropTypes.shape({
    isLoading: PropTypes.bool,
  }).isRequired,
  updatePropertyMutation: PropTypes.shape({
    isLoading: PropTypes.bool,
  }).isRequired,
  resetForm: PropTypes.func.isRequired,
};

export default PropertyForm;
