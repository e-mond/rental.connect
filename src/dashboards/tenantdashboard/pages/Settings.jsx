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
import { useDarkMode } from "../../../context/DarkModeContext";
import Button from "../../../components/Button";
import tenantApi from "../../../api/tenant/tenantApi";

const TenantSettings = () => {
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

        const controller = new AbortController();
        await tenantApi.withRetry(
          tenantApi.updatePassword,
          [
            token,
            {
              currentPassword: passwordForm.currentPassword,
              newPassword: passwordForm.newPassword,
            },
            controller.signal,
          ],
          3,
          2000
        );

        setSuccess("Password updated successfully.");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (err) {
        setError(
          err.type === "auth"
            ? "Your session appears to be invalid. Please log in again to continue."
            : err.type === "network"
            ? "We’re having trouble connecting. Please check your network and try again."
            : err.type === "server"
            ? "The server is currently unavailable. Please try again later."
            : err.message || "Failed to update password."
        );
        if (err.message.includes("token") || err.message.includes("401")) {
          localStorage.removeItem("token");
          setTimeout(() => {
            navigate("/tenantlogin");
          }, 2000);
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

        const controller = new AbortController();
        await tenantApi.withRetry(
          tenantApi.updateNotifications,
          [token, updatedNotifications, controller.signal],
          3,
          2000
        );

        setSuccess("Notification preferences updated successfully.");
      } catch (err) {
        setNotifications(notifications); // Revert on error
        setError(
          err.type === "auth"
            ? "Your session appears to be invalid. Please log in again to continue."
            : err.type === "network"
            ? "We’re having trouble connecting. Please check your network and try again."
            : err.type === "server"
            ? "The server is currently unavailable. Please try again later."
            : err.message || "Failed to update notification preferences."
        );
        if (err.message.includes("token") || err.message.includes("401")) {
          localStorage.removeItem("token");
          setTimeout(() => {
            navigate("/tenantlogin");
          }, 2000);
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

        const controller = new AbortController();
        await tenantApi.withRetry(
          tenantApi.updateLanguage,
          [token, { language: newLanguage }, controller.signal],
          3,
          2000
        );

        setSuccess("Language updated successfully.");
      } catch (err) {
        setLanguage(language); // Revert on error
        setError(
          err.type === "auth"
            ? "Your session appears to be invalid. Please log in again to continue."
            : err.type === "network"
            ? "We’re having trouble connecting. Please check your network and try again."
            : err.type === "server"
            ? "The server is currently unavailable. Please try again later."
            : err.message || "Failed to update language preference."
        );
        if (err.message.includes("token") || err.message.includes("401")) {
          localStorage.removeItem("token");
          setTimeout(() => {
            navigate("/tenantlogin");
          }, 2000);
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

      const controller = new AbortController();
      await tenantApi.withRetry(
        tenantApi.toggleTwoFactor,
        [token, { twoFactorEnabled: newState }, controller.signal],
        3,
        2000
      );

      setSuccess(
        `Two-factor authentication ${newState ? "enabled" : "disabled"}.`
      );
    } catch (err) {
      setTwoFactorEnabled(twoFactorEnabled); // Revert on error
      setError(
        err.type === "auth"
          ? "Your session appears to be invalid. Please log in again to continue."
          : err.type === "network"
          ? "We’re having trouble connecting. Please check your network and try again."
          : err.type === "server"
          ? "The server is currently unavailable. Please try again later."
          : err.message || "Failed to update 2FA settings."
      );
      if (err.message.includes("token") || err.message.includes("401")) {
        localStorage.removeItem("token");
        setTimeout(() => {
          navigate("/tenantlogin");
        }, 2000);
      }
    }
  }, [twoFactorEnabled, navigate]);

  const handleAccountDeletion = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const controller = new AbortController();
      await tenantApi.withRetry(
        tenantApi.deleteAccount,
        [token, controller.signal],
        3,
        2000
      );

      localStorage.clear();
      navigate("/tenantlogin");
    } catch (err) {
      setError(
        err.type === "auth"
          ? "Your session appears to be invalid. Please log in again to continue."
          : err.type === "network"
          ? "We’re having trouble connecting. Please check your network and try again."
          : err.type === "server"
          ? "The server is currently unavailable. Please try again later."
          : err.message || "Failed to delete account."
      );
      if (err.message.includes("token") || err.message.includes("401")) {
        localStorage.removeItem("token");
        setTimeout(() => {
          navigate("/tenantlogin");
        }, 2000);
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
      <h1 className="text-2xl font-bold mb-6 text-center sm:text-left lg:text-3xl">
        Settings
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
          }`}
        >
          {error || success}
        </div>
      )}

      {/* Change Password */}
      <div
        className={`p-4 sm:p-6 rounded-lg shadow-md mb-6 ${
          darkMode ? "bg-gray-900 shadow-gray-700" : "bg-white shadow-gray-200"
        }`}
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
        }`}
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
        }`}
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
        }`}
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
        }`}
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
        }`}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className={`w-11/12 sm:w-96 rounded-lg p-6 sm:p-8 shadow-lg ${
              darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-900"
            }`}
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

export default TenantSettings;
