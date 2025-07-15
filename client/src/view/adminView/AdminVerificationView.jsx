import React from "react";
import CustomButton from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import SeoHelmet from "../../seo/SeoHelmet";
import { FaClock, FaCheckCircle, FaTimesCircle, FaEye } from "react-icons/fa";

const AdminVerificationView = ({
  verificationStats,
  filteredRequests,
  loading,
  error,
  pagination,
  statusFilter,
  handleFilterChange,
  handlePageChange,
  getStatusBadge,
  getStatusIcon,
  selectedProvider,
  actionModal,
  setActionModal,
  setSelectedProvider,
  adminNotes,
  setAdminNotes,
  aadhaarFront,
  setAadhaarFront,
  aadhaarBack,
  setAadhaarBack,
  panCard,
  setPanCard,
  gstNumber,
  setGstNumber,
  fileErrors,
  uploading,
  aadhaarFrontPreview,
  aadhaarBackPreview,
  panCardPreview,
  handleFileChange,
  handleStatusUpdate,
  refreshVerificationData,
}) => {
  return (
    <>
      <SeoHelmet
        title="Verification Management - Admin Dashboard"
        description="Manage provider verification requests"
        keywords="admin, verification, providers"
      />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Verification Management
                </h1>
                <p className="text-gray-600 mt-2">
                  Review and manage provider verification requests
                </p>
              </div>
              <CustomButton
                text="Refresh Data"
                onClick={refreshVerificationData}
                width="auto"
              />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <FaClock className="text-blue-500 text-2xl mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {verificationStats.pending}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <FaClock className="text-blue-500 text-2xl mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Requested
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {verificationStats.requested}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <FaCheckCircle className="text-green-500 text-2xl mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Verified
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {verificationStats.verified}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <FaTimesCircle className="text-red-500 text-2xl mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Rejected
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {verificationStats.rejected}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6">
                  {[
                    {
                      key: "requested",
                      label: "Pending Review",
                      count: verificationStats.requested,
                    },
                    {
                      key: "verified",
                      label: "Verified",
                      count: verificationStats.verified,
                    },
                    {
                      key: "rejected",
                      label: "Rejected",
                      count: verificationStats.rejected,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => handleFilterChange(tab.key)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        statusFilter === tab.key
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {tab.label}
                      <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Verification Requests List */}
            <div className="bg-white rounded-lg shadow">
              {loading ? (
                <div className="p-6 text-center">
                  <p className="text-gray-500">
                    Loading verification requests...
                  </p>
                </div>
              ) : error ? (
                <div className="p-6 text-center">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-500">
                    No {statusFilter} verification requests found.
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Provider
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Requested Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Processed Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredRequests.map((provider) => (
                        <tr key={provider._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={
                                    provider.providerProfile?.profilePhoto ||
                                    "/assets/icons/default-profile-picture.svg"
                                  }
                                  alt=""
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {provider.providerProfile?.companyName ||
                                    "N/A"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {provider.providerProfile?.phone || "N/A"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={getStatusBadge(
                                provider.providerProfile?.verification?.status
                              )}
                            >
                              {provider.providerProfile?.verification?.status ||
                                "pending"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {provider.providerProfile?.verification?.requestedAt
                              ? new Date(
                                  provider.providerProfile.verification.requestedAt
                                ).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {provider.providerProfile?.verification?.verifiedAt
                              ? new Date(
                                  provider.providerProfile.verification.verifiedAt
                                ).toLocaleDateString()
                              : provider.providerProfile?.verification
                                  ?.rejectedAt
                              ? new Date(
                                  provider.providerProfile.verification.rejectedAt
                                ).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {provider.providerProfile?.verification?.status ===
                              "requested" && (
                              <div className="flex space-x-2">
                                <CustomButton
                                  text="Verify"
                                  onClick={() => {
                                    setSelectedProvider(provider);
                                    setActionModal({
                                      open: true,
                                      action: "verify",
                                    });
                                  }}
                                  customClass="bg-green-500 hover:bg-green-600  text-xs px-3 py-1"
                                  width="auto"
                                />
                                <CustomButton
                                  text="Reject"
                                  onClick={() => {
                                    setSelectedProvider(provider);
                                    setActionModal({
                                      open: true,
                                      action: "reject",
                                    });
                                  }}
                                  customClass="bg-red-500 hover:bg-red-600  text-xs px-3 py-1"
                                  width="auto"
                                />
                              </div>
                            )}
                            {provider.providerProfile?.verification?.status ===
                              "verified" && (
                              <div className="flex space-x-2">
                                <CustomButton
                                  text="View Details"
                                  onClick={() => {
                                    setSelectedProvider(provider);
                                    setActionModal({
                                      open: true,
                                      action: "view",
                                    });
                                  }}
                                  customClass="bg-blue-500 hover:bg-blue-600  text-xs px-3 py-1"
                                  width="auto"
                                />
                              </div>
                            )}
                            {provider.providerProfile?.verification?.status ===
                              "rejected" && (
                              <div className="flex space-x-2">
                                <CustomButton
                                  text="View Details"
                                  onClick={() => {
                                    setSelectedProvider(provider);
                                    setActionModal({
                                      open: true,
                                      action: "view",
                                    });
                                  }}
                                  customClass="bg-blue-500 hover:bg-blue-600  text-xs px-3 py-1"
                                  width="auto"
                                />
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <CustomButton
                      text="Previous"
                      onClick={() =>
                        handlePageChange(pagination.currentPage - 1)
                      }
                      disabled={!pagination.hasPrev}
                      width="auto"
                    />
                    <CustomButton
                      text="Next"
                      onClick={() =>
                        handlePageChange(pagination.currentPage + 1)
                      }
                      disabled={!pagination.hasNext}
                      width="auto"
                    />
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing page{" "}
                        <span className="font-medium">
                          {pagination.currentPage}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">
                          {pagination.totalPages}
                        </span>
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <CustomButton
                          text="Previous"
                          onClick={() =>
                            handlePageChange(pagination.currentPage - 1)
                          }
                          disabled={!pagination.hasPrev}
                          width="auto"
                        />
                        <CustomButton
                          text="Next"
                          onClick={() =>
                            handlePageChange(pagination.currentPage + 1)
                          }
                          disabled={!pagination.hasNext}
                          width="auto"
                        />
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Modal */}
      <Modal
        open={actionModal.open}
        onClose={() => {
          setActionModal({ open: false, action: null });
          setSelectedProvider(null);
          setAdminNotes("");
        }}
      >
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {actionModal.action === "verify"
              ? "Verify Provider"
              : actionModal.action === "reject"
              ? "Reject Provider"
              : "Provider Details"}
          </h3>

          {selectedProvider && (
            <div className="mb-4 space-y-3">
              <div className="flex items-center space-x-4">
                <img
                  className="h-16 w-16 rounded-full"
                  src={
                    selectedProvider.providerProfile?.profilePhoto ||
                    "/assets/icons/default-profile-picture.svg"
                  }
                  alt=""
                />
                <div>
                  <h4 className="text-lg font-medium text-gray-900">
                    {selectedProvider.providerProfile?.companyName || "N/A"}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {selectedProvider.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    Phone: {selectedProvider.providerProfile?.phone || "N/A"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <span
                    className={`ml-2 ${getStatusBadge(
                      selectedProvider.providerProfile?.verification?.status
                    )}`}
                  >
                    {selectedProvider.providerProfile?.verification?.status ||
                      "pending"}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Requested:</span>
                  <span className="ml-2 text-gray-600">
                    {selectedProvider.providerProfile?.verification?.requestedAt
                      ? new Date(
                          selectedProvider.providerProfile.verification.requestedAt
                        ).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                {selectedProvider.providerProfile?.verification?.verifiedAt && (
                  <div>
                    <span className="font-medium text-gray-700">Verified:</span>
                    <span className="ml-2 text-gray-600">
                      {new Date(
                        selectedProvider.providerProfile.verification.verifiedAt
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {selectedProvider.providerProfile?.verification?.rejectedAt && (
                  <div>
                    <span className="font-medium text-gray-700">Rejected:</span>
                    <span className="ml-2 text-gray-600">
                      {new Date(
                        selectedProvider.providerProfile.verification.rejectedAt
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {selectedProvider.providerProfile?.verification?.adminNotes && (
                <div>
                  <span className="font-medium text-gray-700">
                    Admin Notes:
                  </span>
                  <p className="mt-1 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    {selectedProvider.providerProfile.verification.adminNotes}
                  </p>
                </div>
              )}

              {selectedProvider.providerProfile?.services &&
                selectedProvider.providerProfile.services.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-700">Services:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {selectedProvider.providerProfile.services.map(
                        (service, index) => (
                          <span
                            key={index}
                            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                          >
                            {service}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          )}

          {actionModal.action !== "view" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Notes (Optional)
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Add any notes about this verification decision..."
              />
            </div>
          )}

          {actionModal.action === "verify" && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aadhaar Card Front <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileChange(e, setAadhaarFront)}
                  className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
                />
                {aadhaarFrontPreview && (
                  <div className="mt-2">
                    <img
                      src={aadhaarFrontPreview}
                      alt="Aadhaar Front Preview"
                      className="h-24 rounded border"
                    />
                  </div>
                )}
                {aadhaarFront && !aadhaarFront.type.startsWith("image/") && (
                  <div className="mt-2 text-xs text-gray-600">
                    {aadhaarFront.name}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aadhaar Card Back <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileChange(e, setAadhaarBack)}
                  className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
                />
                {aadhaarBackPreview && (
                  <div className="mt-2">
                    <img
                      src={aadhaarBackPreview}
                      alt="Aadhaar Back Preview"
                      className="h-24 rounded border"
                    />
                  </div>
                )}
                {aadhaarBack && !aadhaarBack.type.startsWith("image/") && (
                  <div className="mt-2 text-xs text-gray-600">
                    {aadhaarBack.name}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PAN Card <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileChange(e, setPanCard)}
                  className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
                />
                {panCardPreview && (
                  <div className="mt-2">
                    <img
                      src={panCardPreview}
                      alt="PAN Card Preview"
                      className="h-24 rounded border"
                    />
                  </div>
                )}
                {panCard && !panCard.type.startsWith("image/") && (
                  <div className="mt-2 text-xs text-gray-600">
                    {panCard.name}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GST Number (Optional)
                </label>
                <input
                  type="text"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value)}
                  className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
                  placeholder="Enter GST Number (if available)"
                />
              </div>
              {fileErrors && (
                <div className="mb-2 text-red-500 text-sm">{fileErrors}</div>
              )}
            </>
          )}

          <div className="flex justify-end space-x-3">
            <CustomButton
              text="Close"
              onClick={() => {
                setActionModal({ open: false, action: null });
                setSelectedProvider(null);
                setAdminNotes("");
              }}
              customClass="bg-gray-300 hover:bg-gray-400 text-gray-700"
              width="auto"
            />
            {actionModal.action !== "view" && (
              <CustomButton
                text={actionModal.action === "verify" ? "Verify" : "Reject"}
                onClick={() => {
                  const status =
                    actionModal.action === "verify" ? "verified" : "rejected";
                  handleStatusUpdate(selectedProvider._id, status);
                }}
                customClass={
                  actionModal.action === "verify"
                    ? "bg-green-500 hover:bg-green-600 "
                    : "bg-red-500 hover:bg-red-600 "
                }
                width="auto"
              />
            )}
            {actionModal.action === "verify" && (
              <CustomButton
                text={uploading ? "Uploading..." : "Verify"}
                onClick={() =>
                  handleStatusUpdate(selectedProvider._id, "verified")
                }
                disabled={uploading}
                customClass="bg-green-500 hover:bg-green-600 "
                width="auto"
              />
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AdminVerificationView;
