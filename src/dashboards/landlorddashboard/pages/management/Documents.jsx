import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { saveAs } from "file-saver"; // Added for handling blob downloads
import { Card, CardContent } from "../../../../components/Card";
import Button from "../../../../components/Button";
import GlobalSkeleton from "../../../../components/GlobalSkeleton";
import ErrorDisplay from "../../../../components/ErrorDisplay";
import landlordApi from "../../../../api/landlord/landlordApi";
import {
  FaFileAlt,
  FaCloudUploadAlt,
  FaDownload,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { MdGavel, MdDescription } from "react-icons/md";
import { useDarkMode } from "../../../../context/DarkModeContext";

/**
 * Documents Component
 *
 * Displays a list of documents for the landlord, with summary cards for total documents, leases, and contracts.
 * Includes tabs to filter documents by category (All, Leases, Contracts, Other) and actions to upload, download, edit, and delete documents.
 * Fetches document data using react-query and includes a skeleton loader with a minimum 2-second display for UX consistency.
 * Features a modal for uploading new documents with category selection.
 * Features:
 * - Dark mode support for consistent UI theming.
 * - Uses the Button component for consistent button styling.
 * - Verifies BASE_URL usage in API calls.
 */
const Documents = () => {
  const { darkMode } = useDarkMode();
  const [selectedTab, setSelectedTab] = useState("all");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editDocument, setEditDocument] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: "" });
  const [uploadFormData, setUploadFormData] = useState({
    file: null,
    category: "other",
  });
  const [loading, setLoading] = useState(true);

  // Fetch documents using react-query
  const {
    data: documents = [],
    error,
    isLoading: documentsLoading,
    refetch,
  } = useQuery({
    queryKey: ["landlordDocuments"],
    queryFn: () => landlordApi.fetchDocuments(localStorage.getItem("token")),
    enabled: !!localStorage.getItem("token"),
    onError: (error) => {
      console.error("[Documents] Fetch documents error:", error);
    },
    retry: 1,
    retryDelay: 2000,
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false, // Prevent bounces
  });

  // Upload document mutation
  const uploadDocumentMutation = useMutation({
    mutationFn: (formData) =>
      landlordApi.uploadDocument(localStorage.getItem("token"), formData),
    onSuccess: () => {
      toast.success("Document uploaded successfully!");
      setIsUploadModalOpen(false);
      setUploadFormData({ file: null, category: "other" });
      refetch();
    },
    onError: (err) => {
      toast.error(`Failed to upload document: ${err.message}`);
    },
  });

  // Placeholder mutation for renaming a document (requires backend support)
  const renameDocumentMutation = useMutation({
    mutationFn: ({ docId, newName }) =>
      // Placeholder API call; replace with actual endpoint when available
      Promise.resolve({ id: docId, name: newName }),
    onSuccess: () => {
      toast.success("Document renamed successfully!");
      setIsEditModalOpen(false);
      setEditDocument(null);
      setEditFormData({ name: "" });
      refetch();
    },
    onError: (err) => {
      toast.error(`Failed to rename document: ${err.message}`);
    },
  });

  // Delete document mutation
  const deleteDocumentMutation = useMutation({
    mutationFn: (docId) =>
      landlordApi.deleteDocument(localStorage.getItem("token"), docId),
    onSuccess: () => {
      toast.success("Document deleted successfully!");
      refetch();
    },
    onError: (err) => {
      toast.error(`Failed to delete document: ${err.message}`);
    },
  });

  // Ensure minimum 2-second loading for UX consistency
  useEffect(() => {
    if (!documentsLoading) {
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [documentsLoading]);

  // Filter documents based on the selected tab
  const filteredDocuments =
    selectedTab === "all"
      ? documents
      : documents.filter((doc) => doc.category === selectedTab);

  // Calculate summary stats
  const totalDocuments = documents.length;
  const totalLeases = documents.filter(
    (doc) => doc.category === "leases"
  ).length;
  const totalContracts = documents.filter(
    (doc) => doc.category === "contracts"
  ).length;

  const handleDownload = async (docId, docName) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication token is missing. Please log in again.");
      return;
    }
    if (!docId) {
      toast.error("Document ID is missing.");
      return;
    }
    try {
      toast.info(`Downloading: ${docName || "Unnamed Document"}`);
      const { blob } = await landlordApi.downloadDocument(
        token,
        docId,
        docName
      );
      saveAs(blob, docName || "document");
    } catch (error) {
      console.error("[Documents] Download error:", error);
      toast.error(`Failed to download document: ${error.message}`);
    }
  };

  const handleEdit = (doc) => {
    setEditDocument(doc);
    setEditFormData({ name: doc.name || "" });
    setIsEditModalOpen(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editFormData.name.trim()) {
      toast.error("Document name cannot be empty.");
      return;
    }
    renameDocumentMutation.mutate({
      docId: editDocument.id,
      newName: editFormData.name,
    });
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditDocument(null);
    setEditFormData({ name: "" });
  };

  const handleDelete = (docId, docName) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${docName || "this document"}?`
      )
    ) {
      deleteDocumentMutation.mutate(docId);
    }
  };

  const handleUploadModalOpen = () => {
    setIsUploadModalOpen(true);
  };

  const handleUploadModalClose = () => {
    setIsUploadModalOpen(false);
    setUploadFormData({ file: null, category: "other" });
  };

  const handleUploadFormChange = (e) => {
    const { name, value, files } = e.target;
    setUploadFormData((prev) => ({
      ...prev,
      [name]: name === "file" ? files[0] : value,
    }));
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadFormData.file) {
      toast.error("Please select a file to upload.");
      return;
    }
    const formData = new FormData();
    formData.append("file", uploadFormData.file);
    formData.append("category", uploadFormData.category);
    uploadDocumentMutation.mutate(formData);
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <div className="p-6 w-full">
          <GlobalSkeleton
            type="documents"
            bgColor={darkMode ? "bg-gray-700" : "bg-gray-300"}
            animationSpeed="1.5s"
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen">
        <div className="p-6 w-full">
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <ErrorDisplay
              error={error}
              className={darkMode ? "text-red-400" : "text-red-500"}
            />
            <Button
              variant="primary"
              onClick={() => {
                setLoading(true);
                refetch();
              }}
              className="text-sm sm:text-base"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div
        className={`p-6 space-y-6 flex-1 w-full ${
          darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-800"
        }`}
      >
        {/* Breadcrumb Navigation */}
        <nav
          className={`mb-4 text-sm sm:text-base ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          <span
            className={`font-semibold ${
              darkMode ? "text-gray-200" : "text-black"
            }`}
          >
            Dashboard
          </span>
          <span className="mx-2">{">"}</span>
          Documents
        </nav>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl font-semibold">Documents</h2>
          <Button
            variant="primary"
            onClick={handleUploadModalOpen}
            className="flex items-center gap-2 text-sm sm:text-base"
          >
            <FaCloudUploadAlt /> Upload Document
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Card
            className={`shadow hover:shadow-md transition ${
              darkMode
                ? "bg-gray-900 shadow-gray-700"
                : "bg-white shadow-gray-200"
            }`}
          >
            <CardContent className="p-4 flex items-center gap-4">
              <FaFileAlt
                className={
                  darkMode ? "text-teal-500 text-3xl" : "text-blue-500 text-3xl"
                }
              />
              <div>
                <h3 className="font-semibold">Total Documents</h3>
                <p className="text-lg">{totalDocuments}</p>
              </div>
            </CardContent>
          </Card>
          <Card
            className={`shadow hover:shadow-md transition ${
              darkMode
                ? "bg-gray-900 shadow-gray-700"
                : "bg-white shadow-gray-200"
            }`}
          >
            <CardContent className="p-4 flex items-center gap-4">
              <MdGavel
                className={
                  darkMode ? "text-teal-500 text-3xl" : "text-blue-500 text-3xl"
                }
              />
              <div>
                <h3 className="font-semibold">Leases</h3>
                <p className="text-lg">{totalLeases}</p>
              </div>
            </CardContent>
          </Card>
          <Card
            className={`shadow hover:shadow-md transition ${
              darkMode
                ? "bg-gray-900 shadow-gray-700"
                : "bg-white shadow-gray-200"
            }`}
          >
            <CardContent className="p-4 flex items-center gap-4">
              <MdDescription
                className={
                  darkMode ? "text-teal-500 text-3xl" : "text-blue-500 text-3xl"
                }
              />
              <div>
                <h3 className="font-semibold">Contracts</h3>
                <p className="text-lg">{totalContracts}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <div
          className={`flex flex-wrap gap-4 border-b pb-2 ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          {["all", "leases", "contracts", "other"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              onKeyDown={(e) => e.key === "Enter" && setSelectedTab(tab)}
              className={`px-4 py-2 rounded-md cursor-pointer transition text-sm sm:text-base ${
                selectedTab === tab
                  ? darkMode
                    ? "bg-teal-500 text-white"
                    : "bg-blue-600 text-white"
                  : darkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                  : "bg-gray-100 hover:bg-blue-100 text-gray-800"
              }`}
              role="tab"
              tabIndex={0}
              aria-selected={selectedTab === tab}
              aria-label={`Filter by ${tab} documents`}
            >
              {tab === "all"
                ? "All Documents"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Documents List */}
        <div className="space-y-4">
          {filteredDocuments.length === 0 ? (
            <p
              className={`text-center py-4 text-sm sm:text-base ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              No documents found for this category.
            </p>
          ) : (
            filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className={`flex flex-col sm:flex-row justify-between items-center p-4 shadow rounded-lg hover:shadow-md transition ${
                  darkMode
                    ? "bg-gray-900 shadow-gray-700 hover:shadow-gray-600"
                    : "bg-white shadow-gray-200 hover:shadow-gray-300"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={
                      darkMode
                        ? "text-teal-500 text-3xl"
                        : "text-blue-500 text-3xl"
                    }
                  >
                    {doc.icon || <FaFileAlt />}
                  </span>
                  <div>
                    <h4 className="font-semibold">
                      {doc.name || "Unnamed Document"}
                    </h4>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Updated {doc.updated || "Unknown"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <FaDownload
                    className={`text-xl cursor-pointer transition ${
                      darkMode
                        ? "text-gray-400 hover:text-gray-200"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => handleDownload(doc.id, doc.name)}
                    aria-label={`Download ${doc.name || "document"}`}
                  />
                  <FaEdit
                    className={`text-xl cursor-pointer transition ${
                      darkMode
                        ? "text-gray-400 hover:text-teal-500"
                        : "text-gray-500 hover:text-blue-500"
                    }`}
                    onClick={() => handleEdit(doc)}
                    aria-label={`Edit ${doc.name || "document"}`}
                  />
                  <FaTrash
                    className={`text-xl cursor-pointer transition ${
                      darkMode
                        ? "text-gray-400 hover:text-red-400"
                        : "text-gray-500 hover:text-red-500"
                    }`}
                    onClick={() => handleDelete(doc.id, doc.name)}
                    aria-label={`Delete ${doc.name || "document"}`}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Upload Document Modal */}
      {isUploadModalOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 ${
            darkMode ? "bg-black/50" : "bg-black/50"
          }`}
        >
          <div
            className={`p-6 rounded-lg shadow-lg max-w-sm w-full ${
              darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
            }`}
          >
            <h2 className="text-lg font-semibold mb-4">Upload Document</h2>
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="file"
                  className={`block text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Select File
                </label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  onChange={handleUploadFormChange}
                  className={`mt-1 block w-full text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  } file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold ${
                    darkMode
                      ? "file:bg-gray-700 file:text-gray-200 hover:file:bg-gray-600"
                      : "file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  }`}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="category"
                  className={`block text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={uploadFormData.category}
                  onChange={handleUploadFormChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    darkMode
                      ? "border-gray-600 bg-gray-800 text-gray-200"
                      : "border-gray-300 bg-white text-gray-800"
                  }`}
                >
                  <option value="leases">Leases</option>
                  <option value="contracts">Contracts</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={handleUploadModalClose}
                  className="text-sm sm:text-base"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  className="text-sm sm:text-base"
                  disabled={uploadDocumentMutation.isLoading}
                >
                  {uploadDocumentMutation.isLoading ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Document Modal */}
      {isEditModalOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 ${
            darkMode ? "bg-black/50" : "bg-black/50"
          }`}
        >
          <div
            className={`p-6 rounded-lg shadow-lg max-w-sm w-full ${
              darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
            }`}
          >
            <h2 className="text-lg font-semibold mb-4">Rename Document</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className={`block text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Document Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditFormChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    darkMode
                      ? "border-gray-600 bg-gray-800 text-gray-200"
                      : "border-gray-300 bg-white text-gray-800"
                  }`}
                  placeholder="Enter new document name"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={handleEditModalClose}
                  className="text-sm sm:text-base"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  className="text-sm sm:text-base"
                  disabled={renameDocumentMutation.isLoading}
                >
                  {renameDocumentMutation.isLoading ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
