import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const userRole = localStorage.getItem("userRole");

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;