import { FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import LandlordImage from "../assets/Landlord.jpg";
import TenantImage from "../assets/Ten-Keys.jpg";

const Signup = () => {
  const [userType, setUserType] = useState("tenant");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = {
      fullName: e.target.fullName.value,
      email: e.target.email.value,
      password: e.target.password.value,
      confirmPassword: e.target.confirmPassword.value,
      ...(userType === "landlord" && {
        numberOfProperties: e.target.numberOfProperties?.value,
        primaryLocation: e.target.primaryLocation?.value,
      }),
      userType,
    };

    try {
      console.log("Signup Data: ", formData);
      setTimeout(() => {
        navigate(`/account-success/${userType}`);
      }, 2000);
    } catch (err) {
      console.error("Signup failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-max">
      {/* Left Section - Image with Glassmorphic Overlay */}
      <div className="hidden lg:flex w-1/2 relative">
        <img
          src={userType === "tenant" ? TenantImage : LandlordImage}
          alt="Signup Background"
          className="absolute inset-0 w-full h-full object-cover rounded-lg"
        />

        {/* Glassmorphic Text Box */}
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 p-8  bg-opacity-10 backdrop-blur-xl rounded-xl shadow-lg w-3/4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {userType === "tenant"
              ? "Find Your Perfect Home"
              : "Simplify Property Management"}
          </h2>
          <p className="text-md text-gray-200 font-medium">
            {userType === "tenant"
              ? "Discover reliable landlords, manage your rental history, and stay informed with timely updates."
              : "Effortlessly handle your properties, screen tenants, and receive real-time notifications."}
          </p>
        </div>
      </div>

      {/* Right Section - Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 bg-white">
        <h2 className="text-2xl font-bold mb-4">Create an Account</h2>

        {/* User Type Toggle */}
        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded-md text-md font-semibold transition-colors ${
              userType === "tenant" ? "bg-black text-white" : "bg-gray-200"
            }`}
            onClick={() => setUserType("tenant")}
          >
            Tenant
          </button>
          <button
            className={`px-4 py-2 rounded-md text-md font-semibold transition-colors ${
              userType === "landlord" ? "bg-black text-white" : "bg-gray-200"
            }`}
            onClick={() => setUserType("landlord")}
          >
            Landlord
          </button>
        </div>

        {/* Signup Form */}
        <form
          className="w-full max-w-md p-6 rounded-lg border border-gray-300 bg-white shadow-lg"
          onSubmit={handleSignup}
        >
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            className="w-full p-3 mb-4 border border-gray-300 rounded-md text-md"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full p-3 mb-4 border border-gray-300 rounded-md text-md"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 mb-4 border border-gray-300 rounded-md text-md"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full p-3 mb-4 border border-gray-300 rounded-md text-md"
            required
          />

          {/* Landlord-Specific Fields */}
          {userType === "landlord" && (
            <div className="space-y-4">
              <input
                type="number"
                name="numberOfProperties"
                placeholder="Number of Properties"
                className="w-full p-3 border border-gray-300 rounded-md text-md"
                required
              />
              <input
                type="text"
                name="primaryLocation"
                placeholder="Primary Property Location"
                className="w-full p-3 border border-gray-300 rounded-md text-md"
                required
              />
            </div>
          )}

          <button
            className="w-full bg-black text-white py-3 mt-4 rounded-md font-bold text-md hover:bg-gray-800 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <div className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></div>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
