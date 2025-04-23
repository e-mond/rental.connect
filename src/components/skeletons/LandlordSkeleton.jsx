import PropTypes from "prop-types";

/**
 * LandlordSkeleton renders skeleton layouts for the landlord dashboard.
 * Placeholder for future layouts with customizable styling.
 * @param {Object} props - Component props
 * @param {string} props.layout - Specific layout (e.g., 'properties')
 * @param {string} props.bgColor - Background color (e.g., 'bg-gray-300')
 * @param {string} props.animationSpeed - Animation speed (e.g., '1.2s')
 */
const LandlordSkeleton = ({ layout, bgColor, animationSpeed }) => {
  const skeletonClass = `${bgColor} animate-customPulse rounded-lg`;
  const animationStyle = { animationDuration: animationSpeed };

  switch (layout) {
    case "properties":
      return (
        <div className="p-4 landlord-skeleton">
          {/* Landlord: Placeholder for properties list */}
          <div className={`${skeletonClass} h-64`} style={animationStyle} />
        </div>
      );
    default:
      console.warn(`Landlord skeleton for layout '${layout}' not implemented.`);
      return null;
  }
};

// PropTypes for type checking
LandlordSkeleton.propTypes = {
  layout: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
  animationSpeed: PropTypes.string.isRequired,
};

export default LandlordSkeleton;
