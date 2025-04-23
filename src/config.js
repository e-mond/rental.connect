// src/config.js

/**
 * Configuration file for front-end settings and environment-specific variables.
 * Centralizes API endpoints, default values, and timeouts for easy management.
 */

/**
 * Base URL for the API.
 * This should match the backend API base URL.
 * Update this value during deployment.
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
console.log("Base URL configured:", BASE_URL); // Debug log

export { BASE_URL };

/**
 * Base URL for tenant dashboard routes.
 * Used to manage navigation within the tenant dashboard section of the app.
 */
export const DASHBOARD_BASE_URL = "/dashboard";

/**
 * Default timeout duration for API requests in milliseconds.
 * Helps avoid hanging requests by setting a maximum wait time.
 */
export const API_TIMEOUT = 5000;

/**
 * Default profile picture URL for users who haven't uploaded a custom profile picture.
 * Used to provide a consistent placeholder across the app.
 */
export const DEFAULT_PROFILE_PIC = "https://via.placeholder.com/150";

/**
 * Environment-specific settings (Optional).
 * Uncomment and configure as needed for differentiating between development and production environments.
 */
// const isProduction = process.env.NODE_ENV === "production";
// export const ENVIRONMENT = isProduction ? "production" : "development";
