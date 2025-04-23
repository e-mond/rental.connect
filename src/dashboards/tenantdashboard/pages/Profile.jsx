import { useState, useEffect, useCallback } from "react";
import {
  FiMail,
  FiPhone,
  FiHome,
  FiUpload,
  FiEdit2,
  FiCalendar,
  FiMessageSquare,
  FiAlertCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../../../context/DarkModeContext";
import GlobalSkeleton from "../../../components/GlobalSkeleton";
import Button from "../../../components/Button";
import { BASE_URL } from "../../../config";

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
    ].filter(Boolean).length /
      8) *
    100;

  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const response = await fetch(`${BASE_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch profile: ${errorText || "Unknown error"} (HTTP ${
            response.status
          })`
        );
      }

      const data = await response.json();
      console.log("Profile API response:", data);
      const createdAt = data.createdAt
        ? new Date(data.createdAt).toISOString()
        : new Date().toISOString();
      const updatedProfile = {
        username: data.username || data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        dateOfBirth: data.dateOfBirth || "",
        preferredContact: data.preferredContact || "",
        emergencyContact: data.emergencyContact || "",
        role: data.role || "",
        createdAt,
        profilePic: data.profilePic || "",
      };
      setProfile(updatedProfile);
      setProfilePicPreview(data.profilePic || null);
      setProgress(calculateProgress(updatedProfile));
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError(err.message);
      if (err.message.includes("token") || err.message.includes("401")) {
        navigate("/tenantlogin");
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

      const formData = new FormData();
      formData.append("profilePic", profilePictureFile);

      const response = await fetch(`${BASE_URL}/api/users/me/picture`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to upload profile picture: ${
            errorText || "Unknown error"
          } (HTTP ${response.status})`
        );
      }

      await fetchProfile();
    } catch (err) {
      console.error("Failed to update profile picture:", err);
      setError(err.message);
      if (err.message.includes("token") || err.message.includes("401")) {
        navigate("/tenantlogin");
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
      const response = await fetch(`${BASE_URL}/api/users/me`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProfile),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to update profile: ${errorText || "Unknown error"} (HTTP ${
            response.status
          })`
        );
      }

      await fetchProfile();
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError(err.message);
      if (err.message.includes("token") || err.message.includes("401")) {
        navigate("/tenantlogin");
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
    return (
      <div
        className={`max-w-2xl mx-auto p-4 sm:p-6 ${
          darkMode ? "bg-gray-800" : "bg-gray-100"
        } min-h-screen lg:max-w-6xl`}
      >
        <div
          className={`animate-pulse ${
            darkMode ? "bg-gray-700" : "bg-gray-300"
          } h-8 w-1/4 rounded mb-6 mx-auto sm:mx-0`}
        />
        <GlobalSkeleton
          type="profile-header"
          bgColor={darkMode ? "bg-gray-700" : "bg-gray-300"}
          animationSpeed="1.2s"
        />
        <div
          className={`${
            darkMode ? "bg-gray-900" : "bg-white"
          } mt-6 p-4 rounded-lg shadow-md`}
        >
          <GlobalSkeleton
            type="profile-info"
            bgColor={darkMode ? "bg-gray-700" : "bg-gray-300"}
            animationSpeed="1.2s"
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`max-w-2xl mx-auto p-4 sm:p-6 ${
          darkMode ? "bg-gray-800" : "bg-gray-100"
        } min-h-screen lg:max-w-6xl`}
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
      className={`w-lvh mx-auto p-4 sm:p-6 ${
        darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-900"
      } min-h-screen`}
    >
      <h1 className="text-2xl font-bold mb-6 text-center sm:text-left lg:text-3xl animate-fade-in">
        My Profile
      </h1>

      {/* Profile Header */}
      <div
        className={`p-4 sm:p-6 rounded-lg shadow-md mb-6 ${
          darkMode ? "bg-gray-900 shadow-gray-700" : "bg-white shadow-gray-200"
        } animate-slide-up`}
      >
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div
            className={`relative group w-32 h-32 lg:w-36 lg:h-36 ${
              isDragging ? "border-2 border-dashed border-blue-500" : ""
            } rounded-full overflow-hidden`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <img
              src={
                profilePicPreview || "https://placehold.co/96x96?text=No+Pic"
              }
              alt="Profile"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div
              className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
                isDragging || profilePicPreview
                  ? "opacity-0"
                  : "opacity-100 group-hover:opacity-100"
              }`}
            >
              <FiUpload
                className={`cursor-pointer text-2xl ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                } hover:text-blue-500`}
                onClick={() =>
                  document.getElementById("profilePicInput").click()
                }
                aria-label="Upload profile picture"
              />
            </div>
            <input
              type="file"
              id="profilePicInput"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleProfilePicChange(e.target.files[0])}
            />
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-semibold lg:text-2xl">
              {profile.username || "Unnamed Tenant"}
            </h2>
            <p className="lg:text-lg capitalize">{profile.role || "Tenant"}</p>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              } lg:text-base`}
            >
              Member since: {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="mt-6">
          <div
            className={`relative h-3 w-full rounded-full ${
              darkMode ? "bg-gray-700" : "bg-gray-200"
            }`}
          >
            <div
              className={`absolute left-0 top-0 h-3 rounded-full bg-gradient-to-r ${
                darkMode
                  ? "from-blue-500 to-blue-700"
                  : "from-blue-600 to-blue-800"
              } transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p
            className={`mt-1 text-center text-sm font-medium ${
              darkMode ? "text-gray-400" : "text-gray-600"
            } lg:text-base`}
          >
            {progress === 100
              ? "Profile Complete 🎉"
              : `${progress.toFixed(0)}% completed`}
          </p>
        </div>
      </div>

      {/* Personal Information */}
      <div
        className={`p-4 sm:p-6 rounded-lg shadow-md ${
          darkMode ? "bg-gray-900 shadow-gray-700" : "bg-white shadow-gray-200"
        } animate-slide-up delay-100`}
      >
        <h2 className="text-lg font-bold mb-4 lg:text-xl">
          Personal Information
        </h2>
        <div className="space-y-4">
          {[
            { field: "username", label: "Username", icon: null },
            {
              field: "email",
              label: "Email",
              icon: <FiMail className="w-5 h-5" />,
            },
            {
              field: "phone",
              label: "Phone",
              icon: <FiPhone className="w-5 h-5" />,
            },
            {
              field: "address",
              label: "Address",
              icon: <FiHome className="w-5 h-5" />,
            },
            {
              field: "dateOfBirth",
              label: "Date of Birth",
              icon: <FiCalendar className="w-5 h-5" />,
            },
            {
              field: "preferredContact",
              label: "Preferred Contact",
              icon: <FiMessageSquare className="w-5 h-5" />,
            },
            {
              field: "emergencyContact",
              label: "Emergency Contact",
              icon: <FiAlertCircle className="w-5 h-5" />,
            },
          ].map(({ field, label, icon }) => (
            <div
              key={field}
              className="flex items-center justify-between gap-4"
            >
              <div
                className={`flex items-center gap-3 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {icon}
                <span className="text-sm lg:text-base">
                  {profile[field] ||
                    (field === "preferredContact" ||
                    field === "emergencyContact"
                      ? "Not specified"
                      : `No ${label} set`)}
                </span>
              </div>
              <FiEdit2
                className={`cursor-pointer text-xl ${
                  darkMode
                    ? "text-blue-400 hover:text-blue-300"
                    : "text-blue-600 hover:text-blue-700"
                } transition-colors duration-200`}
                onClick={() => {
                  setEditField(field);
                  setNewValue(profile[field] || "");
                  setIsModalOpen(true);
                }}
                aria-label={`Edit ${label}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
          <div
            className={`w-11/12 sm:w-96 rounded-lg p-6 sm:p-8 shadow-lg ${
              darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-900"
            } animate-scale-in`}
          >
            <h2 className="text-lg font-bold mb-4">
              Edit {editField.charAt(0).toUpperCase() + editField.slice(1)}
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
              className={`w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                darkMode
                  ? "bg-gray-800 border-gray-600 text-gray-200"
                  : "bg-white border-gray-300 text-gray-900"
              } ${validationError ? "border-red-500" : ""}`}
              value={newValue}
              onChange={(e) => {
                setNewValue(e.target.value);
                setValidationError(validateInput(editField, e.target.value));
              }}
              required
            />
            {validationError && (
              <p
                className={`mt-2 text-xs ${
                  darkMode ? "text-red-400" : "text-red-500"
                }`}
              >
                {validationError}
              </p>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsModalOpen(false);
                  setNewValue("");
                  setEditField("");
                  setValidationError("");
                }}
                className="text-sm"
                aria-label="Cancel edit"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={saveChanges}
                className="text-sm"
                disabled={!!validationError || !newValue.trim()}
                aria-label="Save changes"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
