import { useState } from "react";
import { Search, RefreshCcw, MoreVertical } from "lucide-react";
import Button from "../../../components/Button";


const reviewsData = [
  {
    id: 1,
    property: "123 Main Street",
    rating: 5,
    review: "Great property and management! Very responsive...",
    image: "https://via.placeholder.com/40",
  },
  {
    id: 2,
    property: "456 Oak Avenue",
    rating: 4,
    review: "Good experience overall, maintenance could be faster",
    image: "https://via.placeholder.com/40",
  },
  {
    id: 3,
    property: "789 Pine Road",
    rating: 5,
    review: "Excellent communication and beautiful property",
    image: "https://via.placeholder.com/40",
  },
  {
    id: 4,
    property: "321 Elm Street",
    rating: 3,
    review: "Decent place but needs some updates",
    image: "https://via.placeholder.com/40",
  },
];

const Reviews = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Reviews");

  const filteredReviews = reviewsData.filter((review) => {
    if (filter === "Positive") return review.rating >= 4;
    if (filter === "Negative") return review.rating < 4;
    return true; // "All Reviews" and "Recent" show all reviews
  });

  const visibleReviews = filteredReviews.filter(
    (review) =>
      review.property.toLowerCase().includes(search.toLowerCase()) ||
      review.review.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row">
   
      <div className="p-6 bg-gray-50 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Reviews</h2>
          <Button className="bg-blue-600 text-white">Export Reviews</Button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search reviews..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 pl-10 border rounded-md shadow-sm"
          />
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-4 text-sm font-medium">
          {["All Reviews", "Recent", "Positive", "Negative"].map((tab) => (
            <span
              key={tab}
              onClick={() => setFilter(tab)}
              className={`cursor-pointer px-3 py-1 rounded-md transition-colors ${
                filter === tab
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-blue-100"
              }`}
            >
              {tab}
            </span>
          ))}
        </div>

        {/* Review List */}
        <div className="bg-white p-4 rounded-lg shadow">
          {visibleReviews.length > 0 ? (
            visibleReviews.map((review) => (
              <div
                key={review.id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between py-3 border-b last:border-0"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={review.image}
                    alt="Property"
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold">{review.property}</h4>
                    <p className="text-gray-500 text-sm">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)} {review.review}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-3 mt-2 md:mt-0">
                  <RefreshCcw className="h-5 w-5 text-gray-500 cursor-pointer" />
                  <MoreVertical className="h-5 w-5 text-gray-500 cursor-pointer" />
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-4 text-gray-500">No reviews found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
