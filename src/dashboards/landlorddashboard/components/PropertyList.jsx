import PropTypes from "prop-types";

const PropertyList = ({ filteredProperties, children }) => (
  <>
    {filteredProperties.length === 0 ? (
      <p className="text-center text-base sm:text-lg font-medium">
        No properties found.
      </p>
    ) : (
      <div className="flex flex-col gap-4">{children}</div>
    )}
  </>
);

PropertyList.propTypes = {
  filteredProperties: PropTypes.array.isRequired,
  children: PropTypes.node,
};

export default PropertyList;
