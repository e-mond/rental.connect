import { Link } from "react-router-dom"; // Added for navigation
import { FaExclamationCircle } from "react-icons/fa"; // Added for visual icon

const ErrorPage = () => {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center"
      role="alert"
      aria-live="assertive"
    >
      <FaExclamationCircle className="text-6xl text-red-600 mb-4 animate-pulse" />
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Oops! Something went wrong.
      </h1>
      <p className="text-lg text-gray-600 mb-4">
        An unexpected error occurred. Please try refreshing the page or contact
        support if the issue persists.
      </p>
      <div className="flex space-x-4">
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition transform hover:scale-105"
        >
          Refresh Page
        </button>
        <Link
          to="/"
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition transform hover:scale-105"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
