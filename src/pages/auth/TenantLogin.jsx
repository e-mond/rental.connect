import { useState } from "react";
import {  Link } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import TenantImage from "../../assets/Tenants.jpg";
import { BASE_URL } from "../../config";
import { useDarkMode } from "../../context/DarkModeContext";
import { useUser } from "../../context/useUser";
import Button from "../../components/Button";

const TenantLogin = () => {
  const { darkMode } = useDarkMode();
  const { login } = useUser();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "password" ? value.trim() : value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Login payload:", {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });
      const response = await fetch(`${BASE_URL}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid email or password");
      }

      const data = await response.json();
      const token = data.accessToken;

      if (token) {
        // Pass the role to login function
        await login(token, "TENANT");
        // Store additional data in localStorage
        localStorage.setItem("refreshToken", data.refreshToken || "");
        localStorage.setItem("customId", data.customId || "");
        localStorage.setItem("userId", data.userId || "");
      } else {
        setError("No token received from server");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "An error occurred during login");
      if (err.message.includes("Failed to fetch")) {
        setError("Unable to connect to the server. Please check your network.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex h-screen ${
        darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-900"
      }`}
    >
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

        <form className="w-full max-w-md space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-${
              darkMode ? "blue-400" : "blue-500"
            } ${
              darkMode
                ? "bg-gray-800 text-gray-200 border-gray-600"
                : "bg-white text-black border-gray-300"
            } font-poppins text-sm`}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-${
              darkMode ? "blue-400" : "blue-500"
            } ${
              darkMode
                ? "bg-gray-800 text-gray-200 border-gray-600"
                : "bg-white text-black border-gray-300"
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

          <Button
            variant="secondary"
            type="button"
            disabled
            className="w-full py-3 flex items-center justify-center gap-2 font-poppins text-sm font-semibold"
            title="Sign in with Google (Coming Soon)"
            aria-label="Sign in with Google (Coming Soon)"
          >
            <FaGoogle className={darkMode ? "text-red-400" : "text-red-500"} />{" "}
            Sign in with Google
          </Button>

          <div className="text-sm text-center">
            <Link
              to="/forgotpassword"
              className={`font-medium hover:underline ${
                darkMode ? "text-blue-400" : "text-blue-600"
              }`}
              aria-label="Forgot password"
            >
              Forgot Password?
            </Link>
          </div>

          <p
            className={`text-sm text-center ${
              darkMode ? "text-gray-400" : "text-gray-600"
            } font-poppins text-md`}
          >
            Do not have an account?{" "}
            <Link
              to="/signup"
              className={`font-medium hover:underline ${
                darkMode ? "text-blue-400" : "text-blue-600"
              }`}
              aria-label="Sign up for a tenant account"
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
