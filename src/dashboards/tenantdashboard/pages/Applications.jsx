import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../config";
import GlobalSkeleton from "../../../components/GlobalSkeleton";
import { FaHome } from "react-icons/fa";
import { useDarkMode } from "../../../context/DarkModeContext"; // Import useDarkMode
import Button from "../../../components/Button"; // Import Button component

const TenantApplications = () => {
  const [applications, setApplications] = useState([]);
  const [properties, setProperties] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { darkMode } = useDarkMode(); // Access dark mode state

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.info("Logged out due to invalid session. Please log in again.", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    setTimeout(() => {
      navigate("/tenantlogin");
    }, 2000);
  };

  const decodeToken = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (err) {
      console.error("Error decoding token:", err.message);
      return null;
    }
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // Debugging: Log the token value and decode it
        console.log("Token retrieved from localStorage:", token);
        if (token) {
          const decodedToken = decodeToken(token);
          console.log("Decoded token payload:", decodedToken);
          if (decodedToken) {
            const expirationDate = new Date(decodedToken.exp * 1000);
            console.log("Token expiration:", expirationDate.toISOString());
            if (expirationDate < new Date()) {
              console.log("Token is expired!");
              toast.error(
                "Your session has expired due to token expiration. Please log in again.",
                {
                  position: "top-right",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                }
              );
              localStorage.removeItem("token");
              setTimeout(() => {
                navigate("/tenantlogin");
              }, 2000);
              return;
            }
          }
          toast.info("Token found in localStorage.", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else {
          toast.error("No token found in localStorage.", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }

        if (!token) {
          setError("No authentication token found. Redirecting to login...");
          toast.error("Please log in to view your applications.", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          setTimeout(() => {
            navigate("/tenantlogin");
          }, 2000);
          return;
        }

        // Fetch applications
        const response = await fetch(`${BASE_URL}/api/applications/tenant`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Response Status:", response.status);
          console.error("API Response Text:", errorText);
          if (response.status === 401) {
            localStorage.removeItem("token");
            throw new Error(
              "Session expired: Full authentication is required. Please log in again."
            );
          }
          throw new Error(
            `Failed to fetch applications: HTTP ${response.status} - ${
              errorText || "Unknown error"
            }`
          );
        }

        const data = await response.json();
        console.log("Fetched applications:", data);
        setApplications(data);

        // Fetch property details for each application
        const propertyIds = [...new Set(data.map((app) => app.propertyId))];
        const propertyPromises = propertyIds.map((id) =>
          fetch(`${BASE_URL}/api/properties/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }).then((res) => {
            if (!res.ok) {
              throw new Error(`Failed to fetch property ${id}`);
            }
            return res.json();
          })
        );
        const propertyData = await Promise.all(propertyPromises);
        const propertyMap = propertyData.reduce((acc, property) => {
          acc[property.id] = property;
          return acc;
        }, {});
        setProperties(propertyMap);
      } catch (err) {
        console.error("Error fetching applications:", err.message);
        setError(err.message);
        if (err.message.includes("token") || err.message.includes("401")) {
          toast.error(
            "Session expired: Full authentication is required. Please log in again.",
            {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );
          setTimeout(() => {
            navigate("/tenantlogin");
          }, 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [navigate]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:max-w-6xl lg:p-8">
        <h1
          className={`text-2xl font-bold mb-6 text-center lg:text-4xl lg:text-left lg:mb-8 ${
            darkMode ? "text-gray-200" : "text-gray-900"
          }`}
        >
          Your Applications
        </h1>
        <div
          className={`animate-pulse h-8 w-1/2 rounded mb-6 ${
            darkMode ? "bg-gray-700" : "bg-gray-300"
          }`}
        />
        <div
          className={`rounded-lg shadow ${
            darkMode
              ? "bg-gray-900 shadow-gray-700"
              : "bg-white shadow-gray-200"
          }`}
        >
          <GlobalSkeleton
            type="table"
            bgColor={darkMode ? "bg-gray-700" : "bg-gray-300"}
            animationSpeed="1.2s"
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:max-w-6xl lg:p-8 text-center">
        <p
          className={`mb-4 text-base lg:text-lg ${
            darkMode ? "text-red-400" : "text-red-500"
          }`}
        >
          {error}
        </p>
        <div className="flex justify-center gap-4">
          <Button
            variant="secondary"
            onClick={() => navigate("/dashboard/tenant/dashboard")}
            className="text-base lg:text-lg"
          >
            Back to Dashboard
          </Button>
          <Button
            variant="danger"
            onClick={handleLogout}
            className="text-base lg:text-lg"
          >
            Log Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:max-w-6xl lg:p-8">
      <h1
        className={`text-2xl font-bold mb-6 text-center lg:text-4xl lg:text-left lg:mb-8 ${
          darkMode ? "text-gray-200" : "text-gray-900"
        }`}
      >
        Your Applications
      </h1>

      {applications.length > 0 ? (
        <div className="overflow-x-auto">
          <table
            className={`min-w-full rounded-lg shadow-md ${
              darkMode
                ? "bg-gray-900 shadow-gray-700"
                : "bg-white shadow-gray-200"
            }`}
          >
            <thead>
              <tr
                className={`text-sm lg:text-base ${
                  darkMode
                    ? "bg-gray-800 text-gray-300"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <th className="p-3 text-left">Property</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Submitted At</th>
                <th className="p-3 text-left">Move-In Date</th>
                <th className="p-3 text-left">Occupants</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr
                  key={application.id}
                  className={`border-b text-sm lg:text-base ${
                    darkMode
                      ? "border-gray-700 hover:bg-gray-800"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <td
                    className={`p-3 flex items-center ${
                      darkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    <img
                      src={
                        properties[application.propertyId]?.imageUrl
                          ? `${BASE_URL}${
                              properties[application.propertyId].imageUrl
                            }`
                          : "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=40&h=40&fit=crop"
                      }
                      alt={
                        properties[application.propertyId]?.title || "Property"
                      }
                      className="w-10 h-10 rounded-full mr-3"
                      onError={(e) =>
                        (e.target.src =
                          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=40&h=40&fit=crop")
                      }
                    />
                    <span>
                      {properties[application.propertyId]?.title ||
                        "Unknown Property"}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs lg:text-sm ${
                        application.status === "Submitted"
                          ? darkMode
                            ? "bg-yellow-900 text-yellow-300"
                            : "bg-yellow-100 text-yellow-800"
                          : application.status === "Under Review"
                          ? darkMode
                            ? "bg-blue-900 text-blue-300"
                            : "bg-blue-100 text-blue-800"
                          : application.status === "Approved"
                          ? darkMode
                            ? "bg-green-900 text-green-300"
                            : "bg-green-100 text-green-800"
                          : darkMode
                          ? "bg-red-900 text-red-300"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {application.status}
                    </span>
                  </td>
                  <td
                    className={`p-3 ${
                      darkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    {new Date(application.submittedAt).toLocaleDateString()}
                  </td>
                  <td
                    className={`p-3 ${
                      darkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    {application.moveInDate}
                  </td>
                  <td
                    className={`p-3 ${
                      darkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    {application.occupants}
                  </td>
                  <td className="p-3">
                    <Button
                      variant="secondary"
                      onClick={() =>
                        navigate(
                          `/dashboard/tenant/property/${application.propertyId}`
                        )
                      }
                      className="text-sm lg:text-base"
                    >
                      View Property
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          className={`text-center rounded-lg shadow p-6 ${
            darkMode
              ? "bg-gray-900 shadow-gray-700"
              : "bg-white shadow-gray-200"
          }`}
          role="alert"
          aria-live="polite"
        >
          <FaHome
            className={`text-4xl mx-auto mb-4 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <p
            className={`mb-4 text-base lg:text-lg ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            You haven’t applied to any properties yet. Start your journey by
            finding the perfect place!
          </p>
          <Button
            variant="primary"
            onClick={() => navigate("/dashboard/tenant/search")}
            className="text-base lg:text-lg"
          >
            Search for Properties
          </Button>
        </div>
      )}
    </div>
  );
};

export default TenantApplications;
