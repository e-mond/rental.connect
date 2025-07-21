import Notifications from "../../../components/Notifications";

// Mock notification data (replace with API call in production)
const mockNotifications = [
  {
    id: 1,
    title: "Rent Due Soon",
    message: "Your July rent is due in 3 days.",
    timestamp: "2025-07-03 09:00 AM",
    type: "rent",
    isRead: false,
    status: "due",
    details: "Amount: $1,200",
  },
  {
    id: 2,
    title: "Maintenance Scheduled",
    message: "Plumbing repair on July 5, 10:00 AM.",
    timestamp: "2025-07-04 02:30 PM",
    type: "maintenance",
    isRead: false,
    details: "Technician: John Doe",
  },
  {
    id: 3,
    title: "Lease Renewal",
    message: "Your lease renewal is available for review.",
    timestamp: "2025-07-02 11:15 AM",
    type: "lease",
    isRead: false,
    details: "Deadline: July 15, 2025",
  },
  {
    id: 4,
    title: "Payment Received",
    message: "Your June rent payment was received.",
    timestamp: "2025-06-30 03:45 PM",
    type: "rent",
    isRead: true,
    status: "received",
    details: "Amount: $1,200",
  },
];

/**
 * TenantNotifications Component
 *
 * Displays a list of notifications for the tenant user using the shared Notifications component.
 *
 * @returns {JSX.Element} The rendered TenantNotifications component
 */
const TenantNotifications = () => {
  return (
    <Notifications initialNotifications={mockNotifications} userType="tenant" />
  );
};

export default TenantNotifications;
