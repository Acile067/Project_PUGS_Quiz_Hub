import React from "react";

const LoginError = ({ message }) => {
  if (!message) return null;
  return <p className="mt-4 text-center text-red-600 font-medium">{message}</p>;
};

export default LoginError;
