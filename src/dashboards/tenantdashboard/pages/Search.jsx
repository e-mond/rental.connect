import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPinIcon,
  BanknotesIcon,
  HomeIcon,
  HomeModernIcon,
} from "@heroicons/react/24/outline";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState({
    location: "",
    priceRange: "",
    propertyType: "",
    bedrooms: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery((prev) => ({ ...prev, [name]: value }));
  };

  const featuredProperties = [
    {
      id: 1,
      name: "Modern Downtown Apartment",
      price: "GH₵1,800/month",
      details: "2 bed, 2 bath",
      image: "https://source.unsplash.com/400x300/?apartment",
    },
    {
      id: 2,
      name: "Suburban Family Home",
      price: "GH₵2,200/month",
      details: "3 bed, 2.5 bath",
      image: "https://source.unsplash.com/400x300/?house",
    },
    {
      id: 3,
      name: "Studio Loft",
      price: "GH₵1,200/month",
      details: "1 bed, 1 bath",
      image: "https://source.unsplash.com/400x300/?loft",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Find Your Perfect Home</h1>

      {/* Search Inputs */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative flex items-center border p-3 rounded-lg">
          <MapPinIcon className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="text"
            name="location"
            placeholder="Enter city or zip code"
            className="w-full focus:outline-none"
            value={searchQuery.location}
            onChange={handleInputChange}
          />
        </div>

        <div className="relative flex items-center border p-3 rounded-lg">
          <BanknotesIcon className="w-5 h-5 text-gray-400 mr-2" />
          <select
            name="priceRange"
            className="w-full focus:outline-none bg-transparent"
            value={searchQuery.priceRange}
            onChange={handleInputChange}
          >
            <option value="">Select Price Range</option>
            <option value="0-1000">GH₵0 - GH₵1,000</option>
            <option value="1000-2000">GH₵1,000 - GH₵2,000</option>
            <option value="2000-3000">GH₵2,000 - GH₵3,000</option>
          </select>
        </div>

        <div className="relative flex items-center border p-3 rounded-lg">
          <HomeIcon className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="text"
            name="propertyType"
            placeholder="Property Type"
            className="w-full focus:outline-none"
            value={searchQuery.propertyType}
            onChange={handleInputChange}
            list="property-types"
          />
          <datalist id="property-types">
            <option value="Apartment" />
            <option value="House" />
            <option value="Studio" />
          </datalist>
        </div>

        <div className="relative flex items-center border p-3 rounded-lg">
          <HomeModernIcon className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="number"
            name="bedrooms"
            placeholder="Number of bedrooms"
            className="w-full focus:outline-none"
            value={searchQuery.bedrooms}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Search Button */}
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full md:w-auto hover:bg-blue-700 transition">
        Search Properties
      </button>

      {/* Featured Properties */}
      <div>
        <h2 className="text-xl font-semibold mt-6">Featured Properties</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {featuredProperties.map((property) => (
            <div
              key={property.id}
              className="border p-4 rounded-lg shadow-sm bg-gray-50"
            >
              <img
                src={property.image}
                alt={property.name}
                className="w-full h-40 object-cover rounded-lg"
              />
              <h3 className="font-bold mt-2">{property.name}</h3>
              <p className="text-gray-600">
                {property.price} - {property.details}
              </p>
              <Link
                to={`/tenant-dashboard/property/${property.id}`}
                className="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
