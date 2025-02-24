import { useParams } from "react-router-dom";

const PropertyDetails = () => {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Property Details</h1>
      <p className="text-gray-600">Property ID: {id}</p>

      <div className="mt-4 border p-4 rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold">Modern Downtown Apartment</h2>
        <p>📍 Location: Downtown City</p>
        <p>💰 Rent: GH₵1,800/month</p>
        <p>🛏 2 Bedrooms, 🚿 2 Bathrooms</p>
        <p>📅 Available from: July 1st</p>

        <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default PropertyDetails;
