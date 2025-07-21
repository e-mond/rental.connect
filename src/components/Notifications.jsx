import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BellIcon,
  EnvelopeIcon,
  CurrencyDollarIcon,
  WrenchScrewdriverIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useDarkMode } from "../hooks/useDarkMode";
import PropTypes from "prop-types";

// Notification type icons
const notificationIcons = {
  message: EnvelopeIcon,
  rent: CurrencyDollarIcon,
  maintenance: WrenchScrewdriverIcon,
  lease: DocumentTextIcon,
  other: BellIcon,
};

/**
 * Notifications Component
 *
 * A reusable component to display a list of notifications with filtering,
 * marking as read/unread, clearing functionality, and action buttons.
 * Supports dark mode and includes animations for a dynamic user experience.
 *
 * @param {Object} props
 * @param {Array} props.initialNotifications - Array of notification objects
 * @param {string} props.userType - "tenant" or "landlord" for context-specific rendering
 * @param {Function} props.onAction - Callback for handling notification actions
 * @returns {JSX.Element} The rendered Notifications component
 */
const Notifications = ({ initialNotifications, userType, onAction }) => {
  const { darkMode } = useDarkMode();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("all");

  // Filter options based on notification types
  const filterOptions = [
    { value: "all", label: "All" },
    { value: "rent", label: "Rent" },
    { value: "maintenance", label: "Maintenance" },
    { value: "lease", label: "Lease" },
  ];

  // Handle marking a notification as read/unread
  const toggleReadStatus = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, isRead: !notif.isRead } : notif
      )
    );
  };

  // Handle clearing all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Handle notification actions (e.g., Pay Now, View Details, Sign Lease)
  const handleAction = (notification, actionType) => {
    if (onAction) {
      onAction(notification, actionType);
    }
  };

  // Filter notifications based on selected type
  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "all") return true;
    return notif.type === filter;
  });

  return (
    <div
      className={`min-h-screen p-6 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            {userType === "tenant"
              ? "Notifications"
              : "Notifications"}
          </h1>
          {notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                darkMode
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
              aria-label="Clear all notifications"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === option.value
                  ? darkMode
                    ? "bg-teal-500 text-white"
                    : "bg-teal-600 text-white"
                  : darkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
              aria-pressed={filter === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <AnimatePresence>
          {filteredNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <BellIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">
                No notifications to display.
              </p>
            </motion.div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredNotifications.map((notification) => {
                const Icon = notificationIcons[notification.type] || BellIcon;
                const isUrgent =
                  notification.type === "rent" &&
                  notification.status === "overdue";
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`p-4 rounded-xl shadow-lg flex flex-col ${
                      notification.isRead
                        ? darkMode
                          ? "bg-gray-800"
                          : "bg-gray-50"
                        : darkMode
                        ? "bg-gray-700"
                        : "bg-white"
                    } ${
                      isUrgent
                        ? darkMode
                          ? "border-l-4 border-red-500"
                          : "border-l-4 border-red-600"
                        : ""
                    } hover:shadow-xl transition-shadow`}
                    role="article"
                    aria-labelledby={`notification-title-${notification.id}`}
                  >
                    <div className="flex items-start space-x-4">
                      <Icon
                        className={`w-8 h-8 flex-shrink-0 ${
                          darkMode ? "text-teal-400" : "text-teal-600"
                        }`}
                      />
                      <div className="flex-1">
                        <h2
                          id={`notification-title-${notification.id}`}
                          className="text-lg font-semibold"
                        >
                          {notification.title}
                        </h2>
                        <p className="mt-1 text-sm">{notification.message}</p>
                        {notification.details && (
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {notification.details}
                          </p>
                        )}
                        <p
                          className={`mt-2 text-xs ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {notification.timestamp}
                        </p>
                        {isUrgent && (
                          <span className="inline-block px-2 py-1 mt-2 text-xs font-semibold text-white bg-red-500 rounded-full">
                            Urgent
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => toggleReadStatus(notification.id)}
                        className={`p-2 rounded-full ${
                          darkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"
                        }`}
                        aria-label={
                          notification.isRead
                            ? "Mark as unread"
                            : "Mark as read"
                        }
                      >
                        {notification.isRead ? (
                          <XCircleIcon className="w-5 h-5 text-red-500" />
                        ) : (
                          <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        )}
                      </button>
                    </div>
                    {/* Action Buttons */}
                    <div className="mt-4 flex gap-2">
                      {notification.type === "rent" &&
                        userType === "tenant" && (
                          <button
                            onClick={() => handleAction(notification, "pay")}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                              darkMode
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "bg-blue-500 hover:bg-blue-600 text-white"
                            }`}
                          >
                            Pay Now
                          </button>
                        )}
                      {notification.type === "maintenance" && (
                        <button
                          onClick={() => handleAction(notification, "view")}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            darkMode
                              ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                              : "bg-yellow-500 hover:bg-yellow-600 text-white"
                          }`}
                        >
                          View Details
                        </button>
                      )}
                      {notification.type === "lease" &&
                        userType === "tenant" && (
                          <button
                            onClick={() => handleAction(notification, "sign")}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                              darkMode
                                ? "bg-green-600 hover:bg-green-700 text-white"
                                : "bg-green-500 hover:bg-green-600 text-white"
                            }`}
                          >
                            Sign Lease
                          </button>
                        )}
                      {notification.type === "lease" &&
                        userType === "landlord" && (
                          <button
                            onClick={() => handleAction(notification, "review")}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                              darkMode
                                ? "bg-purple-600 hover:bg-purple-700 text-white"
                                : "bg-purple-500 hover:bg-purple-600 text-white"
                            }`}
                          >
                            Review Lease
                          </button>
                        )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

Notifications.propTypes = {
  initialNotifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["rent", "maintenance", "lease", "other"])
        .isRequired,
      isRead: PropTypes.bool.isRequired,
      status: PropTypes.string,
      details: PropTypes.string,
    })
  ).isRequired,
  userType: PropTypes.oneOf(["tenant", "landlord"]).isRequired,
  onAction: PropTypes.func,
};

Notifications.defaultProps = {
  onAction: () => {},
};

export default Notifications;
