// RegisterField.jsx
import React from "react";

const RegisterField = ({ field, value, onChange, error }) => {
  const type =
    field === "Email" ? "email" : field === "Password" ? "password" : "text";

  return (
    <div>
      <label htmlFor={field} className="block mb-2 font-medium text-gray-700">
        {field}
      </label>
      <input
        type={type}
        id={field}
        name={field}
        value={value}
        onChange={onChange}
        required
        placeholder={field}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default RegisterField;
