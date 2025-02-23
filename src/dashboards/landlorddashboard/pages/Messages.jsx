import { useState } from "react";
import { Search, MoreVertical, Clock, Check, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const messagesData = [
  {
    id: 1,
    name: "Sarah Johnson",
    subject: "Re: Maintenance request #1234",
    avatar: "https://via.placeholder.com/40",
    status: "unread",
  },
  {
    id: 2,
    name: "Mike Thompson",
    subject: "Lease renewal discussion",
    avatar: "https://via.placeholder.com/40",
    status: "read",
  },
  {
    id: 3,
    name: "Emma Davis",
    subject: "Question about parking space",
    avatar: "https://via.placeholder.com/40",
    status: "archived",
  },
  {
    id: 4,
    name: "Property Management Team",
    subject: "Monthly inspection schedule",
    avatar: "https://via.placeholder.com/40",
    status: "read",
  },
];

const Messages = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Messages"); // Current tab
  const navigate = useNavigate();

  const filteredMessages = messagesData.filter((msg) => {
    const matchesSearch =
      msg.name.toLowerCase().includes(search.toLowerCase()) ||
      msg.subject.toLowerCase().includes(search.toLowerCase());

    if (filter === "Unread") {
      return matchesSearch && msg.status === "unread";
    }
    if (filter === "Archived") {
      return matchesSearch && msg.status === "archived";
    }
    return matchesSearch; // For "All Messages"
  });

  return (
    <div className="flex flex-col lg:flex-row">
      <Sidebar />
      <div className="p-6 flex-1 bg-gray-50">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Messages</h2>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            onClick={() => navigate("/new-message")}
          >
            New Message
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 pl-10 border rounded-md shadow-sm"
          />
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-4 text-sm font-medium">
          {["All Messages", "Unread", "Archived"].map((tab) => (
            <span
              key={tab}
              className={`cursor-pointer px-3 py-1 rounded ${
                filter === tab
                  ? "bg-blue-600 text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              onClick={() => setFilter(tab)}
            >
              {tab}
            </span>
          ))}
        </div>

        {/* Messages List */}
        <div className="bg-white p-4 rounded-lg shadow">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 border-b last:border-0"
            >
              <div className="flex items-start sm:items-center space-x-4">
                <img
                  src={msg.avatar}
                  alt={msg.name}
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <h4 className="font-semibold">{msg.name}</h4>
                  <p className="text-gray-500 text-sm">{msg.subject}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 mt-2 sm:mt-0">
                <Clock className="h-5 w-5 text-gray-500 cursor-pointer" />
                <Check className="h-5 w-5 text-gray-500 cursor-pointer" />
                <Bell className="h-5 w-5 text-gray-500 cursor-pointer" />
                <MoreVertical className="h-5 w-5 text-gray-500 cursor-pointer" />
              </div>
            </div>
          ))}
          {filteredMessages.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No messages found for the selected criteria.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
