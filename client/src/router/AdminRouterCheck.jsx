import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAdminAuthCheck } from "../viewModel/adminAuthCheck";

const AdminRouterCheck = ({ children }) => {
  const { user, role, loading } = useAdminAuthCheck();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Checking admin authentication...
      </div>
    );
  }

  if (!user || role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminRouterCheck;
