import React from "react";
import {
  isAuthenticated,
  getUserRoleFromToken,
} from "../../services/authService";

const AdminRoute = ({ children }) => {
  if (!isAuthenticated() || getUserRoleFromToken() !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
