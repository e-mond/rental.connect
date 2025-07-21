import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import GlobalSkeleton from "../../../../components/GlobalSkeleton";
import ErrorDisplay from "../../../../components/ErrorDisplay";
import landlordApi from "../../../../api/landlord/landlordApi";
import { useDarkMode } from "../../../../context/DarkModeContext";
import { UserContext } from "../../../../context/UserProvider";
import { PropertyHeader } from "../../components/PropertyHeader";
import PropertyForm from "../../components/PropertyForm";
import PropertyList from "../../components/PropertyList";
import PropertyCard from "../../components/PropertyCard";
import { v4 as uuidv4 } from "uuid";
import { useContext } from "react"; // Added useContext

// Properties component for managing landlord properties
const Properties = () => {
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();
  const { user, loading: contextLoading } = useContext(UserContext);
  const queryClient = useQueryClient();

  // State management for form and UI
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
    currency: "GHS",
    squareFeet: "",
    builtYear: "",
    availableFrom: "",
    utilitiesIncluded: false,
    amenities: [],
    status: "Active",
    propertyType: "Apartment",
    images: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(null);
  const [customAmenity, setCustomAmenity] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [effectiveUserId, setEffectiveUserId] = useState(null);

  // Normalize image URLs for consistency
  const normalizeImageUrl = useCallback((url) => {
    if (!url) return null;
    const invalidDomains = ["dummy-storage"];
    let urlObj;
    try {
      urlObj = new URL(
        url.startsWith("http") ? url : `http://placeholder${url}`
      );
    } catch {
      console.error("[Properties] Invalid URL format:", url);
      return null;
    }
    const isInvalidDomain = invalidDomains.some((domain) =>
      urlObj.hostname.includes(domain)
    );
    if (isInvalidDomain || !url.startsWith("http")) {
      const cleanUrl = url.startsWith("/") ? url.substring(1) : url;
      const baseUrl = landlordApi.baseUrl.endsWith("/")
        ? landlordApi.baseUrl.slice(0, -1)
        : landlordApi.baseUrl;
      const normalized = `${baseUrl}/${cleanUrl}`;
      return normalized.replace(/\s/g, "%20");
    }
    return url.replace(/\s/g, "%20");
  }, []);

  // Set user ID or redirect to login
  useEffect(() => {
    if (!contextLoading && user?.userId) {
      setEffectiveUserId(user.userId);
    } else if (!contextLoading && !user?.userId) {
      toast.error("Please log in to continue.", { autoClose: 3000 });
      navigate("/login");
    }
  }, [contextLoading, user, navigate]);

  // Fetch properties with React Query
  const {
    data: properties = [],
    error,
    isLoading: queryLoading,
  } = useQuery({
    queryKey: ["properties", effectiveUserId],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      const response = await landlordApi.fetchProperties(token);
      return response.map((prop) => ({
        ...prop,
        id: prop._id || `temp-id-${uuidv4()}`, // Use UUID for unique temp IDs
        status: prop.status || "Active",
      }));
    },
    enabled:
      !contextLoading && !!effectiveUserId && !!localStorage.getItem("token"),
    onError: (error) => {
      toast.error(`Failed to fetch properties: ${error.message}`, {
        autoClose: 3000,
      });
    },
    retry: 2,
  });

  // Handle loading state
  useEffect(() => {
    if (!contextLoading && !queryLoading) {
      const timer = setTimeout(() => setLoading(false), 100);
      return () => clearTimeout(timer);
    }
  }, [contextLoading, queryLoading]);

  // Clean up image previews
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => {
        if (preview?.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [imagePreviews]);

  // Filter properties
  const filteredProperties = useMemo(() => {
    const statusMap = {
      "Active Rentals": "Active",
      Vacant: "Vacant",
      "Under Maintenance": "Under Maintenance",
      "All Properties": null,
    };
    return (properties || []).filter((property) => {
      const matchesStatus =
        !statusMap[filter] || property.status === statusMap[filter];
      const matchesSearchQuery =
        !searchQuery ||
        [property.title, property.description, property.location].some(
          (field) => field?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesStatus && matchesSearchQuery;
    });
  }, [properties, filter, searchQuery]);

  // Validate form inputs
  const validateForm = useCallback(() => {
    const errors = [];
    if (!newProperty.title.trim()) errors.push("Title is required");
    if (!newProperty.location.trim()) errors.push("Location is required");
    if (
      newProperty.bedrooms === "" ||
      isNaN(Number(newProperty.bedrooms)) ||
      Number(newProperty.bedrooms) < 0
    )
      errors.push("Bedrooms must be a non-negative number");
    if (
      newProperty.bathrooms === "" ||
      isNaN(Number(newProperty.bathrooms)) ||
      Number(newProperty.bathrooms) < 0
    )
      errors.push("Bathrooms must be a non-negative number");
    if (
      newProperty.price === "" ||
      isNaN(Number(newProperty.price)) ||
      Number(newProperty.price) <= 0
    )
      errors.push("Price must be a positive number");
    if (!["GHS", "USD", "EUR"].includes(newProperty.currency))
      errors.push("Valid currency is required");
    if (newProperty.builtYear !== "") {
      const year = Number(newProperty.builtYear);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1900 || year > currentYear)
        errors.push(`Built year must be between 1900 and ${currentYear}`);
    }
    if (newProperty.squareFeet !== "") {
      const sqFt = Number(newProperty.squareFeet);
      if (isNaN(sqFt) || sqFt < 0)
        errors.push("Square feet must be a non-negative number");
    }
    if (!["Active", "Vacant", "Under Maintenance"].includes(newProperty.status))
      errors.push("Invalid status");
    if (!newProperty.propertyType.trim())
      errors.push("Property type is required");
    if (errors.length > 0) {
      setErrorMessage(errors.join(", "));
      return false;
    }
    return true;
  }, [newProperty]);

  // Handle input changes
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setNewProperty((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  // Handle amenities changes
  const handleAmenitiesChange = useCallback((e) => {
    const { value, checked } = e.target;
    setNewProperty((prev) => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, value]
        : prev.amenities.filter((amenity) => amenity !== value),
    }));
  }, []);

  // Handle custom amenity input
  const handleCustomAmenity = useCallback((e) => {
    setCustomAmenity(e.target.value);
  }, []);

  // Add custom amenity
  const addCustomAmenity = useCallback(() => {
    if (
      customAmenity.trim() &&
      !newProperty.amenities.includes(customAmenity.trim())
    ) {
      setNewProperty((prev) => ({
        ...prev,
        amenities: [...prev.amenities, customAmenity.trim()],
      }));
      setCustomAmenity("");
    }
  }, [customAmenity, newProperty.amenities]);

  // Handle image uploads
  const handleImageChange = useCallback(
    (e) => {
      const files = Array.from(e.target.files || []);
      const currentImages = newProperty.images || [];
      const totalImages =
        currentImages.length + existingImages.length - removedImages.length;
      if (files.length + totalImages > 5) {
        setErrorMessage("Maximum 5 images allowed");
        toast.error("Maximum 5 images allowed", { autoClose: 3000 });
        return;
      }
      const validFiles = files.filter((file) => {
        if (file.size > 5 * 1024 * 1024) {
          setErrorMessage(`File ${file.name} exceeds 5MB`);
          toast.error(`File ${file.name} exceeds 5MB`, { autoClose: 3000 });
          return false;
        }
        if (!file.type.startsWith("image/")) {
          setErrorMessage(`File ${file.name} is not an image`);
          toast.error(`File ${file.name} is not an image`, { autoClose: 3000 });
          return false;
        }
        return true;
      });
      setNewProperty((prev) => ({
        ...prev,
        images: [...currentImages, ...validFiles],
      }));
      setImagePreviews((prev) => [
        ...prev,
        ...validFiles.map((file) => URL.createObjectURL(file)),
      ]);
      if (
        primaryImageIndex === null &&
        existingImages.length + validFiles.length > 0
      ) {
        setPrimaryImageIndex(existingImages.length);
      }
      if (validFiles.length > 0) {
        toast.info("Images will be compressed to optimize upload", {
          autoClose: 3000,
        });
      }
    },
    [newProperty.images, primaryImageIndex, existingImages, removedImages]
  );

  // Remove image
  const removeImage = useCallback(
    (index) => {
      const removedPreview = imagePreviews[index];
      const isExistingImage = index < existingImages.length;
      if (isExistingImage) {
        const existingImageUrl = existingImages[index];
        setRemovedImages((prev) => [...prev, existingImageUrl]);
        setExistingImages((prev) => prev.filter((_, i) => i !== index));
      } else {
        const newImageIndex =
          index - (existingImages.length - removedImages.length);
        const currentImages = newProperty.images || [];
        setNewProperty((prev) => ({
          ...prev,
          images: currentImages.filter((_, i) => i !== newImageIndex),
        }));
      }
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
      if (removedPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(removedPreview);
      }
      if (imagePreviews.length - 1 === 0) {
        setPrimaryImageIndex(null);
      } else if (primaryImageIndex === index) {
        setPrimaryImageIndex(0);
      } else if (primaryImageIndex > index) {
        setPrimaryImageIndex(primaryImageIndex - 1);
      }
    },
    [
      imagePreviews,
      primaryImageIndex,
      newProperty.images,
      existingImages,
      removedImages,
    ]
  );

  // Set primary image
  const handleSetPrimaryImage = useCallback((index) => {
    setPrimaryImageIndex(index);
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setNewProperty({
      title: "",
      description: "",
      bedrooms: "",
      bathrooms: "",
      location: "",
      price: "",
      currency: "GHS",
      squareFeet: "",
      builtYear: "",
      availableFrom: "",
      utilitiesIncluded: false,
      amenities: [],
      status: "Active",
      propertyType: "Apartment",
      images: [],
    });
    setImagePreviews((prev) => {
      prev.forEach((preview) => {
        if (preview?.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
      return [];
    });
    setExistingImages([]);
    setRemovedImages([]);
    setPrimaryImageIndex(null);
    setCustomAmenity("");
    setIsAdding(false);
    setIsEditing(false);
    setEditPropertyId(null);
    setErrorMessage("");
  }, []);

  // Add property mutation
  const addPropertyMutation = useMutation({
    mutationFn: async ({ property, images, primaryImageIndex }) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      const formData = new FormData();
      try {
        formData.append("property", JSON.stringify(property));
      } catch {
        throw new Error("Failed to serialize property data");
      }
      images.forEach((image) => formData.append("images[]", image));
      if (primaryImageIndex !== null) {
        formData.append("primaryImageIndex", primaryImageIndex.toString());
      }
      return landlordApi.addProperty(token, formData, async () => {
        await queryClient.invalidateQueries({
          queryKey: ["properties", effectiveUserId],
        });
      });
    },
    onSuccess: () => {
      resetForm();
      toast.success("Property added successfully!", { autoClose: 3000 });
      setTimeout(() => navigate("/dashboard/landlord/properties"), 1000);
    },
    onError: (error) => {
      const errorMessages = error.response?.data?.details
        ? error.response.data.details.map((err) => err.message)
        : [
            error.response?.data?.error ||
              error.message ||
              "Failed to add property",
          ];
      setErrorMessage(errorMessages.join(", "));
      toast.error(errorMessages.join(", "), { autoClose: 3000 });
    },
  });

  // Update property mutation
  const updatePropertyMutation = useMutation({
    mutationFn: async ({
      id,
      property,
      images,
      primaryImageIndex,
      removedImages,
    }) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      const formData = new FormData();
      try {
        formData.append("property", JSON.stringify(property));
      } catch {
        throw new Error("Failed to serialize property data");
      }
      images.forEach((image) => formData.append("images[]", image));
      if (primaryImageIndex !== null) {
        formData.append("primaryImageIndex", primaryImageIndex.toString());
      }
      if (removedImages.length > 0) {
        formData.append("removedImages", JSON.stringify(removedImages));
      }
      return landlordApi.updateProperty(token, id, formData, async () => {
        await queryClient.invalidateQueries({
          queryKey: ["properties", effectiveUserId],
        });
      });
    },
    onSuccess: () => {
      resetForm();
      toast.success("Property updated successfully!", { autoClose: 3000 });
      setTimeout(() => navigate("/dashboard/landlord/properties"), 1000);
    },
    onError: (error) => {
      const errorMessages = error.response?.data?.details
        ? error.response.data.details.map((err) => err.message)
        : [
            error.response?.data?.error ||
              error.message ||
              "Failed to update property",
          ];
      setErrorMessage(errorMessages.join(", "));
      toast.error(errorMessages.join(", "), { autoClose: 3000 });
    },
  });

  // Delete property mutation
  const deletePropertyMutation = useMutation({
    mutationFn: async (propertyId) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      return landlordApi.deleteProperty(token, propertyId, async () => {
        await queryClient.invalidateQueries({
          queryKey: ["properties", effectiveUserId],
        });
      });
    },
    onSuccess: () => {
      toast.success("Property deleted successfully!", { autoClose: 3000 });
    },
    onError: (error) => {
      const errorMessages = error.response?.data?.details
        ? error.response.data.details.map((err) => err.message)
        : [
            error.response?.data?.error ||
              error.message ||
              "Failed to delete property",
          ];
      setErrorMessage(errorMessages.join(", "));
      toast.error(errorMessages.join(", "), { autoClose: 3000 });
    },
  });

  // Handle adding property
  const handleAddProperty = useCallback(
    (e) => {
      e.preventDefault();
      setErrorMessage("");
      if (!validateForm()) {
        toast.error("Please fix form errors", { autoClose: 3000 });
        return;
      }
      const property = {
        ...newProperty,
        bedrooms: Number(newProperty.bedrooms),
        bathrooms: Number(newProperty.bathrooms),
        price: Number(newProperty.price),
        squareFeet: newProperty.squareFeet
          ? Number(newProperty.squareFeet)
          : undefined,
        builtYear: newProperty.builtYear
          ? Number(newProperty.builtYear)
          : undefined,
        photos: imagePreviews.length,
      };
      delete property.images;
      addPropertyMutation.mutate({
        property,
        images: newProperty.images || [],
        primaryImageIndex,
      });
    },
    [
      newProperty,
      primaryImageIndex,
      validateForm,
      addPropertyMutation,
      imagePreviews,
    ]
  );

  // Handle editing property
  const handleEditProperty = useCallback(
    (property) => {
      if (!property.id) {
        toast.error("Cannot edit property: Missing ID", { autoClose: 3000 });
        return;
      }
      setIsEditing(true);
      setEditPropertyId(property.id);
      setNewProperty({
        title: property.title || "",
        description: property.description || "",
        bedrooms: property.bedrooms?.toString() || "",
        bathrooms: property.bathrooms?.toString() || "",
        location: property.location || "",
        price: property.price?.toString() || "",
        currency: property.currency || "GHS",
        squareFeet: property.squareFeet?.toString() || "",
        builtYear: property.builtYear?.toString() || "",
        availableFrom: property.availableFrom || "",
        utilitiesIncluded: !!property.utilitiesIncluded,
        amenities: property.amenities || [],
        status: property.status || "Active",
        propertyType: property.propertyType || "Apartment",
        images: [],
      });
      const imageUrls = (property.imageUrls || [])
        .map(normalizeImageUrl)
        .filter(Boolean);
      setExistingImages(imageUrls);
      setImagePreviews(imageUrls);
      const primaryUrl = normalizeImageUrl(property.primaryImageUrl);
      const index = primaryUrl
        ? imageUrls.findIndex((url) => url === primaryUrl)
        : imageUrls.length > 0
        ? 0
        : null;
      setPrimaryImageIndex(index);
      setRemovedImages([]);
    },
    [normalizeImageUrl]
  );

  // Handle updating property
  const handleUpdateProperty = useCallback(
    (e) => {
      e.preventDefault();
      setErrorMessage("");
      if (!editPropertyId) {
        toast.error("Cannot update property: Missing ID", { autoClose: 3000 });
        return;
      }
      if (editPropertyId.startsWith("temp-id-")) {
        toast.error("Cannot update property: Invalid temporary ID", {
          autoClose: 3000,
        });
        return;
      }
      if (!validateForm()) {
        toast.error("Please fix form errors", { autoClose: 3000 });
        return;
      }
      const property = {
        ...newProperty,
        bedrooms: Number(newProperty.bedrooms),
        bathrooms: Number(newProperty.bathrooms),
        price: Number(newProperty.price),
        squareFeet: newProperty.squareFeet
          ? Number(newProperty.squareFeet)
          : undefined,
        builtYear: newProperty.builtYear
          ? Number(newProperty.builtYear)
          : undefined,
        photos: imagePreviews.length,
      };
      delete property.images;
      updatePropertyMutation.mutate({
        id: editPropertyId,
        property,
        images: newProperty.images || [],
        primaryImageIndex,
        removedImages,
      });
    },
    [
      newProperty,
      editPropertyId,
      primaryImageIndex,
      removedImages,
      validateForm,
      updatePropertyMutation,
      imagePreviews,
    ]
  );

  // Handle deleting property
  const handleDeleteProperty = useCallback(
    (propertyId) => {
      if (!propertyId) {
        toast.error("Cannot delete property: Missing ID", { autoClose: 3000 });
        return;
      }
      if (propertyId.startsWith("temp-id-")) {
        toast.error("Cannot delete property: Invalid temporary ID", {
          autoClose: 3000,
        });
        return;
      }
      if (!window.confirm("Are you sure you want to delete this property?"))
        return;
      setErrorMessage("");
      deletePropertyMutation.mutate(propertyId);
    },
    [deletePropertyMutation]
  );

  // Render error state
  if (error) {
    return <ErrorDisplay error={error} />;
  }

  // Render loading state
  if (contextLoading || loading || queryLoading) {
    return <GlobalSkeleton type="properties" />;
  }

  // Main render
  return (
    <div
      className={`flex flex-col w-full p-4 sm:p-6 md:p-8 min-h-screen ${
        darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-800"
      }`}
    >
      {errorMessage && (
        <div
          className={`mb-4 p-4 rounded-lg text-sm sm:text-base ${
            darkMode ? "bg-red-800 text-red-200" : "bg-red-100 text-red-800"
          }`}
        >
          {errorMessage}
        </div>
      )}
      <PropertyHeader
        darkMode={darkMode}
        filter={filter}
        setFilter={setFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setIsAdding={setIsAdding}
        resetForm={resetForm}
      />
      {(isAdding || isEditing) && (
        <PropertyForm
          darkMode={darkMode}
          isEditing={isEditing}
          newProperty={newProperty}
          handleInputChange={handleInputChange}
          handleAmenitiesChange={handleAmenitiesChange}
          customAmenity={customAmenity}
          handleCustomAmenity={handleCustomAmenity}
          addCustomAmenity={addCustomAmenity}
          handleImageChange={handleImageChange}
          imagePreviews={imagePreviews}
          removeImage={removeImage}
          primaryImageIndex={primaryImageIndex}
          handleSetPrimaryImage={handleSetPrimaryImage}
          handleAddProperty={handleAddProperty}
          handleUpdateProperty={handleUpdateProperty}
          addPropertyMutation={addPropertyMutation}
          updatePropertyMutation={updatePropertyMutation}
          resetForm={resetForm}
        />
      )}
      {!isAdding && !isEditing && (
        <PropertyList
          darkMode={darkMode}
          filteredProperties={filteredProperties}
        >
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              darkMode={darkMode}
              property={property}
              normalizeImageUrl={normalizeImageUrl}
              handleEditProperty={handleEditProperty}
              handleDeleteProperty={handleDeleteProperty}
              deletePropertyMutation={deletePropertyMutation}
              isTemporaryId={property.id.startsWith("temp-id-")} // Pass flag to disable actions
            />
          ))}
        </PropertyList>
      )}
    </div>
  );
};

export default Properties;
