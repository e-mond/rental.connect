import { useState } from "react";
import {
  FiLock,
  FiBell,
  FiLink,
  FiMail,
  FiPhone,
  FiHome,
} from "react-icons/fi";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "Kiky Kendrick",
    role: "Tenant",
    email: "kiky.kendrick@email.com",
    phone: "+233 (555) 123-4567",
    address: "123 Main St, Apt 4B, East Legon, Accra 10001",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editField, setEditField] = useState("");
  const [newValue, setNewValue] = useState("");

  // Open modal for editing
  const openModal = (field) => {
    setEditField(field);
    setNewValue(profile[field]);
    setIsModalOpen(true);
  };

  // Save changes
  const saveChanges = () => {
    setProfile((prev) => ({ ...prev, [editField]: newValue }));
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      {/* Profile Header */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-md">
        <img
          src="https://randomuser.me/api/portraits/men/76.jpg"
          alt="Profile"
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h2 className="text-xl font-semibold">{profile.name}</h2>
          <p className="text-gray-500">{profile.role}</p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white mt-6 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-3">Personal Information</h3>
        <div className="space-y-3">
          {["email", "phone", "address"].map((field) => (
            <div key={field} className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-600">
                {field === "email" ? (
                  <FiMail />
                ) : field === "phone" ? (
                  <FiPhone />
                ) : (
                  <FiHome />
                )}
                {profile[field]}
              </div>
              <button
                className="text-blue-500 hover:underline"
                onClick={() => openModal(field)}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white mt-6 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-3">Account Settings</h3>
        <div className="space-y-3">
          {[
            { icon: <FiLock />, label: "Password", link: "/settings/password" },
            {
              icon: <FiBell />,
              label: "Notifications",
              link: "/settings/notifications",
            },
            {
              icon: <FiLink />,
              label: "Connected Accounts",
              link: "/settings/accounts",
            },
          ].map((item, index) => (
            <a
              key={index}
              href={item.link}
              className="flex justify-between items-center cursor-pointer hover:bg-gray-100 p-2 rounded"
            >
              <div className="flex items-center gap-2">
                {item.icon} {item.label}
              </div>
              <span className="text-gray-500">Manage</span>
            </a>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">
              Edit {editField.charAt(0).toUpperCase() + editField.slice(1)}
            </h2>
            <input
              type="text"
              className="w-full p-2 border rounded-lg"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />
            <div className="flex justify-end mt-4 gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                onClick={saveChanges}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
