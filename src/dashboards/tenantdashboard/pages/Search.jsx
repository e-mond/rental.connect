import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPinIcon,
  BanknotesIcon,
  HomeIcon,
  HomeModernIcon,
} from "@heroicons/react/24/outline";
import { BASE_URL, DASHBOARD_BASE_URL } from "../../../config";
import { useDarkMode } from "../../../context/DarkModeContext";
import Button from "../../../components/Button";
import tenantApi from "../../../api/tenant/tenantApi";
import debounce from "lodash/debounce";

const conversionRates = {
  "GH₵": 1,
  USD: 0.065,
  EUR: 0.059,
};

const convertPrice = (priceInCedis, targetCurrency) => {
  const price = parseFloat(priceInCedis);
  return price * conversionRates[targetCurrency];
};

const isAbsoluteUrl = (url) =>
  url && (url.startsWith("http://") || url.startsWith("https://"));

const Search = () => {
  const [searchQuery, setSearchQuery] = useState({
    location: "",
    priceRange: "",
    propertyType: "",
    bedrooms: "",
  });
  const [currency, setCurrency] = useState("GH₵");
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState(null);
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();

  const fetchProperties = useCallback(
    async (signal) => {
      try {
        console.log(
          "[Search] Fetching properties, using null token for public endpoint"
        );
        const data = await tenantApi.fetchProperties(null, signal);
        console.log("[Search] Fetch properties data:", data);

        const mappedProperties = data
          .map((prop) => {
            const propertyId = prop._id || prop.id;
            if (!propertyId) {
              console.error("[Search] Property missing both _id and id:", prop);
              return null;
            }
            console.log("[Search] Using property ID:", propertyId);
            const imageUrl = prop.primaryImageUrl
              ? isAbsoluteUrl(prop.primaryImageUrl)
                ? prop.primaryImageUrl
                : `${BASE_URL}${prop.primaryImageUrl}`
              : null;
            console.log(
              "[Search] Image URL for property",
              propertyId,
              ":",
              imageUrl
            );
            return {
              id: propertyId,
              title: prop.title || "Untitled Property",
              priceInCedis: prop.price || 0,
              price: `${currency}${convertPrice(
                prop.price || 0,
                currency
              ).toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}/month`,
              description: `${prop.description || "No description"} • ${
                prop.bedrooms || 0
              } bed • ${prop.bathrooms || 0} bath`,
              image: imageUrl,
              location: prop.location || "Unknown",
              bedrooms: prop.bedrooms || 0,
              bathrooms: prop.bathrooms || 0,
            };
          })
          .filter((prop) => prop !== null);
        console.log(
          "[Search] Mapped properties count:",
          mappedProperties.length
        );
        setProperties(mappedProperties);
        setFilteredProperties(mappedProperties);
        setError(null);
        setErrorType(null);
      } catch (err) {
        if (err.name === "AbortError" || err.type === "cancelled") {
          console.log("[Search] Request cancelled, ignoring:", err.message);
          return;
        }
        console.error("[Search] Failed to fetch properties:", err);
        setError(err.message || "Failed to load properties");
        setErrorType(err.type || "unknown");
        setProperties([]);
        setFilteredProperties([]);
      } finally {
        setLoading(false);
      }
    },
    [currency]
  );

  const debouncedFetchProperties = useMemo(
    () => debounce((signal) => fetchProperties(signal), 500),
    [fetchProperties]
  );

  useEffect(() => {
    const controller = new AbortController();
    debouncedFetchProperties(controller.signal);
    return () => {
      controller.abort();
      console.log("[Search] Aborting fetch request on cleanup");
      debouncedFetchProperties.cancel();
    };
  }, [debouncedFetchProperties]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery((prev) => ({ ...prev, [name]: value }));
  };

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    setCurrency(newCurrency);
    const updatedProperties = properties.map((prop) => ({
      ...prop,
      price: `${newCurrency}${convertPrice(
        prop.priceInCedis,
        newCurrency
      ).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })}/month`,
    }));
    setFilteredProperties(updatedProperties);
  };

  const handleSearch = async () => {
    const { location, priceRange, propertyType, bedrooms } = searchQuery;
    const queryParams = {};
    if (location) queryParams.location = location;
    if (priceRange) {
      const [min, max] = priceRange.split("-").map(Number);
      queryParams.priceMin = min / conversionRates[currency];
      queryParams.priceMax = max / conversionRates[currency];
    }
    if (propertyType) queryParams.propertyType = propertyType;
    if (bedrooms) queryParams.bedrooms = parseInt(bedrooms);

    setLoading(true);
    try {
      const data = await tenantApi.fetchProperties(null, null, queryParams);
      const mappedProperties = data
        .map((prop) => {
          const propertyId = prop._id || prop.id;
          if (!propertyId) {
            console.error("[Search] Property missing both _id and id:", prop);
            return null;
          }
          const imageUrl = prop.primaryImageUrl
            ? isAbsoluteUrl(prop.primaryImageUrl)
              ? prop.primaryImageUrl
              : `${BASE_URL}${prop.primaryImageUrl}`
            : null;
          return {
            id: propertyId,
            title: prop.title || "Untitled Property",
            priceInCedis: prop.price || 0,
            price: `${currency}${convertPrice(
              prop.price || 0,
              currency
            ).toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}/month`,
            description: `${prop.description || "No description"} • ${
              prop.bedrooms || 0
            } bed • ${prop.bathrooms || 0} bath`,
            image: imageUrl,
            location: prop.location || "Unknown",
            bedrooms: prop.bedrooms || 0,
            bathrooms: prop.bathrooms || 0,
          };
        })
        .filter((prop) => prop !== null);
      setFilteredProperties(mappedProperties);
      if (data.length === 0) {
        alert("No matching properties found. Showing all properties.");
        debouncedFetchProperties(null);
      }
    } catch (err) {
      if (err.name === "AbortError" || err.type === "cancelled") {
        console.log("[Search] Request cancelled, ignoring:", err.message);
        return;
      }
      console.error("[Search] Failed to fetch properties:", err);
      setError(err.message || "Failed to load properties");
      setErrorType(err.type || "unknown");
      setFilteredProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async () => {
    setLoading(true);
    setError(null);
    setErrorType(null);
    try {
      const data = await tenantApi.withRetry(
        tenantApi.fetchProperties,
        [null, null],
        3,
        2000
      );
      const mappedProperties = data
        .map((prop) => {
          const propertyId = prop._id || prop.id;
          if (!propertyId) {
            console.error("[Search] Property missing both _id and id:", prop);
            return null;
          }
          const imageUrl = prop.primaryImageUrl
            ? isAbsoluteUrl(prop.primaryImageUrl)
              ? prop.primaryImageUrl
              : `${BASE_URL}${prop.primaryImageUrl}`
            : null;
          return {
            id: propertyId,
            title: prop.title || "Untitled Property",
            priceInCedis: prop.price || 0,
            price: `${currency}${convertPrice(
              prop.price || 0,
              currency
            ).toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}/month`,
            description: `${prop.description || "No description"} • ${
              prop.bedrooms || 0
            } bed • ${prop.bathrooms || 0} bath`,
            image: imageUrl,
            location: prop.location || "Unknown",
            bedrooms: prop.bedrooms || 0,
            bathrooms: prop.bathrooms || 0,
          };
        })
        .filter((prop) => prop !== null);
      setProperties(mappedProperties);
      setFilteredProperties(mappedProperties);
    } catch (err) {
      console.error("[Search] Retry failed:", err);
      setError(err.message || "Failed to load properties");
      setErrorType(err.type || "unknown");
      setProperties([]);
      setFilteredProperties([]);
      if (err.type === "auth" && err.status === 401) {
        console.log("[Search] Auth error on retry, redirecting to login");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        navigate("/tenantlogin");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (propertyId) => {
    if (!propertyId || typeof propertyId !== "string") {
      console.error("[Search] Invalid property ID:", propertyId);
      alert("Unable to view property details. Invalid property ID.");
      return;
    }
    console.log("[Search] Navigating to property details with ID:", propertyId);
    navigate(`${DASHBOARD_BASE_URL}/tenant/property/${propertyId}`);
  };

  if (loading) {
    return (
      <div
        className={`p-6 space-y-6 ${
          darkMode ? "text-gray-200 bg-gray-900" : "text-gray-800 bg-gray-50"
        }`}
      >
        <p>Loading properties...</p>
      </div>
    );
  }

  if (error && errorType !== "cancelled") {
    return (
      <div
        className={`p-6 space-y-6 ${
          darkMode ? "text-gray-200 bg-gray-900" : "text-gray-800 bg-gray-50"
        }`}
      >
        <p className="text-red-500">{error}</p>
        {(errorType === "network" || errorType === "server") && (
          <Button variant="primary" onClick={handleRetry} className="mt-2">
            Retry
          </Button>
        )}
        {errorType === "auth" && (
          <Button
            variant="primary"
            onClick={() => navigate("/tenantlogin")}
            className="mt-2"
          >
            Log In
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`p-6 space-y-8 ${
        darkMode ? "text-gray-200 bg-gray-900" : "text-gray-800 bg-gray-50"
      }`}
    >
      <h1 className="text-2xl font-bold">Explore Landlord Listings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div
          className={`flex items-center p-3 rounded-lg shadow-md ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <MapPinIcon
            className={`w-6 h-6 mr-3 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          />
          <input
            type="text"
            name="location"
            placeholder="Enter city or zip code"
            className={`w-full focus:outline-none text-base ${
              darkMode
                ? "bg-gray-800 text-gray-200 placeholder-gray-500"
                : "bg-white text-gray-800 placeholder-gray-400"
            }`}
            value={searchQuery.location}
            onChange={handleInputChange}
          />
        </div>
        <div
          className={`flex items-center p-3 rounded-lg shadow-md ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <BanknotesIcon
            className={`w-6 h-6 mr-3 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          />
          <select
            name="priceRange"
            className={`w-full focus:outline-none text-base ${
              darkMode
                ? "bg-gray-800 text-gray-200"
                : "bg-transparent text-gray-800"
            }`}
            value={searchQuery.priceRange}
            onChange={handleInputChange}
          >
            <option value="">Select Price Range</option>
            <option
              value={
                currency === "GH₵"
                  ? "0-1000"
                  : currency === "USD"
                  ? "0-65"
                  : "0-59"
              }
            >
              {currency}0 - {currency}
              {currency === "GH₵" ? "1,000" : currency === "USD" ? "65" : "59"}
            </option>
            <option
              value={
                currency === "GH₵"
                  ? "1000-2000"
                  : currency === "USD"
                  ? "65-130"
                  : "59-118"
              }
            >
              {currency}1,000 - {currency}
              {currency === "GH₵"
                ? "2,000"
                : currency === "USD"
                ? "130"
                : "118"}
            </option>
            <option
              value={
                currency === "GH₵"
                  ? "2000-3000"
                  : currency === "USD"
                  ? "130-195"
                  : "118-177"
              }
            >
              {currency}2,000 - {currency}
              {currency === "GH₵"
                ? "3,000"
                : currency === "USD"
                ? "195"
                : "177"}
            </option>
            <option
              value={
                currency === "GH₵"
                  ? "3000-5000"
                  : currency === "USD"
                  ? "195-325"
                  : "177-295"
              }
            >
              {currency}3,000 - {currency}
              {currency === "GH₵"
                ? "5,000"
                : currency === "USD"
                ? "325"
                : "295"}
            </option>
          </select>
        </div>
        <div
          className={`flex items-center p-3 rounded-lg shadow-md ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <select
            name="currency"
            className={`w-full focus:outline-none text-base ${
              darkMode
                ? "bg-gray-800 text-gray-200"
                : "bg-transparent text-gray-800"
            }`}
            value={currency}
            onChange={handleCurrencyChange}
          >
            <option value="GH₵">GH₵ (Cedis)</option>
            <option value="USD">USD (Dollar)</option>
            <option value="EUR">EUR (Euro)</option>
          </select>
        </div>
        <div
          className={`flex items-center p-3 rounded-lg shadow-md ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <HomeIcon
            className={`w-6 h-6 mr-3 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          />
          <input
            type="text"
            name="propertyType"
            placeholder="Property Type"
            className={`w-full focus:outline-none text-base ${
              darkMode
                ? "bg-gray-800 text-gray-200 placeholder-gray-500"
                : "bg-white text-gray-800 placeholder-gray-400"
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
          className={`flex items-center p-3 rounded-lg shadow-md ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <HomeModernIcon
            className={`w-6 h-6 mr-3 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          />
          <input
            type="number"
            name="bedrooms"
            placeholder="Number of bedrooms"
            className={`w-full focus:outline-none text-base ${
              darkMode
                ? "bg-gray-800 text-gray-200 placeholder-gray-500"
                : "bg-white text-gray-800 placeholder-gray-400"
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
        className="w-full md:w-auto px-6 py-3 text-base font-semibold"
      >
        Search Properties
      </Button>
      <div>
        <h2 className="text-xl font-semibold mt-8">Landlord Listings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <div
                key={property.id}
                className={`rounded-lg overflow-hidden shadow-lg transition-transform duration-200 hover:scale-105 ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-100"
                }`}
              >
                {property.image ? (
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      console.error(
                        "[Search] Image load failed for",
                        property.image,
                        e
                      );
                      e.target.src = "/placeholder-image.jpg"; // Local fallback
                    }}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span
                      className={darkMode ? "text-gray-500" : "text-gray-400"}
                    >
                      No image
                    </span>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{property.title}</h3>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {property.price} - {property.description}
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => handleViewDetails(property.id)}
                    className="mt-4 w-full text-sm py-2"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p
              className={`text-base ${
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
