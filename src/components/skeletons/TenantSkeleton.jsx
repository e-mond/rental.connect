import PropTypes from "prop-types";

const TenantSkeleton = ({
  layout,
  bgColor,
  animationSpeed = "2s",
  items = 3,
}) => {
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
          className="max-w-[80%] mx-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-gray-100 overflow-hidden"
          aria-hidden="true"
          style={{ "--animation-speed": animationSpeed }}
        >
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-3 sm:gap-4 mt-10 sticky top-0 z-10 py-3 rounded-xl shadow-sm bg-gray-100">
            {[...Array(4)].map((_, index) => (
              <div
                key={`filter-tab-${index}`}
                className={`${baseStyle} h-10 w-32 sm:w-40 rounded-lg shadow-sm`}
              />
            ))}
          </div>

          {/* Payment Cards */}
          <div className="rounded-xl shadow-lg p-6 bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(items)].map((_, index) => (
                <div
                  key={`payment-card-${index}`}
                  className="rounded-xl shadow-md p-5 bg-gray-50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`${baseStyle} h-8 w-8 rounded-full`} />
                      <div className="space-y-2">
                        <div className={`${baseStyle} h-5 w-32 rounded`} />
                        <div className={`${baseStyle} h-4 w-24 rounded`} />
                        <div className={`${baseStyle} h-4 w-28 rounded`} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`${baseStyle} h-5 w-20 rounded-full`} />
                      <div className={`${baseStyle} h-6 w-6 rounded-full`} />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <div className={`${baseStyle} h-4 w-16 rounded`} />
                      <div className={`${baseStyle} h-4 w-20 rounded`} />
                    </div>
                    <div className="flex justify-between">
                      <div className={`${baseStyle} h-4 w-12 rounded`} />
                      <div className={`${baseStyle} h-4 w-16 rounded`} />
                    </div>
                    <div className={`${baseStyle} h-10 w-full rounded-lg`} />
                    <div className={`${baseStyle} h-10 w-full rounded-lg`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions Section */}
          <section className="mt-10">
            <div className={`${baseStyle} h-7 w-1/4 mb-6 rounded`} />
            <div className={`${baseStyle} h-4 w-3/4 mb-2 rounded`} />
            <div className={`${baseStyle} h-4 w-2/3 rounded`} />
          </section>

          {/* Payment Method Section */}
          <section className="mt-6">
            <div className={`${baseStyle} h-7 w-1/4 mb-6 rounded`} />
            <div className="rounded-xl shadow-lg p-6 bg-white space-y-4">
              {/* Payment Method Buttons */}
              <div className="flex space-x-4 mb-4">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={`payment-method-btn-${index}`}
                    className={`${baseStyle} h-10 w-28 sm:w-32 rounded-lg`}
                  />
                ))}
              </div>

              {/* Input Fields (Simulating Stripe as default) */}
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={`input-field-${index}`} className="relative">
                    <div className={`${baseStyle} h-4 w-20 mb-1 rounded`} />
                    <div className="relative">
                      <div className={`${baseStyle} h-10 w-full rounded-lg`} />
                      <div
                        className={`${baseStyle} absolute right-3 top-11 transform -translate-y-1/2 h-4 w-4`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Pay Now Button */}
              <div className={`${baseStyle} h-10 w-full rounded-lg`} />
            </div>
          </section>
        </div>
      );

    case "maintenance-list":
      return (
        <div
          className="space-y-6 p-4 sm:p-6"
          aria-hidden="true"
          style={{ "--animation-speed": animationSpeed }}
        >
          {[...Array(items)].map((_, index) => (
            <div
              key={`maintenance-item-${index}`}
              className={`border p-4 rounded-lg flex items-center space-x-4 ${baseStyle}`}
            >
              <div className={`${baseStyle} w-10 h-10 rounded-full`} />
              <div className="flex-1 space-y-2">
                <div className={`${baseStyle} h-5 w-3/4`} />
                <div className={`${baseStyle} h-4 w-1/2`} />
              </div>
            </div>
          ))}
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
  items: PropTypes.number,
};

export default TenantSkeleton;
