import { useState } from "react";
import PropTypes from "prop-types";
import { useSwipeable } from "react-swipeable";

const PropertyHeader = ({ images, darkMode }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    setImageError(false);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setImageError(false);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    preventDefaultTouchmoveEvent: true,
    trackTouch: true,
  });

  const currentImage = images[currentImageIndex];

  return (
    <div className="mb-6 lg:mb-10">
      {images.length > 0 ? (
        <div
          className={`relative w-full max-w-5xl mx-auto rounded-xl overflow-hidden border transition ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="relative aspect-[16/9]" {...swipeHandlers}>
            {!imageError ? (
              <img
                src={currentImage}
                alt={`Property Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover transition-all duration-300 ease-in-out"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                <span className="text-gray-500 dark:text-gray-300">
                  No image available
                </span>
              </div>
            )}

            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
                  aria-label="Previous image"
                >
                  &#10094;
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
                  aria-label="Next image"
                >
                  &#10095;
                </button>
              </>
            )}
          </div>

          {/* Dots */}
          {images.length > 1 && (
            <div className="flex justify-center items-center gap-2 py-3 bg-transparent">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentImageIndex(index);
                    setImageError(false);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentImageIndex
                      ? darkMode
                        ? "bg-blue-400 scale-110"
                        : "bg-blue-600 scale-110"
                      : darkMode
                      ? "bg-gray-600"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full max-w-5xl mx-auto h-64 sm:h-80 lg:h-96 bg-gray-200 dark:bg-gray-800 rounded-xl flex items-center justify-center border border-dashed dark:border-gray-700 border-gray-300">
          <span className="text-gray-500 dark:text-gray-300">
            No images available
          </span>
        </div>
      )}
    </div>
  );
};

PropertyHeader.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  darkMode: PropTypes.bool,
};

export default PropertyHeader;
