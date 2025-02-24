import PropTypes from "prop-types";

export const Tabs = ({ children }) => {
  return <div className="tabs">{children}</div>;
};

export const TabsList = ({ children }) => {
  return <div className="tabs-list">{children}</div>;
};

export const TabsTrigger = ({ children, onClick }) => {
  return (
    <button className="tabs-trigger" onClick={onClick}>
      {children}
    </button>
  );
};

export const TabsContent = ({ children, isActive }) => {
  return isActive ? <div className="tabs-content">{children}</div> : null;
};

// ✅ Add PropTypes to fix the warning
Tabs.propTypes = {
  children: PropTypes.node.isRequired,
};

TabsList.propTypes = {
  children: PropTypes.node.isRequired,
};

TabsTrigger.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};

TabsContent.propTypes = {
  children: PropTypes.node.isRequired,
  isActive: PropTypes.bool.isRequired,
};
