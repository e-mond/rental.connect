import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPinIcon,
  BanknotesIcon,
  HomeIcon,
  HomeModernIcon,
} from "@heroicons/react/24/outline";
import { BASE_URL, DASHBOARD_BASE_URL } from "../../../config";
import GlobalSkeleton from "../../../components/skeletons/TenantSkeleton";
import { useDarkMode } from "../../../context/DarkModeContext";
import Button from "../../../components/Button";

// Conversion rates (approximate as of April 2025)
const conversionRates = {
  "GH₵": 1, // Base currency
  USD: 0.064, // 1 GH₵ = 0.064 USD
  EUR: 0.058, // 1 GH₵ = 0.058 EUR
};

// Convert price from GH₵ to the selected currency (moved outside the component)
const convertPrice = (priceInCedis, targetCurrency) => {
  const price = parseFloat(priceInCedis);
  const convertedPrice = price * conversionRates[targetCurrency];
  return convertedPrice.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

/**
 * Search component for tenants to find properties based on filters.
 * Allows filtering by location, price range, property type, and bedrooms.
 */
const Search = () => {
  const [searchQuery, setSearchQuery] = useState({
    location: "",
    priceRange: "",
    propertyType: "",
    bedrooms: "",
  });
  const [currency, setCurrency] = useState("GH₵"); // Default currency is Cedis
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await fetch(`${BASE_URL}/api/properties`, { headers });
        if (!response.ok) throw new Error("Failed to fetch properties");
        const data = await response.json();
        const mappedProperties = data.map((prop) => ({
          id: prop.id,
          title: prop.title,
          priceInCedis: prop.price, // Store original price in GH₵
          price: `${currency}${convertPrice(prop.price, currency)}/month`,
          description: `${prop.description} • ${prop.bedrooms} bed • ${prop.bathrooms} bath`,
          image: prop.imageUrl
            ? `${BASE_URL}${prop.imageUrl}`
            : "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
          location: prop.location,
          bedrooms: prop.bedrooms,
          bathrooms: prop.bathrooms,
        }));
        setProperties(mappedProperties);
        setFilteredProperties(mappedProperties);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
        setProperties([]);
        setFilteredProperties([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [currency]); // Dependency array now only includes 'currency'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery((prev) => ({ ...prev, [name]: value }));
  };

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    setCurrency(newCurrency);
    // Update displayed prices for the new currency
    const updatedProperties = properties.map((prop) => ({
      ...prop,
      price: `${newCurrency}${convertPrice(
        prop.priceInCedis,
        newCurrency
      )}/month`,
    }));
    setProperties(updatedProperties);
    setFilteredProperties(updatedProperties);
  };

  const handleSearch = () => {
    const { location, priceRange, propertyType, bedrooms } = searchQuery;
    let results = [...properties];
    if (location) {
      results = results.filter((prop) =>
        prop.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    if (priceRange) {
      const [min, max] = priceRange.split("-").map(Number);
      results = results.filter((prop) => {
        // Convert min and max to GH₵ for comparison since priceInCedis is in GH₵
        const minInCedis = min / conversionRates[currency];
        const maxInCedis = max / conversionRates[currency];
        const priceInCedis = prop.priceInCedis;
        return priceInCedis >= minInCedis && priceInCedis <= maxInCedis;
      });
    }
    if (propertyType) {
      results = results.filter((prop) =>
        prop.title.toLowerCase().includes(propertyType.toLowerCase())
      );
    }
    if (bedrooms) {
      results = results.filter((prop) => prop.bedrooms === parseInt(bedrooms));
    }
    if (results.length === 0) {
      alert("No exact matches found. Showing all properties.");
      setFilteredProperties(properties);
    } else {
      setFilteredProperties(results);
    }
  };

  if (loading) {
    return (
      <GlobalSkeleton
        type="tenant-search"
        bgColor={darkMode ? "bg-gray-700" : "bg-gray-300"}
        animationSpeed="2.5s"
      />
    );
  }

  return (
    <div
      className={`p-4 md:p-6 space-y-6 z-0 ${
        darkMode ? "text-gray-200" : "text-gray-800"
      }`}
    >
      <h1 className="text-lg md:text-2xl font-bold">Find Your Perfect Home</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div
          className={`relative flex items-center border p-3 rounded-lg ${
            darkMode
              ? "border-gray-600 bg-gray-800"
              : "border-gray-300 bg-white"
          }`}
        >
          <MapPinIcon
            className={`w-5 h-5 mr-2 ${
              darkMode ? "text-gray-400" : "text-gray-400"
            }`}
          />
          <input
            type="text"
            name="location"
            placeholder="Enter city or zip code"
            className={`w-full focus:outline-none text-sm md:text-base ${
              darkMode
                ? "bg-gray-800 text-gray-200 placeholder-gray-400"
                : "bg-white text-gray-800 placeholder-gray-500"
            }`}
            value={searchQuery.location}
            onChange={handleInputChange}
          />
        </div>
        <div
          className={`relative flex items-center border p-3 rounded-lg ${
            darkMode
              ? "border-gray-600 bg-gray-800"
              : "border-gray-300 bg-white"
          }`}
        >
          <BanknotesIcon
            className={`w-5 h-5 mr-2 ${
              darkMode ? "text-gray-400" : "text-gray-400"
            }`}
          />
          <select
            name="priceRange"
            className={`w-full focus:outline-none text-sm md:text-base ${
              darkMode
                ? "bg-gray-800 text-gray-200"
                : "bg-transparent text-gray-800"
            }`}
            value={searchQuery.priceRange}
            onChange={handleInputChange}
          >
            <option value="" className={darkMode ? "bg-gray-800" : "bg-white"}>
              Select Price Range
            </option>
            <option
              value={
                currency === "GH₵"
                  ? "0-1000"
                  : currency === "USD"
                  ? "0-64"
                  : "0-58"
              }
              className={darkMode ? "bg-gray-800" : "bg-white"}
            >
              {currency}0 - {currency}
              {currency === "GH₵" ? "1,000" : currency === "USD" ? "64" : "58"}
            </option>
            <option
              value={
                currency === "GH₵"
                  ? "1000-2000"
                  : currency === "USD"
                  ? "64-128"
                  : "58-116"
              }
              className={darkMode ? "bg-gray-800" : "bg-white"}
            >
              {currency}
              {currency === "GH₵"
                ? "1,000"
                : currency === "USD"
                ? "64"
                : "58"}{" "}
              - {currency}
              {currency === "GH₵"
                ? "2,000"
                : currency === "USD"
                ? "128"
                : "116"}
            </option>
            <option
              value={
                currency === "GH₵"
                  ? "2000-3000"
                  : currency === "USD"
                  ? "128-192"
                  : "116-174"
              }
              className={darkMode ? "bg-gray-800" : "bg-white"}
            >
              {currency}
              {currency === "GH₵"
                ? "2,000"
                : currency === "USD"
                ? "128"
                : "116"}{" "}
              - {currency}
              {currency === "GH₵"
                ? "3,000"
                : currency === "USD"
                ? "192"
                : "174"}
            </option>
            <option
              value={
                currency === "GH₵"
                  ? "3000-5000"
                  : currency === "USD"
                  ? "192-320"
                  : "174-290"
              }
              className={darkMode ? "bg-gray-800" : "bg-white"}
            >
              {currency}
              {currency === "GH₵"
                ? "3,000"
                : currency === "USD"
                ? "192"
                : "174"}{" "}
              - {currency}
              {currency === "GH₵"
                ? "5,000"
                : currency === "USD"
                ? "320"
                : "290"}
            </option>
          </select>
        </div>
        <div
          className={`relative flex items-center border p-3 rounded-lg ${
            darkMode
              ? "border-gray-600 bg-gray-800"
              : "border-gray-300 bg-white"
          }`}
        >
          <select
            name="currency"
            className={`w-full focus:outline-none text-sm md:text-base ${
              darkMode
                ? "bg-gray-800 text-gray-200"
                : "bg-transparent text-gray-800"
            }`}
            value={currency}
            onChange={handleCurrencyChange}
          >
            <option
              value="GH₵"
              className={darkMode ? "bg-gray-800" : "bg-white"}
            >
              GH₵ (Cedis)
            </option>
            <option
              value="USD"
              className={darkMode ? "bg-gray-800" : "bg-white"}
            >
              USD (Dollar)
            </option>
            <option
              value="EUR"
              className={darkMode ? "bg-gray-800" : "bg-white"}
            >
              EUR (Euro)
            </option>
          </select>
        </div>
        <div
          className={`relative flex items-center border p-3 rounded-lg ${
            darkMode
              ? "border-gray-600 bg-gray-800"
              : "border-gray-300 bg-white"
          }`}
        >
          <HomeIcon
            className={`w-5 h-5 mr-2 ${
              darkMode ? "text-gray-400" : "text-gray-400"
            }`}
          />
          <input
            type="text"
            name="propertyType"
            placeholder="Property Type"
            className={`w-full focus:outline-none text-sm md:text-base ${
              darkMode
                ? "bg-gray-800 text-gray-200 placeholder-gray-400"
                : "bg-white text-gray-800 placeholder-gray-500"
            }`}
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
        <div
          className={`relative flex items-center border p-3 rounded-lg ${
            darkMode
              ? "border-gray-600 bg-gray-800"
              : "border-gray-300 bg-white"
          }`}
        >
          <HomeModernIcon
            className={`w-5 h-5 mr-2 ${
              darkMode ? "text-gray-400" : "text-gray-400"
            }`}
          />
          <input
            type="number"
            name="bedrooms"
            placeholder="Number of bedrooms"
            className={`w-full focus:outline-none text-sm md:text-base ${
              darkMode
                ? "bg-gray-800 text-gray-200 placeholder-gray-400"
                : "bg-white text-gray-800 placeholder-gray-500"
            }`}
            value={searchQuery.bedrooms}
            onChange={handleInputChange}
            min="1"
          />
        </div>
      </div>
      <Button
        variant="primary"
        onClick={handleSearch}
        className="w-full md:w-auto text-sm md:text-base"
      >
        Search Properties
      </Button>
      <div>
        <h2 className="text-base md:text-xl font-semibold mt-6">
          Featured Properties
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <div
                key={property.id}
                className={`border p-4 rounded-lg shadow-sm z-0 ${
                  darkMode
                    ? "border-gray-600 bg-gray-900 shadow-gray-700"
                    : "border-gray-200 bg-gray-50 shadow-gray-200"
                }`}
              >
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-40 object-cover rounded-lg"
                  onError={(e) =>
                    (e.target.src =
                      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop")
                  }
                />
                <h3 className="font-bold mt-2 text-sm md:text-base">
                  {property.title}
                </h3>
                <p
                  className={`text-xs md:text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {property.price} - {property.description}
                </p>
                <Button
                  variant="primary"
                  onClick={() =>
                    navigate(`${DASHBOARD_BASE_URL}/property/${property.id}`)
                  }
                  className="mt-3 w-full md:w-auto text-sm md:text-base"
                >
                  View Details
                </Button>
              </div>
            ))
          ) : (
            <p
              className={`text-sm md:text-base ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              No properties available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
