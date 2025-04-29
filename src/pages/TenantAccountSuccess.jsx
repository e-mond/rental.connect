import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/useUser"; // Updated import path
import { useDarkMode } from "../hooks/useDarkMode";
import { toast } from "react-toastify";
import Button from "../components/Button";
import { FaCheckCircle } from "react-icons/fa";

const TenantAccountSuccess = () => {
  const navigate = useNavigate();
  const { user, loading, validateToken } = useUser();
  const { darkMode } = useDarkMode();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No session found. Please log in again.");
        navigate("/tenantlogin", { replace: true });
        return;
      }

      try {
        const response = await validateToken();
        if (response.success) {
          console.log("Token validated successfully:", response.data);
          toast.success("Welcome! Your account has been successfully created.");
        } else {
          throw new Error("Token validation failed");
        }
      } catch (error) {
        console.error("Token validation error:", error.message);
        toast.warn("Unable to validate session, but you can continue. Please log in again if you encounter issues.");
      }
    };

    if (!loading) {
      if (!user) {
        navigate("/tenantlogin", { replace: true });
      } else {
        checkToken();
      }
    }
  }, [user, loading, navigate, validateToken]);

  if (loading) {
    return <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-900"}`}>Loading...</div>;
  }

  return (
    <div className={`min-h-screen flex flex-col items-center p-6 ${darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-50 text-gray-800"}`}>
      <div className={`w-full max-w-4xl p-8 rounded-xl shadow-md text-center ${darkMode ? "bg-gray-900 border border-gray-700" : "bg-white border border-gray-300"}`}>
        <div className="flex justify-center items-center mb-4">
          <FaCheckCircle className={darkMode ? "text-green-400" : "text-green-500"} size={40} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Account Created Successfully!</h2>
        <p className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Your tenant account has been created. You can now access all features of RentConnect.
        </p>
        <div className="flex justify-center gap-4">
          <Button
            variant="primary"
            as={Link}
            to="/dashboard/tenant"
            className={`px-6 py-3 shadow-md ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white`}
          >
            Go to Dashboard
          </Button>
          <Button
            variant="secondary"
            as={Link}
            to="/dashboard/tenant/profile"
            className={`px-6 py-3 shadow-md ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600" : "bg-gray-200 hover:bg-gray-300 text-gray-900 border-gray-300"}`}
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
              darkMode ? "bg-gray-900 shadow-gray-700 hover:shadow-gray-600" : "bg-white shadow-gray-200 hover:shadow-gray-300"
            }`}
          >
            <div className={`p-4 rounded-full ${darkMode ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-600"}`}>
              <FaCheckCircle size={24} />
            </div>
            <div>
              <h4 className="text-lg font-medium">Complete your profile</h4>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Add your preferences and requirements for better property suggestions.
              </p>
            </div>
          </div>
          <div
            className={`flex items-start gap-6 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${
              darkMode ? "bg-gray-900 shadow-gray-700 hover:shadow-gray-600" : "bg-white shadow-gray-200 hover:shadow-gray-300"
            }`}
          >
            <div className={`p-4 rounded-full ${darkMode ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-600"}`}>
              <FaCheckCircle size={24} />
            </div>
            <div>
              <h4 className="text-lg font-medium">Browse properties</h4>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Explore and find your perfect rental property.
              </p>
            </div>
          </div>
          <div
            className={`flex items-start gap-6 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${
              darkMode ? "bg-gray-900 shadow-gray-700 hover:shadow-gray-600" : "bg-white shadow-gray-200 hover:shadow-gray-300"
            }`}
          >
            <div className={`p-4 rounded-full ${darkMode ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-600"}`}>
              <FaCheckCircle size={24} />
            </div>
            <div>
              <h4 className="text-lg font-medium">Set up payments</h4>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
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