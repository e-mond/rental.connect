import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import TenantImage from "../../assets/Tenants.jpg";
import { jwtDecode } from "jwt-decode";
import { BASE_URL } from "../../config";
import { useDarkMode } from "../../context/DarkModeContext";
import { useUser } from "../../context/useUser"; // Import useUser to access login function
import Button from "../../components/Button";

/**
 * TenantLogin component handles the login functionality for tenants.
 * It submits email and password to the backend, stores the received JWT token,
 * and redirects to the appropriate dashboard based on the user's role.
 */
const TenantLogin = () => {
  const { darkMode } = useDarkMode(); // Access dark mode state from context
  const { login } = useUser(); // Access login function from UserContext to handle token
  const navigate = useNavigate(); // Hook for programmatic navigation
  const [error, setError] = useState(""); // State for error messages
  const [loading, setLoading] = useState(false); // State for loading indicator

  /**
   * Handles the login form submission.
   * Sends a POST request to the backend's login endpoint with email and password.
   * Uses the UserContext login function to store the token and redirect based on role.
   * @param {Event} e - The form submission event
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Prepare form data for the login request
    const formData = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    try {
      // Send POST request to the backend login endpoint
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers.get("Content-Type"));

      // Check if the response is not OK (e.g., 401, 400)
      if (!response.ok) {
        const contentType = response.headers.get("Content-Type");
        let errorMessage = "Invalid email or password. Please try again.";
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } else {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Verify the response is in JSON format
      const contentType = response.headers.get("Content-Type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Something went wrong. Please try again later.");
      }

      // Parse the response body
      const text = await response.text();
      if (!text) {
        throw new Error("Something went wrong. Please try again later.");
      }

      const data = JSON.parse(text);
      console.log("Login response:", data);

      // Extract the JWT token from the response
      const token = data.token;
      if (token) {
        // Use the login function from UserContext to handle token and update user state
        login(token);

        // Decode the token to extract the role
        let role = "TENANT";
        try {
          const decodedToken = jwtDecode(token);
          console.log("Decoded token payload:", decodedToken);
          role = (decodedToken.role || "TENANT").toUpperCase();
          console.log("Decoded role:", role);
          const expirationDate = new Date(decodedToken.exp * 1000);
          console.log("Token expiration:", expirationDate.toISOString());
        } catch (decodeError) {
          console.warn("Failed to decode token:", decodeError.message);
        }

        // Redirect based on the user's role
        if (role === "LANDLORD") {
          navigate("/dashboard/landlord");
        } else if (role === "TENANT") {
          navigate("/dashboard/tenant");
        } else {
          setError("Unable to determine user role. Please contact support.");
        }
      } else {
        setError("Authentication failed. Please try again.");
      }
    } catch (err) {
      // Handle network errors (e.g., server down)
      if (err.message.includes("Failed to fetch")) {
        setError(
          "Unable to connect to the server. Please check your internet connection and try again."
        );
      } else {
        setError(err.message || "An error occurred. Please try again.");
      }
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Render the login page
  return (
    <div
      className={`flex h-screen ${
        darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-900"
      }`}
    >
      {/* Left Section: Decorative Image (Visible on large screens) */}
      <div className="hidden lg:flex w-1/2 relative">
        <img
          src={TenantImage}
          alt="Tenant Login"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className={`absolute inset-0 ${
            darkMode
              ? "bg-gradient-to-b from-gray-800/60 to-gray-900/20"
              : "bg-gradient-to-b from-black/40 to-black/10"
          } flex flex-col items-center justify-center text-white text-center p-8`}
        >
          <div className="relative backdrop-blur-md bg-white/10 border border-white/20 rounded-lg py-6 px-8 shadow-lg">
            <h2 className="text-4xl font-bold font-playfair tracking-tight drop-shadow-md">
              Welcome Home
            </h2>
            <p className="mt-3 text-lg max-w-md font-poppins font-light drop-shadow-sm leading-relaxed">
              Secure, simple, and seamless renting. Log in and take control.
            </p>
          </div>
        </div>
      </div>

      {/* Right Section: Login Form */}
      <div
        className={`w-full lg:w-1/2 flex flex-col justify-center items-center p-8 ${
          darkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        <h2
          className={`text-3xl font-bold mb-6 font-poppins ${
            darkMode ? "text-gray-200" : "text-gray-900"
          }`}
        >
          Tenant Login
        </h2>

        {/* Error Message Display */}
        {error && (
          <div
            className={`w-full max-w-md mb-4 p-3 rounded-md ${
              darkMode
                ? "bg-red-800/50 text-red-300"
                : "bg-red-100 text-red-700"
            }`}
          >
            {error}
          </div>
        )}

        {/* Login Form */}
        <form className="w-full max-w-md space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            autoComplete="email"
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-${
              darkMode ? "blue-400" : "black"
            } ${
              darkMode
                ? "bg-gray-800 text-gray-200 border-gray-600"
                : "bg-white text-gray-900 border-gray-300"
            } font-poppins text-sm`}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="current-password"
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-${
              darkMode ? "blue-400" : "black"
            } ${
              darkMode
                ? "bg-gray-800 text-gray-200 border-gray-600"
                : "bg-white text-gray-900 border-gray-300"
            } font-poppins text-sm`}
            required
          />

          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            className="w-full py-3 font-poppins text-sm"
            aria-label="Login to tenant account"
          >
            {loading ? <span className="loader w-5 h-5"></span> : "Login"}
          </Button>

          {/* Divider for alternative login options */}
          <div className="flex items-center justify-center gap-2">
            <div
              className={`border-b ${
                darkMode ? "border-gray-600" : "border-gray-300"
              } w-1/4`}
            ></div>
            <span
              className={`${
                darkMode ? "text-gray-400" : "text-gray-500"
              } font-poppins text-sm`}
            >
              OR
            </span>
            <div
              className={`border-b ${
                darkMode ? "border-gray-600" : "border-gray-300"
              } w-1/4`}
            ></div>
          </div>

          {/* Google Sign-In Button (Disabled) */}
          <Button
            variant="secondary"
            type="button"
            disabled
            className="w-full py-3 flex items-center justify-center gap-2 font-poppins text-sm"
            title="Coming Soon"
            aria-label="Sign in with Google (Coming Soon)"
          >
            <FaGoogle className={darkMode ? "text-red-400" : "text-red-500"} />{" "}
            Sign in with Google
          </Button>

          {/* Link to Sign Up */}
          <p
            className={`text-sm text-center ${
              darkMode ? "text-gray-400" : "text-gray-600"
            } font-poppins`}
          >
            Do not have an account?{" "}
            <Link
              to="/signup"
              className={`${
                darkMode ? "text-blue-400" : "text-blue-500"
              } font-medium hover:underline`}
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default TenantLogin;
