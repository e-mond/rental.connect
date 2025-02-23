import { useState } from "react";
import Sidebar from "../../components/Sidebar";

const tabs = ["Account", "Notifications", "Security", "Billing"];
const settingsData = {
  Account: [
    {
      title: "Profile Information",
      description: "Update your account details and profile picture",
      icon: "👤",
    },
    {
      title: "Connected Accounts",
      description: "Manage your linked accounts and services",
      icon: "🔗",
    },
  ],
  Notifications: [
    {
      title: "Email Preferences",
      description: "Manage your email settings",
      icon: "📧",
    },
    {
      title: "Push Notifications",
      description: "Customize push notification preferences",
      icon: "🔔",
    },
  ],
  Security: [
    {
      title: "Change Password",
      description: "Update your password and enable two-factor authentication",
      icon: "🔒",
    },
    {
      title: "Login Activity",
      description: "Review recent login activity for your account",
      icon: "📊",
    },
  ],
  Billing: [
    {
      title: "Payment Methods",
      description: "Manage your saved payment methods",
      icon: "💳",
    },
    {
      title: "Subscription Plan",
      description: "View or change your current subscription plan",
      icon: "📄",
    },
  ],
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState("Account");

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-50">
        {/* Breadcrumb Navigation */}
        <nav className="text-gray-500 mb-4">
          <span className="text-black font-semibold">Dashboard</span> &gt;
          Settings
        </nav>
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        {/* Tabs */}
        <div className="border-b mb-6 flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 ${
                activeTab === tab
                  ? "border-b-2 border-black font-semibold text-black"
                  : "text-gray-500 hover:text-black"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Settings List */}
        <div className="space-y-4">
          {settingsData[activeTab].map((option) => (
            <div
              key={option.title}
              className="flex items-center p-4 bg-white shadow rounded-lg cursor-pointer hover:bg-gray-100"
            >
              <span className="text-2xl mr-4">{option.icon}</span>
              <div>
                <h2 className="font-semibold">{option.title}</h2>
                <p className="text-gray-500 text-sm">{option.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Settings;
