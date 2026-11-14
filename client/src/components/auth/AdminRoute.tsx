import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function AdminRoute() {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!storedUser) {
    return <Navigate to="/" replace />;
  }

  let isAdmin = false;
  try {
    const user = JSON.parse(storedUser);
    isAdmin = user?.role === "admin";
  } catch {
    // Invalid stored user data is treated as unauthorized.
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;