import { useState } from "react";
import { Card, CardContent } from "../../../../components/Card";
import Button from "../../../../components/Button";
import {
  FaFileAlt,
  FaCloudUploadAlt,
  FaDownload,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { MdGavel, MdDescription } from "react-icons/md";
import Sidebar from "../../components/Sidebar";

const mockDocuments = [
  {
    id: 1,
    name: "Lease Agreement - Apt 4B",
    updated: "2 days ago",
    category: "leases",
    icon: <FaFileAlt />,
  },
  {
    id: 2,
    name: "Insurance Policy",
    updated: "1 week ago",
    category: "other",
    icon: <MdGavel />,
  },
  {
    id: 3,
    name: "Maintenance Contract",
    updated: "2 weeks ago",
    category: "contracts",
    icon: <MdDescription />,
  },
  {
    id: 4,
    name: "Property Tax Document",
    updated: "1 month ago",
    category: "other",
    icon: <FaFileAlt />,
  },
  {
    id: 5,
    name: "Residential Lease Agreement",
    updated: "3 days ago",
    category: "leases",
    icon: <FaFileAlt />,
  },
];

export default function Documents() {
  const [selectedTab, setSelectedTab] = useState("all");

  const filteredDocuments =
    selectedTab === "all"
      ? mockDocuments
      : mockDocuments.filter((doc) => doc.category === selectedTab);

  const handleDownload = (docName) => {
    alert(`Downloading: ${docName}`);
  };

  const handleEdit = (docName) => {
    alert(`Editing: ${docName}`);
  };

  const handleDelete = (docName) => {
    alert(`Deleting: ${docName}`);
  };

  const handleUpload = () => {
    alert("Upload functionality will be implemented.");
  };

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <div className="p-6 space-y-6 flex-1 w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl font-semibold">Documents</h2>
          <Button
            onClick={handleUpload}
            className="bg-blue-600 text-white flex items-center gap-2 px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            <FaCloudUploadAlt /> Upload Document
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Card className="shadow hover:shadow-md transition">
            <CardContent className="p-4 flex items-center gap-4">
              <FaFileAlt className="text-blue-500 text-3xl" />
              <div>
                <h3 className="font-semibold">Total Documents</h3>
                <p className="text-lg">{mockDocuments.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow hover:shadow-md transition">
            <CardContent className="p-4 flex items-center gap-4">
              <MdGavel className="text-blue-500 text-3xl" />
              <div>
                <h3 className="font-semibold">Leases</h3>
                <p className="text-lg">
                  {
                    mockDocuments.filter((doc) => doc.category === "leases")
                      .length
                  }
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow hover:shadow-md transition">
            <CardContent className="p-4 flex items-center gap-4">
              <MdDescription className="text-blue-500 text-3xl" />
              <div>
                <h3 className="font-semibold">Contracts</h3>
                <p className="text-lg">
                  {
                    mockDocuments.filter((doc) => doc.category === "contracts")
                      .length
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <div className="flex flex-wrap gap-4 border-b pb-2">
          {["all", "leases", "contracts", "other"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 rounded-md cursor-pointer transition ${
                selectedTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-blue-100"
              }`}
            >
              {tab === "all"
                ? "All Documents"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Documents List */}
        <div className="space-y-4">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-col sm:flex-row justify-between items-center p-4 bg-white shadow rounded-lg hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl text-blue-500">{doc.icon}</span>
                <div>
                  <h4 className="font-semibold">{doc.name}</h4>
                  <p className="text-gray-500 text-sm">Updated {doc.updated}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <FaDownload
                  className="text-gray-500 text-xl cursor-pointer hover:text-gray-700 transition"
                  onClick={() => handleDownload(doc.name)}
                />
                <FaEdit
                  className="text-gray-500 text-xl cursor-pointer hover:text-blue-500 transition"
                  onClick={() => handleEdit(doc.name)}
                />
                <FaTrash
                  className="text-gray-500 text-xl cursor-pointer hover:text-red-500 transition"
                  onClick={() => handleDelete(doc.name)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
