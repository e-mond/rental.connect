import { Navigate } from "react-router-dom";
import PropTypes from "prop-types"; // Import PropTypes

const LandlordAuth = ({ isSignUp }) => {
  return <Navigate to={isSignUp ? "/signup" : "/landlordlogin"} replace />;
};

LandlordAuth.propTypes = {
  isSignUp: PropTypes.bool.isRequired, // Validate isSignUp as a required boolean
};

export default LandlordAuth;
