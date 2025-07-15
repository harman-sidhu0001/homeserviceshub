import React from "react";
import LoggedProviderProfileView from "../view/providerProfileView/LoggedProviderProfileView";
import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

const LoggedProviderProfilePage = () => {
  const { role } = useAuth();
  if (role && role !== "provider" && role !== "both") {
    return <Navigate to="/" replace />;
  }
  return <LoggedProviderProfileView />;
};

export default LoggedProviderProfilePage;
