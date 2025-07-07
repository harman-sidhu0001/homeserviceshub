import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  providers: [],
  loaded: false,
  loading: false,
  error: null,
};

const adminProvidersSlice = createSlice({
  name: "adminProviders",
  initialState,
  reducers: {
    setProviders(state, action) {
      state.providers = action.payload;
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
    clearProviders(state) {
      state.providers = [];
      state.loaded = false;
      state.error = null;
    },
    removeProvider(state, action) {
      state.providers = state.providers.filter((p) => p._id !== action.payload);
    },
  },
});

export const {
  setProviders,
  setLoading,
  setError,
  clearProviders,
  removeProvider,
} = adminProvidersSlice.actions;
export default adminProvidersSlice.reducer;
