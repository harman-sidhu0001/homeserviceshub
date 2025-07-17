// userViewModel.js

import { useState, useEffect } from "react";
import {
  getUserProfileDetailed,
  getUserServiceHistory,
  addToBookmarks,
  removeFromBookmarks,
  getUserBookmarks,
  rateService,
  uploadProfilePhoto,
  uploadVerificationDocuments,
  cancelServiceRequest,
} from "../model/user";
import {
  createDataFetcher,
  createUploadHandler,
  createMultipleUploadHandler,
} from "../utils/apiHandler";
import { getUserReviews } from "../model/review";

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
  const [uploadLoading, setUploadLoading] = useState(false);
  const [cancellingRequests, setCancellingRequests] = useState(new Set());

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
      setProjects(data.data.serviceHistory || []);
      setBookmarks(data.data.bookmarks || []);
    }
  );
  const fetchServiceHistory = createDataFetcher(
    getUserServiceHistory,
    setLoading,
    setError,
    (data) => setProjects(data.requests || [])
  );

  const fetchBookmarks = createDataFetcher(
    getUserBookmarks,
    setLoading,
    setError,
    (data) => setBookmarks(data || [])
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

  // Handle cancel service request
  const onCancelRequest = async (requestId) => {
    setCancellingRequests((prev) => new Set(prev).add(requestId));
    try {
      const result = await cancelServiceRequest(requestId);
      if (result.success) {
        await fetchUserProfileAndReviews(); // Refresh all data
        // Show success message (you can implement a toast notification here)
      }
      return result;
    } catch (error) {
      setError(error.message || "Failed to cancel request");
      return { success: false, error };
    } finally {
      setCancellingRequests((prev) => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  // Navigation handlers
  const onRequestService = (bookmark) => {
    // Navigate to service request page
    window.location.href = `/request-service/${bookmark._id}`;
  };

  const onViewProfile = (bookmark) => {
    window.location.href = `/provider/${bookmark._id}`;
  };

  // Fetch user profile and reviews together
  const fetchUserProfileAndReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const profileRes = await getUserProfileDetailed();

      if (!profileRes.data || !profileRes.data.data) {
        throw new Error("Invalid response structure");
      }

      const userData = profileRes.data.data;
      setUser(userData);
      setProfilePhoto(
        userData.profilePhoto
          ? userData.profilePhoto
          : "/assets/icons/default-profile-picture.svg"
      );
      setProjects(userData.serviceHistory || []);
      setBookmarks(userData.bookmarks || []);

      // Map reviews from userData.reviews
      setReviews(
        (userData.reviews || []).map((review) => ({
          id: review._id,
          providerName:
            review.reviewTo &&
            review.reviewTo.providerProfile &&
            review.reviewTo.providerProfile.companyName
              ? review.reviewTo.providerProfile.companyName
              : "Provider",
          providerPhoto:
            review.reviewTo &&
            review.reviewTo.providerProfile &&
            review.reviewTo.providerProfile.profilePhoto
              ? review.reviewTo.providerProfile.profilePhoto
              : "/assets/icons/default-profile-picture.svg",
          service: review.reviewTitle,
          stars: review.stars,
          date: review.createdAt
            ? new Date(review.createdAt).toLocaleDateString()
            : "",
          description: review.reviewDescription,
        }))
      );
    } catch (err) {
      setError(err.message || "Failed to fetch user profile");
    } finally {
      setLoading(false);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchUserProfileAndReviews();
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
    cancellingRequests,
    onRequestService,
    onViewProfile,
    onAddBookmark,
    onRemoveBookmark,
    onRateService,
    onCancelRequest,
    fetchUserProfile: fetchUserProfileAndReviews,
    fetchServiceHistory,
    fetchBookmarks,
  };
};
