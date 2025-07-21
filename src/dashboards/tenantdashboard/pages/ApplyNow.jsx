import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import { useDarkMode } from "../../../context/DarkModeContext";

const ApplyNow = () => {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();

  return (
    <div
      className={`min-h-screen p-4 ${
        darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-800"
      }`}
    >
      <h1
        className={`text-2xl font-bold mb-4 ${
          darkMode ? "text-gray-100" : "text-gray-900"
        }`}
      >
        Apply for Property
      </h1>
      <p className="mb-4">Fill out the application form to apply.</p>
      {/* Add application form logic here */}
      <Button variant="secondary" onClick={() => navigate(-1)} className="mt-4">
        Back
      </Button>
    </div>
  );
};

export default ApplyNow;
