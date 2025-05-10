// filepath: d:\job1\JOB-A\frontend\src\PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token"); // Example: Check token in localStorage
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;