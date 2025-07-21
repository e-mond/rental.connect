import axios from "axios";

/**
 * Configure axios defaults for production
 */
axios.defaults.timeout = 10000; // 10-second timeout for all requests
axios.defaults.headers.common["Content-Type"] = "application/json"; // Ensure JSON content type

/**
 * List of public endpoints that do not require authentication.
 * Matches JwtAuthorizationFilter.isPublicEndpoint for consistency.
 * @type {string[]}
 */
const PUBLIC_ENDPOINTS = ["/api/properties", "/api/properties/"];

export { PUBLIC_ENDPOINTS };
