import { useState } from "react";
import { FaEdit, FaEllipsisV, FaSearch, FaPlus } from "react-icons/fa";


const properties = [
  {
    id: 1,
    image: "https://via.placeholder.com/50",
    name: "123 Main Street",
    details: "3 bed • 2 bath • GH₵2,000/mo",
    status: "Active",
  },
  {
    id: 2,
    image: "https://via.placeholder.com/50",
    name: "456 Oak Avenue",
    details: "2 bed • 1 bath • GH₵1,800/mo",
    status: "Vacant",
  },
  {
    id: 3,
    image: "https://via.placeholder.com/50",
    name: "789 Pine Road",
    details: "4 bed • 3 bath • GH₵2,800/mo",
    status: "Active",
  },
  {
    id: 4,
    image: "https://via.placeholder.com/50",
    name: "321 Elm Street",
    details: "1 bed • 1 bath • GH₵1,200/mo",
    status: "Under Maintenance",
  },
];

const Properties = () => {
  const [filter, setFilter] = useState("All Properties");

  const filteredProperties =
    filter === "All Properties"
      ? properties
      : properties.filter((property) => {
          if (filter === "Active Rentals") return property.status === "Active";
          if (filter === "Vacant") return property.status === "Vacant";
          if (filter === "Under Maintenance")
            return property.status === "Under Maintenance";
          return false;
        });

  return (
    <div className="flex flex-col md:flex-row">
 
      <div className="p-4 w-full">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold">Properties</h2>
          <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
            <FaPlus className="mr-2" /> Add Property
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center border p-2 rounded-lg bg-white shadow-sm mb-4">
          <FaSearch className="text-gray-400 ml-2" />
          <input
            type="text"
            placeholder="Search properties..."
            className="ml-2 w-full outline-none"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex overflow-x-auto space-x-4 text-gray-600 text-sm border-b pb-2 mb-4">
          {[
            "All Properties",
            "Active Rentals",
            "Vacant",
            "Under Maintenance",
          ].map((status) => (
            <span
              key={status}
              onClick={() => setFilter(status)}
              className={`cursor-pointer pb-1 ${
                filter === status
                  ? "font-semibold border-b-2 border-black"
                  : "hover:text-gray-800"
              }`}
            >
              {status}
            </span>
          ))}
        </div>

        {/* Property List */}
        <div className="bg-white rounded-lg shadow">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <div
                key={property.id}
                className={`flex flex-col md:flex-row justify-between items-center p-3 border-b ${
                  property.status === "Active"
                    ? "bg-green-50"
                    : property.status === "Vacant"
                    ? "bg-yellow-50"
                    : property.status === "Under Maintenance"
                    ? "bg-red-50"
                    : ""
                }`}
              >
                <div className="flex items-center">
                  <img
                    src={property.image}
                    alt="property"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold">{property.name}</p>
                    <p className="text-gray-500 text-sm">{property.details}</p>
                  </div>
                </div>
                <div className="flex space-x-4 mt-2 md:mt-0">
                  <FaEdit className="text-gray-500 cursor-pointer hover:text-gray-700" />
                  <FaEllipsisV className="text-gray-500 cursor-pointer hover:text-gray-700" />
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-4 text-gray-500">
              No properties found under &quot;{filter}&quot;.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Properties;
