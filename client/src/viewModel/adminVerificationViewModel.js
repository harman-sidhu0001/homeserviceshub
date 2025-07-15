import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVerificationStats,
  fetchVerificationRequests,
  updateVerificationStatus,
  refreshVerificationData,
  clearError,
  setCurrentPage,
} from "../store/adminVerificationSlice";
import { verifyProviderWithDocs as verifyProviderWithDocsModel } from "../model/admin";

export const useAdminVerificationViewModel = () => {
  const dispatch = useDispatch();
  const {
    verificationStats,
    verificationRequests,
    pagination,
    loading,
    error,
    statsLoading,
    requestsLoading,
    updateLoading,
  } = useSelector((state) => state.adminVerification);

  // Fetch verification statistics
  const fetchStats = () => {
    dispatch(fetchVerificationStats());
  };

  // Fetch verification requests
  const fetchRequests = (params = {}) => {
    dispatch(fetchVerificationRequests(params));
  };

  // Update provider verification status
  const updateStatus = async (providerId, status, adminNotes = "") => {
    const result = await dispatch(
      updateVerificationStatus({ providerId, status, adminNotes })
    );
    return result.payload;
  };

  // Clear error
  const clearErrorHandler = () => {
    dispatch(clearError());
  };

  // Set current page
  const setPage = (page) => {
    dispatch(setCurrentPage(page));
  };

  // Refresh all data
  const refreshData = () => {
    dispatch(refreshVerificationData());
  };

  // Upload verification documents and verify provider
  const verifyProviderWithDocs = async (providerId, formData) => {
    try {
      const res = await verifyProviderWithDocsModel(providerId, formData);
      return {
        success: res.status === 200 && res.data.success,
        data: res.data,
        error: null,
      };
    } catch (err) {
      return {
        success: false,
        error:
          err?.response?.data?.message ||
          err.message ||
          "Failed to verify provider. Network or server error.",
      };
    }
  };

  // Load initial data only if not already loaded
  useEffect(() => {
    if (verificationStats.total === 0) {
      fetchStats();
    }
    if (verificationRequests.length === 0) {
      fetchRequests();
    }
  }, []);

  return {
    verificationStats,
    verificationRequests,
    loading: loading || statsLoading || requestsLoading || updateLoading,
    error,
    pagination,
    fetchVerificationStats: fetchStats,
    fetchVerificationRequests: fetchRequests,
    updateVerificationStatus: updateStatus,
    refreshVerificationData: refreshData,
    clearError: clearErrorHandler,
    setCurrentPage: setPage,
    verifyProviderWithDocs,
  };
};
