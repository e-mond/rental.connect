import { FaStar, FaWrench, FaDollarSign } from "react-icons/fa";

const RecentActivity = () => {
  const activities = [
    {
      icon: <FaStar className="text-yellow-500 mr-2 inline" />,
      title: "New Review Received",
      detail: "Property: 123 Main St - 5.0 Rating",
    },
    {
      icon: <FaWrench className="text-blue-500 mr-2 inline" />,
      title: "Maintenance Request",
      detail: "Property: 456 Oak Ave - High Priority",
    },
    {
      icon: <FaDollarSign className="text-green-500 mr-2 inline" />,
      title: "Rent Payment Received",
      detail: "Property: 789 Pine St - GH₵2,000",
    },
  ];

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
      <ul className="space-y-4">
        {activities.map((activity, index) => (
          <li
            key={index}
            className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
          >
            <div>
              {activity.icon} {activity.title}
              <p className="text-gray-500">{activity.detail}</p>
            </div>
            <a href="#" className="text-blue-500">
              View
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivity;
