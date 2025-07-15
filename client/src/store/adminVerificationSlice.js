import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getVerificationStats,
  getAllVerificationRequests,
  updateProviderVerificationStatus,
} from "../model/admin";

// Async thunks
export const fetchVerificationStats = createAsyncThunk(
  "adminVerification/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getVerificationStats();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchVerificationRequests = createAsyncThunk(
  "adminVerification/fetchRequests",
  async (params = {}, { rejectWithValue }) => {
    try {
      // Always fetch all verification requests without status filter
      const { status, ...otherParams } = params;
      const response = await getAllVerificationRequests(otherParams);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateVerificationStatus = createAsyncThunk(
  "adminVerification/updateStatus",
  async ({ providerId, status, adminNotes }, { rejectWithValue, dispatch }) => {
    try {
      await updateProviderVerificationStatus(providerId, {
        status,
        adminNotes,
      });

      // Refresh data after update
      await Promise.all([
        dispatch(fetchVerificationStats()),
        dispatch(fetchVerificationRequests({ page: 1 })),
      ]);

      return { success: true };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const refreshVerificationData = createAsyncThunk(
  "adminVerification/refreshData",
  async (_, { dispatch }) => {
    await Promise.all([
      dispatch(fetchVerificationStats()),
      dispatch(fetchVerificationRequests({ page: 1 })),
    ]);
  }
);

const initialState = {
  verificationStats: {
    pending: 0,
    requested: 0,
    verified: 0,
    rejected: 0,
    total: 0,
  },
  verificationRequests: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalProviders: 0,
    hasNext: false,
    hasPrev: false,
  },
  loading: false,
  error: null,
  statsLoading: false,
  requestsLoading: false,
  updateLoading: false,
};

const adminVerificationSlice = createSlice({
  name: "adminVerification",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch verification stats
    builder
      .addCase(fetchVerificationStats.pending, (state) => {
        state.statsLoading = true;
        state.error = null;
      })
      .addCase(fetchVerificationStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.verificationStats = action.payload;
      })
      .addCase(fetchVerificationStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error =
          action.payload || "Failed to load verification statistics";
      });

    // Fetch verification requests
    builder
      .addCase(fetchVerificationRequests.pending, (state) => {
        state.requestsLoading = true;
        state.error = null;
      })
      .addCase(fetchVerificationRequests.fulfilled, (state, action) => {
        state.requestsLoading = false;
        state.verificationRequests = action.payload.providers;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchVerificationRequests.rejected, (state, action) => {
        state.requestsLoading = false;
        state.error = action.payload || "Failed to load verification requests";
      });

    // Update verification status
    builder
      .addCase(updateVerificationStatus.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateVerificationStatus.fulfilled, (state) => {
        state.updateLoading = false;
      })
      .addCase(updateVerificationStatus.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload || "Failed to update verification status";
      });
  },
});

export const { clearError, setCurrentPage } = adminVerificationSlice.actions;
export default adminVerificationSlice.reducer;
