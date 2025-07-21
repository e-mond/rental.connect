import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BASE_URL } from "../../config";
import { useDarkMode } from "../../context/DarkModeContext";
import Button from "../../components/Button";
import { FaEnvelope, FaSms, FaLock } from "react-icons/fa";

const ForgotPassword = () => {
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    phoneNumber: "",
    method: "email",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMethodChange = (method) => {
    setFormData((prev) => ({ ...prev, method }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    const payload = {
      method: formData.method,
      [formData.method === "email" ? "email" : "phoneNumber"]:
        formData.method === "email"
          ? formData.email.trim().toLowerCase()
          : formData.phoneNumber.trim(),
    };

    try {
      console.log("Forgot password payload:", payload);
      const response = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset link");
      }

      const role = data.role ? data.role.toUpperCase() : "TENANT";
      const redirectPath =
        role === "LANDLORD" ? "/landlordlogin" : "/tenantlogin";

      setMessage(
        `Password reset link sent successfully via ${
          formData.method
        }. Check your ${formData.method === "email" ? "email" : "SMS"}.`
      );
      setTimeout(() => navigate(redirectPath), 3000);
    } catch (err) {
      console.error("Forgot password error:", err);
      setError(err.message || "An error occurred while sending the reset link");
      if (err.message.includes("Failed to fetch")) {
        setError("Unable to connect to the server. Please check your network.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-8 bg-cover bg-center relative ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
      style={{
        backgroundImage: darkMode
          ? "none"
          : `url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')`,
      }}
    >
      {/* Overlay for better text readability */}
      <div
        className={`absolute inset-0 ${
          darkMode
            ? "bg-gray-900/90"
            : "bg-gradient-to-br from-blue-900/60 to-gray-900/40"
        }`}
      ></div>

      {/* Main Container */}
      <div
        className={`relative w-full max-w-lg md:max-w-4xl flex flex-col md:flex-row rounded-2xl shadow-2xl overflow-hidden ${
          darkMode ? "bg-gray-800/95" : "bg-white/90"
        } transform transition-all duration-300`}
      >
        {/* Left Side: New Illustration and Headline (Hidden on Mobile) */}
        <div
          className={`hidden md:flex w-full md:w-1/2 p-6 md:p-8 flex-col items-center justify-center ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="w-40 h-40 mb-4 animate-pulse">
            <svg
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`${darkMode ? "text-blue-400" : "text-blue-600"}`}
              aria-label="Envelope with lock icon"
            >
              {/* Envelope */}
              <rect
                x="50"
                y="60"
                width="100"
                height="80"
                rx="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
              />
              <path
                d="M50 60L100 110L150 60"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
              />
              {/* Lock */}
              <rect
                x="85"
                y="110"
                width="30"
                height="30"
                rx="5"
                fill="currentColor"
              />
              <path
                d="M85 90H115V110H85V90Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
              />
              <circle
                cx="100"
                cy="125"
                r="5"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              />
            </svg>
          </div>
          <h2
            className={`text-2xl md:text-3xl font-extrabold text-center font-poppins mb-3 ${
              darkMode ? "text-gray-100" : "text-gray-900"
            } animate-fade-in`}
          >
            Forgot Your Password?
          </h2>
          <p
            className={`text-center font-poppins text-sm leading-relaxed ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Don’t worry! We’ll send you a secure reset link to get back into
            your account.
          </p>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-6 md:p-8">
          {/* Mobile Header */}
          <div className="md:hidden text-center mb-6">
            <h2
              className={`text-2xl font-extrabold font-poppins ${
                darkMode ? "text-gray-100" : "text-gray-900"
              } animate-fade-in`}
            >
              Forgot Password?
            </h2>
            <p
              className={`mt-2 text-sm font-poppins ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              We’ll help you reset it securely.
            </p>
          </div>

          {/* Messages */}
          {message && (
            <div
              className={`mb-4 p-3 rounded-lg flex items-center animate-slide-in ${
                darkMode
                  ? "bg-green-900/60 text-green-300"
                  : "bg-green-100 text-green-700"
              } text-sm font-poppins`}
              role="alert"
            >
              <FaEnvelope className="mr-2 w-5 h-5" />
              {message}
            </div>
          )}
          {error && (
            <div
              className={`mb-4 p-3 rounded-lg flex items-center animate-slide-in ${
                darkMode
                  ? "bg-red-900/60 text-red-300"
                  : "bg-red-100 text-red-700"
              } text-sm font-poppins`}
              role="alert"
            >
              <FaSms className="mr-2 w-5 h-5" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                className={`block text-sm font-medium font-poppins mb-2 ${
                  darkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Receive Reset Link Via
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="method"
                    value="email"
                    checked={formData.method === "email"}
                    onChange={() => handleMethodChange("email")}
                    className="text-blue-500 focus:ring-blue-500 w-4 h-4"
                    aria-checked={formData.method === "email"}
                  />
                  <span
                    className={`font-poppins text-sm ${
                      darkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    Email
                  </span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="method"
                    value="sms"
                    checked={formData.method === "sms"}
                    onChange={() => handleMethodChange("sms")}
                    className="text-blue-500 focus:ring-blue-500 w-4 h-4"
                    aria-checked={formData.method === "sms"}
                  />
                  <span
                    className={`font-poppins text-sm ${
                      darkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    SMS
                  </span>
                </label>
              </div>
            </div>

            {formData.method === "email" ? (
              <div>
                <label
                  htmlFor="email"
                  className={`block text-sm font-medium font-poppins ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Email Address
                </label>
                <div className="relative mt-1">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className={`w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 ${
                      darkMode
                        ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-blue-400"
                        : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"
                    } font-poppins text-sm transition-all duration-200 hover:border-blue-400`}
                    required
                    aria-required="true"
                    aria-label="Email address for password reset"
                  />
                  <FaEnvelope
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    } w-5 h-5`}
                    aria-hidden="true"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label
                  htmlFor="phoneNumber"
                  className={`block text-sm font-medium font-poppins ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Phone Number
                </label>
                <div className="relative mt-1">
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className={`w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 ${
                      darkMode
                        ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-blue-400"
                        : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"
                    } font-poppins text-sm transition-all duration-200 hover:border-blue-400`}
                    required
                    aria-required="true"
                    aria-label="Phone number for password reset"
                  />
                  <FaSms
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    } w-5 h-5`}
                    aria-hidden="true"
                  />
                </div>
              </div>
            )}

            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              className={`w-full py-3 font-poppins text-sm font-semibold rounded-lg ${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 active:scale-95 touch-manipulation`}
              aria-label="Send password reset link"
            >
              {loading ? (
                <span
                  className="loader w-5 h-5 inline-block animate-spin border-2 border-t-transparent border-white rounded-full"
                  aria-label="Loading"
                ></span>
              ) : (
                <>
                  <FaLock className="w-4 h-4" aria-hidden="true" />
                  <span>Send Reset Link</span>
                </>
              )}
            </Button>
          </form>

          <p
            className={`text-sm text-center mt-4 font-poppins ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Remember your password?{" "}
            <Link
              to="/tenantlogin"
              className={`font-medium hover:underline ${
                darkMode ? "text-blue-400" : "text-blue-600"
              } transition-colors duration-200`}
              aria-label="Back to login page"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
