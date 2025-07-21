import { FaHome, FaFilter, FaSearch, FaPlus } from "react-icons/fa";
import Button from "../../../components/Button";
import PropTypes from "prop-types";

export const PropertyHeader = ({
  filter,
  setFilter,
  searchQuery,
  setSearchQuery,
  setIsAdding,
  resetForm,
  darkMode,
}) => (
  <div className={`px-6 py-8 ${darkMode ? "bg-slate-900 text-white" : "bg-slate-100 text-gray-800"} rounded-xl shadow-xl w-full my-4`}> 
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
      <div className="flex items-center gap-3">
        <FaHome className="text-teal-500 text-2xl" />
        <h2 className="text-2xl font-bold">Property Management</h2>
      </div>
      <Button
        onClick={() => {
          resetForm();
          setIsAdding(true);
        }}
        className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg"
        aria-label="Add new property"
      >
        <FaPlus /> Add New
      </Button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="relative">
        <FaSearch className="absolute top-3 left-3 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search properties..."
          className={`w-full pl-10 pr-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-teal-500 ${
            darkMode ? "bg-slate-800 text-white border-slate-700" : "bg-white border-gray-300"
          }`}
        />
      </div>

      <div className="relative">
        <FaFilter className="absolute top-3 left-3 text-gray-400" />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={`w-full pl-10 pr-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none ${
            darkMode ? "bg-slate-800 text-white border-slate-700" : "bg-white border-gray-300"
          }`}
        >
          <option value="All Properties">All Properties</option>
          <option value="Active Rentals">Active Rentals</option>
          <option value="Vacant">Vacant</option>
          <option value="Under Maintenance">Under Maintenance</option>
        </select>
      </div>
    </div>
  </div>
);

PropertyHeader.propTypes = {
  filter: PropTypes.string.isRequired,
  setFilter: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  setIsAdding: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
};
