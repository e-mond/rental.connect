import Button from "../../../components/Button";
import PropTypes from "prop-types";

const PropertyActions = ({ isLeased, navigate }) => {
  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="flex justify-center sm:justify-start gap-4 flex-wrap">
      <Button
        variant="primary"
        onClick={() => handleNavigate("/dashboard/tenant/scheduleviewing")}
        className="w-full md:w-auto text-sm md:text-base"
      >
        Schedule Viewing
      </Button>
      <Button
        variant="primary"
        onClick={() => handleNavigate("/dashboard/tenant/applynow")}
        className="w-full md:w-auto text-sm md:text-base"
      >
        Apply Now
      </Button>
      {isLeased && (
        <Button
          onClick={() => handleNavigate("/maintenance-request")}
          color="green"
          className="w-full md:w-auto text-sm md:text-base"
        >
          Submit Maintenance Request
        </Button>
      )}
    </div>
  );
};

PropertyActions.propTypes = {
  isLeased: PropTypes.bool.isRequired,
  navigate: PropTypes.func.isRequired,
};

export default PropertyActions;
