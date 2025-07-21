import axios from "axios";
import { BASE_URL } from "../../config";
import { ApiError } from "./ApiError";
import { ensureValidToken } from "./authUtils";

const profileApi = {
  /**
   * Fetches the tenant's profile data.
   * @param {string} token - JWT token for authentication.
   * @param {AbortSignal} signal - Signal to abort the request.
   * @returns {Promise<Object>} The tenant's profile data.
   * @throws {ApiError} If the request fails (e.g., 401, 500, network issues).
   */
  fetchProfile: async (token, signal) => {
    try {
      token = await ensureValidToken(token);
      console.log(
        "[profileApi] Fetching profile with token:",
        token.substring(0, 10) + "..."
      );
      const { data } = await axios.get(`${BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      console.log("[profileApi] Profile fetched successfully:", data);
      return data;
    } catch (error) {
      if (axios.isCancel(error)) {
        throw new ApiError(
          "Request to fetch profile was cancelled",
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
          console.error("[profileApi] 401 Unauthorized - Clearing tokens");
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
            "Failed to fetch profile.",
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
   * Updates the tenant's profile picture.
   * @param {string} token - JWT token for authentication.
   * @param {File} profilePic - The profile picture file to upload.
   * @param {AbortSignal} signal - Signal to abort the request.
   * @returns {Promise<void>} Resolves when the profile picture is updated.
   * @throws {ApiError} If the request fails (e.g., invalid file, 401, 403).
   */
  updateProfilePicture: async (token, profilePic, signal) => {
    try {
      token = await ensureValidToken(token);
      if (!(profilePic instanceof File)) {
        throw new ApiError("Profile picture must be a valid file", "client");
      }
      console.log("[profileApi] Uploading profile picture:", profilePic.name);
      const formData = new FormData();
      formData.append("profilePic", profilePic);
      await axios.post(`${BASE_URL}/api/users/me/picture`, formData, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      console.log("[profileApi] Profile picture updated successfully");
    } catch (error) {
      if (axios.isCancel(error)) {
        throw new ApiError(
          "Request to update profile picture was cancelled",
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
          console.error("[profileApi] 401 Unauthorized - Clearing tokens");
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          throw new ApiError(
            "Your session has expired. Please log in again.",
            "auth",
            status,
            details
          );
        } else if (status === 403) {
          throw new ApiError(
            "You are not authorized to update your profile picture.",
            "client",
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
            "Failed to update profile picture.",
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
   * Updates the tenant's profile data.
   * @param {string} token - JWT token for authentication.
   * @param {Object} profileData - The updated profile data (e.g., name, email).
   * @param {AbortSignal} signal - Signal to abort the request.
   * @returns {Promise<void>} Resolves when the profile is updated.
   * @throws {ApiError} If the request fails (e.g., invalid data, 401, 403).
   */
  updateProfile: async (token, profileData, signal) => {
    try {
      token = await ensureValidToken(token);
      if (!profileData || typeof profileData !== "object") {
        throw new ApiError(
          "Profile data is required and must be an object",
          "client"
        );
      }
      console.log("[profileApi] Updating profile with data:", profileData);
      await axios.put(`${BASE_URL}/api/users/me`, profileData, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      console.log("[profileApi] Profile updated successfully");
    } catch (error) {
      if (axios.isCancel(error)) {
        throw new ApiError(
          "Request to update profile was cancelled",
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
          console.error("[profileApi] 401 Unauthorized - Clearing tokens");
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          throw new ApiError(
            "Your session has expired. Please log in again.",
            "auth",
            status,
            details
          );
        } else if (status === 403) {
          throw new ApiError(
            "You are not authorized to update your profile.",
            "client",
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
            "Failed to update profile.",
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
   * Updates the tenant's password.
   * @param {string} token - JWT token for authentication.
   * @param {Object} passwordData - Password data (e.g., { currentPassword, newPassword }).
   * @param {AbortSignal} signal - Signal to abort the request.
   * @returns {Promise<void>} Resolves when the password is updated.
   * @throws {ApiError} If the request fails.
   */
  updatePassword: async (token, passwordData, signal) => {
    try {
      token = await ensureValidToken(token);
      if (!passwordData || typeof passwordData !== "object") {
        throw new ApiError(
          "Password data is required and must be an object",
          "client"
        );
      }
      const { currentPassword, newPassword } = passwordData;
      if (!currentPassword || !newPassword) {
        throw new ApiError(
          "Current password and new password are required",
          "client"
        );
      }
      await axios.put(`${BASE_URL}/api/users/me/password`, passwordData, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      console.log("[profileApi] Password updated successfully");
    } catch (error) {
      if (axios.isCancel(error)) {
        throw new ApiError(
          "Request to update password was cancelled",
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
          throw new ApiError(
            "Your session has expired. Please log in again.",
            "auth",
            status,
            details
          );
        } else if (status === 403) {
          throw new ApiError(
            "You are not authorized to update your password.",
            "client",
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
            "Failed to update password.",
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
   * Updates the tenant's notification preferences.
   * @param {string} token - JWT token for authentication.
   * @param {Object} notificationsData - The notifications data (e.g., { emailNotifications, appNotifications, smsNotifications }).
   * @param {AbortSignal} signal - Signal to abort the request.
   * @returns {Promise<void>} Resolves when the preferences are updated.
   * @throws {ApiError} If the request fails.
   */
  updateNotifications: async (token, notificationsData, signal) => {
    try {
      token = await ensureValidToken(token);
      if (!notificationsData || typeof notificationsData !== "object") {
        throw new ApiError(
          "Notifications data is required and must be an object",
          "client"
        );
      }
      const { emailNotifications, appNotifications, smsNotifications } =
        notificationsData;
      if (
        typeof emailNotifications !== "boolean" ||
        typeof appNotifications !== "boolean" ||
        typeof smsNotifications !== "boolean"
      ) {
        throw new ApiError(
          "Notification preferences must be boolean values",
          "client"
        );
      }
      await axios.patch(
        `${BASE_URL}/api/users/me/notifications`,
        notificationsData,
        {
          headers: { Authorization: `Bearer ${token}` },
          signal,
        }
      );
      console.log("[profileApi] Notification preferences updated successfully");
    } catch (error) {
      if (axios.isCancel(error)) {
        throw new ApiError(
          "Request to update notifications was cancelled",
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
          throw new ApiError(
            "Your session has expired. Please log in again.",
            "auth",
            status,
            details
          );
        } else if (status === 403) {
          throw new ApiError(
            "You are not authorized to update notification preferences.",
            "client",
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
            "Failed to update notification preferences.",
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

export default profileApi;
