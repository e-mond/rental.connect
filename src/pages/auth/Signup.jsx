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
import Button from "../../components/Button";
import { useUser } from "../../context/useUser";

// Country codes with emoji flags for phone number input
const countryCodes = [
  { code: "+233", country: "Ghana", flag: "🇬🇭" },
  { code: "+254", country: "Kenya", flag: "🇰🇪" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+251", country: "Ethiopia", flag: "🇪🇹" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+1", country: "USA", flag: "🇺🇸" },
  { code: "+1", country: "Canada", flag: "🇨🇦" },
  { code: "+52", country: "Mexico", flag: "🇲🇽" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+54", country: "Argentina", flag: "🇦🇷" },
];

const Signup = () => {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const { login } = useUser();

  const [userType, setUserType] = useState("tenant");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    contact: "",
    businessName: "",
    employment: "",
    propertyManagementExperience: "",
    rentalHistory: "",
    countryCode: "+233",
  });
  const [passwordStrength, setPasswordStrength] = useState("");

  const checkPasswordStrength = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) return "Weak";
    const strengthScore =
      (hasUpperCase ? 1 : 0) +
      (hasLowerCase ? 1 : 0) +
      (hasNumber ? 1 : 0) +
      (hasSpecialChar ? 1 : 0);

    if (strengthScore >= 3) return "Strong";
    if (strengthScore >= 2) return "Medium";
    return "Weak";
  };

  const sanitizeInput = (input) => {
    return input.replace(/[<>{}]/g, "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(sanitizedValue));
    }
  };

  const handleCountryCodeChange = (e) => {
    setFormData((prev) => ({ ...prev, countryCode: e.target.value }));
  };

  const signupMutation = useMutation({
    mutationFn: (payload) => authApi.signup(payload),
    mutationKey: ["signup"],
    timeout: 10000,
    onSuccess: (data) => {
      console.log("Signup onSuccess - User registered:", {
        userId: data.user?.id,
        email: data.user?.email,
        role: data.user?.role,
      });
      if (!data || !data.accessToken) {
        console.error("No access token in response:", data);
        toast.error("Signup successful, but no token received. Please log in.");
        navigate(`/${userType}login`);
        return;
      }

      try {
        const decodedToken = jwtDecode(data.accessToken);
        console.log("Decoded token payload:", {
          userId: decodedToken.userId,
          email: decodedToken.sub,
          role: decodedToken.role,
        });
        const expirationDate = new Date(decodedToken.exp * 1000);
        console.log("Token expiration:", expirationDate.toISOString());
      } catch (decodeError) {
        console.error("Failed to decode token:", decodeError.message);
        toast.warn("Token decoding failed, but signup was successful.");
      }

      // Login with the token, indicating this is a post-signup flow
      login(data.accessToken, data.user?.role, true);

      toast.success("Signup successful!");
      console.log(
        "Navigating to:",
        userType === "tenant"
          ? "/account-success/tenant"
          : "/account-success/landlord"
      );
      setTimeout(() => {
        navigate(
          userType === "tenant"
            ? "/account-success/tenant"
            : "/account-success/landlord",
          { replace: true }
        );
      }, 500);
    },
    onError: (err) => {
      console.error("Signup onError:", err);
      let errorMessage = "An error occurred during signup";
      if (err.response) {
        const { status, data } = err.response;
        console.log("Error response details:", { status, data });
        if (status === 400) {
          if (data.error === "businessName is required for landlords") {
            errorMessage = "Business Name is required for landlord accounts.";
          } else if (data.error) {
            errorMessage = data.error;
          } else {
            errorMessage = "Invalid signup data. Please check your inputs.";
          }
        } else if (status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage = "Unexpected error. Please try again.";
        }
      } else if (err.request) {
        errorMessage = "Network error. Please check your connection.";
      } else if (err.code === "ECONNABORTED") {
        errorMessage = "Request timed out. Please try again.";
      } else {
        errorMessage = err.message || "An unexpected error occurred.";
      }
      toast.error(errorMessage);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

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
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }
    if (passwordStrength === "Weak") {
      toast.error(
        "Password is too weak. Please include uppercase, lowercase, numbers, and special characters."
      );
      setLoading(false);
      return;
    }
    if (formData.contact) {
      const phonePattern = /^\d{7,15}$/;
      if (!phonePattern.test(formData.contact)) {
        toast.error("Please enter a valid phone number (7-15 digits)");
        setLoading(false);
        return;
      }
    }
    if (userType === "landlord" && !formData.businessName) {
      toast.error("Business Name is required for landlords");
      setLoading(false);
      return;
    }
    if (!formData.firstName) {
      toast.error("First Name is required");
      setLoading(false);
      return;
    }

    const payload = {
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      role: userType.toUpperCase(),
      phoneNumber: formData.contact
        ? `${formData.countryCode}${formData.contact}`
        : "",
      language: "English (UK)",
      timeZone: "Greenwich Mean Time (GMT)",
      currency: "GHS (₵)",
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: true,
      ...(userType === "landlord" && {
        businessName: formData.businessName.trim(),
        propertyManagementExperience:
          formData.propertyManagementExperience.trim(),
      }),
      ...(userType === "tenant" && {
        employment: formData.employment.trim(),
        rentalHistory: formData.rentalHistory.trim(),
      }),
    };

    console.log("Signup payload:", {
      email: payload.email,
      role: payload.role,
      firstName: payload.firstName,
      ...(payload.businessName && { businessName: payload.businessName }),
    });
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
            name="firstName"
            placeholder="First Name"
            autoComplete="given-name"
            className={`w-full p-3 mb-4 border rounded-md text-md ${
              darkMode
                ? "bg-gray-700 text-gray-200 border-gray-600"
                : "bg-white text-black border-gray-300"
            }`}
            required
            value={formData.firstName}
            onChange={handleChange}
            aria-required="true"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            autoComplete="family-name"
            className={`w-full p-3 mb-4 border rounded-md text-md ${
              darkMode
                ? "bg-gray-700 text-gray-200 border-gray-600"
                : "bg-white text-black border-gray-300"
            }`}
            value={formData.lastName}
            onChange={handleChange}
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
            as="div"
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