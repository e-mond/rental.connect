import PropTypes from "prop-types";

const TenantSkeleton = ({ layout, bgColor, animationSpeed = "2s" }) => {
  const baseStyle = `${bgColor} animate-customPulse rounded`;

  switch (layout) {
    case "dashboard":
      return (
        <div
          className="p-4 sm:p-6 bg-gray-50 tenant-skeleton space-y-6 overflow-hidden"
          aria-hidden="true"
          style={{ "--animation-speed": animationSpeed }}
        >
          {/* Greeting */}
          <div className={`${baseStyle} h-6 sm:h-7 w-1/3 mb-6`} />

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {[...Array(3)].map((_, index) => (
              <div
                key={`dashboard-card-${index}`}
                className="bg-blue-50 p-4 rounded-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center mb-2">
                    <div className={`${baseStyle} h-4 w-4 mr-2`} />
                    <div className={`${baseStyle} h-5 w-1/3`} />
                  </div>
                  <div className={`${baseStyle} h-4 w-3/4 mb-2`} />
                  <div className={`${baseStyle} h-4 w-3/5 mb-4`} />
                </div>
                <div
                  className={`${baseStyle} h-10 w-full sm:w-36 rounded-lg`}
                />
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-4 rounded-lg">
            <div className={`${baseStyle} h-5 w-1/4 mb-4`} />
            <div className="space-y-4">
              {[...Array(2)].map((_, index) => (
                <div
                  key={`activity-${index}`}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div className="flex items-center space-x-2">
                    <div className={`${baseStyle} h-4 w-4`} />
                    <div className={`${baseStyle} h-4 w-1/2`} />
                  </div>
                  <div className={`${baseStyle} h-3.5 w-16`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "search":
      return (
        <div
          className="p-4 md:p-6 space-y-6 z-0"
          aria-hidden="true"
          style={{ "--animation-speed": animationSpeed }}
        >
          {/* Title */}
          <div className={`${baseStyle} h-6 md:h-8 w-1/3 mb-2`} />

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={`filter-${i}`}
                className="border p-3 rounded-lg flex items-center space-x-3"
              >
                <div className={`${baseStyle} w-5 h-5`} />
                <div className={`${baseStyle} h-4 w-full`} />
              </div>
            ))}
          </div>

          {/* Search Button */}
          <div className={`${baseStyle} h-10 w-full md:w-40 rounded-lg`} />

          {/* Section Title */}
          <div className={`${baseStyle} h-5 w-1/4 mt-6`} />

          {/* Property Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={`property-${i}`}
                className="border p-4 rounded-lg shadow-sm bg-gray-100 space-y-3"
              >
                <div className={`${baseStyle} w-full h-40 rounded-lg`} />
                <div className={`${baseStyle} h-4 w-2/3`} />
                <div className={`${baseStyle} h-3 w-full`} />
                <div className={`${baseStyle} h-10 w-full rounded-lg`} />
              </div>
            ))}
          </div>
        </div>
      );

    case "payments":
      return (
        <div
          className="p-4 space-y-6 bg-gray-100 overflow-hidden"
          aria-hidden="true"
          style={{ "--animation-speed": animationSpeed }}
        >
          {/* Filter Tabs */}
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {[...Array(3)].map((_, index) => (
              <div
                key={`filter-tab-${index}`}
                className={`${baseStyle} h-8 w-32`}
              />
            ))}
          </div>

          {/* Payment Cards */}
          <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={`payment-card-${index}`}
                className="p-4 border-b last:border-none rounded-lg mb-3 shadow-sm bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`${baseStyle} h-8 w-8`} />
                    <div>
                      <div className={`${baseStyle} h-5 w-32 mb-1`} />
                      <div className={`${baseStyle} h-4 w-24`} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`${baseStyle} h-5 w-20 rounded-lg`} />
                    <div className={`${baseStyle} h-6 w-6 rounded-full`} />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className={`${baseStyle} h-4 w-1/2`} />
                  <div className={`${baseStyle} h-10 w-full rounded-lg`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    default:
      console.warn(`Unknown tenant skeleton layout: ${layout}`);
      return null;
  }
};

TenantSkeleton.propTypes = {
  layout: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
  animationSpeed: PropTypes.string,
};

export default TenantSkeleton;
