// userViewModel.js

import { useState, useEffect } from "react";
import {
  getUserProfileDetailed,
  getUserServiceHistory,
  addToBookmarks,
  removeFromBookmarks,
  getUserBookmarks,
  rateService,
  getUserAnalytics,
  uploadProfilePhoto,
  uploadVerificationDocuments,
} from "../model/user";
import {
  createDataFetcher,
  createUploadHandler,
  createMultipleUploadHandler,
} from "../utils/apiHandler";

export const useUserProfile = () => {
  const [user, setUser] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(
    "/assets/icons/default-profile-picture.svg"
  );
  const [projects, setProjects] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Create centralized data fetchers
  const fetchUserProfile = createDataFetcher(
    getUserProfileDetailed,
    setLoading,
    setError,
    (data) => {
      setUser(data.data);
      setProfilePhoto(
        data.data.profilePhoto
          ? data.data.profilePhoto
          : "/assets/icons/default-profile-picture.svg"
      );
      setProjects(data.serviceHistory || []);
      setBookmarks(data.bookmarks || []);
    }
  );
  const fetchServiceHistory = createDataFetcher(
    getUserServiceHistory,
    setLoading,
    setError,
    (data) => setProjects(data.requests)
  );

  const fetchBookmarks = createDataFetcher(
    getUserBookmarks,
    setLoading,
    setError,
    setBookmarks
  );

  const fetchAnalytics = createDataFetcher(
    getUserAnalytics,
    setLoading,
    setError,
    setAnalytics
  );

  // Create centralized upload handlers
  const handlePhotoUpload = createUploadHandler(
    uploadProfilePhoto,
    setUploadLoading,
    (data) => {
      setProfilePhoto(data.profilePhoto);
      fetchUserProfile(); // Refresh user profile
    }
  );

  const handleVerificationUpload = createMultipleUploadHandler(
    uploadVerificationDocuments,
    setUploadLoading,
    () => fetchUserProfile() // Refresh user profile
  );

  // Handle photo change
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      return await handlePhotoUpload(file);
    }
  };

  // Handle verification documents upload
  const handleVerificationUploadWrapper = async (files) => {
    return await handleVerificationUpload(files);
  };

  // Handle bookmark operations
  const onAddBookmark = async (providerId) => {
    const result = await createDataFetcher(
      addToBookmarks,
      setLoading,
      setError,
      () => fetchBookmarks() // Refresh bookmarks
    )(providerId);

    return result;
  };

  const onRemoveBookmark = async (providerId) => {
    const result = await createDataFetcher(
      removeFromBookmarks,
      setLoading,
      setError,
      () => setBookmarks((prev) => prev.filter((b) => b._id !== providerId))
    )(providerId);

    return result;
  };

  // Handle service rating
  const onRateService = async (requestId, ratingData) => {
    const result = await createDataFetcher(
      rateService,
      setLoading,
      setError,
      () => fetchServiceHistory() // Refresh service history
    )(requestId, ratingData);

    return result;
  };

  // Navigation handlers
  const onRequestService = (bookmark) => {
    // Navigate to service request page
    window.location.href = `/request-service/${bookmark._id}`;
  };

  const onViewProfile = (bookmark) => {
    window.location.href = `/provider/${bookmark._id}`;
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchUserProfile();
    fetchAnalytics();
  }, []);

  return {
    user,
    profilePhoto,
    handlePhotoChange,
    handleVerificationUpload: handleVerificationUploadWrapper,
    projects,
    reviews,
    bookmarks,
    loading,
    uploadLoading,
    error,
    analytics,
    onRequestService,
    onViewProfile,
    onAddBookmark,
    onRemoveBookmark,
    onRateService,
    fetchUserProfile,
    fetchServiceHistory,
    fetchBookmarks,
    fetchAnalytics,
  };
};
