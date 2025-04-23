import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiLock,
  FiBell,
  FiTrash2,
  FiMoon,
  FiSun,
  FiGlobe,
  FiShield,
} from "react-icons/fi";
import { useDarkMode } from "../../../../context/DarkModeContext";
import Button from "../../../../components/Button";
import { BASE_URL } from "../../../../config";

const LandlordSettings = () => {
  const { darkMode, setDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    appNotifications: true,
    smsNotifications: false,
    propertyNotifications: true,
  });
  const [language, setLanguage] = useState("en");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePasswordChange = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      setSuccess("");

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setError("New password and confirmation do not match.");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found. Please log in.");
        }

        const response = await fetch(`${BASE_URL}/api/users/me/password`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to update password: ${errorText || "Unknown error"} (HTTP ${
              response.status
            })`
          );
        }

        setSuccess("Password updated successfully.");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (err) {
        console.error("Failed to update password:", err);
        setError(err.message);
        if (err.message.includes("token") || err.message.includes("401")) {
          navigate("/landlordlogin");
        }
      }
    },
    [passwordForm, navigate]
  );

  const handleNotificationChange = useCallback(
    async (field) => {
      const updatedNotifications = {
        ...notifications,
        [field]: !notifications[field],
      };
      setNotifications(updatedNotifications);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found. Please log in.");
        }

        const response = await fetch(`${BASE_URL}/api/users/me/notifications`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedNotifications),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to update notifications: ${
              errorText || "Unknown error"
            } (HTTP ${response.status})`
          );
        }

        setSuccess("Notification preferences updated successfully.");
      } catch (err) {
        console.error("Failed to update notifications:", err);
        setNotifications(notifications); // Revert on error
        setError(err.message);
        if (err.message.includes("token") || err.message.includes("401")) {
          navigate("/landlordlogin");
        }
      }
    },
    [notifications, navigate]
  );

  const handleLanguageChange = useCallback(
    async (newLanguage) => {
      setLanguage(newLanguage);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found. Please log in.");
        }

        const response = await fetch(`${BASE_URL}/api/users/me/language`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ language: newLanguage }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to update language: ${errorText || "Unknown error"} (HTTP ${
              response.status
            })`
          );
        }

        setSuccess("Language updated successfully.");
      } catch (err) {
        console.error("Failed to update language:", err);
        setLanguage(language); // Revert on error
        setError(err.message);
        if (err.message.includes("token") || err.message.includes("401")) {
          navigate("/landlordlogin");
        }
      }
    },
    [language, navigate]
  );

  const handleTwoFactorToggle = useCallback(async () => {
    const newState = !twoFactorEnabled;
    setTwoFactorEnabled(newState);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const response = await fetch(`${BASE_URL}/api/users/me/2fa`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ twoFactorEnabled: newState }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to update 2FA: ${errorText || "Unknown error"} (HTTP ${
            response.status
          })`
        );
      }

      setSuccess(
        `Two-factor authentication ${newState ? "enabled" : "disabled"}.`
      );
    } catch (err) {
      console.error("Failed to update 2FA:", err);
      setTwoFactorEnabled(twoFactorEnabled); // Revert on error
      setError(err.message);
      if (err.message.includes("token") || err.message.includes("401")) {
        navigate("/landlordlogin");
      }
    }
  }, [twoFactorEnabled, navigate]);

  const handleAccountDeletion = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const response = await fetch(`${BASE_URL}/api/users/me`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to delete account: ${errorText || "Unknown error"} (HTTP ${
            response.status
          })`
        );
      }

      localStorage.clear();
      navigate("/landlordlogin");
    } catch (err) {
      console.error("Failed to delete account:", err);
      setError(err.message);
      if (err.message.includes("token") || err.message.includes("401")) {
        navigate("/landlordlogin");
      }
    } finally {
      setIsDeleteModalOpen(false);
    }
  }, [navigate]);

  return (
    <div
      className={`max-w-2xl mx-auto p-4 sm:p-6 ${
        darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-900"
      } min-h-screen lg:max-w-5xl`}
    >
      <h1 className="text-2xl font-bold mb-6 text-center sm:text-left lg:text-3xl animate-fade-in">
        Landlord Settings
      </h1>

      {/* Error/Success Messages */}
      {(error || success) && (
        <div
          className={`mb-4 p-3 rounded-lg text-center text-sm ${
            error
              ? darkMode
                ? "bg-red-900 text-red-300"
                : "bg-red-100 text-red-700"
              : darkMode
              ? "bg-green-900 text-green-300"
              : "bg-green-100 text-green-700"
          } animate-fade-in`}
        >
          {error || success}
        </div>
      )}

      {/* Change Password */}
      <div
        className={`p-4 sm:p-6 rounded-lg shadow-md mb-6 ${
          darkMode ? "bg-gray-900 shadow-gray-700" : "bg-white shadow-gray-200"
        } animate-slide-up`}
      >
        <h2 className="text-lg font-bold mb-4 lg:text-xl flex items-center gap-2">
          <FiLock className="w-5 h-5" /> Change Password
        </h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label
              htmlFor="currentPassword"
              className={`block text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              } mb-1`}
            >
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  currentPassword: e.target.value,
                })
              }
              className={`w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                darkMode
                  ? "bg-gray-800 border-gray-600 text-gray-200"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              required
            />
          </div>
          <div>
            <label
              htmlFor="newPassword"
              className={`block text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              } mb-1`}
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  newPassword: e.target.value,
                })
              }
              className={`w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                darkMode
                  ? "bg-gray-800 border-gray-600 text-gray-200"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              required
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className={`block text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              } mb-1`}
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  confirmPassword: e.target.value,
                })
              }
              className={`w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                darkMode
                  ? "bg-gray-800 border-gray-600 text-gray-200"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              required
            />
          </div>
          <Button
            variant="primary"
            type="submit"
            className="w-full sm:w-auto"
            disabled={
              !passwordForm.currentPassword ||
              !passwordForm.newPassword ||
              !passwordForm.confirmPassword
            }
            aria-label="Update password"
          >
            Update Password
          </Button>
        </form>
      </div>

      {/* Notification Preferences */}
      <div
        className={`p-4 sm:p-6 rounded-lg shadow-md mb-6 ${
          darkMode ? "bg-gray-900 shadow-gray-700" : "bg-white shadow-gray-200"
        } animate-slide-up delay-100`}
      >
        <h2 className="text-lg font-bold mb-4 lg:text-xl flex items-center gap-2">
          <FiBell className="w-5 h-5" /> Notification Preferences
        </h2>
        <div className="space-y-4">
          {[
            {
              field: "emailNotifications",
              label: "Email Notifications",
              description: "Receive updates via email.",
            },
            {
              field: "appNotifications",
              label: "In-App Notifications",
              description: "Receive notifications within the app.",
            },
            {
              field: "smsNotifications",
              label: "SMS Notifications",
              description: "Receive updates via text messages.",
            },
            {
              field: "propertyNotifications",
              label: "Property Notifications",
              description:
                "Receive alerts for tenant applications and maintenance.",
            },
          ].map(({ field, label, description }) => (
            <div key={field} className="flex items-center justify-between">
              <div>
                <span
                  className={`block text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {label}
                </span>
                <p
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {description}
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications[field]}
                onChange={() => handleNotificationChange(field)}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 rounded cursor-pointer"
                aria-label={`Toggle ${label.toLowerCase()}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Appearance */}
      <div
        className={`p-4 sm:p-6 rounded-lg shadow-md mb-6 ${
          darkMode ? "bg-gray-900 shadow-gray-700" : "bg-white shadow-gray-200"
        } animate-slide-up delay-200`}
      >
        <h2 className="text-lg font-bold mb-4 lg:text-xl flex items-center gap-2">
          {darkMode ? (
            <FiSun className="w-5 h-5" />
          ) : (
            <FiMoon className="w-5 h-5" />
          )}{" "}
          Appearance
        </h2>
        <div className="flex items-center justify-between">
          <span
            className={`text-sm font-medium ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </span>
          <Button
            variant="secondary"
            onClick={() => setDarkMode(!darkMode)}
            className="text-sm"
            aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
          >
            Toggle
          </Button>
        </div>
      </div>

      {/* Language */}
      <div
        className={`p-4 sm:p-6 rounded-lg shadow-md mb-6 ${
          darkMode ? "bg-gray-900 shadow-gray-700" : "bg-white shadow-gray-200"
        } animate-slide-up delay-300`}
      >
        <h2 className="text-lg font-bold mb-4 lg:text-xl flex items-center gap-2">
          <FiGlobe className="w-5 h-5" /> Language
        </h2>
        <div className="flex items-center justify-between">
          <span
            className={`text-sm font-medium ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Select Language
          </span>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className={`rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              darkMode
                ? "bg-gray-800 border-gray-600 text-gray-200"
                : "bg-white border-gray-300 text-gray-900"
            }`}
            aria-label="Select language"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div
        className={`p-4 sm:p-6 rounded-lg shadow-md mb-6 ${
          darkMode ? "bg-gray-900 shadow-gray-700" : "bg-white shadow-gray-200"
        } animate-slide-up delay-400`}
      >
        <h2 className="text-lg font-bold mb-4 lg:text-xl flex items-center gap-2">
          <FiShield className="w-5 h-5" /> Two-Factor Authentication
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <span
              className={`block text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {twoFactorEnabled ? "2FA Enabled" : "2FA Disabled"}
            </span>
            <p
              className={`text-xs ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Enhance security with two-factor authentication.
            </p>
          </div>
          <Button
            variant={twoFactorEnabled ? "secondary" : "primary"}
            onClick={handleTwoFactorToggle}
            className="text-sm"
            aria-label={twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
          >
            {twoFactorEnabled ? "Disable" : "Enable"}
          </Button>
        </div>
      </div>

      {/* Delete Account */}
      <div
        className={`p-4 sm:p-6 rounded-lg shadow-md ${
          darkMode ? "bg-gray-900 shadow-gray-700" : "bg-white shadow-gray-200"
        } animate-slide-up delay-500`}
      >
        <h2 className="text-lg font-bold mb-4 lg:text-xl flex items-center gap-2">
          <FiTrash2 className="w-5 h-5" /> Delete Account
        </h2>
        <p
          className={`text-sm ${
            darkMode ? "text-gray-400" : "text-gray-600"
          } mb-4`}
        >
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </p>
        <Button
          variant="danger"
          onClick={() => setIsDeleteModalOpen(true)}
          className="w-full sm:w-auto"
          aria-label="Delete account"
        >
          Delete Account
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
          <div
            className={`w-11/12 sm:w-96 rounded-lg p-6 sm:p-8 shadow-lg ${
              darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-900"
            } animate-scale-in`}
          >
            <h2 className="text-lg font-bold mb-4">Confirm Account Deletion</h2>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              } mb-6`}
            >
              Are you sure you want to delete your account? This action is
              irreversible and will remove all your data.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-sm"
                aria-label="Cancel account deletion"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleAccountDeletion}
                className="text-sm"
                aria-label="Confirm account deletion"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandlordSettings;
