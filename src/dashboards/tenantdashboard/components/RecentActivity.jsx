const RecentActivity = () => {
  const activities = [
    { message: "Account created", time: "Just now" },
    { message: "Profile completion pending", time: "2 min ago" },
  ];

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      <ul className="space-y-4">
        {activities.map((activity, index) => (
          <li key={index} className="flex justify-between items-center">
            <p className="text-gray-800">{activity.message}</p>
            <p className="text-sm text-gray-600">{activity.time}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivity;
