import { useState } from "react";
import {
  DocumentIcon,
  CreditCardIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

const Applications = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [uploaded, setUploaded] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [paid, setPaid] = useState(false);

  const applications = [
    {
      property: "Modern Downtown Apartment",
      date: "Jan 15, 2024",
      status: "Under Review",
      price: "GH₵2,100/month",
      category: "active",
    },
    {
      property: "Suburban Family Home",
      date: "Jan 12, 2024",
      status: "Background Check",
      price: "GH₵2,800/month",
      category: "pending",
    },
    {
      property: "Studio Loft",
      date: "Jan 10, 2024",
      status: "Document Review",
      price: "GH₵1,500/month",
      category: "completed",
    },
  ];

  const filteredApplications = applications.filter(
    (app) => app.category === activeTab
  );

  const requirements = [
    {
      title: "Documents",
      description: "Upload proof of income, ID, and references",
      icon: DocumentIcon,
      button: uploaded ? "Uploaded ✔" : "Upload",
      action: () => setUploaded(true),
    },
    {
      title: "Credit Check",
      description: "Authorize background and credit check",
      icon: CheckCircleIcon,
      button: authorized ? "Authorized ✔" : "Authorize",
      action: () => setAuthorized(true),
    },
    {
      title: "Application Fee",
      description: "Pay the required application fee",
      icon: CreditCardIcon,
      button: paid ? "Paid ✔" : "Pay Now",
      action: () => setPaid(true),
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">My Applications</h2>

      {/* Tabs */}
      <div className="flex space-x-4 border-b mt-4">
        {["active", "pending", "completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 ${
              activeTab === tab
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Applications List */}
      <div className="mt-4">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((app, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 border-b"
            >
              <div>
                <p className="font-medium">{app.property}</p>
                <p className="text-gray-500 text-sm">Submitted {app.date}</p>
              </div>
              <p className="text-gray-600">{app.status}</p>
              <p className="font-medium">{app.price}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 mt-4">
            No applications in this category.
          </p>
        )}
      </div>

      {/* Application Requirements */}
      <h3 className="text-xl font-semibold mt-6">Application Requirements</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {requirements.map(
          ({ title, description, icon: Icon, button, action }, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg flex flex-col items-center text-center"
            >
              <Icon
                className={`w-10 h-10 ${
                  button.includes("✔") ? "text-green-500" : "text-blue-500"
                } mb-2`}
              />
              <h4 className="font-semibold">{title}</h4>
              <p className="text-gray-500 text-sm mb-2">{description}</p>
              <button
                onClick={action}
                disabled={button.includes("✔")}
                className={`px-4 py-1 rounded-lg ${
                  button.includes("✔")
                    ? "bg-gray-400"
                    : "bg-blue-500 text-white"
                }`}
              >
                {button}
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Applications;
