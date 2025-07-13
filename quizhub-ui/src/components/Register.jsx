import React, { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../services/userService";

const Register = () => {
  const [formData, setFormData] = useState({
    Username: "",
    FullName: "",
    Email: "",
    Password: "",
    ProfilePicture: null,
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    setFieldErrors((prev) => ({ ...prev, [name]: null }));

    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      setProfileImagePreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setSuccessMessage("");

    if (!formData.ProfilePicture) {
      setFieldErrors((prev) => ({
        ...prev,
        ProfilePicture: "Profile image is required.",
      }));
      return;
    }

    try {
      const response = await registerUser(formData);

      let data;
      try {
        data = await response.json();
      } catch {
        data = { ExceptionMessage: await response.text() };
      }

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          const errorsObj = {};
          for (const error of data.errors) {
            errorsObj[error.name] = error.reason;
          }
          setFieldErrors(errorsObj);
        } else {
          setFieldErrors({
            general:
              data.Message ||
              data.ExceptionMessage ||
              data.detail ||
              "Registration failed",
          });
        }
        return;
      }

      setSuccessMessage(data.Message || "User registered successfully");
    } catch (error) {
      setFieldErrors({ general: "Network error or server unavailable" });
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-lg shadow-md p-8 space-y-6"
      >
        <Link
          to="/"
          className="block w-full text-2xl font-semibold mb-6 text-center"
        >
          QuizHub
        </Link>

        <div className="flex justify-center">
          <label
            htmlFor="ProfilePicture"
            className="relative cursor-pointer group"
          >
            <img
              src={
                profileImagePreview ||
                "https://avatars.githubusercontent.com/u/583231?v=4"
              }
              alt="Profile Preview"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-300 group-hover:opacity-80 transition"
            />
            <input
              type="file"
              id="ProfilePicture"
              name="ProfilePicture"
              accept="image/*"
              onChange={handleChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="absolute bottom-0 w-full text-center text-sm text-white bg-black bg-opacity-50 rounded-b-full py-1 hidden group-hover:block">
              Change
            </div>
          </label>
        </div>
        {fieldErrors.ProfilePicture && (
          <p className="text-red-500 text-sm text-center mt-2">
            {fieldErrors.ProfilePicture}
          </p>
        )}

        {["Username", "FullName", "Email", "Password"].map((field) => (
          <div key={field}>
            <label
              htmlFor={field}
              className="block mb-2 font-medium text-gray-700"
            >
              {field}
            </label>
            <input
              type={
                field === "Email"
                  ? "email"
                  : field === "Password"
                  ? "password"
                  : "text"
              }
              id={field}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
              placeholder={field}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {fieldErrors[field] && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors[field]}</p>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Register
        </button>

        {fieldErrors.general && (
          <p className="text-red-600 mt-4 text-center font-semibold">
            {fieldErrors.general}
          </p>
        )}

        {successMessage && (
          <p className="text-green-600 mt-4 text-center font-semibold">
            {successMessage}
          </p>
        )}
      </form>
    </div>
  );
};

export default Register;
