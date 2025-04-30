import axios from "axios";

// Base URL for API requests, defaults to localhost if not set in environment variables
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * Utility to check if a JWT token is expired.
 * @param {string} token - The JWT token to validate
 * @returns {boolean} - True if the token is expired, false otherwise
 */
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiration = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expiration;
  } catch (error) {
    console.error("[landlordApi] Error decoding token:", error);
    return true; // Assume expired if decoding fails
  }
};

/**
 * API client for landlord-related endpoints.
 * Provides methods to interact with the backend for properties, dashboard data, leases, transactions, notifications, profile management, maintenance requests, messages, payments, and documents.
 */
const landlordApi = {
  // Expose BASE_URL as baseUrl for components to use (e.g., for constructing image URLs)
  baseUrl: BASE_URL,

  /**
   * Fetches all properties for the authenticated landlord.
   * @param {string} token - The authentication token
   * @returns {Promise<Array>} - List of properties belonging to the landlord
   * @throws {Error} - If the request fails or token is invalid
   */
  fetchProperties: async (token) => {
    if (!token) {
      console.error("[landlordApi] fetchProperties: No token provided");
      throw new Error("No authentication token provided");
    }
    if (isTokenExpired(token)) {
      console.log("[landlordApi] fetchProperties: Token expired");
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Token expired");
    }
    try {
      console.log(
        "[landlordApi] fetchProperties: Initiating request with token:",
        token
      );
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log("[landlordApi] fetchProperties: Token payload:", payload);
      } catch (decodeError) {
        console.error(
          "[landlordApi] fetchProperties: Error decoding token:",
          decodeError
        );
      }

      const response = await axios.get(`${BASE_URL}/api/landlord/properties`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(
        "[landlordApi] fetchProperties: Response data:",
        response.data
      );
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error(
        "[landlordApi] fetchProperties: Error:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        console.log("[landlordApi] fetchProperties: Unauthorized - 401 error");
        localStorage.removeItem("token");
        window.location.href = "/landlordlogin";
        throw new Error("Unauthorized: Please log in again");
      }
      throw new Error(
        error.response?.data?.error || "Failed to fetch properties"
      );
    }
  },

  /**
   * Adds a new property with form data (multipart/form-data).
   * @param {string} token - The authentication token
   * @param {FormData} formData - The form data containing property details and images
   * @param {Function} [onSuccess] - Optional callback to execute on successful addition
   * @returns {Promise<Object>} - The created property
   * @throws {Error} - If the request fails or token is invalid
   */
  addProperty: async (token, formData, onSuccess) => {
    if (!token) {
      console.error("[landlordApi] addProperty: No token provided");
      throw new Error("No authentication token provided");
    }
    if (!(formData instanceof FormData)) {
      console.error("[landlordApi] addProperty: Invalid formData");
      throw new Error("FormData is required for adding a property");
    }
    if (isTokenExpired(token)) {
      console.log("[landlordApi] addProperty: Token expired");
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Token expired");
    }
    try {
      console.log(
        "[landlordApi] addProperty: Initiating request with token:",
        token
      );
      console.log("[landlordApi] addProperty: FormData entries:");
      for (const [key, value] of formData.entries()) {
        console.log(`[landlordApi] addProperty: FormData ${key}:`, value);
      }

      const originalProperty = formData.get("property");
      if (originalProperty) {
        formData.delete("property");
        formData.append(
          "property",
          new Blob([originalProperty], { type: "application/json" })
        );
      }

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log("[landlordApi] addProperty: Token payload:", payload);
      } catch (decodeError) {
        console.error(
          "[landlordApi] addProperty: Error decoding token:",
          decodeError
        );
      }

      const response = await axios.post(
        `${BASE_URL}/api/landlord/properties`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("[landlordApi] addProperty: Response data:", response.data);

      if (onSuccess && typeof onSuccess === "function") {
        console.log("[landlordApi] addProperty: Executing onSuccess callback");
        await onSuccess();
      }

      return response.data;
    } catch (error) {
      console.error(
        "[landlordApi] addProperty: Error:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        console.log("[landlordApi] addProperty: Unauthorized - 401 error");
        localStorage.removeItem("token");
        window.location.href = "/landlordlogin";
        throw new Error("Unauthorized: Please log in again");
      }
      throw new Error(error.response?.data?.error || "Failed to add property");
    }
  },

  /**
   * Updates an existing property by ID with form data.
   * @param {string} token - The authentication token
   * @param {string} id - The ID of the property to update
   * @param {FormData} formData - The form data containing updated property details and images
   * @param {Function} [onSuccess] - Optional callback to execute on successful update
   * @returns {Promise<Object>} - The updated property
   * @throws {Error} - If the request fails or token is invalid
   */
  updateProperty: async (token, id, formData, onSuccess) => {
    if (!token) {
      console.error("[landlordApi] updateProperty: No token provided");
      throw new Error("No authentication token provided");
    }
    if (!id) {
      console.error("[landlordApi] updateProperty: No property ID provided");
      throw new Error("Property ID is required");
    }
    if (!(formData instanceof FormData)) {
      console.error("[landlordApi] updateProperty: Invalid formData");
      throw new Error("FormData is required for updating a property");
    }
    if (isTokenExpired(token)) {
      console.log("[landlordApi] updateProperty: Token expired");
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Token expired");
    }
    try {
      console.log(
        "[landlordApi] updateProperty: Initiating request with token:",
        token
      );
      console.log("[landlordApi] updateProperty: Property ID:", id);
      console.log("[landlordApi] updateProperty: FormData entries:");
      for (const [key, value] of formData.entries()) {
        console.log(`[landlordApi] updateProperty: FormData ${key}:`, value);
      }

      const originalProperty = formData.get("property");
      if (originalProperty) {
        formData.delete("property");
        formData.append(
          "property",
          new Blob([originalProperty], { type: "application/json" })
        );
      }

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log("[landlordApi] updateProperty: Token payload:", payload);
      } catch (decodeError) {
        console.error(
          "[landlordApi] updateProperty: Error decoding token:",
          decodeError
        );
      }

      const response = await axios.patch(
        `${BASE_URL}/api/landlord/properties/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(
        "[landlordApi] updateProperty: Response data:",
        response.data
      );

      if (onSuccess && typeof onSuccess === "function") {
        console.log(
          "[landlordApi] updateProperty: Executing onSuccess callback"
        );
        await onSuccess();
      }

      return response.data;
    } catch (error) {
      console.error(
        "[landlordApi] updateProperty: Error:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        console.log("[landlordApi] updateProperty: Unauthorized - 401 error");
        localStorage.removeItem("token");
        window.location.href = "/landlordlogin";
        throw new Error("Unauthorized: Please log in again");
      }
      throw new Error(
        error.response?.data?.error || "Failed to update property"
      );
    }
  },

  /**
   * Deletes a property by ID.
   * @param {string} token - The authentication token
   * @param {string} propertyId - The ID of the property to delete
   * @param {Function} [onSuccess] - Optional callback to execute on successful deletion
   * @returns {Promise<Object>} - The response data
   * @throws {Error} - If the request fails or token is invalid
   */
  deleteProperty: async (token, propertyId, onSuccess) => {
    if (!token) {
      console.error("[landlordApi] deleteProperty: No token provided");
      throw new Error("No authentication token provided");
    }
    if (!propertyId) {
      console.error("[landlordApi] deleteProperty: No propertyId provided");
      throw new Error("Property ID is required");
    }
    if (isTokenExpired(token)) {
      console.log("[landlordApi] deleteProperty: Token expired");
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Token expired");
    }
    try {
      console.log(
        "[landlordApi] deleteProperty: Initiating request with token:",
        token
      );
      console.log("[landlordApi] deleteProperty: Property ID:", propertyId);

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log("[landlordApi] deleteProperty: Token payload:", payload);
      } catch (decodeError) {
        console.error(
          "[landlordApi] deleteProperty: Error decoding token:",
          decodeError
        );
      }

      const response = await axios.delete(
        `${BASE_URL}/api/landlord/properties/${propertyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(
        "[landlordApi] deleteProperty: Response data:",
        response.data
      );

      if (onSuccess && typeof onSuccess === "function") {
        console.log(
          "[landlordApi] deleteProperty: Executing onSuccess callback"
        );
        await onSuccess();
      }

      return response.data;
    } catch (error) {
      console.error(
        "[landlordApi] deleteProperty: Error:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        console.log("[landlordApi] deleteProperty: Unauthorized - 401 error");
        localStorage.removeItem("token");
        window.location.href = "/landlordlogin";
        throw new Error("Unauthorized: Please log in again");
      }
      throw new Error(
        error.response?.data?.error || "Failed to delete property"
      );
    }
  },

  /**
   * Fetches dashboard data (active rentals, revenue, ratings, issues).
   * Note: Updated to call /api/landlord/dashboard-data to match the renamed endpoint in LandlordController.java.
   * @param {string} token - The authentication token
   * @returns {Promise<Object>} - Dashboard data
   * @throws {Error} - If the request fails or token is invalid
   */
  fetchDashboardData: async (token) => {
    if (!token) {
      console.error("[landlordApi] fetchDashboardData: No token provided");
      throw new Error("No authentication token provided");
    }
    if (isTokenExpired(token)) {
      console.log("[landlordApi] fetchDashboardData: Token expired");
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Token expired");
    }
    try {
      console.log(
        "[landlordApi] fetchDashboardData: Initiating request with token:",
        token
      );
      const response = await axios.get(
        `${BASE_URL}/api/landlord/dashboard-data`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(
        "[landlordApi] fetchDashboardData: Response data:",
        response.data
      );
      return response.data || {};
    } catch (error) {
      console.error(
        "[landlordApi] fetchDashboardData: Error:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        console.log(
          "[landlordApi] fetchDashboardData: Unauthorized - 401 error"
        );
        localStorage.removeItem("token");
        window.location.href = "/landlordlogin";
        throw new Error("Unauthorized: Please log in again");
      }
      throw new Error(
        error.response?.data?.error || "Failed to fetch dashboard data"
      );
    }
  },

  /**
   * Fetches lease data (property, tenant, daysRemaining, rent).
   * @param {string} token - The authentication token
   * @returns {Promise<Array>} - List of leases
   * @throws {Error} - If the request fails or token is invalid
   */
  fetchLeases: async (token) => {
    if (!token) {
      console.error("[landlordApi] fetchLeases: No token provided");
      throw new Error("No authentication token provided");
    }
    if (isTokenExpired(token)) {
      console.log("[landlordApi] fetchLeases: Token expired");
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Token expired");
    }
    try {
      console.log(
        "[landlordApi] fetchLeases: Initiating request with token:",
        token
      );
      const response = await axios.get(`${BASE_URL}/api/landlord/leases`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("[landlordApi] fetchLeases: Response data:", response.data);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error(
        "[landlordApi] fetchLeases: Error:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        console.log("[landlordApi] fetchLeases: Unauthorized - 401 error");
        localStorage.removeItem("token");
        window.location.href = "/landlordlogin";
        throw new Error("Unauthorized: Please log in again");
      }
      throw new Error(error.response?.data?.error || "Failed to fetch leases");
    }
  },

  /**
   * Fetches transaction data (type, tenant, property, amount, date).
   * @param {string} token - The authentication token
   * @returns {Promise<Array>} - List of transactions
   * @throws {Error} - If the request fails or token is invalid
   */
  fetchTransactions: async (token) => {
    if (!token) {
      console.error("[landlordApi] fetchTransactions: No token provided");
      throw new Error("No authentication token provided");
    }
    if (isTokenExpired(token)) {
      console.log("[landlordApi] fetchTransactions: Token expired");
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Token expired");
    }
    try {
      console.log(
        "[landlordApi] fetchTransactions: Initiating request with token:",
        token
      );
      const response = await axios.get(
        `${BASE_URL}/api/landlord/transactions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(
        "[landlordApi] fetchTransactions: Response data:",
        response.data
      );
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error(
        "[landlordApi] fetchTransactions: Error:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        console.log(
          "[landlordApi] fetchTransactions: Unauthorized - 401 error"
        );
        localStorage.removeItem("token");
        window.location.href = "/landlordlogin";
        throw new Error("Unauthorized: Please log in again");
      }
      throw new Error(
        error.response?.data?.error || "Failed to fetch transactions"
      );
    }
  },

  /**
   * Fetches notifications (id, message, createdAt).
   * @param {string} token - The authentication token
   * @returns {Promise<Array>} - List of notifications
   * @throws {Error} - If the request fails or token is invalid
   */
  fetchNotifications: async (token) => {
    if (!token) {
      console.error("[landlordApi] fetchNotifications: No token provided");
      throw new Error("No authentication token provided");
    }
    if (isTokenExpired(token)) {
      console.log("[landlordApi] fetchNotifications: Token expired");
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Token expired");
    }
    try {
      console.log(
        "[landlordApi] fetchNotifications: Initiating request with token:",
        token
      );
      const response = await axios.get(
        `${BASE_URL}/api/landlord/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(
        "[landlordApi] fetchNotifications: Response data:",
        response.data
      );
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error(
        "[landlordApi] fetchNotifications: Error:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        console.log(
          "[landlordApi] fetchNotifications: Unauthorized - 401 error"
        );
        localStorage.removeItem("token");
        window.location.href = "/landlordlogin";
        throw new Error("Unauthorized: Please log in again");
      }
      throw new Error(
        error.response?.data?.error || "Failed to fetch notifications"
      );
    }
  },

  /**
   * Fetches the authenticated landlord's profile.
   * @param {string} token - The authentication token
   * @returns {Promise<Object>} - The profile data
   * @throws {Error} - If the request fails or token is invalid
   */
  fetchProfile: async (token) => {
    if (!token) {
      console.error("[landlordApi] fetchProfile: No token provided");
      throw new Error("No authentication token provided");
    }
    if (isTokenExpired(token)) {
      console.log("[landlordApi] fetchProfile: Token expired");
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Token expired");
    }
    try {
      console.log(
        "[landlordApi] fetchProfile: Initiating request with token:",
        token
      );
      const response = await axios.get(`${BASE_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("[landlordApi] fetchProfile: Response data:", response.data);
      return response.data || {};
    } catch (error) {
      console.error(
        "[landlordApi] fetchProfile: Error:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        console.log("[landlordApi] fetchProfile: Unauthorized - 401 error");
        localStorage.removeItem("token");
        window.location.href = "/landlordlogin";
        throw new Error("Unauthorized: Please log in again");
      }
      throw new Error(error.response?.data?.error || "Failed to fetch profile");
    }
  },

  /**
   * Uploads a profile picture for the authenticated landlord.
   * @param {string} token - The authentication token
   * @param {File} file - The profile picture file to upload
   * @returns {Promise<Object>} - The response data
   * @throws {Error} - If the request fails or token is invalid
   */
  uploadProfilePicture: async (token, file) => {
    if (!token) {
      console.error("[landlordApi] uploadProfilePicture: No token provided");
      throw new Error("No authentication token provided");
    }
    if (isTokenExpired(token)) {
      console.log("[landlordApi] uploadProfilePicture: Token expired");
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Token expired");
    }
    if (!file) {
      console.error("[landlordApi] uploadProfilePicture: No file provided");
      throw new Error("No file provided");
    }
    try {
      console.log(
        "[landlordApi] uploadProfilePicture: Initiating request with token:",
        token
      );
      const formData = new FormData();
      formData.append("profilePic", file);
      const response = await axios.post(
        `${BASE_URL}/api/users/me/picture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(
        "[landlordApi] uploadProfilePicture: Response data:",
        response.data
      );
      return response.data || {};
    } catch (error) {
      console.error(
        "[landlordApi] uploadProfilePicture: Error:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        console.log(
          "[landlordApi] uploadProfilePicture: Unauthorized - 401 error"
        );
        localStorage.removeItem("token");
        window.location.href = "/landlordlogin";
        throw new Error("Unauthorized: Please log in again");
      }
      throw new Error(
        error.response?.data?.error || "Failed to upload profile picture"
      );
    }
  },

  /**
   * Updates the authenticated landlord's profile.
   * @param {string} token - The authentication token
   * @param {Object} updatedData - The updated profile data
   * @returns {Promise<Object>} - The updated profile data
   * @throws {Error} - If the request fails or token is invalid
   */
  updateProfile: async (token, updatedData) => {
    if (!token) {
      console.error("[landlordApi] updateProfile: No token provided");
      throw new Error("No authentication token provided");
    }
    if (isTokenExpired(token)) {
      console.log("[landlordApi] updateProfile: Token expired");
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Token expired");
    }
    if (!updatedData || Object.keys(updatedData).length === 0) {
      console.error("[landlordApi] updateProfile: No updated data provided");
      throw new Error("Updated profile data is required");
    }
    try {
      console.log(
        "[landlordApi] updateProfile: Initiating request with token:",
        token
      );
      console.log("[landlordApi] updateProfile: Updated data:", updatedData);
      const response = await axios.put(
        `${BASE_URL}/api/users/me`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("[landlordApi] updateProfile: Response data:", response.data);
      return response.data || {};
    } catch (error) {
      console.error(
        "[landlordApi] updateProfile: Error:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        console.log("[landlordApi] updateProfile: Unauthorized - 401 error");
        localStorage.removeItem("token");
        window.location.href = "/landlordlogin";
        throw new Error("Unauthorized: Please log in again");
      }
      throw new Error(
        error.response?.data?.error || "Failed to update profile"
      );
    }
  },

  /**
   * Fetches maintenance requests for the authenticated landlord.
   * @param {string} token - The authentication token
   * @returns {Promise<Array>} - List of maintenance requests
   * @throws {Error} - If the request fails or token is invalid
   */
  fetchMaintenanceRequests: async (token) => {
    if (!token) {
      console.error(
        "[landlordApi] fetchMaintenanceRequests: No token provided"
      );
      throw new Error("No authentication token provided");
    }
    if (isTokenExpired(token)) {
      console.log("[landlordApi] fetchMaintenanceRequests: Token expired");
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Token expired");
    }
    try {
      console.log(
        "[landlordApi] fetchMaintenanceRequests: Initiating request with token:",
        token
      );
      const response = await axios.get(`${BASE_URL}/api/landlord/maintenance`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(
        "[landlordApi] fetchMaintenanceRequests: Response data:",
        response.data
      );
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error(
        "[landlordApi] fetchMaintenanceRequests: Error:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        console.log(
          "[landlordApi] fetchMaintenanceRequests: Unauthorized - 401 error"
        );
        localStorage.removeItem("token");
        window.location.href = "/landlordlogin";
        throw new Error("Unauthorized: Please log in again");
      }
      throw new Error(
        error.response?.data?.error || "Failed to fetch maintenance requests"
      );
    }
  },

  /**
   * Fetches messages for the authenticated landlord.
   * @param {string} token - The authentication token
   * @returns {Promise<Array>} - List of messages
   * @throws {Error} - If the request fails or token is invalid
   */
  fetchMessages: async (token) => {
    if (!token) {
      console.error("[landlordApi] fetchMessages: No token provided");
      throw new Error("No authentication token provided");
    }
    if (isTokenExpired(token)) {
      console.log("[landlordApi] fetchMessages: Token expired");
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Token expired");
    }
    try {
      console.log(
        "[landlordApi] fetchMessages: Initiating request with token:",
        token
      );
      const response = await axios.get(`${BASE_URL}/api/landlord/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("[landlordApi] fetchMessages: Response data:", response.data);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error(
        "[landlordApi] fetchMessages: Error:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        console.log("[landlordApi] fetchMessages: Unauthorized - 401 error");
        localStorage.removeItem("token");
        window.location.href = "/landlordlogin";
        throw new Error("Unauthorized: Please log in again");
      }
      throw new Error(
        error.response?.data?.error || "Failed to fetch messages"
      );
    }
  },

  /**
   * Updates the read/unread status of a message.
   * @param {string} token - The authentication token
   * @param {string} messageId - The ID of the message to update
   * @param {boolean} isRead - The new read status (true for read, false for unread)
   * @returns {Promise<Object>} - The updated message data
   * @throws {Error} - If the request fails or token is invalid
   */
  updateMessageStatus: async (token, messageId, isRead) => {
    if (!token) {
      console.error("[landlordApi] updateMessageStatus: No token provided");
      throw new Error("No authentication token provided");
    }
    if (!messageId) {
      console.error("[landlordApi] updateMessageStatus: No messageId provided");
      throw new Error("Message ID is required");
    }
    if (typeof isRead !== "boolean") {
      console.error("[landlordApi] updateMessageStatus: Invalid isRead value");
      throw new Error("isRead must be a boolean");
    }
    if (isTokenExpired(token)) {
      console.log("[landlordApi] updateMessageStatus: Token expired");
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Token expired");
    }
    try {
      console.log(
        "[landlordApi] updateMessageStatus: Initiating request with token:",
        token
      );
      console.log("[landlordApi] updateMessageStatus: Message ID:", messageId);
      console.log("[landlordApi] updateMessageStatus: New status:", isRead);
      const response = await axios.patch(
        `${BASE_URL}/api/landlord/messages/${messageId}`,
        { isRead },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(
        "[landlordApi] updateMessageStatus: Response data:",
        response.data
      );
      return response.data;
    } catch (error) {
      console.error(
        "[landlordApi] updateMessageStatus: Error:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        console.log(
          "[landlordApi] updateMessageStatus: Unauthorized - 401 error"
        );
        localStorage.removeItem("token");
        window.location.href = "/landlordlogin";
        throw new Error("Unauthorized: Please log in again");
      }
      throw new Error(
        error.response?.data?.error || "Failed to update message status"
      );
    }
  },

  /**
   * Sends a new message or reply to a tenant associated with a property.
   * @param {string} token - The authentication token
   * @param {Object} messageData - The message data
   * @param {string} messageData.content - The content of the message
   * @param {string} messageData.recipientId - The ID of the tenant (recipient)
   * @param {string} messageData.propertyId - The ID of the property associated with the message
   * @param {string|null} messageData.replyToId - The ID of the message being replied to (null if not a reply)
   * @returns {Promise<Object>} - The sent message data
   * @throws {Error} - If the request fails or token is invalid
   */
  sendMessage: async (
    token,
    { content, recipientId, propertyId, replyToId }
  ) => {
    if (!token) {
      console.error("[landlordApi] sendMessage: No token provided");
      throw new Error("No authentication token provided");
    }
    if (!content || !recipientId || !propertyId) {
      console.error("[landlordApi] sendMessage: Missing required fields");
      throw new Error("Content, recipientId, and propertyId are required");
    }
    if (isTokenExpired(token)) {
      console.log("[landlordApi] sendMessage: Token expired");
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Token expired");
    }
    try {
      console.log(
        "[landlordApi] sendMessage: Initiating request with token:",
        token
      );
      console.log("[landlordApi] sendMessage: Message content:", content);
      console.log(
        "[landlordApi] sendMessage: Recipient ID (tenant):",
        recipientId
      );
      console.log("[landlordApi] sendMessage: Property ID:", propertyId);
      console.log(
        "[landlordApi] sendMessage: Reply to ID:",
        replyToId || "Not a reply"
      );
      const response = await axios.post(
        `${BASE_URL}/api/landlord/messages`,
        {
          content,
          recipientId, // The tenant's ID
          propertyId,
          replyToId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("[landlordApi] sendMessage: Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "[landlordApi] sendMessage: Error:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        console.log("[landlordApi] sendMessage: Unauthorized - 401 error");
        localStorage.removeItem("token");
        window.location.href = "/landlordlogin";
        throw new Error("Unauthorized: Please log in again");
      }
      throw new Error(error.response?.data?.error || "Failed to send message");
    }
  },

  /**
   * Fetches payments for the authenticated landlord.
   * @param {string} token - The authentication token
   * @returns {Promise<Array>} - List of payments
   * @throws {Error} - If the request fails or token is invalid
   */
  fetchPayments: async (token) => {
    if (!token) {
      console.error("[landlordApi] fetchPayments: No token provided");
      throw new Error("No authentication token provided");
    }
    if (isTokenExpired(token)) {
      console.log("[landlordApi] fetchPayments: Token expired");
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Token expired");
    }
    try {
      console.log(
        "[landlordApi] fetchPayments: Initiating request with token:",
        token
      );
      const response = await axios.get(`${BASE_URL}/api/landlord/payments`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("[landlordApi] fetchPayments: Response data:", response.data);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error(
        "[landlordApi] fetchPayments: Error:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        console.log("[landlordApi] fetchPayments: Unauthorized - 401 error");
        localStorage.removeItem("token");
        window.location.href = "/landlordlogin";
        throw new Error("Unauthorized: Please log in again");
      }
      throw new Error(
        error.response?.data?.error || "Failed to fetch payments"
      );
    }
  },

  /**
   * Records a new payment for the landlord.
   * @param {string} token - The authentication token
   * @param {Object} paymentData - The payment data
   * @param {string} paymentData.name - The name of the tenant
   * @param {string} paymentData.apt - The apartment name
   * @param {number} paymentData.amount - The payment amount in GH₵
   * @param {string} paymentData.date - The payment date (ISO format)
   * @param {string} paymentData.status - The payment status ("Pending", "Completed", "Overdue")
   * @returns {Promise<Object>} - The created payment data
   * @throws {Error} - If the request fails or token is invalid
   */
  recordPayment: async (token, paymentData) => {
    if (!token) {
      console.error("[landlordApi] recordPayment: No token provided");
      throw new Error("No authentication token provided");
    }
    if (
      !paymentData.name ||
      !paymentData.apt ||
      !paymentData.amount ||
      !paymentData.date ||
      !paymentData.status
    ) {
      console.error("[landlordApi] recordPayment: Missing required fields");
      throw new Error(
        "All payment fields (name, apt, amount, date, status) are required"
      );
    }
    if (isNaN(paymentData.amount) || paymentData.amount <= 0) {
      console.error("[landlordApi] recordPayment: Invalid amount");
      throw new Error("Amount must be a positive number");
    }
    if (!["Pending", "Completed", "Overdue"].includes(paymentData.status)) {
      console.error("[landlordApi] recordPayment: Invalid status");
      throw new Error("Status must be one of: Pending, Completed, Overdue");
    }
    if (isTokenExpired(token)) {
      console.log("[landlordApi] recordPayment: Token expired");
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Token expired");
    }
    try {
      console.log(
        "[landlordApi] recordPayment: Initiating request with token:",
        token
      );
      console.log("[landlordApi] recordPayment: Payment data:", paymentData);
      const response = await axios.post(
        `${BASE_URL}/api/landlord/payments`,
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("[landlordApi] recordPayment: Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "[landlordApi] recordPayment: Error:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        console.log("[landlordApi] recordPayment: Unauthorized - 401 error");
        localStorage.removeItem("token");
        window.location.href = "/landlordlogin";
        throw new Error("Unauthorized: Please log in again");
      }
      throw new Error(
        error.response?.data?.error || "Failed to record payment"
      );
    }
  },

  /**
   * Updates an existing payment by ID.
   * @param {string} token - The authentication token
   * @param {string} paymentId - The ID of the payment to update
   * @param {Object} paymentData - The updated payment data
   * @param {string} paymentData.name - The name of the tenant
   * @param {string} paymentData.apt - The apartment name
   * @param {number} paymentData.amount - The payment amount in GH₵
   * @param {string} paymentData.date - The payment date (ISO format)
   * @param {string} paymentData.status - The payment status ("Pending", "Completed", "Overdue")
   * @returns {Promise<Object>} - The updated payment data
   * @throws {Error} - If the request fails or token is invalid
   */
  updatePayment: async (token, paymentId, paymentData) => {
    if (!token) {
      console.error("[landlordApi] updatePayment: No token provided");
      throw new Error("No authentication token provided");
    }
    if (!paymentId) {
      console.error("[landlordApi] updatePayment: No paymentId provided");
      throw new Error("Payment ID is required");
    }
    if (
      !paymentData.name ||
      !paymentData.apt ||
      !paymentData.amount ||
      !paymentData.date ||
      !paymentData.status
    ) {
      console.error("[landlordApi] updatePayment: Missing required fields");
      throw new Error(
        "All payment fields (name, apt, amount, date, status) are required"
      );
    }
    if (isNaN(paymentData.amount) || paymentData.amount <= 0) {
      console.error("[landlordApi] updatePayment: Invalid amount");
      throw new Error("Amount must be a positive number");
    }
    if (!["Pending", "Completed", "Overdue"].includes(paymentData.status)) {
      console.error("[landlordApi] updatePayment: Invalid status");
      throw new Error("Status must be one of: Pending, Completed, Overdue");
    }
    if (isTokenExpired(token)) {
      console.log("[landlordApi] updatePayment: Token expired");
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Token expired");
    }
    try {
      console.log(
        "[landlordApi] updatePayment: Initiating request with token:",
        token
      );
      console.log("[landlordApi] updatePayment: Payment ID:", paymentId);
      console.log("[landlordApi] updatePayment: Payment data:", paymentData);
      const response = await axios.put(
        `${BASE_URL}/api/landlord/payments/${paymentId}`,
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("[landlordApi] updatePayment: Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "[landlordApi] updatePayment: Error:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        console.log("[landlordApi] updatePayment: Unauthorized - 401 error");
        localStorage.removeItem("token");
        window.location.href = "/landlordlogin";
        throw new Error("Unauthorized: Please log in again");
      }
      throw new Error(
        error.response?.data?.error || "Failed to update payment"
      );
    }
  },

  /**
   * Deletes a payment by ID.
   * @param {string} token - The authentication token
   * @param {string} paymentId - The ID of the payment to delete
   * @returns {Promise<Object>} - The response data
   * @throws {Error} - If the request fails or token is invalid
   */
  deletePayment: async (token, paymentId) => {
    if (!token) {
      console.error("[landlordApi] deletePayment: No token provided");
      throw new Error("No authentication token provided");
    }
    if (!paymentId) {
      console.error("[landlordApi] deletePayment: No paymentId provided");
      throw new Error("Payment ID is required");
    }
    if (isTokenExpired(token)) {
      console.log("[landlordApi] deletePayment: Token expired");
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Token expired");
    }
    try {
      console.log(
        "[landlordApi] deletePayment: Initiating request with token:",
        token
      );
      console.log("[landlordApi] deletePayment: Payment ID:", paymentId);
      const response = await axios.delete(
        `${BASE_URL}/api/landlord/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("[landlordApi] deletePayment: Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "[landlordApi] deletePayment: Error:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        console.log("[landlordApi] deletePayment: Unauthorized - 401 error");
        localStorage.removeItem("token");
        window.location.href = "/landlordlogin";
        throw new Error("Unauthorized: Please log in again");
      }
      throw new Error(
        error.response?.data?.error || "Failed to delete payment"
      );
    }
  },

  /**
   * Fetches documents for the authenticated landlord.
   * @param {string} token - The authentication token
   * @returns {Promise<Array>} - List of documents
   * @throws {Error} - If the request fails or token is invalid
   */
  fetchDocuments: async (token) => {
    if (!token) {
      console.error("[landlordApi] fetchDocuments: No token provided");
      throw new Error("No authentication token provided");
    }
    if (isTokenExpired(token)) {
      console.log("[landlordApi] fetchDocuments: Token expired");
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Token expired");
    }
    try {
      console.log(
        "[landlordApi] fetchDocuments: Initiating request with token:",
        token
      );
      const response = await axios.get(`${BASE_URL}/api/landlord/documents`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(
        "[landlordApi] fetchDocuments: Response data:",
        response.data
      );
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error(
        "[landlordApi] fetchDocuments: Error:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        console.log("[landlordApi] fetchDocuments: Unauthorized - 401 error");
        localStorage.removeItem("token");
        window.location.href = "/landlordlogin";
        throw new Error("Unauthorized: Please log in again");
      }
      throw new Error(
        error.response?.data?.error || "Failed to fetch documents"
      );
    }
  },

  /**
   * Uploads a new document for the landlord.
   * @param {string} token - The authentication token
   * @param {FormData} formData - The form data containing the file and category
   * @returns {Promise<Object>} - The uploaded document data
   * @throws {Error} - If the request fails or token is invalid
   */
  uploadDocument: async (token, formData) => {
    if (!token) {
      console.error("[landlordApi] uploadDocument: No token provided");
      throw new Error("No authentication token provided");
    }
    if (!(formData instanceof FormData)) {
      console.error("[landlordApi] uploadDocument: Invalid formData");
      throw new Error("FormData is required for uploading a document");
    }
    if (!formData.get("file")) {
      console.error(
        "[landlordApi] uploadDocument: No file provided in formData"
      );
      throw new Error("A file is required for uploading");
    }
    if (isTokenExpired(token)) {
      console.log("[landlordApi] uploadDocument: Token expired");
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Token expired");
    }
    try {
      console.log(
        "[landlordApi] uploadDocument: Initiating request with token:",
        token
      );
      console.log("[landlordApi] uploadDocument: FormData entries:");
      for (const [key, value] of formData.entries()) {
        console.log(`[landlordApi] uploadDocument: FormData ${key}:`, value);
      }
      const response = await axios.post(
        `${BASE_URL}/api/landlord/documents`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(
        "[landlordApi] uploadDocument: Response data:",
        response.data
      );
      return response.data;
    } catch (error) {
      console.error(
        "[landlordApi] uploadDocument: Error:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        console.log("[landlordApi] uploadDocument: Unauthorized - 401 error");
        localStorage.removeItem("token");
        window.location.href = "/landlordlogin";
        throw new Error("Unauthorized: Please log in again");
      }
      throw new Error(
        error.response?.data?.error || "Failed to upload document"
      );
    }
  },

  /**
   * Renames an existing document by ID.
   * @param {string} token - The authentication token
   * @param {string} docId - The ID of the document to rename
   * @param {string} newName - The new name for the document
   * @returns {Promise<Object>} - The updated document data
   * @throws {Error} - If the request fails or token is invalid
   */
  renameDocument: async (token, docId, newName) => {
    if (!token) {
      console.error("[landlordApi] renameDocument: No token provided");
      throw new Error("No authentication token provided");
    }
    if (!docId) {
      console.error("[landlordApi] renameDocument: No docId provided");
      throw new Error("Document ID is required");
    }
    if (!newName || typeof newName !== "string" || !newName.trim()) {
      console.error("[landlordApi] renameDocument: Invalid newName");
      throw new Error("New name must be a non-empty string");
    }
    if (isTokenExpired(token)) {
      console.log("[landlordApi] renameDocument: Token expired");
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Token expired");
    }
    try {
      console.log(
        "[landlordApi] renameDocument: Initiating request with token:",
        token
      );
      console.log("[landlordApi] renameDocument: Document ID:", docId);
      console.log("[landlordApi] renameDocument: New name:", newName);
      const response = await axios.put(
        `${BASE_URL}/api/landlord/documents/${docId}`,
        { name: newName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(
        "[landlordApi] renameDocument: Response data:",
        response.data
      );
      return response.data;
    } catch (error) {
      console.error(
        "[landlordApi] renameDocument: Error:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        console.log("[landlordApi] renameDocument: Unauthorized - 401 error");
        localStorage.removeItem("token");
        window.location.href = "/landlordlogin";
        throw new Error("Unauthorized: Please log in again");
      }
      throw new Error(
        error.response?.data?.error || "Failed to rename document"
      );
    }
  },

  /**
   * Deletes a document by ID.
   * @param {string} token - The authentication token
   * @param {string} docId - The ID of the document to delete
   * @returns {Promise<Object>} - The response data
   * @throws {Error} - If the request fails or token is invalid
   */
  deleteDocument: async (token, docId) => {
    if (!token) {
      console.error("[landlordApi] deleteDocument: No token provided");
      throw new Error("No authentication token provided");
    }
    if (!docId) {
      console.error("[landlordApi] deleteDocument: No docId provided");
      throw new Error("Document ID is required");
    }
    if (isTokenExpired(token)) {
      console.log("[landlordApi] deleteDocument: Token expired");
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Token expired");
    }
    try {
      console.log(
        "[landlordApi] deleteDocument: Initiating request with token:",
        token
      );
      console.log("[landlordApi] deleteDocument: Document ID:", docId);
      const response = await axios.delete(
        `${BASE_URL}/api/landlord/documents/${docId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(
        "[landlordApi] deleteDocument: Response data:",
        response.data
      );
      return response.data;
    } catch (error) {
      console.error(
        "[landlordApi] deleteDocument: Error:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        console.log("[landlordApi] deleteDocument: Unauthorized - 401 error");
        localStorage.removeItem("token");
        window.location.href = "/landlordlogin";
        throw new Error("Unauthorized: Please log in again");
      }
      throw new Error(
        error.response?.data?.error || "Failed to delete document"
      );
    }
  },
};

export default landlordApi;
