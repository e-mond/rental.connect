import axios from "axios";
import { makeAuthenticatedRequest } from "./tokenUtils";

const fetchProperties = async (token) => {
  if (!token) throw new Error("No authentication token provided");
  try {
    console.log(
      "[landlordApi] fetchProperties: Initiating request with token:",
      token.slice(0, 20) + "..."
    );
    const payload = JSON.parse(atob(token.split(".")[1]));
    console.log("[landlordApi] fetchProperties: Token payload:", payload);
    const response = await makeAuthenticatedRequest(
      "get",
      `/api/landlord/properties`,
      token,
      null,
      {}
    );
    console.log("[landlordApi] fetchProperties: Response data:", response.data);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("[landlordApi] fetchProperties: Error:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Unauthorized: Please log in again");
    }
    throw new Error(
      error.response?.data?.error || "Failed to fetch properties"
    );
  }
};

const fetchAllProperties = async (token = null) => {
  try {
    console.log(
      "[landlordApi] fetchAllProperties: Initiating request",
      token ? `with token: ${token.slice(0, 20)}...` : "without token"
    );
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await axios.get(`/api/properties`, { headers });
    console.log(
      "[landlordApi] fetchAllProperties: Response data:",
      response.data
    );
    const properties = Array.isArray(response.data)
      ? response.data.filter(
          (prop) => prop.status === "Active" || prop.status === "Vacant"
        )
      : [];
    return properties;
  } catch (error) {
    console.error("[landlordApi] fetchAllProperties: Error:", error);
    if (error.response?.status === 401 && token) {
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Unauthorized: Please log in again");
    }
    throw new Error(
      error.response?.data?.error || "Failed to fetch all properties"
    );
  }
};

const addProperty = async (token, formData, onSuccess) => {
  if (!token) throw new Error("No authentication token provided");
  if (!(formData instanceof FormData)) throw new Error("FormData is required");
  try {
    console.log(
      "[landlordApi] addProperty: Initiating request with token:",
      token.slice(0, 20) + "..."
    );
    const payload = JSON.parse(atob(token.split(".")[1]));
    console.log("[landlordApi] addProperty: Token payload:", payload);
    console.log("[landlordApi] addProperty: FormData contents:");
    for (const [key, value] of formData.entries()) {
      console.log(
        `[landlordApi] addProperty: ${key}=${
          value instanceof File ? value.name : value
        }`
      );
    }
    // Validate FormData
    if (!formData.has("property")) {
      throw new Error(
        "FormData must contain 'property' field with JSON string"
      );
    }
    const images = formData.getAll("images[]");
    if (images.length > 0 && !images.every((img) => img instanceof File)) {
      throw new Error("All entries in images[] must be valid files");
    }
    const response = await makeAuthenticatedRequest(
      "post",
      `/api/landlord/properties`,
      token,
      formData,
      {}
    );
    console.log("[landlordApi] addProperty: Response data:", response.data);
    if (onSuccess && typeof onSuccess === "function") {
      await onSuccess();
    }
    return response.data;
  } catch (error) {
    console.error("[landlordApi] addProperty: Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
    });
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Unauthorized: Please log in again");
    }
    if (error.response?.status === 403) {
      console.error(
        "[landlordApi] addProperty: Forbidden - Check role or Content-Type"
      );
      throw new Error("403 Forbidden: Invalid role or content type");
    }
    throw new Error(error.response?.data?.error || "Failed to add property");
  }
};

const updateProperty = async (token, id, formData, onSuccess) => {
  if (!token) throw new Error("No authentication token provided");
  if (!id) throw new Error("Property ID is required");
  if (!(formData instanceof FormData)) throw new Error("FormData is required");
  if (!/^[0-9a-fA-F]{24}$/.test(id) && !id.startsWith("temp-id-")) {
    throw new Error("Invalid property ID format");
  }
  try {
    console.log(
      "[landlordApi] updateProperty: Initiating request with token:",
      token.slice(0, 20) + "...",
      "Property ID:",
      id
    );
    const payload = JSON.parse(atob(token.split(".")[1]));
    console.log("[landlordApi] updateProperty: Token payload:", payload);
    console.log("[landlordApi] updateProperty: FormData contents:");
    for (const [key, value] of formData.entries()) {
      console.log(
        `[landlordApi] updateProperty: ${key}=${
          value instanceof File ? value.name : value
        }`
      );
    }
    if (!formData.has("property")) {
      throw new Error(
        "FormData must contain 'property' field with JSON string"
      );
    }
    const response = await makeAuthenticatedRequest(
      "put",
      `/api/landlord/properties/${id}`,
      token,
      formData,
      {}
    );
    console.log("[landlordApi] updateProperty: Response data:", response.data);
    if (onSuccess && typeof onSuccess === "function") {
      await onSuccess();
    }
    return response.data;
  } catch (error) {
    console.error("[landlordApi] updateProperty: Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
    });
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Unauthorized: Please log in again");
    }
    if (error.response?.status === 403) {
      console.error(
        "[landlordApi] updateProperty: Forbidden - Check role or Content-Type"
      );
      throw new Error("403 Forbidden: Invalid role or content type");
    }
    throw new Error(
      error.response?.data?.message || "Failed to update property"
    );
  }
};

const deleteProperty = async (token, propertyId, onSuccess) => {
  if (!token) throw new Error("No authentication token provided");
  if (!propertyId) throw new Error("Property ID is required");
  try {
    console.log(
      "[landlordApi] deleteProperty: Initiating request with token:",
      token.slice(0, 20) + "..."
    );
    console.log("[landlordApi] deleteProperty: Property ID:", propertyId);
    const response = await makeAuthenticatedRequest(
      "delete",
      `/api/landlord/properties/${propertyId}`,
      token,
      null,
      {}
    );
    console.log("[landlordApi] deleteProperty: Response data:", response.data);
    if (onSuccess && typeof onSuccess === "function") {
      await onSuccess();
    }
    return response.data;
  } catch (error) {
    console.error("[landlordApi] deleteProperty: Error:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Unauthorized: Please log in again");
    }
    throw new Error(error.response?.data?.error || "Failed to delete property");
  }
};

export {
  fetchProperties,
  fetchAllProperties,
  addProperty,
  updateProperty,
  deleteProperty,
};
