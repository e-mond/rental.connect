import { useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import LandlordSidebar from "../../components/LandlordSidebar";
import GlobalSkeleton from "../../../../components/GlobalSkeleton";
import { BASE_URL, DEFAULT_PROFILE_PIC } from "../../../../config";
import { useUser } from "../../../../hooks/useUser";
import {
  HomeIcon,
  BuildingOfficeIcon,
  UsersIcon,
  StarIcon,
  WrenchIcon,
  EnvelopeIcon,
  CreditCardIcon,
  DocumentTextIcon,
  CogIcon,
} from "@heroicons/react/24/outline";
import { useDarkMode } from "../../../../context/DarkModeContext";
import Button from "../../../../components/Button";

// Function to fetch properties for the landlord using the backend API
const fetchPropertiesByLandlord = async (userId, token) => {
  const response = await fetch(
    `${BASE_URL}/api/properties/landlord/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch properties: ${response.statusText}`);
  }

  const contentType = response.headers.get("Content-Type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    throw new Error(`Expected JSON, but received: ${text.substring(0, 50)}...`);
  }

  return response.json();
};

const LandlordDashboard = () => {
  const { darkMode } = useDarkMode();
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const sidebarOpen = localStorage.getItem("sidebarOpen");
    console.log("sidebarOpen from localStorage:", sidebarOpen);
    if (
      sidebarOpen === null ||
      sidebarOpen === undefined ||
      sidebarOpen === ""
    ) {
      return false;
    }
    try {
      const parsedValue = JSON.parse(sidebarOpen);
      return typeof parsedValue === "boolean" ? parsedValue : false;
    } catch (err) {
      console.error("Failed to parse sidebarOpen from localStorage:", err);
      localStorage.removeItem("sidebarOpen");
      return false;
    }
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: userLoading, error: userError } = useUser();
  const token = localStorage.getItem("token");

  // Define navigation menu items for the sidebar
  const menuItems = [
    { name: "Dashboard", path: "/dashboard/landlord", icon: HomeIcon },
    {
      name: "Properties",
      path: "/dashboard/landlord/properties",
      icon: BuildingOfficeIcon,
    },
    { name: "Tenants", path: "/dashboard/landlord/tenants", icon: UsersIcon },
    { name: "Reviews", path: "/dashboard/landlord/reviews", icon: StarIcon },
    {
      name: "Maintenance",
      path: "/dashboard/landlord/maintenance",
      icon: WrenchIcon,
    },
    {
      name: "Messages",
      path: "/dashboard/landlord/messages",
      icon: EnvelopeIcon,
    },
    {
      name: "Revenue",
      path: "/dashboard/landlord/revenue",
      icon: CreditCardIcon,
    },
  ];

  // Define management menu items for the sidebar
  const managementItems = [
    {
      name: "Payments",
      path: "/dashboard/landlord/payments",
      icon: CreditCardIcon,
    },
    {
      name: "Documents",
      path: "/dashboard/landlord/documents",
      icon: DocumentTextIcon,
    },
    { name: "Settings", path: "/dashboard/landlord/settings", icon: CogIcon },
  ];

  // Fetch properties using TanStack Query once user data is available
  const {
    data: properties,
    isLoading: isPropertiesLoading,
    error: propertiesError,
  } = useQuery({
    queryKey: ["properties", user?._id],
    queryFn: () => fetchPropertiesByLandlord(user._id, token),
    enabled: !!user && !!user._id && !!token,
    onError: (err) => {
      console.error("Failed to fetch properties:", err);
    },
  });

  // Persist sidebar state in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  // Determine the type of skeleton loader based on the current route
  const getSkeletonType = () => {
    const path = location.pathname;
    if (path.includes("dashboard")) return "dashboard";
    if (path.includes("properties")) return "cards";
    if (path.includes("tenants")) return "list";
    if (path.includes("reviews")) return "list";
    if (path.includes("maintenance")) return "list";
    if (path.includes("messages")) return "list";
    if (path.includes("payments")) return "table";
    if (path.includes("documents")) return "list";
    if (path.includes("settings")) return "form";
    if (path.includes("profile")) return "profile";
    if (path.includes("revenue")) return "revenue";
    return "list";
  };

  // Handle loading state while user data or properties are being fetched
  if (userLoading || isPropertiesLoading) {
    return (
      <div
        className={`flex h-screen ${
          darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-black"
        }`}
      >
        <LandlordSidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          user={null}
          isLoading={true}
          menuItems={menuItems}
          managementItems={managementItems}
        />
        <div className="flex-1 p-6 overflow-auto">
          <GlobalSkeleton
            type={getSkeletonType()}
            bgColor={darkMode ? "bg-gray-700" : "bg-gray-300"}
            animationSpeed="1.2s"
          />
        </div>
      </div>
    );
  }

  // Handle error state if user fetch fails
  if (userError) {
    return (
      <div
        className={`flex h-screen ${
          darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-black"
        }`}
      >
        <LandlordSidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          user={null}
          isLoading={false}
          menuItems={menuItems}
          managementItems={managementItems}
        />
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <p className={darkMode ? "text-red-400" : "text-red-500"}>
              {userError}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Handle properties fetch error
  if (propertiesError) {
    return (
      <div
        className={`flex h-screen ${
          darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-black"
        }`}
      >
        <LandlordSidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          user={null}
          isLoading={false}
          menuItems={menuItems}
          managementItems={managementItems}
        />
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <p className={darkMode ? "text-red-400" : "text-red-500"}>
              Error fetching properties: {propertiesError.message}
            </p>
            <Button variant="primary" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Redirect if the user is a tenant
  if (user && user.role && user.role.toUpperCase() === "TENANT") {
    navigate("/dashboard/tenant/dashboard");
    return null;
  }

  // Format user data for the sidebar and child components
  const formattedUser = user
    ? {
        ...user,
        profilePic: user.profilePic || DEFAULT_PROFILE_PIC,
        accountType: user.role || "Landlord",
      }
    : null;

  // Render the dashboard layout with sidebar and child routes
  return (
    <div
      className={`flex h-screen ${
        darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-black"
      }`}
    >
      <LandlordSidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        user={formattedUser}
        isLoading={false}
        menuItems={menuItems}
        managementItems={managementItems}
      />
      <div className="flex-1 p-6 overflow-auto">
        <Outlet
          context={{
            user: formattedUser,
            properties,
            isLoading: isPropertiesLoading,
          }}
        />
      </div>
    </div>
  );
};

export default LandlordDashboard;
