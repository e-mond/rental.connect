import axios from "axios";

/**
 * Base API URL for property-related operations.
 * Adjust this if your `BASE_URL` configuration differs.
 */
const API_URL = "http://localhost:8080/api/properties";

/**
 * Creates an instance of Axios with pre-configured settings.
 * - `baseURL`: Base URL for API requests.
 * - `headers`: Default headers for all requests made with this instance.
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Fetches a list of properties associated with a specific landlord.
 *
 * @param {string} landlordId - The unique ID of the landlord.
 * @param {string} token - JWT token used for authentication.
 * @returns {Promise<Array>} - A promise that resolves to an array of property objects.
 * @throws {Error} - If the request fails, an error is thrown with a relevant message.
 *
 * Example Usage:
 * ```javascript
 * try {
 *   const properties = await fetchPropertiesByLandlord("landlord123", userToken);
 *   console.log(properties);
 * } catch (error) {
 *   console.error(error.message);
 * }
 * ```
 */
export const fetchPropertiesByLandlord = async (landlordId, token) => {
  try {
    const response = await api.get(`/landlord/${landlordId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include JWT token for secure access
      },
    });
    return response.data; // Returns the array of properties
  } catch (error) {
    console.error("Error fetching properties by landlord:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch properties. Please try again later."
    );
  }
};
