import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Messages = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Sarah Wilson - Property Manager",
      message:
        "Your application for Modern Downtown Apartment has been reviewed...",
      type: "review",
      unread: true,
      important: false,
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 2,
      sender: "Maintenance Team",
      message: "Schedule confirmation for property inspection next week...",
      type: "maintenance",
      unread: false,
      important: true,
      image: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      id: 3,
      sender: "System Notification",
      message: "Your background check has been completed successfully...",
      type: "notification",
      unread: true,
      important: false,
      image: "",
    },
  ]);

  // Filter Messages
  const filteredMessages = messages.filter((msg) => {
    if (activeFilter === "unread") return msg.unread;
    if (activeFilter === "important") return msg.important;
    return true;
  });

  // Toggle Unread / Read Status
  const toggleUnread = (id) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, unread: !msg.unread } : msg))
    );
  };

  // Toggle Important Status
  const toggleImportant = (id) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, important: !msg.important } : msg
      )
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4 md:p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold">Messages</h1>

      {/* Filter Tabs */}
      <div className="flex space-x-4 mt-4 text-gray-600 overflow-x-auto">
        {["all", "unread", "important"].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`py-2 px-4 ${
              activeFilter === filter
                ? "border-b-2 border-blue-500 text-blue-500"
                : ""
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-lg shadow-md p-4 mt-4 overflow-y-auto flex-grow">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className="flex items-center justify-between py-3 border-b last:border-none"
            >
              <div className="flex items-center gap-4">
                {msg.image ? (
                  <img
                    src={msg.image}
                    alt="Sender"
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <span className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-500 rounded-full">
                    🔔
                  </span>
                )}
                <div>
                  <h3
                    className={`font-semibold ${
                      msg.unread ? "text-black" : "text-gray-700"
                    }`}
                  >
                    {msg.sender}
                  </h3>
                  <p className="text-sm text-gray-500">{msg.message}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                {/* Mark as Read/Unread */}
                <button
                  onClick={() => toggleUnread(msg.id)}
                  className={`text-sm px-2 py-1 rounded ${
                    msg.unread
                      ? "bg-blue-100 text-blue-500"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {msg.unread ? "Mark Read" : "Mark Unread"}
                </button>

                {/* Mark as Important */}
                <button
                  onClick={() => toggleImportant(msg.id)}
                  className={`text-sm px-2 py-1 rounded ${
                    msg.important
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {msg.important ? "Unmark" : "Important"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-4">No messages found.</p>
        )}
      </div>

      {/* Quick Actions */}
      <h2 className="text-xl font-bold mt-6">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-blue-500 text-2xl">📝</div>
          <h3 className="font-semibold mt-2">New Message</h3>
          <p className="text-sm text-gray-500">Start a new conversation</p>
          <button
            onClick={() => navigate("/messages/compose")}
            className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Compose
          </button>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-blue-500 text-2xl">💬</div>
          <h3 className="font-semibold mt-2">Support</h3>
          <p className="text-sm text-gray-500">Contact customer support</p>
          <button
            onClick={() => navigate("/contact")}
            className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Contact
          </button>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-blue-500 text-2xl">⚙️</div>
          <h3 className="font-semibold mt-2">Preferences</h3>
          <p className="text-sm text-gray-500">Manage notification settings</p>
          <button
            onClick={() => navigate("/settings")}
            className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Messages;
