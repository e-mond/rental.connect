import notificationImage from "/src/assets/Not2.jpg";

export default function NotificationsSection() {
  return (
    <section className="flex flex-col lg:flex-row items-center justify-between px-6 py-12 lg:px-20">
      <div className="max-w-lg space-y-4">
        <h6 className="text-sm font-semibold text-gray-600">Notifications</h6>
        <h2 className="text-3xl font-bold text-gray-900">
          Stay Informed with Essential Notifications
        </h2>
        <p className="text-gray-600">
          Our platform ensures you never miss important updates regarding rent,
          maintenance, and lease agreements.
        </p>
        <ul className="space-y-2">
          <li>✔ Receive alerts for rent due dates and maintenance needs.</li>
          <li>✔ Stay updated on lease agreements and important changes.</li>
          <li>✔ Manage your rental history with ease and confidence.</li>
        </ul>
      </div>

      {/* Image Section */}
      <div className="w-full lg:w-1/2 h-64 flex items-center justify-center mt-8 lg:mt-0">
        <img
          src={notificationImage}
          alt="Notifications Preview"
          className="w-full h-full object-cover rounded-lg shadow-md"
        />
      </div>
    </section>
  );
}
