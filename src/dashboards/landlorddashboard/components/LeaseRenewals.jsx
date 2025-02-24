const LeaseRenewals = () => {
  const leases = [
    {
      property: "123 Main St",
      tenant: "John Doe",
      daysRemaining: "30 days",
      rent: "GH₵2,000/mo",
    },
    {
      property: "456 Oak Ave",
      tenant: "Jane Smith",
      daysRemaining: "45 days",
      rent: "GH₵1,800/mo",
    },
  ];

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Upcoming Lease Renewals</h3>
      <table className="w-full bg-white rounded-lg shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-4">Property</th>
            <th className="text-left p-4">Tenant</th>
            <th className="text-left p-4">Days Remaining</th>
            <th className="text-left p-4">Rent</th>
          </tr>
        </thead>
        <tbody>
          {leases.map((lease, index) => (
            <tr key={index} className="border-t">
              <td className="p-4">{lease.property}</td>
              <td className="p-4">{lease.tenant}</td>
              <td className="p-4">{lease.daysRemaining}</td>
              <td className="p-4">{lease.rent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaseRenewals;
