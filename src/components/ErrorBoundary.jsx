import  { Component } from "react";
import PropTypes from "prop-types";

/**
 * ErrorBoundary component to catch JavaScript errors in child components.
 * Displays a fallback UI when an error occurs and prevents infinite loops by ensuring
 * the fallback UI is error-free.
 */
class ErrorBoundary extends Component {
  state = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  /**
   * Catches errors in child components and updates the state to display a fallback UI.
   * @param {Error} error - The error that was thrown.
   * @param {Object} errorInfo - Information about the component stack where the error occurred.
   */
  componentDidCatch(error, errorInfo) {
    // Log the error to the console (or an error reporting service in production)
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    // Update state to display the error message
    this.setState({
      hasError: true,
      error: error,
      errorInfo: errorInfo,
    });
  }

  /**
   * Renders the component.
   * If an error has occurred, displays a fallback UI; otherwise, renders the children.
   * @returns {JSX.Element} The rendered component or fallback UI.
   */
  render() {
    if (this.state.hasError) {
      // Fallback UI to display when an error occurs
      // Ensure this UI is simple and error-free to prevent further errors
      return (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h2>Something went wrong.</h2>
          <p>An unexpected error occurred. Please try refreshing the page.</p>
          {this.state.error && (
            <details style={{ whiteSpace: "pre-wrap" }}>
              <summary>Error Details</summary>
              <p>{this.state.error.toString()}</p>
              <p>{this.state.errorInfo?.componentStack}</p>
            </details>
          )}
        </div>
      );
    }
    // Render the children if no error has occurred
    return this.props.children;
  }
}

// Define propTypes for ESLint validation
ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired, 
};

export default ErrorBoundary;
