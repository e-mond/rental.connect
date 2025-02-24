import { useState } from "react";
import { FiGlobe, FiClock, FiDollarSign, FiMail, FiBell, FiMessageSquare } from "react-icons/fi";

const Settings = () => {
  const [preferences, setPreferences] = useState({
    language: "English (US)",
    timeZone: "Pacific Time (US & Canada)",
    currency: "USD ($)",
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
  });

  const [tab, setTab] = useState("General");

  const toggleNotification = (type) => {
    setPreferences((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Tabs Navigation */}
      <div className="flex border-b mb-6">
        {["General", "Notifications", "Privacy", "Billing"].map((item) => (
          <button
            key={item}
            className={`px-4 py-2 ${tab === item ? "border-b-2 border-blue-500 font-semibold" : "text-gray-500"}`}
            onClick={() => setTab(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {/* General Settings */}
      {tab === "General" && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-3">Account Preferences</h3>

          {/* Language Selection */}
          <div className="flex justify-between items-center p-3 hover:bg-gray-100 rounded">
            <div className="flex items-center gap-2">
              <FiGlobe />
              <span>Language</span>
            </div>
            <select
              value={preferences.language}
              onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
              className="border rounded p-2"
            >
              <option>English (US)</option>
              <option>English (UK)</option>
              <option>French</option>
              <option>Spanish</option>
            </select>
          </div>

          {/* Time Zone Selection */}
          <div className="flex justify-between items-center p-3 hover:bg-gray-100 rounded">
            <div className="flex items-center gap-2">
              <FiClock />
              <span>Time Zone</span>
            </div>
            <select
              value={preferences.timeZone}
              onChange={(e) => setPreferences({ ...preferences, timeZone: e.target.value })}
              className="border rounded p-2"
            >
              <option>Pacific Time (US & Canada)</option>
              <option>Eastern Time (US & Canada)</option>
              <option>Greenwich Mean Time (GMT)</option>
              <option>Central European Time (CET)</option>
            </select>
          </div>

          {/* Currency Selection */}
          <div className="flex justify-between items-center p-3 hover:bg-gray-100 rounded">
            <div className="flex items-center gap-2">
              <FiDollarSign />
              <span>Currency</span>
            </div>
            <select
              value={preferences.currency}
              onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
              className="border rounded p-2"
            >
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
              <option>GHS (₵)</option>
            </select>
          </div>
        </div>
      )}

      {/* Notifications Settings */}
      {tab === "Notifications" && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-3">Notifications</h3>

          {/* Email Notifications */}
          <div className="flex justify-between items-center p-3 hover:bg-gray-100 rounded">
            <div className="flex items-center gap-2">
              <FiMail />
              <span>Email Notifications</span>
            </div>
            <input
              type="checkbox"
              checked={preferences.emailNotifications}
              onChange={() => toggleNotification("emailNotifications")}
              className="cursor-pointer"
            />
          </div>

          {/* Push Notifications */}
          <div className="flex justify-between items-center p-3 hover:bg-gray-100 rounded">
            <div className="flex items-center gap-2">
              <FiBell />
              <span>Push Notifications</span>
            </div>
            <input
              type="checkbox"
              checked={preferences.pushNotifications}
              onChange={() => toggleNotification("pushNotifications")}
              className="cursor-pointer"
            />
          </div>

          {/* SMS Notifications */}
          <div className="flex justify-between items-center p-3 hover:bg-gray-100 rounded">
            <div className="flex items-center gap-2">
              <FiMessageSquare />
              <span>SMS Notifications</span>
            </div>
            <input
              type="checkbox"
              checked={preferences.smsNotifications}
              onChange={() => toggleNotification("smsNotifications")}
              className="cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Privacy Settings */}
      {tab === "Privacy" && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-3">Privacy Settings</h3>
          <p className="text-gray-500">Manage your data and privacy preferences.</p>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">Manage Privacy</button>
        </div>
      )}

      {/* Billing Settings */}
      {tab === "Billing" && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-3">Billing Settings</h3>
          <p className="text-gray-500">Manage your billing and payment methods.</p>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">Manage Billing</button>
        </div>
      )}
    </div>
  );
};

export default Settings;
