import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FaGoogle } from "react-icons/fa";
import LandlordImage from "../../assets/Landlord.jpg";
import TenantImage from "../../assets/Ten-Keys.jpg";
import { jwtDecode } from "jwt-decode";
import authApi from "../../api/auth";
import ErrorDisplay from "../../components/ErrorDisplay";
import GlobalSkeleton from "../../components/GlobalSkeleton";
import { useDarkMode } from "../../hooks/useDarkMode";
import Button from "../../components/Button"; // Import Button component

// Country codes with emoji flags
const countryCodes = [
  { code: "+233", country: "Ghana", flag: "🇬🇭" }, // Default
  // African countries
  { code: "+254", country: "Kenya", flag: "🇰🇪" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+251", country: "Ethiopia", flag: "🇪🇹" },
  // European countries
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  // American countries
  { code: "+1", country: "USA", flag: "🇺🇸" },
  { code: "+1", country: "Canada", flag: "🇨🇦" },
  { code: "+52", country: "Mexico", flag: "🇲🇽" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+54", country: "Argentina", flag: "🇦🇷" },
];

const Signup = () => {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const [userType, setUserType] = useState("tenant");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    contact: "",
    businessName: "",
    employment: "",
    propertyManagementExperience: "",
    rentalHistory: "",
    countryCode: "+233", // Default to Ghana
  });
  const [passwordStrength, setPasswordStrength] = useState("");

  // Signup mutation using react-query
  const signupMutation = useMutation({
    mutationFn: (payload) => authApi.signup(payload),
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      try {
        const decodedToken = jwtDecode(data.token);
        console.log("Decoded token payload:", decodedToken);
        const expirationDate = new Date(decodedToken.exp * 1000);
        console.log("Token expiration:", expirationDate.toISOString());
      } catch (decodeError) {
        console.warn("Failed to decode token:", decodeError.message);
      }
      toast.success("Signup successful!");
      setTimeout(() => {
        navigate(`/account-success/${userType}`);
      }, 2000);
    },
    onError: (err) => {
      toast.error(err.message || "An error occurred during signup");
    },
    onSettled: () => {
      setTimeout(() => setLoading(false), 2000);
    },
  });

  const checkPasswordStrength = (password) => {
    if (password.length < 6) return "Weak";
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) return "Strong";
    return "Medium";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleCountryCodeChange = (e) => {
    setFormData((prev) => ({ ...prev, countryCode: e.target.value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }
    if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    ) {
      toast.error("Please enter a valid email address");
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    const payload = {
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      role: userType.toUpperCase(),
      contact: formData.contact
        ? `${formData.countryCode}${formData.contact}`
        : "",
      ...(userType === "landlord" && {
        businessName: formData.businessName,
        propertyManagementExperience: formData.propertyManagementExperience,
      }),
      ...(userType === "tenant" && {
        employment: formData.employment,
        rentalHistory: formData.rentalHistory,
      }),
    };

    signupMutation.mutate(payload);
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <div className="p-6 w-full">
          <GlobalSkeleton
            type="signup"
            bgColor={darkMode ? "bg-gray-600" : "bg-gray-300"}
            animationSpeed="1.5s"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-max">
      <div className="hidden lg:flex w-1/2 relative">
        <img
          src={userType === "tenant" ? TenantImage : LandlordImage}
          alt="Signup Background"
          className="absolute inset-0 w-full h-full object-cover rounded-lg"
        />
        <div
          className={`absolute top-1/3 left-1/2 transform -translate-x-1/2 p-8 rounded-xl shadow-lg w-3/4 text-center ${
            darkMode
              ? "bg-gray-900 bg-opacity-50 backdrop-blur-xl shadow-gray-700"
              : "bg-opacity-10 backdrop-blur-xl shadow-gray-300"
          }`}
        >
          <h2
            className={`text-3xl font-bold mb-4 ${
              darkMode ? "text-gray-200" : "text-white"
            }`}
          >
            {userType === "tenant"
              ? "Find Your Perfect Home"
              : "Simplify Property Management"}
          </h2>
          <p
            className={`text-md font-medium ${
              darkMode ? "text-gray-400" : "text-gray-200"
            }`}
          >
            {userType === "tenant"
              ? "Discover reliable landlords, manage your rental history, and stay informed with timely updates."
              : "Effortlessly handle your properties, screen tenants, and receive real-time notifications."}
          </p>
        </div>
      </div>

      <div
        className={`w-full lg:w-1/2 flex flex-col justify-center items-center p-6 ${
          darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-black"
        }`}
      >
        <h2 className="text-2xl font-bold mb-4">Create an Account</h2>

        <div className="flex space-x-4 mb-4">
          <Button
            variant={userType === "tenant" ? "primary" : "secondary"}
            onClick={() => setUserType("tenant")}
            className="text-md"
            aria-label="Select Tenant role"
          >
            Tenant
          </Button>
          <Button
            variant={userType === "landlord" ? "primary" : "secondary"}
            onClick={() => setUserType("landlord")}
            className="text-md"
            aria-label="Select Landlord role"
          >
            Landlord
          </Button>
        </div>

        <form
          className={`w-full max-w-md p-6 rounded-lg border shadow-lg ${
            darkMode
              ? "bg-gray-800 border-gray-700 shadow-gray-700"
              : "bg-white border-gray-300 shadow-gray-300"
          }`}
          onSubmit={handleSignup}
        >
          {signupMutation.isError && (
            <div className="mb-4">
              <ErrorDisplay error={signupMutation.error} />
            </div>
          )}

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            autoComplete="name"
            className={`w-full p-3 mb-4 border rounded-md text-md ${
              darkMode
                ? "bg-gray-700 text-gray-200 border-gray-600"
                : "bg-white text-black border-gray-300"
            }`}
            required
            value={formData.fullName}
            onChange={handleChange}
            aria-required="true"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            autoComplete="email"
            className={`w-full p-3 mb-4 border rounded-md text-md ${
              darkMode
                ? "bg-gray-700 text-gray-200 border-gray-600"
                : "bg-white text-black border-gray-300"
            }`}
            required
            value={formData.email}
            onChange={handleChange}
            aria-required="true"
          />
          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="new-password"
              className={`w-full p-3 mb-4 border rounded-md text-md ${
                darkMode
                  ? "bg-gray-700 text-gray-200 border-gray-600"
                  : "bg-white text-black border-gray-300"
              }`}
              required
              value={formData.password}
              onChange={handleChange}
              aria-required="true"
            />
            {passwordStrength && (
              <p
                className={`text-sm mb-4 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Password Strength: {passwordStrength}
              </p>
            )}
          </div>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            autoComplete="new-password"
            className={`w-full p-3 mb-4 border rounded-md text-md ${
              darkMode
                ? "bg-gray-700 text-gray-200 border-gray-600"
                : "bg-white text-black border-gray-300"
            }`}
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            aria-required="true"
          />
          <div className="mb-4">
            <label
              className={`block text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-black"
              }`}
            >
              Contact Number (Optional)
            </label>
            <div className="flex space-x-2">
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleCountryCodeChange}
                className={`w-1/3 p-2 border rounded-md text-md ${
                  darkMode
                    ? "bg-gray-700 text-gray-200 border-gray-600"
                    : "bg-white text-black border-gray-300"
                }`}
                aria-label="Select country code"
              >
                {countryCodes.map(({ code, country, flag }) => (
                  <option key={code + country} value={code}>
                    {flag} {code} ({country})
                  </option>
                ))}
              </select>
              <input
                type="tel"
                name="contact"
                placeholder="Phone Number"
                className={`w-2/3 p-2 border rounded-md text-md ${
                  darkMode
                    ? "bg-gray-700 text-gray-200 border-gray-600"
                    : "bg-white text-black border-gray-300"
                }`}
                value={formData.contact}
                onChange={handleChange}
                aria-label="Phone number (optional)"
              />
            </div>
          </div>

          {userType === "landlord" && (
            <div className="space-y-4">
              <input
                type="text"
                name="businessName"
                placeholder="Business Name"
                className={`w-full p-3 border rounded-md text-md ${
                  darkMode
                    ? "bg-gray-700 text-gray-200 border-gray-600"
                    : "bg-white text-black border-gray-300"
                }`}
                required
                value={formData.businessName}
                onChange={handleChange}
                aria-required="true"
              />
              <input
                type="text"
                name="propertyManagementExperience"
                placeholder="Property Management Experience (e.g., Years, Optional)"
                className={`w-full p-3 border rounded-md text-md ${
                  darkMode
                    ? "bg-gray-700 text-gray-200 border-gray-600"
                    : "bg-white text-black border-gray-300"
                }`}
                value={formData.propertyManagementExperience}
                onChange={handleChange}
              />
            </div>
          )}

          {userType === "tenant" && (
            <div className="space-y-4">
              <input
                type="text"
                name="employment"
                placeholder="Employment Status (Optional)"
                className={`w-full p-3 border rounded-md text-md ${
                  darkMode
                    ? "bg-gray-700 text-gray-200 border-gray-600"
                    : "bg-white text-black border-gray-300"
                }`}
                value={formData.employment}
                onChange={handleChange}
              />
              <input
                type="text"
                name="rentalHistory"
                placeholder="Rental History (e.g., Years Rented, Optional)"
                className={`w-full p-3 border rounded-md text-md ${
                  darkMode
                    ? "bg-gray-700 text-gray-200 border-gray-600"
                    : "bg-white text-black border-gray-300"
                }`}
                value={formData.rentalHistory}
                onChange={handleChange}
              />
            </div>
          )}

          <Button
            variant="primary"
            type="submit"
            disabled={signupMutation.isLoading}
            className="w-full py-3 mt-4 mb-4 font-bold text-md"
            aria-label="Sign Up"
          >
            {signupMutation.isLoading ? (
              <span className="loader w-5 h-5"></span>
            ) : (
              "Sign Up"
            )}
          </Button>

          <Button
            variant="secondary"
            as="div" // Use div since the button is disabled and not interactive
            disabled
            className="w-full py-3 mb-4 flex items-center justify-center gap-2 font-semibold text-md"
            aria-label="Sign in with Google (Coming Soon)"
          >
            <FaGoogle className={darkMode ? "text-red-400" : "text-red-500"} />{" "}
            Sign in with Google (Coming Soon)
          </Button>

          <p
            className={`text-sm text-center ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Already have an account?{" "}
            <Link
              to={`/${userType}login`}
              className={`font-medium hover:underline ${
                darkMode ? "text-blue-300" : "text-blue-500"
              }`}
              aria-label={`Log in as ${userType}`}
            >
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
