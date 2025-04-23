import PropTypes from "prop-types";
import { useDarkMode } from "../context/DarkModeContext"; // Import useDarkMode

const Card = ({ children, className }) => {
  const { darkMode } = useDarkMode(); // Access dark mode state

  return (
    <div
      className={`shadow-md rounded-lg p-4 ${
        darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
      } ${className}`}
    >
      {children}
    </div>
  );
};

const CardContent = ({ children, className }) => {
  return <div className={`p-2 ${className}`}>{children}</div>;
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

CardContent.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Card.defaultProps = {
  className: "",
};

CardContent.defaultProps = {
  className: "",
};

export { Card, CardContent };
