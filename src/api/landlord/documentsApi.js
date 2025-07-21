import { makeAuthenticatedRequest } from "./tokenUtils";

const fetchDocuments = async (token) => {
  if (!token) throw new Error("No authentication token provided");
  try {
    console.log(
      "[landlordApi] fetchDocuments: Initiating request with token:",
      token.slice(0, 20) + "..."
    );
    const response = await makeAuthenticatedRequest(
      "get",
      `/api/landlord/documents`,
      token,
      null,
      {
        "Content-Type": "application/json",
      }
    );
    console.log("[landlordApi] fetchDocuments: Response data:", response.data);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("[landlordApi] fetchDocuments: Error:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Unauthorized: Please log in again");
    }
    throw new Error(error.response?.data?.error || "Failed to fetch documents");
  }
};

const uploadDocument = async (token, formData) => {
  if (!token) throw new Error("No authentication token provided");
  if (!(formData instanceof FormData)) throw new Error("FormData is required");
  const file = formData.get("file");
  if (!file) throw new Error("A file is required for uploading");
  if (!["application/pdf"].includes(file.type)) {
    throw new Error("Only PDF files are allowed");
  }
  try {
    console.log(
      "[landlordApi] uploadDocument: Initiating request with token:",
      token.slice(0, 20) + "..."
    );
    const response = await makeAuthenticatedRequest(
      "post",
      `/api/landlord/documents`,
      token,
      formData,
      {}
    );
    console.log("[landlordApi] uploadDocument: Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("[landlordApi] uploadDocument: Error:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Unauthorized: Please log in again");
    }
    throw new Error(error.response?.data?.error || "Failed to upload document");
  }
};

const renameDocument = async (token, docId, newName) => {
  if (!token) throw new Error("No authentication token provided");
  if (!docId) throw new Error("Document ID is required");
  if (!newName || typeof newName !== "string" || !newName.trim()) {
    throw new Error("New name must be a non-empty string");
  }
  try {
    console.log(
      "[landlordApi] renameDocument: Initiating request with token:",
      token.slice(0, 20) + "..."
    );
    const response = await makeAuthenticatedRequest(
      "put",
      `/api/landlord/documents/${docId}`,
      token,
      { name: newName },
      {
        "Content-Type": "application/json",
      }
    );
    console.log("[landlordApi] renameDocument: Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("[landlordApi] renameDocument: Error:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Unauthorized: Please log in again");
    }
    throw new Error(error.response?.data?.error || "Failed to rename document");
  }
};

const deleteDocument = async (token, docId) => {
  if (!token) throw new Error("No authentication token provided");
  if (!docId) throw new Error("Document ID is required");
  try {
    console.log(
      "[landlordApi] deleteDocument: Initiating request with token:",
      token.slice(0, 20) + "..."
    );
    const response = await makeAuthenticatedRequest(
      "delete",
      `/api/landlord/documents/${docId}`,
      token,
      null,
      {
        "Content-Type": "application/json",
      }
    );
    console.log("[landlordApi] deleteDocument: Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("[landlordApi] deleteDocument: Error:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Unauthorized: Please log in again");
    }
    throw new Error(error.response?.data?.error || "Failed to delete document");
  }
};

const downloadDocument = async (token, docId, fileName) => {
  if (!token) throw new Error("No authentication token provided");
  if (!docId) throw new Error("Document ID is required");
  if (!fileName || typeof fileName !== "string" || !fileName.trim()) {
    throw new Error("File name must be a non-empty string");
  }
  try {
    console.log(
      "[landlordApi] downloadDocument: Initiating request with token:",
      token.slice(0, 20) + "..."
    );
    const response = await makeAuthenticatedRequest(
      "get",
      `/api/landlord/documents/${docId}/download`,
      token,
      null,
      {
        responseType: "blob",
      }
    );
    console.log(
      "[landlordApi] downloadDocument: Response data:",
      response.data
    );
    return { blob: response.data };
  } catch (error) {
    console.error("[landlordApi] downloadDocument: Error:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Unauthorized: Please log in again");
    }
    throw new Error(
      error.response?.data?.error || "Failed to download document"
    );
  }
};

export {
  fetchDocuments,
  uploadDocument,
  renameDocument,
  deleteDocument,
  downloadDocument,
};
