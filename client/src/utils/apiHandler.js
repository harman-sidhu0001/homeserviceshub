import { handleAsync } from "./handleAsync.js";

// Generic API call handler with automatic error handling
export const apiCall = async (apiFunction, ...args) => {
  const { success, data, error } = await handleAsync(() =>
    apiFunction(...args)
  );

  if (!success) {
    throw new Error(
      error?.response?.data?.message || error?.message || "API call failed"
    );
  }

  return data;
};

// Generic data fetcher with loading state management
export const createDataFetcher = (
  apiFunction,
  setLoading,
  setError,
  setData
) => {
  return async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall(apiFunction, ...args);
      // Handle both direct data and { success: true, data: {...} } structure
      const actualData = response.data || response;
      setData(actualData);
      return { success: true, data: actualData };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };
};

// Generic upload handler
export const createUploadHandler = (
  uploadFunction,
  setLoading,
  onSuccess,
  fieldName = "file"
) => {
  return async (file) => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append(fieldName, file); // Use correct field name

      const data = await apiCall(uploadFunction, formData);

      if (onSuccess) {
        onSuccess(data);
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };
};

// Generic multiple files upload handler
export const createMultipleUploadHandler = (
  uploadFunction,
  setLoading,
  onSuccess
) => {
  return async (files) => {
    setLoading(true);

    try {
      const formData = new FormData();

      Object.entries(files).forEach(([key, file]) => {
        if (file) {
          formData.append(key, file);
        }
      });

      const data = await apiCall(uploadFunction, formData);

      if (onSuccess) {
        onSuccess(data);
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };
};
