import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaDollarSign, FaStar, FaBell } from "react-icons/fa";

const DashboardCards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("DashboardCards - token:", token); // Debug log
        if (!token) {
          console.error(
            "DashboardCards - No token found, redirecting to login"
          );
          navigate("/landlordlogin");
          return;
        }

        const response = await fetch(
          "http://localhost:8080/api/landlord/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json", // Add Content-Type for consistency
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            console.error(
              "DashboardCards - 401 Unauthorized, redirecting to login"
            );
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/landlordlogin");
            return;
          }
          const errorText = await response.text();
          throw new Error(`Failed to fetch dashboard data: ${errorText}`);
        }

        const data = await response.json();
        console.log("DashboardCards - fetched data:", data); // Debug log
        setCards([
          {
            icon: <FaHome className="text-blue-500 text-xl md:text-2xl mb-2" />,
            title: "Properties",
            value: `${data.activeRentals} Active rentals`,
          },
          {
            icon: (
              <FaDollarSign className="text-green-500 text-xl md:text-2xl mb-2" />
            ),
            title: "Revenue",
            value: `GH₵${data.monthlyRevenue.toLocaleString()} Monthly`,
          },
          {
            icon: (
              <FaStar className="text-yellow-500 text-xl md:text-2xl mb-2" />
            ),
            title: "Rating",
            value: `${data.averageRating}/5.0 Avg`,
          },
          {
            icon: <FaBell className="text-red-500 text-xl md:text-2xl mb-2" />,
            title: "Alerts",
            value: `${data.pendingIssues} Pending issues`,
          },
        ]);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setCards([
          {
            icon: <FaHome className="text-blue-500 text-xl md:text-2xl mb-2" />,
            title: "Properties",
            value: "12 Active rentals",
          },
          {
            icon: (
              <FaDollarSign className="text-green-500 text-xl md:text-2xl mb-2" />
            ),
            title: "Revenue",
            value: "GH₵24,500 Monthly",
          },
          {
            icon: (
              <FaStar className="text-yellow-500 text-xl md:text-2xl mb-2" />
            ),
            title: "Rating",
            value: "4.8/5.0 Avg",
          },
          {
            icon: <FaBell className="text-red-500 text-xl md:text-2xl mb-2" />,
            title: "Alerts",
            value: "3 Pending issues",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return <p className="text-gray-500">Loading dashboard data...</p>;
  }

  return (
    <div className="flex overflow-x-auto md:grid md:grid-cols-4 gap-3 md:gap-6 pb-2 md:pb-0">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white p-4 md:p-6 rounded-lg shadow min-w-[150px] md:min-w-0"
        >
          {card.icon}
          <h3 className="text-base md:text-lg font-semibold text-gray-700 leading-tight">
            {card.title}
          </h3>
          <p className="text-sm md:text-base text-gray-500">{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
