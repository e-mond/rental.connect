import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { Link } from "react-router-dom";
import LandlordImage from "../assets/Keys.jpg"; // Import local image

const LandlordLogin = () => {
  const navigate = useNavigate(); // Initialize navigation

  // Handle login submission
  const handleLogin = (e) => {
    e.preventDefault(); // Prevent page refresh
    navigate("/dashboard"); // Redirect to Landlord Dashboard
  };

  return (
    <div className="flex h-screen">
      {/* Left Section - Image with Overlay */}
      <div className="hidden lg:flex w-1/2 relative">
        <img
          src={LandlordImage}
          alt="Landlord Login"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/10 flex flex-col items-center justify-center text-white text-center p-8">
          <h2 className="text-4xl font-bold drop-shadow-lg">
            Welcome Back, Landlord
          </h2>
          <p className="mt-2 text-lg max-w-md font-medium drop-shadow-sm">
            Manage your properties effortlessly. Secure, simple, and efficient.
          </p>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">
          Landlord Login
        </h2>

        <form className="w-full max-w-md space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            required
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition"
          >
            Login
          </button>

          <div className="flex items-center justify-center gap-2">
            <div className="border-b border-gray-300 w-1/4"></div>
            <span className="text-gray-500">OR</span>
            <div className="border-b border-gray-300 w-1/4"></div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 border border-gray-400 py-3 rounded-md font-semibold hover:bg-gray-100 transition">
            <FaGoogle className="text-red-500" /> Sign in with Google
          </button>

          <p className="text-sm text-gray-600 text-center">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-500 font-medium hover:underline"
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
