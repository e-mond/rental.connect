import { FaHome, FaDollarSign, FaStar, FaBell } from "react-icons/fa";

const DashboardCards = () => {
  const cards = [
    {
      icon: <FaHome className="text-blue-500 text-2xl mb-2" />,
      title: "Properties",
      value: "12 Active rentals",
    },
    {
      icon: <FaDollarSign className="text-green-500 text-2xl mb-2" />,
      title: "Revenue",
      value: "GH₵24,500 Monthly",
    },
    {
      icon: <FaStar className="text-yellow-500 text-2xl mb-2" />,
      title: "Rating",
      value: "4.8/5.0 Avg",
    },
    {
      icon: <FaBell className="text-red-500 text-2xl mb-2" />,
      title: "Alerts",
      value: "3 Pending issues",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow">
          {card.icon}
          <h3 className="text-lg font-semibold">{card.title}</h3>
          <p className="text-gray-500">{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
