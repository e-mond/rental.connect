import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/useUser"; // Updated import path
import { useDarkMode } from "../hooks/useDarkMode";
import { toast } from "react-toastify";
import Button from "../components/Button";
import { FaHome, FaCreditCard, FaUsers } from "react-icons/fa";

/**
 * LandlordSuccess Component
 *
 * Displays a welcome message and next steps after a landlord successfully creates an account.
 * Validates the user's token and redirects to login if the user is not authenticated.
 */
const LandlordSuccess = () => {
  const navigate = useNavigate();
  const { user, loading, validateToken } = useUser();
  const { darkMode } = useDarkMode();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No session found. Please log in again.");
        navigate("/landlordlogin", { replace: true });
        return;
      }

      try {
        const response = await validateToken();
        if (response.success) {
          console.log("Token validated successfully:", response.data);
          toast.success("Welcome! Your landlord account has been created.");
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
        navigate("/landlordlogin", { replace: true });
      } else {
        checkToken();
      }
    }
  }, [user, loading, navigate, validateToken]);

  if (loading) {
    return <div className={`h-screen flex items-center justify-center ${darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-900"}`}>Loading...</div>;
  }

  return (
    <div className={`flex flex-col items-center min-h-screen p-6 ${darkMode ? "bg-gradient-to-br from-gray-800 to-gray-900 text-gray-200" : "bg-gradient-to-br from-blue-50 to-gray-100 text-gray-800"}`}>
      <div className={`w-full max-w-3xl p-6 rounded-xl shadow-xl mb-10 animate-fadeIn ${darkMode ? "bg-gray-900 border border-gray-700" : "bg-white border border-gray-300"}`}>
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full shadow-md ${darkMode ? "bg-green-600 text-gray-200" : "bg-green-500 text-white"}`}>
            ✓
          </span>
          Account Created Successfully!
        </h2>
        <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Congratulations! Your landlord account is now active and ready to use.
        </p>
        <div className="mt-6 flex gap-4">
          <Button
            variant="primary"
            as={Link}
            to="/dashboard/landlord"
            className={`px-6 py-3 shadow-md ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white`}
            aria-label="Go to Dashboard"
          >
            Go to Dashboard
          </Button>
          <Button
            variant="secondary"
            as={Link}
            to="/dashboard/landlord/properties"
            className={`px-6 py-3 shadow-md ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600" : "bg-gray-200 hover:bg-gray-300 text-gray-900 border-gray-300"}`}
            aria-label="Add More Properties"
          >
            Add More Properties
          </Button>
        </div>
      </div>

      <div className="w-full max-w-3xl">
        <h3 className="text-xl font-semibold mb-6">Next Steps</h3>
        <div className="flex flex-col gap-6">
          <div
            className={`flex items-start gap-6 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${
              darkMode ? "bg-gray-900 shadow-gray-700 hover:shadow-gray-600" : "bg-white shadow-gray-200 hover:shadow-gray-300"
            }`}
          >
            <div className={`p-4 rounded-full ${darkMode ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-600"}`}>
              <FaHome size={24} />
            </div>
            <div>
              <h4 className="text-lg font-medium">Add Property Details</h4>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Upload photos and set rental terms to attract tenants.
              </p>
            </div>
          </div>
          <div
            className={`flex items-start gap-6 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${
              darkMode ? "bg-gray-900 shadow-gray-700 hover:shadow-gray-600" : "bg-white shadow-gray-200 hover:shadow-gray-300"
            }`}
          >
            <div className={`p-4 rounded-full ${darkMode ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-600"}`}>
              <FaCreditCard size={24} />
            </div>
            <div>
              <h4 className="text-lg font-medium">Set Up Payment Methods</h4>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Configure secure payment options to receive rent directly.
              </p>
            </div>
          </div>
          <div
            className={`flex items-start gap-6 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${
              darkMode ? "bg-gray-900 shadow-gray-700 hover:shadow-gray-600" : "bg-white shadow-gray-200 hover:shadow-gray-300"
            }`}
          >
            <div className={`p-4 rounded-full ${darkMode ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-600"}`}>
              <FaUsers size={24} />
            </div>
            <div>
              <h4 className="text-lg font-medium">Invite Tenants</h4>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Easily connect and manage your existing or new tenants.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordSuccess;