import axios from "axios";
import { BASE_URL } from "../../config";
import { ApiError } from "./ApiError";

/**
 * Decodes a JWT token to extract its payload.
 * @param {string} token - The JWT token to decode.
 * @returns {Object|null} The decoded payload, or null if decoding fails.
 */
const decodeToken = (token) => {
  try {
    // Validate token format
    if (!token || typeof token !== "string" || !token.includes(".")) {
      console.warn("[authUtils] Invalid token format:", token);
      return null;
    }
    // Extract and decode payload
    const base64Url = token.split(".")[1];
    if (!base64Url) {
      console.warn("[authUtils] No payload found in token:", token);
      return null;
    }
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);
    console.debug("[authUtils] Decoded token payload:", payload);
    return payload;
  } catch (error) {
    console.error("[authUtils] Failed to decode token:", error.message);
    return null;
  }
};

/**
 * Refreshes the JWT token using a refresh token stored in localStorage.
 * @returns {Promise<string>} The new access token.
 * @throws {ApiError} If the refresh fails or no refresh token is found.
 */
const refreshToken = async () => {
  try {
    // Retrieve refresh token
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      console.error("[authUtils] No refresh token found in localStorage");
      throw new ApiError(
        "No refresh token available. Please log in again.",
        "auth"
      );
    }
    console.log("[authUtils] Attempting to refresh token...");
    // Make refresh request
    const response = await axios.post(`${BASE_URL}/api/auth/refresh-token`, {
      refreshToken,
    });
    const newAccessToken = response.data.accessToken;
    console.log(
      "[authUtils] Token refreshed successfully:",
      newAccessToken.substring(0, 10) + "..."
    );
    // Store new access token
    localStorage.setItem("token", newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error("[authUtils] Refresh token failed:", error);
    // Clear tokens on failure
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    throw new ApiError(
      "Failed to refresh token. Please log in again.",
      "auth",
      error.response?.status,
      error.response?.data
    );
  }
};

/**
 * Ensures the JWT token is valid, refreshing it if expired.
 * @param {string} token - The current access token.
 * @returns {Promise<string>} A valid access token.
 * @throws {ApiError} If the token is invalid or cannot be refreshed.
 */
const ensureValidToken = async (token) => {
  // Validate token input
  if (!token || typeof token !== "string") {
    console.error("[authUtils] Invalid token provided:", token);
    throw new ApiError(
      "Authentication token is required and must be a string",
      "auth"
    );
  }
  // Decode token to check expiration
  const decodedToken = decodeToken(token);
  if (decodedToken && decodedToken.exp) {
    const expirationDate = new Date(decodedToken.exp * 1000);
    if (expirationDate < new Date()) {
      console.log("[authUtils] Token expired, attempting to refresh...");
      return await refreshToken();
    } else {
      console.log(
        "[authUtils] Token is still valid, expires at:",
        expirationDate
      );
    }
  } else {
    console.warn(
      "[authUtils] Token could not be decoded or has no expiration:",
      decodedToken
    );
  }
  return token;
};

export { decodeToken, refreshToken, ensureValidToken };
