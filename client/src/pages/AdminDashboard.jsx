import React from "react";
import { useAdminDashboard } from "../viewModel/adminViewModel.js";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";
import SeoHelmet from "../seo/SeoHelmet.jsx";

const AdminDashboard = () => {
  const { user, loading, handleLogout } = useAdminDashboard();

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
              <Button
                onClick={handleLogout}
                variant="outline"
                loading={loading}
                disabled={loading}
              >
                {loading ? "Logging out..." : "Logout"}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Total Users
                </h3>
                <p className="text-3xl font-bold text-blue-600">0</p>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Total Providers
                </h3>
                <p className="text-3xl font-bold text-green-600">0</p>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Service Requests
                </h3>
                <p className="text-3xl font-bold text-purple-600">0</p>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Revenue
                </h3>
                <p className="text-3xl font-bold text-orange-600">₹0</p>
              </Card>
            </div>

            <div className="mt-8">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="justify-start">
                    View All Users
                  </Button>
                  <Button variant="outline" className="justify-start">
                    View All Providers
                  </Button>
                  <Button variant="outline" className="justify-start">
                    View Service Requests
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
