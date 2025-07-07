import React, { useEffect, useState } from "react";
import { getProviderAnalytics } from "../model/provider";
import useAuth from "../hooks/useAuth";
import Card from "../components/common/Card";

const ProviderAnalyticsDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?._id) return;
    setLoading(true);
    getProviderAnalytics(user._id)
      .then((res) => setAnalytics(res.data.data))
      .catch((err) => setError("Failed to load analytics"))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <div>Loading analytics...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!analytics) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Provider Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Total Requests" description={analytics.totalRequests} />
        <Card title="Accepted" description={analytics.acceptedRequests} />
        <Card title="Rejected" description={analytics.rejectedRequests} />
        <Card title="Pending" description={analytics.pendingRequests} />
        <Card
          title="Acceptance Rate"
          description={`${analytics.acceptanceRate}%`}
        />
        <Card
          title="Avg. Response Time"
          description={analytics.averageResponseTime}
        />
      </div>
      {/* You can add charts for monthlyTrend and topServices here */}
    </div>
  );
};

export default ProviderAnalyticsDashboard;
