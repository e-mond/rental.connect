import PropTypes from "prop-types";
import { useDarkMode } from "../hooks/useDarkMode"; // Fixed import

const Button = ({
  variant,
  type,
  disabled,
  onClick,
  children,
  className,
  title,
  as: Component = "button",
  ...rest
}) => {
  const { darkMode } = useDarkMode();

  const baseStyles =
    "font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 px-4 py-2";

  const variants = {
    primary: darkMode
      ? "bg-teal-500 text-white hover:bg-teal-600 focus:ring-teal-400"
      : "bg-black text-white hover:bg-gray-800 focus:ring-black",
    secondary: darkMode
      ? "border border-teal-500 text-teal-200 hover:bg-teal-500/20 focus:ring-teal-400"
      : "border border-gray-400 text-gray-900 hover:bg-gray-100 focus:ring-black",
    danger: darkMode
      ? "bg-red-600 text-white hover:bg-red-500 focus:ring-red-400"
      : "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
    icon: darkMode
      ? "text-gray-400 hover:text-gray-300 focus:ring-blue-400"
      : "text-gray-500 hover:text-gray-600 focus:ring-black",
  };

  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <Component
      type={Component === "button" ? type : undefined}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || ""} ${disabledStyles} ${
        className || ""
      }`}
      title={title}
      {...rest}
    >
      {children}
    </Component>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(["primary", "secondary", "danger", "icon"])
    .isRequired,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  title: PropTypes.string,
  as: PropTypes.elementType,
};

Button.defaultProps = {
  type: "button",
  disabled: false,
  onClick: () => {},
  className: "",
  title: "",
  as: "button",
};

export default Button;
