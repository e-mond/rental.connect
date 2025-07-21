import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiMail,
  FiPhone,
  FiHome,
  FiEdit2,
  FiCalendar,
  FiMessageSquare,
  FiBriefcase,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useDarkMode } from "../../../../context/DarkModeContext";
import GlobalSkeleton from "../../../../components/GlobalSkeleton";
import ErrorDisplay from "../../../../components/ErrorDisplay";
import Button from "../../../../components/Button";
import landlordApi from "../../../../api/landlord/landlordApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * Profile Component
 * Displays and manages the landlord's profile, including fetching user details,
 * updating profile fields, and uploading a profile picture.
 */
const Profile = () => {
  // Access dark mode context for theming
  const { darkMode } = useDarkMode();
  // Access query client for invalidating queries after mutations
  const queryClient = useQueryClient();

  // State for modal and editing fields
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls edit modal visibility
  const [editField, setEditField] = useState(""); // Field being edited (e.g., "email")
  const [newValue, setNewValue] = useState(""); // New value for the edited field
  const [validationError, setValidationError] = useState(""); // Validation error message
  const [profilePicPreview, setProfilePicPreview] = useState(null); // Preview URL for profile picture

  // Fetch profile data using React Query
  const {
    data: profile = {
      username: "",
      email: "",
      phone: "",
      address: "",
      dateOfBirth: "",
      preferredContact: "",
      businessName: "",
      role: "",
      createdAt: "",
      profilePic: "",
    },
    error,
    isLoading,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      const response = await landlordApi.fetchProfile(token);
      console.log("[Profile] Raw fetchProfile response:", response); // Debug log
      const createdAt = response.createdAt
        ? new Date(response.createdAt).toISOString()
        : new Date().toISOString();
      // Map response to profile state, providing defaults for missing fields
      return {
        username: response.username || response.name || "", // Avoid using email as username
        email: response.email || "",
        phone: response.phone || "",
        address: response.address || "",
        dateOfBirth: response.dateOfBirth || "",
        preferredContact: response.preferredContact || "",
        businessName: response.businessName || "",
        role: response.role || "",
        createdAt,
        profilePic: response.profilePic || "",
        fullName: response.fullName || "",
        firstName: response.firstName || "",
        lastName: response.lastName || "",
      };
    },
    onSuccess: (data) => {
      console.log("[Profile] Profile data fetched or refetched:", data); // Debug log
      // Set profile picture preview on successful fetch
      setProfilePicPreview(data.profilePic || null);
    },
    onError: (error) => {
      console.error("[Profile] Fetch error:", error);
      toast.error(error.message || "Failed to fetch profile", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    retry: 1, // Retry once on failure
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
  });

  // Mutation for uploading profile picture
  const uploadProfilePicMutation = useMutation({
    mutationFn: async (file) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      return landlordApi.uploadProfilePicture(token, file);
    },
    onSuccess: () => {
      // Invalidate profile query to refetch updated data
      queryClient.invalidateQueries(["profile"]);
      toast.success("Profile picture updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error) => {
      console.error("[Profile] Upload profile picture error:", error);
      toast.error(error.message || "Failed to upload profile picture", {
        position: "top-right",
        autoClose: 3000,
      });
    },
  });

  // Mutation for updating profile fields
  const updateProfileMutation = useMutation({
    mutationFn: async ({ field, value }) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      const response = await landlordApi.updateProfile(token, {
        [field]: value,
      });
      console.log("[Profile] Update response:", response); // Debug log
      return response;
    },
    onSuccess: () => {
      // Invalidate profile query to refetch updated data
      queryClient.invalidateQueries(["profile"]);
      toast.success("Profile updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error) => {
      console.error("[Profile] Update profile error:", error);
      toast.error(error.message || "Failed to update profile", {
        position: "top-right",
        autoClose: 3000,
      });
    },
  });

  /**
   * Validates input for profile fields
   * @param {string} field - The field being validated (e.g., "email")
   * @param {string} value - The value to validate
   * @returns {string} - Error message if validation fails, empty string if valid
   */
  const validateInput = (field, value) => {
    if (!value.trim()) return "This field cannot be empty.";
    if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Invalid email format.";
    if (field === "phone" && !/^\+?\d{10,15}$/.test(value.replace(/\s/g, "")))
      return "Invalid phone number format.";
    if (field === "dateOfBirth") {
      const date = new Date(value);
      if (isNaN(date.getTime()) || date > new Date())
        return "Invalid or future date.";
    }
    return "";
  };

  /**
   * Handles profile picture change and uploads the new image
   * @param {Event} e - The file input change event
   */
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setProfilePicPreview(URL.createObjectURL(file));
      uploadProfilePicMutation.mutate(file);
    } else {
      toast.error("Please upload a valid image file.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  /**
   * Saves changes to the profile field being edited
   */
  const saveChanges = () => {
    const error = validateInput(editField, newValue);
    if (error) {
      setValidationError(error);
      return;
    }
    updateProfileMutation.mutate({ field: editField, value: newValue });
    setIsModalOpen(false);
    setEditField("");
    setNewValue("");
    setValidationError("");
  };

  // Derive username consistent with dashboards, avoiding email
  const userName =
    profile?.fullName ||
    `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() ||
    "Landlord";

  // Calculate profile completion percentage
  const fieldsFilled = Object.values(profile).filter(
    (val) => val && typeof val === "string" && val.trim() !== ""
  ).length;
  const totalFields = 9; // Number of fields excluding profilePic
  const progress = Math.round((fieldsFilled / totalFields) * 100);

  // Render error state
  if (error) {
    return <ErrorDisplay error={error} />;
  }

  // Render loading state
  if (isLoading) {
    return <GlobalSkeleton />;
  }

  return (
    <div
      className={`flex flex-col items-center justify-center p-4 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } w-full min-h-11/12 overflow-hidden`}
    >
      {/* Toast container for notifications */}
      <ToastContainer />

      {/* Profile Card */}
      <motion.div
        layout
        className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Left Section: Profile Picture & Completion Progress */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <img
              src={
                profilePicPreview ||
                `https://api.dicebear.com/7.x/personas/svg?seed=${profile.username}`
              }
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-300"
              onError={(e) =>
                (e.target.src = `https://api.dicebear.com/7.x/personas/svg?seed=${profile.username}`)
              }
            />
            {uploadProfilePicMutation.isLoading && (
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center text-white text-xs">
                Uploading...
              </div>
            )}
          </div>

          {/* File input for uploading profile picture */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="fileInput"
            onChange={handleProfilePicChange}
          />
          <label
            htmlFor="fileInput"
            className="cursor-pointer px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
          >
            Change Picture
          </label>

          {/* Profile Completion Progress Bar */}
          <div className="w-40 bg-gray-300 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs">{progress}% Completed</p>
        </div>

        {/* Right Section: Profile Details */}
        <div className="space-y-4">
          {/* Display Username with Dashboard Style */}
          <h1 className="text-xl font-bold text-center">
            <span className={darkMode ? "text-teal-300" : "text-white"}>
              {userName}
            </span>
          </h1>

          {/* Display Profile Fields */}
          {[
            {
              label: "Email",
              value: profile.email,
              icon: FiMail,
              field: "email",
            },
            {
              label: "Phone",
              value: profile.phone,
              icon: FiPhone,
              field: "phone",
            },
            {
              label: "Address",
              value: profile.address,
              icon: FiHome,
              field: "address",
            },
            {
              label: "Date of Birth",
              value: profile.dateOfBirth,
              icon: FiCalendar,
              field: "dateOfBirth",
            },
            {
              label: "Preferred Contact",
              value: profile.preferredContact,
              icon: FiMessageSquare,
              field: "preferredContact",
            },
            {
              label: "Business Name",
              value: profile.businessName,
              icon: FiBriefcase,
              field: "businessName",
            },
          ].map(({ label, value, icon: Icon, field }) => (
            <div key={field} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Icon className="text-blue-500" />
                <div>
                  <h3 className="font-semibold">{label}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {value || "Not provided"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setEditField(field);
                  setNewValue(value || "");
                  setIsModalOpen(true);
                }}
                className="text-blue-500 hover:text-blue-700"
              >
                <FiEdit2 />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Modal for Editing Profile Fields */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white dark:bg-gray-700 p-6 rounded-xl w-72 space-y-4"
            >
              <h2 className="text-lg font-bold capitalize text-center">
                Edit {editField}
              </h2>

              <input
                type={editField === "dateOfBirth" ? "date" : "text"}
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="w-full border rounded-md p-2 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500"
                placeholder={`Enter new ${editField}`}
              />

              {validationError && (
                <p className="text-xs text-red-500">{validationError}</p>
              )}

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditField("");
                    setNewValue("");
                    setValidationError("");
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={saveChanges}>Save</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
