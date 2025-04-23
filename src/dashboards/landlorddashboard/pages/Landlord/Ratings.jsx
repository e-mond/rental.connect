import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import landlordApi from "../../../../api/landlord";
import Button from "../../../../components/Button";
import GlobalSkeleton from "../../../../components/GlobalSkeleton";
import { useDarkMode } from "../../../../context/DarkModeContext";

/**
 * Ratings component displays a list of ratings and reviews for the landlord's properties.
 * Features:
 * - Dark mode support for consistent UI theming.
 * - Uses the Button component for navigation and retry actions.
 * - Verifies BASE_URL usage in API calls via landlordApi.
 */
const Ratings = () => {
  const { user } = useOutletContext();
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Placeholder: Fetch ratings
  const {
    data: ratings = [],
    error,
    isLoading: ratingsLoading,
    refetch,
  } = useQuery({
    queryKey: ["ratings"],
    queryFn: () => landlordApi.fetchRatings(localStorage.getItem("token")),
    enabled: !!localStorage.getItem("token"),
  });

  // Ensure minimum 2-second loading for UX consistency
  useEffect(() => {
    if (!ratingsLoading) {
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [ratingsLoading]);

  const handleBack = () => {
    navigate("/dashboard/landlord");
  };

  // Show skeleton while loading
  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row">
        <div
          className={`p-4 sm:p-6 flex-1 overflow-y-auto ${
            darkMode ? "bg-gray-800" : "bg-gray-50"
          }`}
        >
          <GlobalSkeleton
            type="ratings"
            bgColor={darkMode ? "bg-gray-700" : "bg-gray-300"}
            animationSpeed="1.5s"
          />
        </div>
      </div>
    );
  }

  // Show error message if fetching ratings failed
  if (error || !localStorage.getItem("token")) {
    const errorMessage = error
      ? error.message || "Failed to load ratings. Please try again."
      : "No token found. Please log in.";
    return (
      <div className="flex flex-col lg:flex-row">
        <div
          className={`p-4 sm:p-6 flex-1 overflow-y-auto ${
            darkMode ? "bg-gray-800" : "bg-gray-50"
          }`}
        >
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <p
              className={`text-sm sm:text-base ${
                darkMode ? "text-red-400" : "text-red-500"
              }`}
            >
              {errorMessage}
            </p>
            <Button
              variant="primary"
              onClick={() => {
                setLoading(true);
                refetch();
              }}
              className="text-sm sm:text-base"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-4 sm:p-6 flex-1 overflow-y-auto ${
        darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-50 text-gray-800"
      }`}
    >
      <nav
        className={`mb-4 text-sm sm:text-base ${
          darkMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        <span
          className={`font-semibold ${
            darkMode ? "text-gray-200" : "text-black"
          }`}
        >
          Dashboard
        </span>{" "}
        {">"} Ratings
      </nav>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">
          Ratings for {user?.name || "Landlord"}
        </h2>
        <Button
          variant="secondary"
          onClick={handleBack}
          className="text-sm sm:text-base"
        >
          Back
        </Button>
      </div>
      {ratings.length === 0 ? (
        <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
          This section will display ratings and reviews for your properties.
          (Under construction)
        </p>
      ) : (
        <ul className="space-y-4">
          {ratings.map((rating) => (
            <li
              key={rating.id}
              className={`p-4 rounded-lg shadow ${
                darkMode
                  ? "bg-gray-900 shadow-gray-700"
                  : "bg-white shadow-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  {rating.reviewerName} - {rating.propertyAddress}
                </h3>
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1">{rating.score}/5</span>
                </div>
              </div>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {rating.review}
              </p>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Date: {rating.date}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Ratings;
