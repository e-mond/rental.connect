import PropTypes from "prop-types";

export const TableHeader = ({ children }) => {
  return <thead className="bg-gray-200">{children}</thead>;
};

export const TableHead = ({ children }) => {
  return <thead className="bg-gray-200">{children}</thead>;
};

export const TableBody = ({ children }) => {
  return <tbody>{children}</tbody>;
};

export const TableRow = ({ children }) => {
  return <tr className="border-b">{children}</tr>;
};

export const TableCell = ({ children }) => {
  return <td className="p-4">{children}</td>;
};

export const Table = ({ children }) => {
  return <table className="w-full border-collapse">{children}</table>;
};

// ✅ Add PropTypes to prevent warnings
TableHeader.propTypes = {
  children: PropTypes.node.isRequired,
};

TableHead.propTypes = {
  children: PropTypes.node.isRequired,
};

TableBody.propTypes = {
  children: PropTypes.node.isRequired,
};

TableRow.propTypes = {
  children: PropTypes.node.isRequired,
};

TableCell.propTypes = {
  children: PropTypes.node.isRequired,
};

Table.propTypes = {
  children: PropTypes.node.isRequired,
};
