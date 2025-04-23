import PropTypes from "prop-types";

const ErrorDisplay = ({ error, onRetry }) => (
  <div className="p-4 bg-red-100 text-red-700 rounded-lg">
    <p>{error.message || "Something went wrong"}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-2 underline focus:ring-2 focus:ring-red-500"
        aria-label="Retry the action"
      >
        Retry
      </button>
    )}
  </div>
);

ErrorDisplay.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string,
  }).isRequired,
  onRetry: PropTypes.func,
};

export default ErrorDisplay;
