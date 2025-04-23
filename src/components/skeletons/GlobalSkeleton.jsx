import PropTypes from "prop-types";
import TenantSkeleton from "./TenantSkeleton";

/**
 * GlobalSkeleton routes to dashboard-specific skeleton layouts.
 * @param {Object} props - Component props
 * @param {string} props.type - Skeleton type (e.g., 'tenant-dashboard')
 * @param {string} props.bgColor - Background color for skeleton elements
 * @param {string} props.animationSpeed - Animation speed for pulse effect
 */
const GlobalSkeleton = ({
  type,
  bgColor = "bg-gray-300",
  animationSpeed = "2s",
}) => {
  const [dashboard, layout] = type.split("-");

  switch (dashboard) {
    case "tenant":
      return (
        <TenantSkeleton
          layout={layout}
          bgColor={bgColor}
          animationSpeed={animationSpeed}
        />
      );
    default:
      console.warn(`Unknown skeleton type: ${type}`);
      return null;
  }
};

GlobalSkeleton.propTypes = {
  type: PropTypes.string.isRequired,
  bgColor: PropTypes.string,
  animationSpeed: PropTypes.string,
};

export default GlobalSkeleton;
