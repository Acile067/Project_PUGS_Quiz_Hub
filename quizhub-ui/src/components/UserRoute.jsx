import React from "react";
import { isAuthenticated, getUserRoleFromToken } from "../services/authService";

const UserRoute = ({ children }) => {
  if (!isAuthenticated() || getUserRoleFromToken() !== "User") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default UserRoute;
