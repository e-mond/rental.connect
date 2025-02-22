const DashboardCards = () => {
  const cards = [
    {
      title: "Find Your Home",
      description: "Browse available properties matching your criteria",
      actionText: "Start Search",
    },
    {
      title: "Active Applications",
      description: "You have no active rental applications",
      actionText: "View All",
    },
    {
      title: "Payment Setup",
      description: "Complete your payment information",
      actionText: "Setup Now",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold">{card.title}</h2>
          <p className="text-sm text-gray-600 mt-2">{card.description}</p>
          <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            {card.actionText}
          </button>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
