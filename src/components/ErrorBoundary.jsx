
import { Component } from "react";
import PropTypes from "prop-types";
import Button from "../components/Button"; // Assuming Button component exists

/**
 * ErrorBoundary component to catch JavaScript errors in child components.
 * Displays a user-friendly fallback UI when an error occurs, with an option to retry rendering.
 * Logs errors to the console in development mode only.
 */
class ErrorBoundary extends Component {
  state = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  /**
   * Synchronously updates state when an error is caught, ensuring the fallback UI renders immediately.
   * @param {Error} error - The error that was thrown.
   * @returns {Object} Updated state with error details.
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  /**
   * Logs the error to the console in development mode only.
   * @param {Error} error - The error that was thrown.
   * @param {Object} errorInfo - Information about the component stack where the error occurred.
   */
  componentDidCatch(error, errorInfo) {
    // Log to console only in development mode
    if (import.meta.env.MODE !== "production") {
      console.error("Error caught by ErrorBoundary:", error, errorInfo);
    }

    // Update state with errorInfo for potential debugging (not exposed in production UI)
    this.setState({ errorInfo });
  }

  /**
   * Resets the error state to attempt re-rendering the children.
   */
  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  /**
   * Renders the component.
   * If an error has occurred, displays a fallback UI; otherwise, renders the children.
   * @returns {JSX.Element} The rendered component or fallback UI.
   */
  render() {
    if (this.state.hasError) {
      // Fallback UI: Simple, error-free, and user-friendly
      return (
        <div className="p-4 text-center">
          <h2 className="text-xl font-bold text-red-500 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">
            An unexpected error occurred. Please try again or refresh the page.
          </p>
          <Button
            variant="primary"
            onClick={this.handleRetry}
            className="mt-4"
            aria-label="Retry loading the application"
          >
            Retry
          </Button>
          {/* In development only, show error details */}
          {import.meta.env.MODE !== "production" && this.state.error && (
            <details className="mt-4 text-left">
              <summary className="text-sm text-gray-500 cursor-pointer">
                Error Details (Dev Only)
              </summary>
              <p className="text-sm text-gray-700 mt-2">
                {this.state.error.toString()}
              </p>
              <p className="text-sm text-gray-700">
                {this.state.errorInfo?.componentStack}
              </p>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;