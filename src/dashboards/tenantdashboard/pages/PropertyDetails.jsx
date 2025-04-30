import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { GiWashingMachine } from "react-icons/gi";
import { FaParking, FaSnowflake } from "react-icons/fa";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../config";
import GlobalSkeleton from "../../../components/GlobalSkeleton";
import { useDarkMode } from "../../../context/DarkModeContext";

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [viewingDate, setViewingDate] = useState("");
  const [applicationDetails, setApplicationDetails] = useState({
    fullName: "",
    email: "",
    phone: "",
    moveInDate: "",
    occupants: 1,
    message: "",
  });
  const [modalError, setModalError] = useState("");
  const [modalSuccess, setModalSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();

  // Fetch property and user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found. Please log in.");
        }

        const propertyResponse = await fetch(
          `${BASE_URL}/api/properties/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!propertyResponse.ok) {
          const errorText = await propertyResponse.text();
          if (propertyResponse.status === 401) {
            throw new Error("Session expired. Please log in again.");
          }
          if (propertyResponse.status === 404) {
            throw new Error("Property not found.");
          }
          throw new Error(
            `Failed to fetch property: ${errorText || "Unknown error"}`
          );
        }

        const propertyData = await propertyResponse.json();
        setProperty(propertyData);

        const userResponse = await fetch(`${BASE_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!userResponse.ok) {
          const errorText = await userResponse.text();
          throw new Error(
            `Failed to fetch user: ${errorText || "Unknown error"}`
          );
        }

        const userData = await userResponse.json();
        setUser(userData);
        setApplicationDetails({
          fullName: userData.fullName || "",
          email: userData.email || "",
          phone: userData.phone || "",
          moveInDate: "",
          occupants: 1,
          message: "",
        });
      } catch (err) {
        setError(err.message);
        toast.error(err.message, { position: "top-right", autoClose: 3000 });
        if (err.message.includes("token") || err.message.includes("401")) {
          localStorage.removeItem("token");
          navigate("/tenantlogin");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  // Handle scheduling a viewing
  const handleScheduleViewing = async (e) => {
    e.preventDefault();
    setModalError("");
    setModalSuccess("");
    setIsSubmitting(true);

    if (!viewingDate) {
      setModalError("Please select a date and time for the viewing.");
      toast.error("Please select a date and time for the viewing.", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsSubmitting(false);
      return;
    }

    const selectedDate = new Date(viewingDate);
    const now = new Date();
    if (selectedDate <= now) {
      setModalError("Please select a future date and time for the viewing.");
      toast.error("Please select a future date and time for the viewing.", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsSubmitting(false);
      return;
    }

    if (!termsAccepted) {
      setModalError("Please accept the terms to proceed.");
      toast.error("Please accept the terms to proceed.", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      if (user?.role !== "TENANT") {
        throw new Error("Only tenants can schedule viewings.");
      }

      const response = await fetch(
        `${BASE_URL}/api/properties/${id}/schedule`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            viewingDate,
            tenantId: user?.id,
            propertyId: id,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 401) {
          throw new Error("Session expired. Please log in again.");
        }
        throw new Error(
          `Failed to schedule viewing: ${errorText || "Unknown error"}`
        );
      }

      const responseData = await response.json();
      const successMessage =
        responseData.message || "Viewing scheduled successfully!";
      setModalSuccess(successMessage);
      toast.success(successMessage, {
        position: "top-right",
        autoClose: 3000,
      });
      setViewingDate("");
      setTermsAccepted(false);
      setTimeout(() => {
        setShowScheduleModal(false);
        navigate("/dashboard/tenant/search");
      }, 2000);
    } catch (err) {
      setModalError(err.message);
      toast.error(err.message, { position: "top-right", autoClose: 3000 });
      if (err.message.includes("token") || err.message.includes("401")) {
        localStorage.removeItem("token");
        setModalError("Session expired. Redirecting to login...");
        setTimeout(() => {
          navigate("/tenantlogin");
        }, 2000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle submitting an application
  const handleApplyNow = async (e) => {
    e.preventDefault();
    setModalError("");
    setModalSuccess("");
    setIsSubmitting(true);

    const { fullName, email, phone, moveInDate, occupants } =
      applicationDetails;
    if (!fullName || !email || !phone || !moveInDate || !occupants) {
      setModalError("Please fill in all required fields.");
      toast.error("Please fill in all required fields.", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setModalError("Please enter a valid email address.");
      toast.error("Please enter a valid email address.", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsSubmitting(false);
      return;
    }

    const phoneRegex = /^\+?\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
      setModalError("Please enter a valid phone number (10-15 digits).");
      toast.error("Please enter a valid phone number (10-15 digits).", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsSubmitting(false);
      return;
    }

    const selectedMoveInDate = new Date(moveInDate);
    const now = new Date();
    if (selectedMoveInDate <= now) {
      setModalError("Please select a future move-in date.");
      toast.error("Please select a future move-in date.", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsSubmitting(false);
      return;
    }

    if (occupants < 1) {
      setModalError("Number of occupants must be at least 1.");
      toast.error("Number of occupants must be at least 1.", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsSubmitting(false);
      return;
    }

    if (!termsAccepted) {
      setModalError("Please accept the terms to proceed.");
      toast.error("Please accept the terms to proceed.", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      if (user?.role !== "TENANT") {
        throw new Error("Only tenants can submit applications.");
      }

      const response = await fetch(`${BASE_URL}/api/properties/${id}/apply`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tenantId: user?.id,
          propertyId: id,
          fullName,
          email,
          phone,
          moveInDate,
          occupants,
          message: applicationDetails.message,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 401) {
          throw new Error("Session expired. Please log in again.");
        }
        throw new Error(
          `Failed to submit application: ${errorText || "Unknown error"}`
        );
      }

      const responseData = await response.json();
      const successMessage =
        responseData.message || "Application submitted successfully!";
      setModalSuccess(successMessage);
      toast.success(successMessage, {
        position: "top-right",
        autoClose: 3000,
      });
      setApplicationDetails({
        fullName: user?.fullName || "",
        email: user?.email || "",
        phone: user?.phone || "",
        moveInDate: "",
        occupants: 1,
        message: "",
      });
      setTermsAccepted(false);
      setTimeout(() => {
        setShowApplyModal(false);
        navigate("/dashboard/tenant/search");
      }, 2000);
    } catch (err) {
      setModalError(err.message);
      toast.error(err.message, { position: "top-right", autoClose: 3000 });
      if (err.message.includes("token") || err.message.includes("401")) {
        localStorage.removeItem("token");
        setModalError("Session expired. Redirecting to login...");
        setTimeout(() => {
          navigate("/tenantlogin");
        }, 2000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:max-w-6xl lg:p-8">
        <div className="animate-customPulse bg-gray-300 w-full h-64 sm:h-80 lg:h-96 rounded-lg mb-6 lg:mb-8" />
        <div className="animate-customPulse bg-gray-300 h-4 w-1/2 rounded mb-4 lg:mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 lg:gap-6 lg:mb-8">
          <GlobalSkeleton
            type="property-details"
            bgColor={darkMode ? "bg-gray-700" : "bg-blue-50"}
            animationSpeed="1.2s"
          />
        </div>
        <div className="mb-6 lg:mb-8">
          <div className="animate-customPulse bg-gray-300 h-6 w-1/4 rounded mb-4" />
          <div className="flex flex-wrap gap-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className={`animate-customPulse ${
                  darkMode ? "bg-gray-700" : "bg-blue-50"
                } p-3 rounded-lg w-32 h-10`}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-center sm:justify-start gap-4">
          <div className="animate-customPulse bg-gray-300 h-10 w-32 rounded-lg lg:h-12 lg:w-40" />
          <div className="animate-customPulse bg-gray-300 h-10 w-32 rounded-lg lg:h-12 lg:w-40" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:max-w-6xl lg:p-8 text-center">
        <p className="text-red-500 mb-4 text-base lg:text-lg">{error}</p>
        <Link
          to="/dashboard/tenant/search"
          className={`${
            darkMode
              ? "text-blue-400 hover:text-blue-300"
              : "text-blue-600 hover:text-blue-700"
          } hover:underline text-base lg:text-lg`}
        >
          Back to Property Search
        </Link>
      </div>
    );
  }

  // Property not found
  if (!property) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:max-w-6xl lg:p-8 text-center">
        <p
          className={`${
            darkMode ? "text-gray-400" : "text-gray-500"
          } mb-4 text-base lg:text-lg`}
        >
          Property not found.
        </p>
        <Link
          to="/dashboard/tenant/search"
          className={`${
            darkMode
              ? "text-blue-400 hover:text-blue-300"
              : "text-blue-600 hover:text-blue-700"
          } hover:underline text-base lg:text-lg`}
        >
          Back to Property Search
        </Link>
      </div>
    );
  }

  // Determine image to display
  const displayImage = property.primaryImageUrl
    ? `${BASE_URL}${property.primaryImageUrl}`
    : property.imageUrls && property.imageUrls.length > 0
    ? `${BASE_URL}${property.imageUrls[0]}`
    : null;

  return (
    <div
      className={`max-w-2xl mx-auto p-4 sm:p-6 lg:max-w-6xl lg:p-8 ${
        darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-800"
      }`}
    >
      {/* Property Image */}
      <div className="mb-6 lg:mb-8">
        {displayImage ? (
          <img
            src={displayImage}
            alt={property.title}
            className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-64 sm:h-80 lg:h-96 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
      </div>

      {/* Breadcrumb Navigation */}
      <nav
        className={`text-sm lg:text-base ${
          darkMode ? "text-gray-400" : "text-gray-600"
        } mb-4 lg:mb-6`}
      >
        <Link
          to="/dashboard/tenant/dashboard"
          className={`${
            darkMode ? "hover:text-gray-300" : "hover:text-gray-700"
          } hover:underline`}
        >
          Dashboard
        </Link>
        {" > "}
        <Link
          to="/dashboard/tenant/search"
          className={`${
            darkMode ? "hover:text-gray-300" : "hover:text-gray-700"
          } hover:underline`}
        >
          Property Search
        </Link>
        {" > "}
        <span className={darkMode ? "text-gray-100" : "text-gray-800"}>
          {property.title}
        </span>
      </nav>

      {/* Property Details Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 lg:gap-6 lg:mb-8">
        <div
          className={`${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-blue-50 border-gray-200"
          } p-4 rounded-lg lg:p-5 border`}
        >
          <h2
            className={`text-lg font-semibold mb-2 lg:text-xl lg:mb-3 ${
              darkMode ? "text-gray-100" : "text-gray-800"
            }`}
          >
            Property Details
          </h2>
          <p
            className={`${
              darkMode ? "text-gray-300" : "text-gray-700"
            } text-sm lg:text-base`}
          >
            {property.bedrooms}{" "}
            {property.isSharedBedrooms ? "Shared Bedrooms" : "Bedrooms"} •{" "}
            {property.bathrooms}{" "}
            {property.isSharedBathrooms ? "Shared Bathrooms" : "Bathrooms"} •{" "}
            {property.squareFeet} sq ft • Built in {property.builtYear} •
            Available from {property.availableFrom}
          </p>
        </div>
        <div
          className={`${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-blue-50 border-gray-200"
          } p-4 rounded-lg lg:p-5 border`}
        >
          <h2
            className={`text-lg font-semibold mb-2 lg:text-xl lg:mb-3 ${
              darkMode ? "text-gray-100" : "text-gray-800"
            }`}
          >
            Monthly Rent
          </h2>
          <p
            className={`${
              darkMode ? "text-gray-300" : "text-gray-700"
            } text-sm lg:text-base`}
          >
            {property.currency}
            {property.price.toLocaleString()}/month{" "}
            {property.utilitiesIncluded
              ? "Utilities Included"
              : "Utilities not included"}
          </p>
        </div>
        <div
          className={`${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-blue-50 border-gray-200"
          } p-4 rounded-lg lg:p-5 border`}
        >
          <h2
            className={`text-lg font-semibold mb-2 lg:text-xl lg:mb-3 ${
              darkMode ? "text-gray-100" : "text-gray-800"
            }`}
          >
            Location
          </h2>
          <p
            className={`${
              darkMode ? "text-gray-300" : "text-gray-700"
            } text-sm lg:text-base`}
          >
            {property.location}
          </p>
        </div>
      </div>

      {/* Amenities Section */}
      <div className="mb-6 lg:mb-8">
        <h2
          className={`text-lg font-semibold mb-4 lg:text-xl lg:mb-6 ${
            darkMode ? "text-gray-100" : "text-gray-800"
          }`}
        >
          Amenities
        </h2>
        <div className="flex flex-wrap gap-4 lg:gap-6">
          {property.amenities &&
            property.amenities.map((amenity, index) => (
              <div
                key={index}
                className={`flex items-center ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-blue-50 border-gray-200"
                } p-3 rounded-lg lg:p-4 border`}
              >
                {amenity === "In-unit Laundry" && (
                  <GiWashingMachine
                    className={`w-6 h-6 ${
                      darkMode ? "text-blue-400" : "text-blue-500"
                    } mr-2 lg:w-7 lg:h-7 lg:mr-3`}
                  />
                )}
                {amenity === "Central AC" && (
                  <FaSnowflake
                    className={`w-6 h-6 ${
                      darkMode ? "text-blue-400" : "text-blue-500"
                    } mr-2 lg:w-7 lg:h-7 lg:mr-3`}
                  />
                )}
                {amenity === "Parking Included" && (
                  <FaParking
                    className={`w-6 h-6 ${
                      darkMode ? "text-blue-400" : "text-blue-500"
                    } mr-2 lg:w-7 lg:h-7 lg:mr-3`}
                  />
                )}
                <span
                  className={`${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  } text-sm lg:text-base`}
                >
                  {amenity}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center sm:justify-start gap-4">
        <button
          onClick={() => {
            setShowScheduleModal(true);
            setModalError("");
            setModalSuccess("");
            setTermsAccepted(false);
          }}
          className={`${
            darkMode
              ? "bg-blue-500 hover:bg-blue-600 text-gray-100"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          } px-4 py-2 rounded-lg transition text-sm lg:text-base lg:px-6 lg:py-3`}
        >
          Schedule Viewing
        </button>
        <button
          onClick={() => {
            setShowApplyModal(true);
            setModalError("");
            setModalSuccess("");
            setTermsAccepted(false);
          }}
          className={`${
            darkMode
              ? "bg-blue-500 hover:bg-blue-600 text-gray-100"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          } px-4 py-2 rounded-lg transition text-sm lg:text-base lg:px-6 lg:py-3`}
        >
          Apply Now
        </button>
      </div>

      {/* Schedule Viewing Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`${
              darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
            } p-4 sm:p-6 rounded-lg w-11/12 max-w-md max-h-[80vh] overflow-y-auto`}
          >
            <h2 className="text-lg font-semibold mb-4 lg:text-xl">
              Schedule a Viewing
            </h2>
            {modalError && (
              <p className="text-red-500 mb-4 text-sm lg:text-base">
                {modalError}
              </p>
            )}
            {modalSuccess ? (
              <div
                className={`${
                  darkMode
                    ? "bg-green-800 text-green-100"
                    : "bg-green-100 text-green-800"
                } p-4 rounded-lg mb-4`}
              >
                <p className="text-base lg:text-lg font-semibold">
                  {modalSuccess}
                </p>
                <button
                  onClick={() => {
                    setShowScheduleModal(false);
                    setModalSuccess("");
                    setViewingDate("");
                    setTermsAccepted(false);
                  }}
                  className={`mt-4 ${
                    darkMode
                      ? "bg-green-600 hover:bg-green-700 text-gray-100"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  } px-4 py-2 rounded-lg transition text-sm lg:text-base`}
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleScheduleViewing}>
                <div className="mb-4">
                  <label
                    className={`block ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    } mb-2 text-sm lg:text-base`}
                  >
                    Select Date and Time
                  </label>
                  <input
                    type="datetime-local"
                    value={viewingDate}
                    onChange={(e) => setViewingDate(e.target.value)}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 lg:p-3 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="mb-4">
                  <p
                    className={`${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    } text-sm lg:text-base`}
                  >
                    The landlord will confirm your viewing request within 24-48
                    hours.
                  </p>
                </div>
                <div className="mb-4">
                  <label
                    className={`flex items-center text-sm lg:text-base ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mr-2"
                      disabled={isSubmitting}
                    />
                    I understand that viewings may be rescheduled or canceled
                    with 24-hour notice.{" "}
                    <Link
                      to="/privacy-policy"
                      className={`${
                        darkMode
                          ? "text-blue-400 hover:text-blue-300"
                          : "text-blue-600 hover:text-blue-700"
                      } hover:underline`}
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowScheduleModal(false);
                      setModalError("");
                      setModalSuccess("");
                      setViewingDate("");
                      setTermsAccepted(false);
                    }}
                    className={`${
                      darkMode
                        ? "bg-gray-600 hover:bg-gray-500 text-gray-200"
                        : "bg-gray-300 hover:bg-gray-400 text-gray-700"
                    } px-4 py-2 rounded-lg transition text-sm lg:text-base lg:px-6 lg:py-2 disabled:opacity-50`}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`${
                      darkMode
                        ? "bg-blue-500 hover:bg-blue-600 text-gray-100"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    } px-4 py-2 rounded-lg transition text-sm lg:text-base lg:px-6 lg:py-2 disabled:opacity-50 flex items-center`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 mr-2 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          />
                        </svg>
                        Scheduling...
                      </>
                    ) : (
                      "Schedule"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Apply Now Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`${
              darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
            } p-4 sm:p-6 rounded-lg w-11/12 max-w-md max-h-[80vh] overflow-y-auto`}
          >
            <h2 className="text-lg font-semibold mb-4 lg:text-xl">
              Apply for Property
            </h2>
            {modalError && (
              <p className="text-red-500 mb-4 text-sm lg:text-base">
                {modalError}
              </p>
            )}
            {modalSuccess ? (
              <div
                className={`${
                  darkMode
                    ? "bg-green-800 text-green-100"
                    : "bg-green-100 text-green-800"
                } p-4 rounded-lg mb-4`}
              >
                <p className="text-base lg:text-lg font-semibold">
                  {modalSuccess}
                </p>
                <button
                  onClick={() => {
                    setShowApplyModal(false);
                    setModalSuccess("");
                    setApplicationDetails({
                      fullName: user?.fullName || "",
                      email: user?.email || "",
                      phone: user?.phone || "",
                      moveInDate: "",
                      occupants: 1,
                      message: "",
                    });
                    setTermsAccepted(false);
                  }}
                  className={`mt-4 ${
                    darkMode
                      ? "bg-green-600 hover:bg-green-700 text-gray-100"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  } px-4 py-2 rounded-lg transition text-sm lg:text-base`}
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyNow}>
                <div className="mb-4">
                  <label
                    className={`block ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    } mb-2 text-sm lg:text-base`}
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={applicationDetails.fullName}
                    onChange={(e) =>
                      setApplicationDetails({
                        ...applicationDetails,
                        fullName: e.target.value,
                      })
                    }
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 lg:p-3 disabled:opacity-50 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className={`block ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    } mb-2 text-sm lg:text-base`}
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    value={applicationDetails.email}
                    onChange={(e) =>
                      setApplicationDetails({
                        ...applicationDetails,
                        email: e.target.value,
                      })
                    }
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 lg:p-3 disabled:opacity-50 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className={`block ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    } mb-2 text-sm lg:text-base`}
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={applicationDetails.phone}
                    onChange={(e) =>
                      setApplicationDetails({
                        ...applicationDetails,
                        phone: e.target.value,
                      })
                    }
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 lg:p-3 disabled:opacity-50 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className={`block ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    } mb-2 text-sm lg:text-base`}
                  >
                    Preferred Move-In Date *
                  </label>
                  <input
                    type="date"
                    value={applicationDetails.moveInDate}
                    onChange={(e) =>
                      setApplicationDetails({
                        ...applicationDetails,
                        moveInDate: e.target.value,
                      })
                    }
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 lg:p-3 disabled:opacity-50 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className={`block ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    } mb-2 text-sm lg:text-base`}
                  >
                    Number of Occupants *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={applicationDetails.occupants}
                    onChange={(e) =>
                      setApplicationDetails({
                        ...applicationDetails,
                        occupants: parseInt(e.target.value) || 1,
                      })
                    }
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 lg:p-3 disabled:opacity-50 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className={`block ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    } mb-2 text-sm lg:text-base`}
                  >
                    Message (Optional)
                  </label>
                  <textarea
                    value={applicationDetails.message}
                    onChange={(e) =>
                      setApplicationDetails({
                        ...applicationDetails,
                        message: e.target.value,
                      })
                    }
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 lg:p-3 disabled:opacity-50 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                    rows="3"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="mb-4">
                  <p
                    className={`${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    } text-sm lg:text-base`}
                  >
                    By submitting, you agree to our{" "}
                    <Link
                      to="/privacy-policy"
                      className={`${
                        darkMode
                          ? "text-blue-400 hover:text-blue-300"
                          : "text-blue-600 hover:text-blue-700"
                      } hover:underline`}
                    >
                      Privacy Policy
                    </Link>{" "}
                    and Terms. The landlord will review your application within
                    3-5 business days.
                  </p>
                </div>
                <div className="mb-4">
                  <label
                    className={`flex items-center text-sm lg:text-base ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mr-2"
                      disabled={isSubmitting}
                    />
                    I agree to the Privacy Policy and Terms of Service.
                  </label>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowApplyModal(false);
                      setModalError("");
                      setModalSuccess("");
                      setApplicationDetails({
                        fullName: user?.fullName || "",
                        email: user?.email || "",
                        phone: user?.phone || "",
                        moveInDate: "",
                        occupants: 1,
                        message: "",
                      });
                      setTermsAccepted(false);
                    }}
                    className={`${
                      darkMode
                        ? "bg-gray-600 hover:bg-gray-500 text-gray-200"
                        : "bg-gray-300 hover:bg-gray-400 text-gray-700"
                    } px-4 py-2 rounded-lg transition text-sm lg:text-base lg:px-6 lg:py-2 disabled:opacity-50`}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`${
                      darkMode
                        ? "bg-blue-500 hover:bg-blue-600 text-gray-100"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    } px-4 py-2 rounded-lg transition text-sm lg:text-base lg:px-6 lg:py-2 disabled:opacity-50 flex items-center`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 mr-2 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          />
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
