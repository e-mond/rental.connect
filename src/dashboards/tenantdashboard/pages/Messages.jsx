import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for Button navigation
import { BASE_URL } from "../../../config";
import GlobalSkeleton from "../../../components/GlobalSkeleton";
import { useDarkMode } from "../../../context/DarkModeContext"; // Import useDarkMode
import Button from "../../../components/Button"; // Import Button component

// Messages page for tenants to view their messages
const TenantMessages = () => {
  const [messages, setMessages] = useState([]); // State to store the list of messages
  const [loading, setLoading] = useState(true); // State to handle loading status
  const navigate = useNavigate(); // Initialize navigate for Button navigation
  const { darkMode } = useDarkMode(); // Access dark mode state

  // Fetch messages for the authenticated tenant
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token"); // Get the authentication token from localStorage
        const response = await fetch(`${BASE_URL}/api/messages/tenant/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch messages");
        const data = await response.json();
        setMessages(data);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []); // Empty dependency array to run only on mount

  // Display skeleton loader while fetching messages
  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <GlobalSkeleton
          type="list"
          bgColor={darkMode ? "bg-gray-700" : "bg-gray-300"}
          animationSpeed="1.2s"
        />
      </div>
    );
  }

  return (
    <div
      className={`p-4 md:p-6 ${darkMode ? "text-gray-200" : "text-gray-800"}`}
    >
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg md:text-2xl font-bold">Your Messages</h1>
        <Button
          variant="primary"
          onClick={() => navigate("/dashboard/tenant/messages/compose")}
          className="text-sm md:text-base"
        >
          Compose Message
        </Button>
      </div>

      {/* Messages List */}
      <div
        className={`rounded-lg shadow ${
          darkMode ? "bg-gray-900 shadow-gray-700" : "bg-white shadow-gray-200"
        }`}
      >
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col md:flex-row justify-between items-start md:items-center p-3 border-b ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="flex items-start w-full">
                {/* Property Image */}
                <img
                  src={
                    message.property.imageUrl
                      ? `${BASE_URL}${message.property.imageUrl}`
                      : "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=40&h=40&fit=crop"
                  }
                  alt={message.property.title}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full mr-3 md:mr-4"
                  onError={(e) =>
                    (e.target.src =
                      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=40&h=40&fit=crop")
                  }
                />
                <div className="flex-1">
                  {/* Property Title */}
                  <p className="font-semibold text-sm md:text-base leading-tight">
                    {message.property.title}
                  </p>
                  {/* Message Preview */}
                  <p
                    className={`text-xs md:text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {message.sender}: {message.content.substring(0, 50)}...
                  </p>
                </div>
              </div>
              <Button
                variant="secondary"
                onClick={() =>
                  navigate(`/dashboard/tenant/messages/${message.id}`)
                }
                className="mt-2 md:mt-0 text-sm md:text-base"
              >
                View Message
              </Button>
            </div>
          ))
        ) : (
          <p
            className={`text-center py-4 text-sm md:text-base ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            You have no messages.
          </p>
        )}
      </div>
    </div>
  );
};

export default TenantMessages;
