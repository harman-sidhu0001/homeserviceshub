import { motion } from "framer-motion";
import CustomButton from "../common/Button";

const ServiceRequestsBlock = ({
  requests,
  loading,
  onUpdateStatus,
  onRefresh,
}) => {
  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status display text
  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "accepted":
        return "Accepted";
      case "rejected":
        return "Rejected by Provider";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled by Customer";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <div className="text-xl font-semibold mb-4">Service Requests</div>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-gray-600">
            Loading service requests...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="text-xl font-semibold mb-6">Service Requests</div>

      {requests.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">📋</div>
          <p className="text-lg font-medium">No service requests yet</p>
          <p className="text-sm">
            Service requests from customers will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {requests.map((request) => (
            <motion.div
              key={request._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              {/* Header with Service Name and Status */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {request.serviceName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Requested on{" "}
                    {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                    request.status
                  )}`}
                >
                  {getStatusText(request.status)}
                </span>
              </div>

              {/* Customer Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Customer Details
                  </h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {request.customerDetails?.name ||
                        request.userId?.userProfile?.fullName ||
                        "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {request.customerDetails?.phone ||
                        request.userId?.userProfile?.phone ||
                        "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {request.customerDetails?.email ||
                        request.userId?.userProfile?.email ||
                        "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Address:</span>{" "}
                      {request.location || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Service Details */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Service Details
                  </h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Property Type:</span>{" "}
                      {request.propertyType || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Timeline:</span>{" "}
                      {request.timeline || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Budget:</span>{" "}
                      {request.budget ? `₹${request.budget}` : "Not specified"}
                    </p>
                    <p>
                      <span className="font-medium">Preferred Date:</span>{" "}
                      {request.preferredDate
                        ? new Date(request.preferredDate).toLocaleDateString()
                        : "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {request.description && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Description
                  </h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    {request.description}
                  </p>
                </div>
              )}

              {/* Contact Information for Accepted Requests */}
              {request.status === "accepted" && (
                <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-900 mb-2">
                    Contact Information
                  </h4>
                  <div className="space-y-1 text-sm text-green-800">
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {request.customerDetails?.phone ||
                        request.userId?.userProfile?.phone ||
                        "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Address:</span>{" "}
                      {request.location || "N/A"}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {request.status === "pending" && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <CustomButton
                    text="Accept"
                    onClick={() => onUpdateStatus(request._id, "accepted")}
                  />
                  <CustomButton
                    text="Reject"
                    onClick={() => onUpdateStatus(request._id, "rejected")}
                    customClass="bg-red-500 hover:bg-red-600 text-red-600 border-red"
                  />
                </div>
              )}

              {request.status === "accepted" && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <CustomButton
                    text="Mark as Completed"
                    onClick={() => onUpdateStatus(request._id, "completed")}
                    customClass="bg-blue-500 hover:bg-blue-600 text-white"
                  />
                </div>
              )}

              {/* Status Messages */}
              {request.status === "rejected" && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    <span className="font-medium">Status:</span> You have
                    rejected this service request.
                  </p>
                </div>
              )}

              {request.status === "cancelled" && (
                <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-800">
                    <span className="font-medium">Status:</span> This request
                    was cancelled by the customer.
                  </p>
                </div>
              )}

              {request.status === "completed" && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Status:</span> This service
                    has been completed.
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceRequestsBlock;
