import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/userService";
import { createLoginRequest } from "../../models/loginRequestModel";
import LoginInput from "./LoginInput";
import LoginError from "./LoginError";

const LoginForm = () => {
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

      <LoginInput
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={fieldErrors.Email}
      />

      <LoginInput
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={fieldErrors.Password}
      />

      <button
        type="submit"
        className="w-full mt-6 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
      >
        Login
      </button>

      <LoginError message={fieldErrors.general} />

      <p className="mt-4 text-center text-gray-600">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
