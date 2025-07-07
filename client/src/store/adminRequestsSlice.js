import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  requests: [],
  loaded: false,
  loading: false,
  error: null,
};

const adminRequestsSlice = createSlice({
  name: "adminRequests",
  initialState,
  reducers: {
    setRequests(state, action) {
      state.requests = action.payload;
      state.loaded = true;
      state.loading = false;
      state.error = null;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    clearRequests(state) {
      state.requests = [];
      state.loaded = false;
      state.error = null;
    },
    removeRequest(state, action) {
      state.requests = state.requests.filter((r) => r._id !== action.payload);
    },
  },
});

export const {
  setRequests,
  setLoading,
  setError,
  clearRequests,
  removeRequest,
} = adminRequestsSlice.actions;
export default adminRequestsSlice.reducer;
