import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const schema = yup.object().shape({
  fullName: yup.string().required("Full Name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  phone: yup
    .string()
    .matches(/\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .required("Phone number is required"),
  bio: yup.string().max(500, "Bio cannot exceed 500 characters"),
  password: yup.string().min(6, "Password must be at least 6 characters"),
});

const Profile = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState(null);
  const [accountCreated, setAccountCreated] = useState("");

  useEffect(() => {
    axios
      .get("/api/user/profile")
      .then((response) => {
        const { fullName, email, phone, bio, profilePic, createdAt } =
          response.data;
        setValue("fullName", fullName);
        setValue("email", email);
        setValue("phone", phone);
        setValue("bio", bio);
        setProfilePic(profilePic);
        setAccountCreated(new Date(createdAt).toLocaleDateString());
      })
      .catch((error) => console.error("Error fetching profile data", error))
      .finally(() => setLoading(false));
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      await axios.put("/api/user/profile", data);
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Error updating profile");
    }
  };

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  if (loading) return <p className="text-center mt-10 text-lg">Loading...</p>;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 overflow-auto flex justify-center items-center">
        <div className="bg-white shadow-lg rounded-lg p-4 md:p-6 w-full max-w-md md:max-w-lg">
          <h2 className="text-xl md:text-2xl font-semibold text-center mb-4 md:mb-6">
            Profile Information
          </h2>
          <div className="flex flex-col items-center mb-3 md:mb-4">
            <img
              src={profilePic || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover mb-2 border-4 border-black-500"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              className="text-sm text-gray-600"
            />
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-3 md:space-y-4"
          >
            <div>
              <label className="block text-sm font-medium">Full Name</label>
              <input
                type="text"
                {...register("fullName")}
                className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
              />
              <p className="text-red-500 text-sm">{errors.fullName?.message}</p>
            </div>

            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                {...register("email")}
                className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
              />
              <p className="text-red-500 text-sm">{errors.email?.message}</p>
            </div>

            <div>
              <label className="block text-sm font-medium">Phone Number</label>
              <input
                type="text"
                {...register("phone")}
                className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
              />
              <p className="text-red-500 text-sm">{errors.phone?.message}</p>
            </div>

            <div>
              <label className="block text-sm font-medium">Bio</label>
              <textarea
                {...register("bio")}
                className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
              />
              <p className="text-red-500 text-sm">{errors.bio?.message}</p>
            </div>

            <div>
              <label className="block text-sm font-medium">
                Change Password
              </label>
              <input
                type="password"
                {...register("password")}
                className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
                placeholder="Enter new password"
              />
              <p className="text-red-500 text-sm">{errors.password?.message}</p>
            </div>

            <div className="text-sm text-gray-500 text-center">
              Account created on: {accountCreated}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-black text-white px-4 py-2 rounded hover:bg-blue-700 w-full font-semibold"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
