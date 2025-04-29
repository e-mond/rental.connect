import { useState, useEffect, useMemo } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaPlus,
  FaImage,
  FaTimes,
  FaBed,
  FaBath,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaSpinner,
} from "react-icons/fa";
import { toast } from "react-toastify";
import GlobalSkeleton from "../../../../components/GlobalSkeleton";
import ErrorDisplay from "../../../../components/ErrorDisplay";
import landlordApi from "../../../../api/landlordApi";
import { useDarkMode } from "../../../../context/DarkModeContext";
import Button from "../../../../components/Button";

/**
 * Component for managing landlord properties.
 * Displays a list of properties with options to add, edit, or delete.
 * Handles image uploads, form validation, and API interactions.
 * Properties are fetched from the backend, which already filters by landlordId.
 */
const Properties = () => {
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();
  const {
    user,
    isLoading: contextLoading,
    refetchProperties,
    refetchDashboardData,
  } = useOutletContext();

  // Initialize QueryClient for React Query
  const queryClient = useQueryClient();

  // State management
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All Properties");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editPropertyId, setEditPropertyId] = useState(null);
  const [newProperty, setNewProperty] = useState({
    title: "",
    description: "",
    bedrooms: "",
    bathrooms: "",
    location: "",
    price: "",
    currency: "GH₵",
    squareFeet: "",
    builtYear: "",
    availableFrom: "",
    utilitiesIncluded: false,
    amenities: [],
    status: "Active",
    images: [],
    isSharedBedrooms: false,
    isSharedBathrooms: false,
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(null);
  const [customAmenity, setCustomAmenity] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Validates a JWT token by checking its expiration.
   * @param {string} token - The JWT token
   * @returns {boolean} - Whether the token is valid
   */
  const isTokenValid = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {
      console.error("[Properties] Token validation error:", error);
      return false;
    }
  };

  // Fetch properties using React Query
  const {
    data: properties = [],
    error,
    isLoading: queryLoading,
  } = useQuery({
    queryKey: ["properties", user?._id],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      if (!isTokenValid(token)) {
        localStorage.removeItem("token");
        navigate("/login");
        throw new Error("Session expired. Please log in again.");
      }
      if (!user?._id) throw new Error("User ID not available");
      console.log("[Properties] Fetching properties for user:", user._id);
      const response = await landlordApi.fetchProperties(token);
      console.log("[Properties] Fetched properties:", response);
      return response || [];
    },
    enabled: !contextLoading && !!user?._id,
    onSuccess: (data) => {
      console.log("[Properties] Fetched properties:", data);
      data.forEach((prop) => {
        console.log(`[Properties] Property ${prop.title}:`, {
          imageUrls: prop.imageUrls,
          primaryImageUrl: prop.primaryImageUrl,
          landlordId: prop.landlordId,
        });
      });
    },
    onError: (error) => {
      console.error("[Properties] Fetch error:", error);
      if (error.message.includes("Session expired")) return;
      toast.error(error.message || "Failed to fetch properties", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  // Mutation for adding a property
  const addPropertyMutation = useMutation({
    mutationFn: async ({ property, images, primaryImageIndex }) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      if (!isTokenValid(token)) {
        localStorage.removeItem("token");
        navigate("/login");
        throw new Error("Session expired. Please log in again.");
      }
      const formData = new FormData();
      formData.append(
        "property",
        JSON.stringify({ ...property, landlordId: user._id })
      );
      images.forEach((image) => formData.append("images", image));
      if (primaryImageIndex !== null) {
        formData.append("primaryImageIndex", primaryImageIndex);
      }
      return landlordApi.addProperty(token, formData, async () => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["properties", user._id] }),
          refetchProperties(),
          refetchDashboardData && refetchDashboardData(),
        ]);
      });
    },
    onSuccess: (data) => {
      console.log("[Properties] Add property success:", data);
      resetForm();
      toast.success("Property added successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/dashboard/landlord/properties");
    },
    onError: (error) => {
      console.error("[Properties] Add property error:", error);
      if (error.message.includes("Session expired")) return;
      handleMutationError(error, "Failed to add property");
    },
  });

  // Mutation for updating a property
  const updatePropertyMutation = useMutation({
    mutationFn: async ({ id, property, images, primaryImageIndex }) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      console.log("[Properties] Update property token:", token);
      if (!isTokenValid(token)) {
        localStorage.removeItem("token");
        navigate("/login");
        throw new Error("Session expired. Please log in again.");
      }
      const formData = new FormData();
      formData.append(
        "property",
        JSON.stringify({ ...property, landlordId: user._id })
      );
      images.forEach((image) => formData.append("images", image));
      if (primaryImageIndex !== null) {
        formData.append("primaryImageIndex", primaryImageIndex);
      }
      return landlordApi.updateProperty(token, id, formData, async () => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["properties", user._id] }),
          refetchProperties(),
          refetchDashboardData && refetchDashboardData(),
        ]);
      });
    },
    onSuccess: (data) => {
      console.log("[Properties] Update property success:", data);
      resetForm();
      toast.success("Property updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/dashboard/landlord/properties");
    },
    onError: (error) => {
      console.error("[Properties] Update property error:", error);
      if (error.message.includes("Session expired")) return;
      handleMutationError(error, "Failed to update property");
    },
  });

  // Mutation for deleting a property
  const deletePropertyMutation = useMutation({
    mutationFn: async (propertyId) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      if (!isTokenValid(token)) {
        localStorage.removeItem("token");
        navigate("/login");
        throw new Error("Session expired. Please log in again.");
      }
      return landlordApi.deleteProperty(token, propertyId, async () => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["properties", user._id] }),
          refetchProperties(),
          refetchDashboardData && refetchDashboardData(),
        ]);
      });
    },
    onSuccess: (_, propertyId) => {
      console.log("[Properties] Delete property success:", propertyId);
      toast.success("Property deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/dashboard/landlord/properties");
    },
    onError: (error) => {
      console.error("[Properties] Delete property error:", error);
      if (error.message.includes("Session expired")) return;
      handleMutationError(error, "Failed to delete property");
    },
  });

  /**
   * Handles mutation errors with appropriate messaging.
   * @param {Error} error - The error object
   * @param {string} defaultMessage - Default error message
   */
  const handleMutationError = (error, defaultMessage) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
      toast.error("Session expired. Please log in again.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (error.response?.data) {
      const errors = error.response.data;
      const errorMessages = Object.entries(errors)
        .map(([field, message]) => `${field}: ${message}`)
        .join(", ");
      setErrorMessage(errorMessages || defaultMessage);
      toast.error(errorMessages || defaultMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      setErrorMessage(error.message || defaultMessage);
      toast.error(error.message || defaultMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Handle loading state with delayed transition
  useEffect(() => {
    if (!contextLoading && !queryLoading) {
      const timer = setTimeout(() => setLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [contextLoading, queryLoading]);

  // Clean up image previews on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  // Filter properties based on status and search query
  const filteredProperties = useMemo(
    () =>
      (properties || [])
        .filter((property) => {
          const status = filter === "Active Rentals" ? "Active" : filter;
          return filter === "All Properties" || property.status === status;
        })
        .filter(
          (property) =>
            property.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.description
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            property.location?.toLowerCase().includes(searchQuery.toLowerCase())
        ),
    [properties, filter, searchQuery]
  );

  /**
   * Handles input changes for form fields.
   * @param {Event} e - Input event
   */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProperty((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /**
   * Handles amenities checkbox changes.
   * @param {Event} e - Checkbox event
   */
  const handleAmenitiesChange = (e) => {
    const { value, checked } = e.target;
    setNewProperty((prev) => {
      const amenities = checked
        ? [...prev.amenities, value]
        : prev.amenities.filter((amenity) => amenity !== value);
      return { ...prev, amenities };
    });
  };

  /**
   * Handles custom amenity input.
   * @param {Event} e - Input event
   */
  const handleCustomAmenity = (e) => {
    setCustomAmenity(e.target.value);
  };

  /**
   * Adds a custom amenity to the list.
   */
  const addCustomAmenity = () => {
    if (
      customAmenity.trim() &&
      !newProperty.amenities.includes(customAmenity)
    ) {
      setNewProperty((prev) => ({
        ...prev,
        amenities: [...prev.amenities, customAmenity],
      }));
      setCustomAmenity("");
    }
  };

  /**
   * Handles image uploads with validation.
   * @param {Event} e - File input event
   */
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + newProperty.images.length > 5) {
      setErrorMessage("You can upload a maximum of 5 images.");
      toast.error("You can upload a maximum of 5 images.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage(`File ${file.name} exceeds 5MB.`);
        toast.error(`File ${file.name} exceeds 5MB.`, {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
      if (!file.type.startsWith("image/")) {
        setErrorMessage(`File ${file.name} is not an image.`);
        toast.error(`File ${file.name} is not an image.`, {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
    });
    setNewProperty((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
    setImagePreviews((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
    if (
      primaryImageIndex === null &&
      newProperty.images.length + files.length > 0
    ) {
      setPrimaryImageIndex(newProperty.images.length);
    }
  };

  /**
   * Removes an uploaded image.
   * @param {number} index - Index of the image to remove
   */
  const removeImage = (index) => {
    setNewProperty((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    if (primaryImageIndex === index) {
      setPrimaryImageIndex(null);
    } else if (primaryImageIndex > index) {
      setPrimaryImageIndex(primaryImageIndex - 1);
    }
  };

  /**
   * Sets the primary image index.
   * @param {number} index - Index of the primary image
   */
  const handleSetPrimaryImage = (index) => {
    setPrimaryImageIndex(index);
  };

  /**
   * Resets the form state.
   */
  const resetForm = () => {
    setNewProperty({
      title: "",
      description: "",
      bedrooms: "",
      bathrooms: "",
      location: "",
      price: "",
      currency: "GH₵",
      squareFeet: "",
      builtYear: "",
      availableFrom: "",
      utilitiesIncluded: false,
      amenities: [],
      status: "Active",
      images: [],
      isSharedBedrooms: false,
      isSharedBathrooms: false,
    });
    setImagePreviews([]);
    setPrimaryImageIndex(null);
    setCustomAmenity("");
    setIsAdding(false);
    setIsEditing(false);
    setEditPropertyId(null);
    setErrorMessage("");
  };

  /**
   * Handles adding a new property.
   * @param {Event} e - Form submit event
   */
  const handleAddProperty = (e) => {
    e.preventDefault();
    setErrorMessage("");
    const property = { ...newProperty };
    delete property.images; // Images are sent separately
    addPropertyMutation.mutate({
      property,
      images: newProperty.images,
      primaryImageIndex,
    });
  };

  /**
   * Populates the form for editing a property.
   * @param {Object} property - Property data
   */
  const handleEditProperty = (property) => {
    setIsEditing(true);
    setEditPropertyId(property._id); // Use _id instead of id
    setNewProperty({
      title: property.title || "",
      description: property.description || "",
      bedrooms: property.bedrooms || "",
      bathrooms: property.bathrooms || "",
      location: property.location || "",
      price: property.price || "",
      currency: property.currency || "GH₵",
      squareFeet: property.squareFeet || "",
      builtYear: property.builtYear || "",
      availableFrom: property.availableFrom || "",
      utilitiesIncluded: property.utilitiesIncluded || false,
      amenities: property.amenities || [],
      status: property.status || "Active",
      images: [],
      isSharedBedrooms: property.isSharedBedrooms || false,
      isSharedBathrooms: property.isSharedBathrooms || false,
    });
    const imageUrls = property.imageUrls || [];
    setImagePreviews(
      imageUrls.map((url) =>
        url.startsWith("http") ? url : `${landlordApi.baseUrl}${url}`
      )
    );
    const primaryUrl = property.primaryImageUrl;
    const index =
      imageUrls && primaryUrl
        ? imageUrls.indexOf(
            primaryUrl.startsWith("http")
              ? primaryUrl
              : primaryUrl.replace(landlordApi.baseUrl, "")
          )
        : -1;
    setPrimaryImageIndex(index >= 0 ? index : imageUrls.length > 0 ? 0 : null);
  };

  /**
   * Handles updating a property.
   * @param {Event} e - Form submit event
   */
  const handleUpdateProperty = (e) => {
    e.preventDefault();
    setErrorMessage("");
    const property = { ...newProperty };
    delete property.images; // Images are sent separately
    updatePropertyMutation.mutate({
      id: editPropertyId,
      property,
      images: newProperty.images,
      primaryImageIndex,
    });
  };

  /**
   * Handles deleting a property with confirmation.
   * @param {string} propertyId - ID of the property to delete
   */
  const handleDeleteProperty = (propertyId) => {
    if (!window.confirm("Are you sure you want to delete this property?"))
      return;
    setErrorMessage("");
    deletePropertyMutation.mutate(propertyId);
  };

  // Render error state
  if (error) {
    return <ErrorDisplay error={error} />;
  }

  // Render loading state
  if (contextLoading || loading || queryLoading) {
    return <GlobalSkeleton type="properties" />;
  }

  return (
    <div
      className={`flex flex-col w-full p-2 sm:p-4 md:p-6 ${
        darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-800"
      }`}
    >
      {/* Error Message */}
      {errorMessage && (
        <div
          className={`mb-4 p-3 rounded-md ${
            darkMode ? "bg-red-800 text-red-200" : "bg-red-100 text-red-800"
          }`}
        >
          {errorMessage}
        </div>
      )}

      {/* Header Section */}
      <div
        className={`flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0 ${
          darkMode ? "text-gray-200" : "text-gray-800"
        }`}
      >
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Properties</h2>
        <Button
          variant="primary"
          onClick={() => setIsAdding(true)}
          className="w-full sm:w-auto"
          aria-label="Add new property"
        >
          <FaPlus className="mr-2" /> Add Property
        </Button>
      </div>

      {/* Add/Edit Property Modal */}
      {(isAdding || isEditing) && (
        <div
          className={`fixed inset-0 ${
            darkMode ? "bg-gray-900 bg-opacity-75" : "bg-black bg-opacity-50"
          } flex items-center justify-center z-50 p-2 sm:p-4`}
        >
          <div
            className={`bg-${
              darkMode ? "gray-800" : "white"
            } p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto ${
              darkMode ? "text-gray-200" : "text-gray-800"
            }`}
          >
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-semibold">
                {isEditing ? "Edit Property" : "Add New Property"}
              </h3>
              <Button
                variant="icon"
                onClick={resetForm}
                className={darkMode ? "text-gray-400" : "text-gray-500"}
                aria-label="Close modal"
              >
                <FaTimes />
              </Button>
            </div>
            <form
              onSubmit={isEditing ? handleUpdateProperty : handleAddProperty}
              className="space-y-3 sm:space-y-4"
            >
              <div>
                <label
                  className={`block text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={newProperty.title}
                  onChange={handleInputChange}
                  className={`mt-1 p-2 w-full border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode
                      ? "bg-gray-700 text-gray-200 border-gray-600"
                      : "bg-white text-gray-800 border-gray-300"
                  }`}
                  placeholder="e.g., Luxury Apartment"
                  required
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Description
                </label>
                <textarea
                  name="description"
                  value={newProperty.description}
                  onChange={handleInputChange}
                  className={`mt-1 p-2 w-full border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode
                      ? "bg-gray-700 text-gray-200 border-gray-600"
                      : "bg-white text-gray-800 border-gray-300"
                  }`}
                  placeholder="e.g., Spacious living area"
                  rows="3"
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:space-x-3">
                <div className="flex-1">
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={newProperty.bedrooms}
                    onChange={handleInputChange}
                    className={`mt-1 p-2 w-full border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode
                        ? "bg-gray-700 text-gray-200 border-gray-600"
                        : "bg-white text-gray-800 border-gray-300"
                    }`}
                    placeholder="e.g., 2"
                    min="0"
                    required
                  />
                </div>
                <div className="flex-1 mt-3 sm:mt-0">
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={newProperty.bathrooms}
                    onChange={handleInputChange}
                    className={`mt-1 p-2 w-full border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode
                        ? "bg-gray-700 text-gray-200 border-gray-600"
                        : "bg-white text-gray-800 border-gray-300"
                    }`}
                    placeholder="e.g., 2"
                    min="0"
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  className={`block text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Shared Facilities
                </label>
                <div className="flex space-x-4 mt-1">
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      name="isSharedBedrooms"
                      checked={newProperty.isSharedBedrooms}
                      onChange={handleInputChange}
                      className={`h-4 w-4 ${
                        darkMode ? "text-blue-400" : "text-blue-600"
                      } focus:ring-${
                        darkMode ? "blue-400" : "blue-500"
                      } border-${
                        darkMode ? "gray-600" : "gray-300"
                      } rounded mr-2`}
                    />
                    Shared Bedrooms
                  </label>
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      name="isSharedBathrooms"
                      checked={newProperty.isSharedBathrooms}
                      onChange={handleInputChange}
                      className={`h-4 w-4 ${
                        darkMode ? "text-blue-400" : "text-blue-600"
                      } focus:ring-${
                        darkMode ? "blue-400" : "blue-500"
                      } border-${
                        darkMode ? "gray-600" : "gray-300"
                      } rounded mr-2`}
                    />
                    Shared Bathrooms
                  </label>
                </div>
              </div>
              <div>
                <label
                  className={`block text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={newProperty.location}
                  onChange={handleInputChange}
                  className={`mt-1 p-2 w-full border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode
                      ? "bg-gray-700 text-gray-200 border-gray-600"
                      : "bg-white text-gray-800 border-gray-300"
                  }`}
                  placeholder="e.g., Kumasi"
                  required
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Price
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    name="price"
                    value={newProperty.price}
                    onChange={handleInputChange}
                    className={`mt-1 p-2 w-full border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode
                        ? "bg-gray-700 text-gray-200 border-gray-600"
                        : "bg-white text-gray-800 border-gray-300"
                    }`}
                    placeholder="e.g., 4000"
                    min="0"
                    step="0.01"
                    required
                  />
                  <select
                    name="currency"
                    value={newProperty.currency}
                    onChange={handleInputChange}
                    className={`mt-1 p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode
                        ? "bg-gray-700 text-gray-200 border-gray-600"
                        : "bg-white text-gray-800 border-gray-300"
                    }`}
                  >
                    <option value="GH₵">GH₵</option>
                    <option value="USD">$</option>
                    <option value="EUR">€</option>
                  </select>
                </div>
              </div>
              <div>
                <label
                  className={`block text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Square Feet
                </label>
                <input
                  type="number"
                  name="squareFeet"
                  value={newProperty.squareFeet}
                  onChange={handleInputChange}
                  className={`mt-1 p-2 w-full border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode
                      ? "bg-gray-700 text-gray-200 border-gray-600"
                      : "bg-white text-gray-800 border-gray-300"
                  }`}
                  placeholder="e.g., 1200"
                  min="0"
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Built Year
                </label>
                <input
                  type="number"
                  name="builtYear"
                  value={newProperty.builtYear}
                  onChange={handleInputChange}
                  className={`mt-1 p-2 w-full border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode
                      ? "bg-gray-700 text-gray-200 border-gray-600"
                      : "bg-white text-gray-800 border-gray-300"
                  }`}
                  placeholder="e.g., 2020"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Available From
                </label>
                <input
                  type="date"
                  name="availableFrom"
                  value={newProperty.availableFrom}
                  onChange={handleInputChange}
                  className={`mt-1 p-2 w-full border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode
                      ? "bg-gray-700 text-gray-200 border-gray-600"
                      : "bg-white text-gray-800 border-gray-300"
                  }`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Status
                </label>
                <select
                  name="status"
                  value={newProperty.status}
                  onChange={handleInputChange}
                  className={`mt-1 p-2 w-full border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode
                      ? "bg-gray-700 text-gray-200 border-gray-600"
                      : "bg-white text-gray-800 border-gray-300"
                  }`}
                >
                  <option value="Active">Active</option>
                  <option value="Vacant">Vacant</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                </select>
              </div>
              <div>
                <label
                  className={`block text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Utilities Included
                </label>
                <input
                  type="checkbox"
                  name="utilitiesIncluded"
                  checked={newProperty.utilitiesIncluded}
                  onChange={handleInputChange}
                  className={`mt-1 h-4 w-4 ${
                    darkMode ? "text-blue-400" : "text-blue-600"
                  } focus:ring-${darkMode ? "blue-400" : "blue-500"} border-${
                    darkMode ? "gray-600" : "gray-300"
                  } rounded`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Amenities
                </label>
                <div className="space-y-2">
                  {["In-unit Laundry", "Central AC", "Parking Included"].map(
                    (amenity) => (
                      <div key={amenity} className="flex items-center">
                        <input
                          type="checkbox"
                          value={amenity}
                          checked={newProperty.amenities.includes(amenity)}
                          onChange={handleAmenitiesChange}
                          className={`h-4 w-4 ${
                            darkMode ? "text-blue-400" : "text-blue-600"
                          } focus:ring-${
                            darkMode ? "blue-400" : "blue-500"
                          } border-${
                            darkMode ? "gray-600" : "gray-300"
                          } rounded mr-2`}
                        />
                        <label
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {amenity}
                        </label>
                      </div>
                    )
                  )}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={customAmenity}
                      onChange={handleCustomAmenity}
                      placeholder="Add custom amenity"
                      className={`mt-1 p-2 w-full border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode
                          ? "bg-gray-700 text-gray-200 border-gray-600"
                          : "bg-white text-gray-800 border-gray-300"
                      }`}
                    />
                    <Button
                      variant="primary"
                      onClick={addCustomAmenity}
                      className="mt-1"
                      aria-label="Add custom amenity"
                    >
                      Add
                    </Button>
                  </div>
                  {newProperty.amenities.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {newProperty.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className={`bg-${
                            darkMode ? "gray-700" : "blue-100"
                          } text-${
                            darkMode ? "text-gray-200" : "text-blue-800"
                          } text-xs px-2 py-1 rounded-full`}
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label
                  className={`block text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Images (Max 5)
                </label>
                <div className="relative">
                  <FaImage
                    className={`absolute left-2 top-1/2 transform -translate-y-1/2 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className={`mt-1 pl-8 w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold ${
                      darkMode
                        ? "file:bg-gray-600 file:text-gray-200 hover:file:bg-gray-500"
                        : "file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    } ${
                      darkMode
                        ? "bg-gray-700 text-gray-200 border-gray-600"
                        : "bg-white text-gray-800 border-gray-300"
                    }`}
                  />
                </div>
                {imagePreviews.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-16 h-16 object-cover rounded-md"
                          onError={(e) =>
                            (e.target.outerHTML =
                              '<div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center"><span className="text-gray-500 text-xs">No image</span></div>')
                          }
                        />
                        <Button
                          variant="danger"
                          onClick={() => removeImage(index)}
                          className="absolute top-0 right-0 p-1 text-xs rounded-full"
                          aria-label="Remove image"
                        >
                          <FaTimes />
                        </Button>
                        <label className="flex items-center mt-1 text-xs">
                          <input
                            type="radio"
                            name="primaryImage"
                            checked={primaryImageIndex === index}
                            onChange={() => handleSetPrimaryImage(index)}
                            className="mr-1"
                          />
                          Primary
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="secondary"
                  onClick={resetForm}
                  aria-label="Cancel property form"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={
                    addPropertyMutation.isLoading ||
                    updatePropertyMutation.isLoading
                  }
                  aria-label={isEditing ? "Update property" : "Save property"}
                >
                  {addPropertyMutation.isLoading ||
                  updatePropertyMutation.isLoading ? (
                    <FaSpinner className="animate-spin mr-2" />
                  ) : null}
                  {isEditing ? "Update" : "Save"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div
        className={`flex items-center border p-2 rounded-lg shadow-sm mb-4 sm:mb-6 ${
          darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
        }`}
      >
        <FaSearch
          className={`text-${darkMode ? "gray-400" : "gray-400"} ml-2 text-sm`}
        />
        <input
          type="text"
          placeholder="Search properties..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`ml-2 w-full outline-none text-sm ${
            darkMode ? "bg-gray-700 text-gray-200" : "bg-white text-gray-800"
          } focus:ring-0`}
        />
      </div>

      {/* Filter Tabs */}
      <div
        className={`flex overflow-x-auto space-x-3 text-${
          darkMode ? "gray-400" : "gray-600"
        } text-xs sm:text-sm border-b pb-2 mb-4 sm:mb-6 whitespace-nowrap`}
      >
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
                ? `font-semibold border-b-2 ${
                    darkMode
                      ? "border-blue-400 text-blue-400"
                      : "border-blue-600 text-blue-600"
                  }`
                : `hover:text-${darkMode ? "blue-400" : "blue-600"}`
            }`}
          >
            {status}
          </span>
        ))}
      </div>

      {/* Property List */}
      <div className="space-y-4">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((property) => {
            // Normalize image URLs
            const imageUrls = property.imageUrls || [];
            const primaryImageUrl = property.primaryImageUrl;
            const displayImageUrl =
              primaryImageUrl || (imageUrls.length > 0 ? imageUrls[0] : null);
            const finalImageUrl = displayImageUrl
              ? displayImageUrl.startsWith("http")
                ? displayImageUrl
                : `${landlordApi.baseUrl}${displayImageUrl}`
              : null;

            return (
              <div
                key={property._id} // Use _id instead of id
                className={`bg-${
                  darkMode ? "gray-800" : "white"
                } rounded-lg shadow-md p-4 sm:p-5 transition-all duration-300 hover:shadow-lg ${
                  property.status === "Active"
                    ? "border-l-4 border-green-500"
                    : property.status === "Vacant"
                    ? "border-l-4 border-yellow-500"
                    : property.status === "Under Maintenance"
                    ? "border-l-4 border-red-500"
                    : "border-l-4 border-gray-300"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:space-x-4">
                  {/* Image Carousel */}
                  <div className="w-full sm:w-48 h-48 sm:h-40 rounded-lg overflow-hidden mb-3 sm:mb-0">
                    {finalImageUrl ? (
                      <div className="relative w-full h-full">
                        <img
                          src={finalImageUrl}
                          alt={property.title}
                          className="w-full h-full object-cover"
                          onError={(e) =>
                            (e.target.outerHTML =
                              '<div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center"><span className="text-gray-500">No image available</span></div>')
                          }
                        />
                        {imageUrls.length > 1 && (
                          <div
                            className={`absolute bottom-2 right-2 ${
                              darkMode
                                ? "bg-gray-800 bg-opacity-75"
                                : "bg-black bg-opacity-50"
                            } text-white text-xs px-2 py-1 rounded`}
                          >
                            {imageUrls.length} photos
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500">
                          No image available
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Property Details */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <div>
                        <h3
                          className={`text-base sm:text-lg font-semibold ${
                            darkMode ? "text-gray-200" : "text-gray-800"
                          }`}
                        >
                          {property.title}
                        </h3>
                        <p
                          className={`text-${
                            darkMode ? "gray-400" : "gray-600"
                          } text-xs sm:text-sm mt-1`}
                        >
                          {property.description}
                        </p>
                      </div>
                      <div className="flex space-x-2 mt-2 sm:mt-0">
                        <Button
                          variant="icon"
                          onClick={() => handleEditProperty(property)}
                          className={
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }
                          aria-label="Edit property"
                        >
                          <FaEdit className="text-base sm:text-lg" />
                        </Button>
                        <Button
                          variant="icon"
                          onClick={() => handleDeleteProperty(property._id)} // Use _id
                          className={
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }
                          aria-label="Delete property"
                        >
                          <FaTrash className="text-base sm:text-lg" />
                        </Button>
                      </div>
                    </div>

                    {/* Property Info */}
                    <div
                      className={`mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      <div className="flex items-center">
                        <FaMapMarkerAlt
                          className={`mr-2 ${
                            darkMode ? "text-blue-400" : "text-blue-500"
                          }`}
                        />
                        <span>{property.location}</span>
                      </div>
                      <div className="flex items-center">
                        <FaMoneyBillWave
                          className={`mr-2 ${
                            darkMode ? "text-green-400" : "text-green-500"
                          }`}
                        />
                        <span>
                          {property.currency}
                          {property.price}/mo
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FaBed
                          className={`mr-2 ${
                            darkMode ? "text-blue-400" : "text-blue-500"
                          }`}
                        />
                        <span>
                          {property.bedrooms}{" "}
                          {property.isSharedBedrooms
                            ? "Shared Bedrooms"
                            : "Bedrooms"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FaBath
                          className={`mr-2 ${
                            darkMode ? "text-blue-400" : "text-blue-500"
                          }`}
                        />
                        <span>
                          {property.bathrooms}{" "}
                          {property.isSharedBathrooms
                            ? "Shared Bathrooms"
                            : "Bathrooms"}
                        </span>
                      </div>
                    </div>

                    {/* Amenities */}
                    {property.amenities?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {property.amenities.map((amenity, index) => (
                          <span
                            key={index}
                            className={`bg-${
                              darkMode ? "gray-700" : "blue-100"
                            } text-${
                              darkMode ? "text-gray-200" : "text-blue-800"
                            } text-xs px-2 py-1 rounded-full`}
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div
            className={`bg-${
              darkMode ? "gray-800" : "white"
            } rounded-lg shadow-md p-4 sm:p-5 text-center`}
          >
            <p
              className={`text-${
                darkMode ? "gray-400" : "gray-500"
              } text-sm sm:text-base`}
            >
              No properties found under{" "}
              <span className="font-semibold">{filter}</span>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;
