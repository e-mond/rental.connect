import  { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";

const schema = yup.object().shape({
  fullName: yup.string().required("Full Name is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  phone: yup
    .string()
    .matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .required("Phone number is required"),
  bio: yup.string().max(500, "Bio cannot exceed 500 characters"),
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

  useEffect(() => {
    // Fetch user data
    axios.get("/api/user/profile")
      .then((response) => {
        const { fullName, email, phone, bio } = response.data;
        setValue("fullName", fullName);
        setValue("email", email);
        setValue("phone", phone);
        setValue("bio", bio);
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

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            type="text"
            {...register("fullName")}
            className="w-full p-2 border rounded"
          />
          <p className="text-red-500 text-sm">{errors.fullName?.message}</p>
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            {...register("email")}
            className="w-full p-2 border rounded"
          />
          <p className="text-red-500 text-sm">{errors.email?.message}</p>
        </div>

        <div>
          <label className="block text-sm font-medium">Phone Number</label>
          <input
            type="text"
            {...register("phone")}
            className="w-full p-2 border rounded"
          />
          <p className="text-red-500 text-sm">{errors.phone?.message}</p>
        </div>

        <div>
          <label className="block text-sm font-medium">Bio</label>
          <textarea
            {...register("bio")}
            className="w-full p-2 border rounded"
          />
          <p className="text-red-500 text-sm">{errors.bio?.message}</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
