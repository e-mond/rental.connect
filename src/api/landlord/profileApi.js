import { makeAuthenticatedRequest } from "./tokenUtils";

const fetchProfile = async (token) => {
  if (!token) throw new Error("No authentication token provided");
  try {
    console.log(
      "[landlordApi] fetchProfile: Initiating request with token:",
      token.slice(0, 20) + "..."
    );
    const response = await makeAuthenticatedRequest(
      "get",
      `/api/users/me`,
      token,
      null,
      {
        "Content-Type": "application/json",
      }
    );
    console.log("[landlordApi] fetchProfile: Response data:", response.data);
    return response.data || {};
  } catch (error) {
    console.error("[landlordApi] fetchProfile: Error:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Unauthorized: Please log in again");
    }
    throw new Error(error.response?.data?.error || "Failed to fetch profile");
  }
};

const uploadProfilePicture = async (token, file) => {
  if (!token) throw new Error("No authentication token provided");
  if (!file) throw new Error("No file provided");
  try {
    console.log(
      "[landlordApi] uploadProfilePicture: Initiating request with token:",
      token.slice(0, 20) + "..."
    );
    const formData = new FormData();
    formData.append("profilePic", file);
    const response = await makeAuthenticatedRequest(
      "post",
      `/api/users/me/picture`,
      token,
      formData,
      {}
    );
    console.log(
      "[landlordApi] uploadProfilePicture: Response data:",
      response.data
    );
    return response.data;
  } catch (error) {
    console.error("[landlordApi] uploadProfilePicture: Error:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Unauthorized: Please log in again");
    }
    throw new Error(
      error.response?.data?.error || "Failed to upload profile picture"
    );
  }
};

const updateProfile = async (token, updatedData) => {
  if (!token) throw new Error("No authentication token provided");
  if (!updatedData || Object.keys(updatedData).length === 0) {
    throw new Error("Updated profile data is required");
  }
  try {
    console.log(
      "[landlordApi] updateProfile: Initiating request with token:",
      token.slice(0, 20) + "..."
    );
    const response = await makeAuthenticatedRequest(
      "put",
      `/api/users/me`,
      token,
      updatedData,
      {
        "Content-Type": "application/json",
      }
    );
    console.log("[landlordApi] updateProfile: Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("[landlordApi] updateProfile: Error:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Unauthorized: Please log in again");
    }
    throw new Error(error.response?.data?.error || "Failed to update profile");
  }
};

const fetchPublicKey = async (token, userId) => {
  if (!token) throw new Error("No authentication token provided");
  if (!userId) throw new Error("User ID is required");
  try {
    console.log(
      "[landlordApi] fetchPublicKey: Initiating request with token:",
      token.slice(0, 20) + "..."
    );
    const response = await makeAuthenticatedRequest(
      "get",
      `/api/users/${userId}/public-key`,
      token,
      null,
      {
        "Content-Type": "application/json",
      }
    );
    console.log("[landlordApi] fetchPublicKey: Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("[landlordApi] fetchPublicKey: Error:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Unauthorized: Please log in again");
    }
    throw new Error(
      error.response?.data?.error || "Failed to fetch public key"
    );
  }
};

const savePublicKey = async (token, publicKey) => {
  if (!token) throw new Error("No authentication token provided");
  if (!publicKey || typeof publicKey !== "string" || !publicKey.trim()) {
    throw new Error("Public key must be a non-empty string");
  }
  try {
    console.log(
      "[landlordApi] savePublicKey: Initiating request with token:",
      token.slice(0, 20) + "..."
    );
    const response = await makeAuthenticatedRequest(
      "put",
      `/api/users/me`,
      token,
      { publicKey },
      {
        "Content-Type": "application/json",
      }
    );
    console.log("[landlordApi] savePublicKey: Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("[landlordApi] savePublicKey: Error:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Unauthorized: Please log in again");
    }
    throw new Error(error.response?.data?.error || "Failed to save public key");
  }
};

export {
  fetchProfile,
  uploadProfilePicture,
  updateProfile,
  fetchPublicKey,
  savePublicKey,
};
