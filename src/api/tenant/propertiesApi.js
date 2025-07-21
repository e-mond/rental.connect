import axios from "axios";
import { BASE_URL } from "../../config";
import { ApiError } from "./ApiError";
import { ensureValidToken } from "./authUtils";
import { normalizeImageUrl } from "./imageUtils";
import { PUBLIC_ENDPOINTS } from "./axiosConfig";

const propertiesApi = {
  /**
   * Fetches all available properties and normalizes image URLs.
   * Supports public access without a token, as per JwtAuthorizationFilter.
   * @param {string} [token] - JWT token for authentication (optional).
   * @param {AbortSignal} [signal] - Signal to abort the request.
   * @param {Object} [queryParams] - Optional query parameters for filtering (e.g., location, priceRange).
   * @returns {Promise<Object[]>} Array of property data with normalized image URLs and detailed fields.
   * @throws {ApiError} If the request fails (e.g., 401, 500).
   */
  fetchProperties: async (token, signal, queryParams = {}) => {
    console.log(
      "[propertiesApi] Starting fetchProperties request to: " +
        `${BASE_URL}/api/properties`
    );
    const config = { signal };
    const endpoint = `${BASE_URL}/api/properties`;
    const isPublic = PUBLIC_ENDPOINTS.some((ep) =>
      endpoint.endsWith(ep.replace("/**", ""))
    );
    console.log(
      "[propertiesApi] Endpoint: " + endpoint + ", Is public: " + isPublic
    );
    try {
      if (!isPublic && token) {
        console.log("[propertiesApi] Token provided, validating token...");
        const validatedToken = await ensureValidToken(token);
        config.headers = { Authorization: `Bearer ${validatedToken}` };
        console.log(
          "[propertiesApi] Authorization header added: Bearer " +
            validatedToken.substring(0, 10) +
            "..."
        );
      } else if (isPublic) {
        console.log(
          "[propertiesApi] Skipping token for public endpoint: " + endpoint
        );
      }
      // Add query parameters if provided
      const params = { ...queryParams };
      config.params = Object.keys(params).length > 0 ? params : undefined;

      const response = await axios.get(endpoint, config);
      console.log(
        "[propertiesApi] Successfully fetched properties, response length: " +
          response.data.length
      );
      const normalizedData = response.data.map((property) => ({
        id: property._id || property.id, // Use _id or id as per backend response
        title: property.title || "Untitled Property",
        price: property.price || 0, // Price in Cedis by default
        priceInCedis: property.price || 0, // Store original price for conversion
        description: property.description || "No description",
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        location: property.location || "Unknown",
        primaryImageUrl: normalizeImageUrl(property.primaryImageUrl),
        amenities: property.amenities || [],
        squareFeet: property.squareFeet || null,
        builtYear: property.builtYear || null,
        availableFrom: property.availableFrom || null,
        utilitiesIncluded: property.utilitiesIncluded || false,
        status: property.status || "Active",
        propertyType: property.propertyType || "Apartment",
      }));
      return normalizedData;
    } catch (error) {
      console.error("[propertiesApi] Error fetching properties:", error);
      if (axios.isCancel(error)) {
        throw new ApiError(
          "Request to fetch properties was cancelled",
          "cancelled"
        );
      }
      if (error.code === "ECONNABORTED") {
        throw new ApiError(
          "Request timed out. Please try again.",
          "network",
          null,
          error.message
        );
      }
      if (error.response) {
        const status = error.response.status;
        const details = error.response.data || "No additional details";
        console.log(
          "[propertiesApi] Server responded with status: " +
            status +
            ", details: " +
            JSON.stringify(details)
        );
        if (status === 401) {
          console.error("[propertiesApi] 401 Unauthorized - Clearing tokens");
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          throw new ApiError(
            "Your session has expired. Please log in again.",
            "auth",
            status,
            details
          );
        } else if (status >= 500) {
          throw new ApiError(
            "The server is currently unavailable. Please try again later.",
            "server",
            status,
            details
          );
        } else {
          throw new ApiError(
            "Failed to fetch properties.",
            "client",
            status,
            details
          );
        }
      }
      throw new ApiError(
        "We’re having trouble connecting. Please check your network and try again.",
        "network",
        null,
        error.message
      );
    }
  },

  /**
   * Fetches details for a specific property by ID.
   * @param {string} token - JWT token for authentication (optional for public endpoint).
   * @param {string|Object} propertyId - The property ID or an object containing the ID.
   * @param {AbortSignal} [signal] - Signal to abort the request.
   * @returns {Promise<Object>} The property data with normalized image URLs.
   * @throws {ApiError} If the request fails (e.g., invalid ID, 404, 500).
   */
  fetchPropertyById: async (propertyId, { signal, token } = {}) => {
    try {
      let id = propertyId;
      let config = { signal };
      if (typeof propertyId === "object" && propertyId !== null) {
        if (propertyId instanceof AbortSignal) {
          throw new ApiError(
            "Invalid property ID: AbortSignal detected, expected property ID string",
            "client"
          );
        }
        id =
          propertyId.id ||
          propertyId.propertyId ||
          Object.values(propertyId)[0];
        console.log("[propertiesApi] Extracted propertyId from object:", id);
      }

      if (!id || typeof id !== "string") {
        console.error(
          "[propertiesApi] Invalid propertyId provided:",
          propertyId
        );
        throw new ApiError(
          "Property ID is required and must be a string",
          "client"
        );
      }

      const endpoint = `${BASE_URL}/api/properties/${id}`;
      const isPublic = PUBLIC_ENDPOINTS.some((ep) =>
        endpoint.startsWith(`${BASE_URL}${ep.replace("/**", "")}`)
      );
      console.log(
        "[propertiesApi] Endpoint:",
        endpoint,
        "Is public:",
        isPublic
      );
      if (!isPublic && token) {
        token = await ensureValidToken(token);
        config.headers = { Authorization: `Bearer ${token}` };
      } else if (isPublic) {
        console.log(
          "[propertiesApi] Skipping token for public endpoint:",
          endpoint
        );
      }

      const { data } = await axios.get(endpoint, config);
      console.log("[propertiesApi] Property fetched successfully:", data);

      return {
        id: data._id || data.id,
        title: data.title || "Untitled Property",
        price: data.price || 0,
        priceInCedis: data.price || 0,
        description: data.description || "No description",
        bedrooms: data.bedrooms || 0,
        bathrooms: data.bathrooms || 0,
        location: data.location || "Unknown",
        primaryImageUrl: normalizeImageUrl(data.primaryImageUrl),
        amenities: data.amenities || [],
        squareFeet: data.squareFeet || null,
        builtYear: data.builtYear || null,
        availableFrom: data.availableFrom || null,
        utilitiesIncluded: data.utilitiesIncluded || false,
        status: data.status || "Active",
        propertyType: data.propertyType || "Apartment",
      };
    } catch (error) {
      console.error("[propertiesApi] Error fetching property by id:", error);
      if (axios.isCancel(error)) {
        throw new ApiError("Request cancelled", "cancelled");
      }
      if (error.code === "ECONNABORTED") {
        throw new ApiError(
          "Request timed out. Please try again.",
          "network",
          null,
          error.message
        );
      }
      if (error.response) {
        const status = error.response.status;
        const details = error.response.data || "No additional details";
        throw new ApiError(
          details.message || "Failed to fetch property",
          "client",
          status,
          details
        );
      }
      throw new ApiError(
        "We’re having trouble connecting. Please check your network and try again.",
        "network",
        null,
        error.message
      );
    }
  },

  /**
   * Fetches leased properties for the tenant.
   * @param {string} token - JWT token for authentication.
   * @param {AbortSignal} [signal] - Signal to abort the request.
   * @returns {Promise<Array>} Array of leased property data.
   * @throws {ApiError} If the request fails (e.g., 401, 500).
   */
  fetchLeasedProperties: async (token, signal) => {
    try {
      token = await ensureValidToken(token);
      console.log(
        "[propertiesApi] Fetching leased properties with token:",
        token.substring(0, 10) + "..."
      );
      const response = await axios.get(
        `${BASE_URL}/api/tenant/leasedProperties`,
        {
          headers: { Authorization: `Bearer ${token}` },
          signal,
        }
      );
      console.log(
        "[propertiesApi] Leased properties fetched successfully:",
        response.data
      );
      return response.data.map((lease) => ({
        ...lease,
        propertyId: lease.propertyId || lease.id,
        tenantName: lease.tenantName || "Unknown Tenant",
        startDate: lease.startDate || null,
        endDate: lease.endDate || null,
        status: lease.status || "Active",
      }));
    } catch (error) {
      if (axios.isCancel(error)) {
        throw new ApiError(
          "Request to fetch leased properties was cancelled",
          "cancelled"
        );
      }
      if (error.code === "ECONNABORTED") {
        throw new ApiError(
          "Request timed out. Please try again.",
          "network",
          null,
          error.message
        );
      }
      if (error.response) {
        const status = error.response.status;
        const details = error.response.data || "No additional details";
        if (status === 401) {
          console.error("[propertiesApi] 401 Unauthorized - Clearing tokens");
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          throw new ApiError(
            "Your session has expired. Please log in again.",
            "auth",
            status,
            details
          );
        } else if (status >= 500) {
          throw new ApiError(
            "The server is currently unavailable. Please try again later.",
            "server",
            status,
            details
          );
        } else {
          throw new ApiError(
            "Failed to fetch leased properties.",
            "client",
            status,
            details
          );
        }
      }
      throw new ApiError(
        "We’re having trouble connecting. Please check your network and try again.",
        "network",
        null,
        error.message
      );
    }
  },
};

export default propertiesApi;
