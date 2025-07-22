import React, { useEffect } from "react";
import { useAdminDashboard } from "../viewModel/adminViewModel.js";
import { useAdminStatsViewModel } from "../viewModel/adminStatsViewModel";
import { useAdminVerificationViewModel } from "../viewModel/adminVerificationViewModel";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";
import SeoHelmet from "../seo/SeoHelmet.jsx";
import { useNavigate } from "react-router-dom";
import CustomButton from "../components/common/Button.jsx";
import { FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const AdminDashboard = () => {
  const { user, loading, handleLogout } = useAdminDashboard();
  const {
    stats,
    loading: statsLoading,
    error: statsError,
  } = useAdminStatsViewModel();
  const { verificationStats, loading: verificationLoading } =
    useAdminVerificationViewModel();
  const navigate = useNavigate();

  return (
    <>
      <SeoHelmet
        title="Admin Dashboard - Home Services Hub"
        description="Admin dashboard for managing Home Services Hub"
        keywords="admin, dashboard, management"
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 mt-2">
                  Welcome back, {user?.email}
                </p>
              </div>
              <CustomButton
                text={loading ? "Logging out..." : "Logout"}
                onClick={handleLogout}
                disabled={loading}
                width={"auto"}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card
                title="Total Users"
                description={
                  statsLoading
                    ? "Loading..."
                    : statsError
                    ? "Error"
                    : stats?.totalUsers ?? 0
                }
                className="p-6"
              />

              <Card
                title="Total Providers"
                description={
                  statsLoading
                    ? "Loading..."
                    : statsError
                    ? "Error"
                    : stats?.totalProviders ?? 0
                }
                className="p-6"
              />

              <Card
                title="Service Requests"
                description={
                  statsLoading
                    ? "Loading..."
                    : statsError
                    ? "Error"
                    : stats?.totalRequests ?? 0
                }
                className="p-6"
              />
              {/* Verification Status Card */}
              <Card
                title="Verification Requests"
                description={
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <FaClock className="text-blue-500 mr-2" />
                      <span className="text-gray-600">Pending: </span>
                      <span className="font-medium ml-1">
                        {verificationLoading
                          ? "..."
                          : verificationStats.requested}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <FaCheckCircle className="text-green-500 mr-2" />
                      <span className="text-gray-600">Verified: </span>
                      <span className="font-medium ml-1">
                        {verificationLoading
                          ? "..."
                          : verificationStats.verified}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <FaTimesCircle className="text-red-500 mr-2" />
                      <span className="text-gray-600">Rejected: </span>
                      <span className="font-medium ml-1">
                        {verificationLoading
                          ? "..."
                          : verificationStats.rejected}
                      </span>
                    </div>
                  </div>
                }
                className="p-6"
              />
            </div>

            <div className="mt-8">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <CustomButton
                    text="View All Users"
                    onClick={() => navigate("/admin/dashboard/users")}
                  />
                  <CustomButton
                    text="View All Providers"
                    onClick={() => navigate("/admin/dashboard/providers")}
                  />
                  <CustomButton
                    text="View Service Requests"
                    onClick={() => navigate("/admin/dashboard/requests")}
                  />
                  <CustomButton
                    text="Manage Verifications"
                    onClick={() => navigate("/admin/dashboard/verifications")}
                  />
                  <CustomButton
                    text="Manage Trending Services"
                    onClick={() =>
                      navigate("/admin/dashboard/trending-services")
                    }
                  />
                  <CustomButton
                    text="Manage Services"
                    onClick={() => navigate("/admin/dashboard/services")}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
