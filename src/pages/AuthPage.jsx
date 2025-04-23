import { Navigate } from "react-router-dom";
import PropTypes from "prop-types"; // Import PropTypes

const AuthPage = ({ userType }) => {
  return <Navigate to={`/${userType}login`} replace />;
};

AuthPage.propTypes = {
  userType: PropTypes.string.isRequired, // Validate userType as a required string
};

export default AuthPage;
