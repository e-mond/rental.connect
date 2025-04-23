import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LeaseRenewals = () => {
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaseData = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("LeaseRenewals - token:", token); // Debug log
        if (!token) {
          console.error("LeaseRenewals - No token found, redirecting to login");
          navigate("/landlordlogin");
          return;
        }

        const response = await fetch(
          "http://localhost:8080/api/landlord/leases",
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
              "LeaseRenewals - 401 Unauthorized, redirecting to login"
            );
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/landlordlogin");
            return;
          }
          const errorText = await response.text();
          throw new Error(`Failed to fetch lease data: ${errorText}`);
        }

        const data = await response.json();
        console.log("LeaseRenewals - fetched data:", data); // Debug log
        setLeases(data);
      } catch (err) {
        console.error("Error fetching lease data:", err);
        setLeases([
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
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaseData();
  }, [navigate]);

  if (loading) {
    return <p className="text-gray-500">Loading lease renewals...</p>;
  }

  return (
    <div className="mt-6 md:mt-8">
      <h3 className="text-lg md:text-xl font-bold mb-4">
        Upcoming Lease Renewals
      </h3>
      <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3 md:p-4 text-sm md:text-base">
                Property
              </th>
              <th className="text-left p-3 md:p-4 text-sm md:text-base">
                Tenant
              </th>
              <th className="text-left p-3 md:p-4 text-sm md:text-base">
                Days Remaining
              </th>
              <th className="text-left p-3 md:p-4 text-sm md:text-base">
                Rent
              </th>
            </tr>
          </thead>
          <tbody>
            {leases.map((lease, index) => (
              <tr key={index} className="border-t">
                <td className="p-3 md:p-4 text-sm md:text-base">
                  {lease.property}
                </td>
                <td className="p-3 md:p-4 text-sm md:text-base">
                  {lease.tenant}
                </td>
                <td className="p-3 md:p-4 text-sm md:text-base">
                  {lease.daysRemaining}
                </td>
                <td className="p-3 md:p-4 text-sm md:text-base">
                  {lease.rent}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="block md:hidden space-y-4">
        {leases.map((lease, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm font-semibold text-gray-700">
              Property: {lease.property}
            </p>
            <p className="text-sm text-gray-600">Tenant: {lease.tenant}</p>
            <p className="text-sm text-gray-600">
              Days Remaining: {lease.daysRemaining}
            </p>
            <p className="text-sm text-gray-600">Rent: {lease.rent}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaseRenewals;
