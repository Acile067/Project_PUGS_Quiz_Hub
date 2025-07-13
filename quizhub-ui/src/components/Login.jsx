import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/userService";
import { createLoginRequest } from "../models/loginRequestModel";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    try {
      const request = createLoginRequest(email, password);
      const response = await loginUser(request);

      let data;
      try {
        data = await response.json();
      } catch {
        data = { ExceptionMessage: await response.text() };
      }

      if (!response.ok) {
        if (response.status === 401) {
          setFieldErrors({ general: "Wrong email or password." });
          return;
        }

        if (data.errors && Array.isArray(data.errors)) {
          const errorsObj = {};
          for (const error of data.errors) {
            errorsObj[error.name] = error.reason;
          }
          setFieldErrors(errorsObj);
        } else {
          setFieldErrors({
            general:
              data.detail ||
              data.message ||
              data.ExceptionMessage ||
              "Login failed.",
          });
        }
        return;
      }

      if (data.success) {
        localStorage.setItem("access_token", data.token);
        navigate("/");
      } else {
        setFieldErrors({ general: data.message || "Login failed." });
      }
    } catch (error) {
      setFieldErrors({ general: "Unexpected error: " + error.message });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-lg shadow-md p-8"
      >
        <Link
          to="/"
          className="block w-full text-2xl font-semibold mb-6 text-center"
        >
          QuizHub
        </Link>

        <label htmlFor="email" className="block mb-2 font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {fieldErrors.Email && (
          <p className="text-red-500 text-sm mt-1">{fieldErrors.Email}</p>
        )}

        <label
          htmlFor="password"
          className="block mt-4 mb-2 font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {fieldErrors.Password && (
          <p className="text-red-500 text-sm mt-1">{fieldErrors.Password}</p>
        )}

        <button
          type="submit"
          className="w-full mt-6 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Login
        </button>

        {fieldErrors.general && (
          <p className="mt-4 text-center text-red-600 font-medium">
            {fieldErrors.general}
          </p>
        )}

        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
