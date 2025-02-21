import { FaGoogle } from "react-icons/fa";
import { useState } from "react";

const AuthPage = ({ userType }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt:", formData);
  };

  return (
    <div className="flex h-screen">
      {/* Left Section - Image */}
      <div className="hidden lg:flex w-1/2 bg-gray-200 items-center justify-center">
        <img
          src={
            userType === "tenant"
              ? "/images/tenant-login.jpg"
              : "/images/landlord-login.jpg"
          }
          alt={`${userType} login`}
          className="w-3/4 h-auto object-cover rounded-lg"
        />
      </div>

      {/* Right Section - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
        <h2 className="text-3xl font-bold mb-4">
          {userType === "tenant" ? "Tenant Login" : "Landlord Login"}
        </h2>

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            autoComplete="email"
            className="w-full p-3 border border-gray-300 rounded-md"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="current-password"
            className="w-full p-3 border border-gray-300 rounded-md"
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800"
          >
            Login
          </button>

          <div className="flex items-center justify-center gap-2">
            <div className="border-b border-gray-300 w-1/3"></div>
            <span className="text-gray-600">OR</span>
            <div className="border-b border-gray-300 w-1/3"></div>
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 border border-gray-400 py-3 rounded-md font-semibold hover:bg-gray-100"
          >
            <FaGoogle className="text-red-500" /> Sign in with Google
          </button>

          <p className="text-sm text-gray-600 text-center">
            Don't have an account?{" "}
            <a href={`/${userType}-signup`} className="text-blue-500">
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
