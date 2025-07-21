import { useState, useEffect, useCallback } from "react";
import {
  FiMail,
  FiPhone,
  FiHome,
  FiEdit2,
  FiCalendar,
  FiMessageSquare,
  FiAlertCircle,
  FiUser,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDarkMode } from "../../../context/DarkModeContext";
import GlobalSkeleton from "../../../components/GlobalSkeleton";
import Button from "../../../components/Button";
import tenantApi from "../../../api/tenant/tenantApi";

const Profile = () => {
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    preferredContact: "",
    emergencyContact: "",
    role: "",
    createdAt: "",
    profilePic: "",
    fullName: "",
    firstName: "",
    lastName: "",
    customId: "", // New field for custom ID
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editField, setEditField] = useState("");
  const [newValue, setNewValue] = useState("");
  const [validationError, setValidationError] = useState("");
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const calculateProgress = ({
    profilePic,
    username,
    email,
    phone,
    address,
    dateOfBirth,
    preferredContact,
    emergencyContact,
    customId,
  }) =>
    ([
      profilePic,
      username,
      email,
      phone,
      address,
      dateOfBirth,
      preferredContact,
      emergencyContact,
      customId,
    ].filter(Boolean).length /
      9) *
    100;

  const parseDate = (dateValue) => {
    try {
      if (Array.isArray(dateValue)) {
        // Handle array format (e.g., [2025, 5, 10, 7, 34, 47, 225000000])
        const [year, month, day, hour, minute, second, nano] = dateValue;
        return new Date(
          Date.UTC(year, month - 1, day, hour, minute, second, nano / 1000000)
        );
      }
      // Handle ISO 8601 string
      return new Date(dateValue);
    } catch (err) {
      console.error("Failed to parse date:", dateValue, err);
      return new Date(); // Fallback to current date
    }
  };

  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const controller = new AbortController();
      const data = await tenantApi.withRetry(
        tenantApi.fetchProfile,
        [token, controller.signal],
        3,
        2000
      );

      console.log("Profile API response:", data);
      const createdAt = data.createdAt
        ? parseDate(data.createdAt).toISOString()
        : new Date().toISOString();
      const updatedProfile = {
        username: data.username || data.name || "",
        email: data.email || "",
        phone: data.phoneNumber || data.phone || "",
        address: data.address || "",
        dateOfBirth: data.dateOfBirth || "",
        preferredContact: data.preferredContact || "",
        emergencyContact: data.emergencyContact || "",
        role: data.role || "",
        createdAt,
        profilePic: data.profilePic || "",
        fullName: data.fullName || "",
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        customId: data.customId || "", // Include customId
      };
      setProfile(updatedProfile);
      setProfilePicPreview(data.profilePic || null);
      setProgress(calculateProgress(updatedProfile));
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError(
        err.type === "auth"
          ? "Your session appears to be invalid. Please log in again to continue."
          : err.type === "network"
          ? "We’re having trouble connecting. Please check your network and try again."
          : err.type === "server"
          ? "The server is currently unavailable. Please try again later."
          : err.message || "Failed to fetch profile."
      );
      if (err.message.includes("token") || err.message.includes("401")) {
        localStorage.removeItem("token");
        setTimeout(() => {
          navigate("/tenantlogin");
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const saveProfilePicture = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      if (!profilePictureFile) {
        throw new Error("No profile picture file selected.");
      }

      const controller = new AbortController();
      await tenantApi.withRetry(
        tenantApi.updateProfilePicture,
        [token, profilePictureFile, controller.signal],
        3,
        2000
      );

      await fetchProfile();
    } catch (err) {
      console.error("Failed to update profile picture:", err);
      setError(
        err.type === "auth"
          ? "Your session appears to be invalid. Please log in again to continue."
          : err.type === "network"
          ? "We’re having trouble connecting. Please check your network and try again."
          : err.type === "server"
          ? "The server is currently unavailable. Please try again later."
          : err.message || "Failed to update profile picture."
      );
      if (err.message.includes("token") || err.message.includes("401")) {
        localStorage.removeItem("token");
        setTimeout(() => {
          navigate("/tenantlogin");
        }, 2000);
      }
    }
  }, [profilePictureFile, fetchProfile, navigate]);

  const validateInput = (field, value) => {
    if (!value.trim()) {
      return "Field cannot be empty.";
    }
    if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Invalid email format.";
    }
    if (field === "phone" && !/^\+?\d{10,15}$/.test(value.replace(/\s/g, ""))) {
      return "Invalid phone number.";
    }
    if (field === "dateOfBirth") {
      const date = new Date(value);
      if (isNaN(date.getTime()) || date > new Date()) {
        return "Invalid or future date of birth.";
      }
    }
    return "";
  };

  const saveChanges = async () => {
    const validationError = validateInput(editField, newValue);
    if (validationError) {
      setValidationError(validationError);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const updatedProfile = { ...profile, [editField]: newValue };
      const controller = new AbortController();
      await tenantApi.withRetry(
        tenantApi.updateProfile,
        [token, updatedProfile, controller.signal],
        3,
        2000
      );

      await fetchProfile();
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError(
        err.type === "auth"
          ? "Your session appears to be invalid. Please log in again to continue."
          : err.type === "network"
          ? "We’re having trouble connecting. Please check your network and try again."
          : err.type === "server"
          ? "The server is currently unavailable. Please try again later."
          : err.message || "Failed to update profile."
      );
      if (err.message.includes("token") || err.message.includes("401")) {
        localStorage.removeItem("token");
        setTimeout(() => {
          navigate("/tenantlogin");
        }, 2000);
      }
    } finally {
      setIsModalOpen(false);
      setNewValue("");
      setEditField("");
      setValidationError("");
    }
  };

  const handleProfilePicChange = (file) => {
    if (file) {
      setProfilePictureFile(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleProfilePicChange(file);
    } else {
      setError("Please upload a valid image file.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Derive username consistent with landlord profile
  const userName =
    profile?.fullName ||
    `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() ||
    "Tenant";

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profilePictureFile) saveProfilePicture();
    return () => {
      if (profilePicPreview) URL.revokeObjectURL(profilePicPreview);
    };
  }, [profilePictureFile, saveProfilePicture, profilePicPreview]);

  if (loading) {
    return <GlobalSkeleton />;
  }

  if (error) {
    return (
      <div
        className={`flex flex-col items-center justify-center p-4 ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        } w-full min-h-screen overflow-hidden`}
      >
        <div
          className={`p-3 rounded-lg text-center text-sm ${
            darkMode ? "bg-red-900 text-red-300" : "bg-red-100 text-red-700"
          }`}
        >
          {error}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center p-4 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } w-full min-h-screen overflow-hidden`}
    >
      {/* Profile Card */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Left Section: Profile Picture & Completion Progress */}
        <div className="flex flex-col items-center space-y-4">
          <div
            className={`relative w-32 h-32 rounded-full overflow-hidden ${
              isDragging
                ? "border-4 border-dashed border-blue-500"
                : "border-4 border-gray-300"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <img
              src={
                profilePicPreview ||
                `https://api.dicebear.com/7.x/personas/svg?seed=${profile.username}`
              }
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) =>
                (e.target.src = `https://api.dicebear.com/7.x/personas/svg?seed=${profile.username}`)
              }
            />
            {profilePictureFile && (
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
            id="profilePicInput"
            onChange={(e) => handleProfilePicChange(e.target.files[0])}
          />
          <label
            htmlFor="profilePicInput"
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
          <p className="text-xs">{progress.toFixed(0)}% Completed</p>
        </div>

        {/* Right Section: Profile Details */}
        <div className="space-y-4">
          {/* Display Username with Landlord Profile Style */}
          <h1 className="text-xl font-bold text-center">
            <span className={darkMode ? "text-blue-300" : "text-blue-600"}>
              {userName}
            </span>
          </h1>

          {/* Display Profile Fields */}
          {[
            {
              label: "User ID",
              value: profile.customId,
              icon: FiUser,
              field: "customId",
            },
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
              label: "Emergency Contact",
              value: profile.emergencyContact,
              icon: FiAlertCircle,
              field: "emergencyContact",
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
              {field !== "customId" && (
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
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Edit Modal */}
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
                type={
                  editField === "email"
                    ? "email"
                    : editField === "phone" || editField === "emergencyContact"
                    ? "tel"
                    : editField === "dateOfBirth"
                    ? "date"
                    : "text"
                }
                value={newValue}
                onChange={(e) => {
                  setNewValue(e.target.value);
                  setValidationError(validateInput(editField, e.target.value));
                }}
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
                    setNewValue("");
                    setEditField("");
                    setValidationError("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveChanges}
                  disabled={!!validationError || !newValue.trim()}
                >
                  Save
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
