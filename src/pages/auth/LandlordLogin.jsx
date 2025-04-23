import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import LandlordImage from "../../assets/Keys.jpg";
import { jwtDecode } from "jwt-decode";
import { BASE_URL } from "../../config"; // Universal BASE_URL
import { useDarkMode } from "../../context/DarkModeContext"; // Updated import
import { useUser } from "../../context/UserContext"; // Add UserContext
import Button from "../../components/Button";

const LandlordLogin = () => {
  const { darkMode } = useDarkMode();
  const { setUser } = useUser(); // Add setUser from UserContext
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(""); // Add state for form fields
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const contentType = response.headers.get("Content-Type");
        let errorMessage = "Login failed";
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } else {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get("Content-Type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response format: Expected JSON");
      }

      const text = await response.text();
      if (!text) {
        throw new Error("Empty response from server");
      }

      const data = JSON.parse(text);
      console.log("Login response:", data);

      if (data.error) {
        throw new Error(data.error);
      }

      const token = data.token;
      if (token) {
        localStorage.setItem("token", token);
        console.log("Token stored:", token);

        let role = "LANDLORD";
        let decodedToken;
        try {
          decodedToken = jwtDecode(token);
          console.log("Decoded token payload:", decodedToken);
          role = (decodedToken.role || "LANDLORD").toUpperCase();
          console.log("Decoded role:", role);
          const expirationDate = new Date(decodedToken.exp * 1000);
          console.log("Token expiration:", expirationDate.toISOString());
        } catch (decodeError) {
          console.warn("Failed to decode token:", decodeError.message);
        }

        // Update UserContext with the logged-in user
        setUser({
          email: decodedToken.sub,
          role: role,
          id: decodedToken.id,
        });

        // Redirect based on role
        if (role === "LANDLORD") {
          navigate("/dashboard/landlord", { replace: true });
        } else if (role === "TENANT") {
          navigate("/dashboard/tenant", { replace: true });
        } else {
          setError("Unknown user role");
          localStorage.removeItem("token");
          return;
        }

        // Reset form fields to prevent resubmission
        setEmail("");
        setPassword("");
      } else {
        setError("No token received from server");
      }
    } catch (err) {
      if (err.message.includes("Failed to fetch")) {
        setError(
          "Unable to connect to the server. Please check your network or try again later."
        );
      } else {
        setError(err.message || "An error occurred during login");
      }
      console.error("Login error:", err);
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
          src={LandlordImage}
          alt="Landlord Login"
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
              Welcome Back, Landlord
            </h2>
            <p className="mt-3 text-lg max-w-md font-poppins font-light drop-shadow-sm leading-relaxed">
              Manage your properties effortlessly. Secure, simple, and
              efficient.
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
          Landlord Login
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
            placeholder="Email Address"
            autoComplete="email"
            value={email} // Add controlled input
            onChange={(e) => setEmail(e.target.value)} // Add onChange handler
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
            value={password} // Add controlled input
            onChange={(e) => setPassword(e.target.value)} // Add onChange handler
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
            aria-label="Login to landlord account"
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
            className="w-full py-3 flex items-center justify-center gap-2 font-poppins text-sm"
            title="Coming Soon"
            aria-label="Sign in with Google (Coming Soon)"
          >
            <FaGoogle className={darkMode ? "text-red-400" : "text-red-500"} />{" "}
            Sign in with Google
          </Button>

          <p
            className={`text-sm text-center ${
              darkMode ? "text-gray-400" : "text-gray-600"
            } font-poppins`}
          >
            Don’t have an account?{" "}
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

export default LandlordLogin;
