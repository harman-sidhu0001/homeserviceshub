import React, { useState, useEffect } from "react";
import { useAdminVerificationViewModel } from "../viewModel/adminVerificationViewModel";
import AdminVerificationView from "../view/adminView/AdminVerificationView";

const AdminVerificationPage = () => {
  // State and logic
  const {
    verificationStats,
    verificationRequests,
    loading,
    error,
    pagination,
    updateVerificationStatus,
    fetchVerificationRequests,
    refreshVerificationData,
    clearError,
    setCurrentPage,
    verifyProviderWithDocs,
  } = useAdminVerificationViewModel();

  // All local UI state
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [actionModal, setActionModal] = useState({ open: false, action: null });
  const [adminNotes, setAdminNotes] = useState("");
  const [statusFilter, setStatusFilter] = useState("requested");
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [aadhaarFront, setAadhaarFront] = useState(null);
  const [aadhaarBack, setAadhaarBack] = useState(null);
  const [panCard, setPanCard] = useState(null);
  const [gstNumber, setGstNumber] = useState("");
  const [fileErrors, setFileErrors] = useState("");
  const [uploading, setUploading] = useState(false);
  const [aadhaarFrontPreview, setAadhaarFrontPreview] = useState(null);
  const [aadhaarBackPreview, setAadhaarBackPreview] = useState(null);
  const [panCardPreview, setPanCardPreview] = useState(null);

  // Preview logic
  useEffect(() => {
    if (aadhaarFront) {
      setAadhaarFrontPreview(URL.createObjectURL(aadhaarFront));
    } else {
      setAadhaarFrontPreview(null);
    }
  }, [aadhaarFront]);
  useEffect(() => {
    if (aadhaarBack) {
      setAadhaarBackPreview(URL.createObjectURL(aadhaarBack));
    } else {
      setAadhaarBackPreview(null);
    }
  }, [aadhaarBack]);
  useEffect(() => {
    if (panCard) {
      setPanCardPreview(URL.createObjectURL(panCard));
    } else {
      setPanCardPreview(null);
    }
  }, [panCard]);

  // Filter requests based on status without making API calls
  useEffect(() => {
    if (verificationRequests.length > 0) {
      const filtered = verificationRequests.filter(
        (provider) =>
          provider.providerProfile?.verification?.status === statusFilter
      );
      setFilteredRequests(filtered);
    } else {
      setFilteredRequests([]);
    }
  }, [verificationRequests, statusFilter]);

  const handleStatusUpdate = async (providerId, status) => {
    setFileErrors("");
    if (status === "verified") {
      // Validate required files
      if (!aadhaarFront || !aadhaarBack || !panCard) {
        setFileErrors(
          "Aadhaar Card Front, Aadhaar Card Back, and PAN Card are required."
        );
        return;
      }
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("aadhaarFront", aadhaarFront);
        formData.append("aadhaarBack", aadhaarBack);
        formData.append("panCard", panCard);
        if (gstNumber) formData.append("gstNumber", gstNumber);
        if (adminNotes) formData.append("adminNotes", adminNotes);
        // Use axiosClient for the API call
        const res = await verifyProviderWithDocs(providerId, formData);
        if (res.success) {
          setActionModal({ open: false, action: null });
          setSelectedProvider(null);
          setAdminNotes("");
          setAadhaarFront(null);
          setAadhaarBack(null);
          setPanCard(null);
          setGstNumber("");
          setFileErrors("");
          setAadhaarFrontPreview(null);
          setAadhaarBackPreview(null);
          setPanCardPreview(null);
          refreshVerificationData();
        } else {
          setFileErrors(res.message || "Failed to verify provider.");
        }
      } catch (err) {
        setFileErrors(
          err?.response?.data?.message ||
            err.message ||
            "Failed to verify provider. Network or server error."
        );
      } finally {
        setUploading(false);
      }
    } else if (status === "rejected") {
      // Just update status and notes
      const result = await updateVerificationStatus(
        providerId,
        status,
        adminNotes
      );
      if (result.success) {
        setActionModal({ open: false, action: null });
        setAdminNotes("");
        setSelectedProvider(null);
      }
    }
  };

  const handleFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    // No API call needed - data is filtered client-side
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchVerificationRequests({ page });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "requested":
        return <FaClock className="text-blue-500" />;
      case "verified":
        return <FaCheckCircle className="text-green-500" />;
      case "rejected":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "requested":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "verified":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "rejected":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // Handle file input changes
  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    setter(file || null);
  };

  // Pass all props to the view
  return (
    <AdminVerificationView
      verificationStats={verificationStats}
      filteredRequests={filteredRequests}
      loading={loading}
      error={error}
      pagination={pagination}
      statusFilter={statusFilter}
      handleFilterChange={handleFilterChange}
      handlePageChange={handlePageChange}
      getStatusBadge={getStatusBadge}
      getStatusIcon={getStatusIcon}
      selectedProvider={selectedProvider}
      actionModal={actionModal}
      setActionModal={setActionModal}
      setSelectedProvider={setSelectedProvider}
      adminNotes={adminNotes}
      setAdminNotes={setAdminNotes}
      aadhaarFront={aadhaarFront}
      setAadhaarFront={setAadhaarFront}
      aadhaarBack={aadhaarBack}
      setAadhaarBack={setAadhaarBack}
      panCard={panCard}
      setPanCard={setPanCard}
      gstNumber={gstNumber}
      setGstNumber={setGstNumber}
      fileErrors={fileErrors}
      uploading={uploading}
      aadhaarFrontPreview={aadhaarFrontPreview}
      aadhaarBackPreview={aadhaarBackPreview}
      panCardPreview={panCardPreview}
      handleFileChange={handleFileChange}
      handleStatusUpdate={handleStatusUpdate}
      refreshVerificationData={refreshVerificationData}
    />
  );
};

export default AdminVerificationPage;
