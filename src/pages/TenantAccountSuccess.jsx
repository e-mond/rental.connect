import { FaCheckCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { BASE_URL } from "../config";
import { useDarkMode } from "../hooks/useDarkMode";
import Button from "../components/Button"; // Import Button component

const TenantAccountSuccess = () => {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode(); // Access dark mode state

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found, redirecting to login");
      navigate("/tenantlogin");
      return;
    }

    fetch(`${BASE_URL}/api/auth/welcome`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          console.error("Token validation failed, status:", response.status);
          localStorage.removeItem("token");
          navigate("/tenantlogin");
        } else {
          console.log("Token validated successfully");
        }
      })
      .catch((err) => {
        console.error("Error validating token:", err);
        if (err.message.includes("Failed to fetch")) {
          console.error(
            "Possible CORS or network issue. Please check server configuration."
          );
        }
        localStorage.removeItem("token");
        navigate("/tenantlogin");
      });
  }, [navigate]);

  return (
    <div
      className={`min-h-screen flex flex-col items-center p-6 ${
        darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-50 text-gray-800"
      }`}
    >
      <div
        className={`w-full max-w-4xl p-8 rounded-xl shadow-md text-center ${
          darkMode ? "bg-gray-900 shadow-gray-700" : "bg-white shadow-gray-200"
        }`}
      >
        <div className="flex justify-center items-center mb-4">
          <FaCheckCircle
            className={darkMode ? "text-green-400" : "text-green-500"}
            size={40}
          />
        </div>
        <h2 className="text-2xl font-bold mb-2">
          Account Created Successfully!
        </h2>
        <p className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Your tenant account has been created. You can now access all features
          of RentConnect.
        </p>
        <div className="flex justify-center gap-4">
          <Button
            variant="primary"
            as={Link}
            to="/dashboard/tenant"
            className="px-6 py-3 shadow-md"
          >
            Go to Dashboard
          </Button>
          <Button
            variant="secondary"
            as={Link}
            to="/dashboard/tenant/profile"
            className="px-6 py-3 shadow-md"
          >
            Complete Profile
          </Button>
        </div>
      </div>

      <div className="w-full max-w-4xl mt-10">
        <h3 className="text-xl font-semibold mb-6">What&apos;s next?</h3>
        <div className="flex flex-col gap-6">
          <div
            className={`flex items-start gap-6 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${
              darkMode
                ? "bg-gray-900 shadow-gray-700 hover:shadow-gray-600"
                : "bg-white shadow-gray-200 hover:shadow-gray-300"
            }`}
          >
            <div
              className={`p-4 rounded-full ${
                darkMode
                  ? "bg-blue-900 text-blue-300"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              <FaCheckCircle size={24} />
            </div>
            <div>
              <h4 className="text-lg font-medium">Complete your profile</h4>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Add your preferences and requirements for better property
                suggestions.
              </p>
            </div>
          </div>
          <div
            className={`flex items-start gap-6 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${
              darkMode
                ? "bg-gray-900 shadow-gray-700 hover:shadow-gray-600"
                : "bg-white shadow-gray-200 hover:shadow-gray-300"
            }`}
          >
            <div
              className={`p-4 rounded-full ${
                darkMode
                  ? "bg-blue-900 text-blue-300"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              <FaCheckCircle size={24} />
            </div>
            <div>
              <h4 className="text-lg font-medium">Browse properties</h4>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Explore and find your perfect rental property.
              </p>
            </div>
          </div>
          <div
            className={`flex items-start gap-6 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${
              darkMode
                ? "bg-gray-900 shadow-gray-700 hover:shadow-gray-600"
                : "bg-white shadow-gray-200 hover:shadow-gray-300"
            }`}
          >
            <div
              className={`p-4 rounded-full ${
                darkMode
                  ? "bg-blue-900 text-blue-300"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              <FaCheckCircle size={24} />
            </div>
            <div>
              <h4 className="text-lg font-medium">Set up payments</h4>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Add your payment information to streamline transactions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantAccountSuccess;
