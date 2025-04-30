import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, RefreshCcw, MoreVertical } from "lucide-react";
import Button from "../../../../components/Button";
import GlobalSkeleton from "../../../../components/GlobalSkeleton";
import ErrorDisplay from "../../../../components/ErrorDisplay";
import PropTypes from "prop-types";
import landlordApi from "../../../../api/landlordApi";
import { useDarkMode } from "../../../../context/DarkModeContext";

/**
 * Reviews Component
 *
 * Displays a list of reviews for the landlord's properties, with options to filter by type (All, Recent, Positive, Negative)
 * and search by property or review content. Fetches review data using react-query and provides a responsive, accessible interface.
 * Includes a skeleton loader with a minimum 2-second display to match the LandlordDashboardHome component. Supports refreshing
 * the review data and shows an error message or "No reviews found" if applicable.
 * Features:
 * - Dark mode support for consistent UI theming.
 * - Uses the Button component for consistent button styling.
 * - Verifies BASE_URL usage in API calls via landlordApi.
 *
 * @param {Object} props - Component props
 * @param {Object} props.userData - User data containing the landlord's information
 */
const Reviews = ({ userData }) => {
  const { darkMode } = useDarkMode();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Reviews");
  const [loading, setLoading] = useState(true);

  const {
    data: reviewsData = [],
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["reviews", userData?.id],
    queryFn: () => landlordApi.fetchReviews(localStorage.getItem("token")),
    enabled: !!userData,
    select: (data) =>
      data.map((review) => ({
        ...review,
        image: review.image.startsWith("http")
          ? review.image
          : `${landlordApi.baseUrl}${review.image}`,
      })),
  });

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Filter reviews based on the selected tab
  const filteredReviews = reviewsData.filter((review) => {
    if (filter === "Positive") return review.rating >= 4;
    if (filter === "Negative") return review.rating < 4;
    if (filter === "Recent") return true; // Assuming reviews are sorted by date descending
    return true; // "All Reviews"
  });

  // Filter reviews based on search input
  const visibleReviews = filteredReviews.filter(
    (review) =>
      review.property.toLowerCase().includes(search.toLowerCase()) ||
      review.review.toLowerCase().includes(search.toLowerCase())
  );

  const handleRefresh = () => {
    refetch();
    setLoading(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row">
        <div
          className={`p-4 sm:p-6 ${
            darkMode ? "bg-gray-800" : "bg-gray-50"
          } flex-1 overflow-y-auto`}
        >
          <GlobalSkeleton
            type="reviews"
            bgColor={darkMode ? "bg-gray-700" : "bg-gray-300"}
            animationSpeed="1.5s"
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col md:flex-row">
        <div
          className={`p-4 sm:p-6 ${
            darkMode ? "bg-gray-800" : "bg-gray-50"
          } flex-1 overflow-y-auto`}
        >
          <ErrorDisplay
            error={error}
            className={darkMode ? "text-red-400" : "text-red-500"}
          />
        </div>
      </div>
    );
  }

  if (!reviewsData || reviewsData.length === 0) {
    return (
      <div className="flex flex-col md:flex-row">
        <div
          className={`p-4 sm:p-6 ${
            darkMode ? "bg-gray-800" : "bg-gray-50"
          } flex-1 overflow-y-auto flex items-center justify-center h-screen`}
        >
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            No reviews found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div
        className={`p-4 sm:p-6 ${
          darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-50 text-gray-800"
        } flex-1 overflow-y-auto`}
      >
        {/* Header Section: Title and Export/Refresh Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
          <h2 className="text-xl sm:text-2xl font-bold">Reviews</h2>
          <div className="flex space-x-2">
            <Button
              variant="primary"
              className="text-sm sm:text-base"
              onClick={() => alert("Export feature coming soon!")}
            >
              Export Reviews
            </Button>
            <Button
              variant="secondary"
              onClick={handleRefresh}
              className="text-sm sm:text-base flex items-center"
            >
              <RefreshCcw className="h-4 w-4 mr-2" /> Refresh
            </Button>
          </div>
        </div>

        {/* Search Bar Section */}
        <section aria-labelledby="search-reviews-heading">
          <h3 id="search-reviews-heading" className="sr-only">
            Search Reviews
          </h3>
          <div className="relative mb-4">
            <label htmlFor="review-search" className="sr-only">
              Search reviews
            </label>
            <input
              id="review-search"
              type="text"
              placeholder="Search reviews..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full p-3 pl-10 border rounded-md shadow-sm text-sm sm:text-base focus:ring-2 focus:ring-blue-500 ${
                darkMode
                  ? "border-gray-600 bg-gray-800 text-gray-200"
                  : "border-gray-300 bg-white text-gray-800"
              }`}
              aria-label="Search reviews by property or content"
            />
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                darkMode ? "text-gray-400" : "text-gray-400"
              }`}
            />
          </div>
        </section>

        {/* Filter Tabs Section */}
        <section aria-labelledby="filter-reviews-heading">
          <h3 id="filter-reviews-heading" className="sr-only">
            Filter Reviews
          </h3>
          <div
            role="tablist"
            className="flex flex-wrap gap-2 sm:gap-3 mb-4 text-sm sm:text-base font-medium"
          >
            {["All Reviews", "Recent", "Positive", "Negative"].map((tab) => (
              <span
                key={tab}
                role="tab"
                tabIndex={0}
                onClick={() => setFilter(tab)}
                onKeyDown={(e) => e.key === "Enter" && setFilter(tab)}
                className={`cursor-pointer px-3 sm:px-4 py-1 sm:py-2 rounded-md transition-colors ${
                  filter === tab
                    ? darkMode
                      ? "bg-teal-500 text-white"
                      : "bg-blue-600 text-white"
                    : darkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-600 hover:bg-blue-100"
                }`}
                aria-selected={filter === tab}
                aria-controls={`tabpanel-${tab
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                {tab}
              </span>
            ))}
          </div>
        </section>

        {/* Review List Section */}
        <section aria-labelledby="reviews-list-heading">
          <h3 id="reviews-list-heading" className="sr-only">
            Review List
          </h3>
          <div
            className={`p-4 sm:p-6 rounded-lg shadow ${
              darkMode
                ? "bg-gray-900 shadow-gray-700"
                : "bg-white shadow-gray-200"
            }`}
          >
            {visibleReviews.length > 0 ? (
              visibleReviews.map((review) => (
                <div
                  key={review.id}
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 sm:py-4 border-b last:border-0 ${
                    darkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={review.image || "https://via.placeholder.com/40"}
                      alt={`Property at ${review.property}`}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <h4 className="font-semibold text-base sm:text-lg">
                        {review.property}
                      </h4>
                      <p
                        className={`text-sm sm:text-base ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        <span className="text-yellow-400">
                          {"★".repeat(review.rating)}
                        </span>
                        <span
                          className={
                            darkMode ? "text-gray-500" : "text-gray-300"
                          }
                        >
                          {"☆".repeat(5 - review.rating)}
                        </span>{" "}
                        {review.review}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-3 mt-2 sm:mt-0">
                    <Button
                      variant="secondary"
                      className="p-2 rounded-full"
                      aria-label="Reply to review"
                      onClick={() => alert("Reply feature coming soon!")}
                    >
                      <RefreshCcw className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="secondary"
                      className="p-2 rounded-full"
                      aria-label="More options"
                      onClick={() => alert("More options coming soon!")}
                    >
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p
                className={`text-center py-4 text-sm sm:text-base ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                No reviews found.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

// Define PropTypes for type safety and validation
Reviews.propTypes = {
  userData: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    accountType: PropTypes.string,
    profilePic: PropTypes.string,
  }),
};

export default Reviews;
