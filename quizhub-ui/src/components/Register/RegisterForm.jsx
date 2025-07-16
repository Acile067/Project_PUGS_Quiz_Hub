// RegisterForm.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../../services/userService";
import ProfileImageUploader from "./ProfileImageUploader";
import RegisterField from "./RegisterField";

const RegisterForm = () => {
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

      <ProfileImageUploader
        preview={profileImagePreview}
        onChange={handleChange}
        error={fieldErrors.ProfilePicture}
      />

      {["Username", "FullName", "Email", "Password"].map((field) => (
        <RegisterField
          key={field}
          field={field}
          value={formData[field]}
          onChange={handleChange}
          error={fieldErrors[field]}
        />
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
  );
};

export default RegisterForm;
