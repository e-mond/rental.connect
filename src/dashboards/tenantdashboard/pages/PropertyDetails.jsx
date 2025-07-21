import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../config";
import GlobalSkeleton from "../../../components/GlobalSkeleton";
import { useDarkMode } from "../../../context/DarkModeContext";
import tenantApi from "../../../api/tenant/tenantApi";
import PropertyHeader from "../components/PropertyHeader";
import PropertyBreadcrumbs from "../components/PropertyBreadcrumbs";
import PropertyDetailsCard from "../components/PropertyDetailsCard";
import PropertyDescription from "../components/PropertyDescription";
import PropertyAmenities from "../components/PropertyAmenities";
import PropertyLeaseHistory from "../components/PropertyLeaseHistory";
import PropertyActions from "../components/PropertyActions";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const [property, setProperty] = useState(null);
  const [user, setUser] = useState(null);
  const [leasedProperties, setLeasedProperties] = useState([]);
  const [isLeased, setIsLeased] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

  useEffect(() => {
    const fetchData = async () => {
      console.log("[PropertyDetails] Property ID from useParams:", id);
      if (
        !id ||
        id.trim() === "" ||
        id === "undefined" ||
        id.startsWith("fallback-") ||
        !isValidObjectId(id)
      ) {
        setError("Invalid property ID. Property not found.");
        toast.error("Invalid property ID. Redirecting to search...", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => navigate("/dashboard/tenant/search"), 3000);
        setLoading(false);
        return;
      }

      const controller = new AbortController();
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const propertyData = await tenantApi.fetchPropertyById(id, {
          signal: controller.signal,
          token,
        });
        if (!propertyData || !propertyData.id) {
          throw new Error("Invalid property data received from server.");
        }
        console.log("[PropertyDetails] Property data:", propertyData);
        setProperty(propertyData);

        if (token && typeof tenantApi.fetchProfile === "function") {
          try {
            const userData = await tenantApi.fetchProfile({
              token,
              signal: controller.signal,
            });
            setUser(userData);

            const leasedData = await tenantApi.fetchLeasedProperties({
              token,
              signal: controller.signal,
            });
            if (!Array.isArray(leasedData)) {
              throw new Error("Invalid response format for leased properties.");
            }
            console.log(
              "[PropertyDetails] Leased Properties Response:",
              leasedData
            );
            setLeasedProperties(leasedData);

            const isPropertyLeased = leasedData.some(
              (leasedProperty) => leasedProperty.propertyId === id
            );
            setIsLeased(isPropertyLeased);
          } catch (userErr) {
            console.warn(
              "[PropertyDetails] Failed to fetch user profile:",
              userErr.message
            );
            setUser(null);
          }
        }
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("[PropertyDetails] Request cancelled:", err.message);
          return;
        }
        const errorMessage =
          err.message || "Failed to load property details. Please try again.";
        setError(errorMessage);
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
        });
        if (
          err.message.includes("token") ||
          err.message.includes("401") ||
          err.type === "auth"
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          setTimeout(() => navigate("/tenantlogin"), 3000);
        } else {
          setTimeout(() => navigate("/dashboard/tenant/search"), 3000);
        }
      } finally {
        setLoading(false);
      }

      return () => {
        controller.abort();
        console.log("[PropertyDetails] Aborting fetch requests on cleanup");
      };
    };

    fetchData();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:max-w-6xl lg:p-8">
        <div className="animate-customPulse bg-gray-300 w-full h-64 sm:h-80 lg:h-96 rounded-lg mb-6 lg:mb-8" />
        <div className="animate-customPulse bg-gray-300 h-4 w-1/2 rounded mb-4 lg:mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 lg:gap-6 lg:mb-8">
          <GlobalSkeleton
            type="property-details"
            bgColor={darkMode ? "bg-gray-700" : "bg-blue-50"}
            animationSpeed="1.2s"
          />
        </div>
        <div className="mb-6 lg:mb-8">
          <div className="animate-customPulse bg-gray-300 h-6 w-1/4 rounded mb-4" />
          <div className="flex flex-wrap gap-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className={`animate-customPulse ${
                  darkMode ? "bg-gray-700" : "bg-blue-50"
                } p-3 rounded-lg w-32 h-10`}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-center sm:justify-start gap-4">
          <div className="animate-customPulse bg-gray-300 h-10 w-32 rounded-lg lg:h-12 lg:w-40" />
          <div className="animate-customPulse bg-gray-300 h-10 w-32 rounded-lg lg:h-12 lg:w-40" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:max-w-6xl lg:p-8 text-center">
        <p className="text-red-500 mb-4 text-base lg:text-lg">{error}</p>
        <Link
          to="/dashboard/tenant/search"
          className={`${
            darkMode
              ? "text-blue-400 hover:text-blue-300"
              : "text-blue-600 hover:text-blue-700"
          } hover:underline text-base lg:text-lg`}
        >
          Back to Property Search
        </Link>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:max-w-6xl lg:p-8 text-center">
        <p
          className={`${
            darkMode ? "text-gray-400" : "text-gray-500"
          } mb-4 text-base lg:text-lg`}
        >
          Property not found.
        </p>
        <Link
          to="/dashboard/tenant/search"
          className={`${
            darkMode
              ? "text-blue-400 hover:text-blue-300"
              : "text-blue-600 hover:text-blue-700"
          } hover:underline text-base lg:text-lg`}
        >
          Back to Property Search
        </Link>
      </div>
    );
  }

  const images = property.images || [property.primaryImageUrl].filter(Boolean);
  const imageUrls = images
    .map((img) => {
      if (img.startsWith(BASE_URL)) {
        return img.replace(/^\/*[iI]mages\//, "/images/");
      }
      return `${BASE_URL}${img.replace(/^\/*[iI]mages\//, "/images/")}`;
    })
    .filter((url) => url && !url.includes(`${BASE_URL}${BASE_URL}`));

  console.log("[PropertyDetails] Constructed image URLs:", imageUrls);

  return (
    <div
      className={`max-w-2xl mx-auto p-4 sm:p-6 lg:max-w-6xl lg:p-8 ${
        darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-800"
      }`}
    >
      <PropertyHeader images={imageUrls} darkMode={darkMode} />
      <PropertyBreadcrumbs darkMode={darkMode} propertyTitle={property.title} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 lg:gap-6 lg:mb-8">
        <PropertyDetailsCard property={property} darkMode={darkMode} />
      </div>
      <PropertyDescription
        description={property.description}
        darkMode={darkMode}
      />
      <PropertyAmenities amenities={property.amenities} darkMode={darkMode} />
      <PropertyLeaseHistory
        leasedProperties={leasedProperties}
        propertyId={id}
        darkMode={darkMode}
      />
      <PropertyActions
        user={user}
        isLeased={isLeased}
        propertyId={id}
        navigate={navigate}
        darkMode={darkMode}
      />
    </div>
  );
};

export default PropertyDetails;
