import React from "react";
import AdminLoginView from "../view/adminView/AdminLoginView.jsx";
import SeoHelmet from "../seo/SeoHelmet.jsx";

const AdminLoginPage = () => {
  return (
    <>
      <SeoHelmet
        title="Admin Login - Home Services Hub"
        description="Admin login portal for Home Services Hub"
        keywords="admin, login, dashboard"
      />
      <AdminLoginView />
    </>
  );
};

export default AdminLoginPage;
