import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stats: null,
  loaded: false,
  loading: false,
  error: null,
};

const adminStatsSlice = createSlice({
  name: "adminStats",
  initialState,
  reducers: {
    setStats(state, action) {
      state.stats = action.payload;
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
    clearStats(state) {
      state.stats = null;
      state.loaded = false;
      state.error = null;
    },
  },
});

export const { setStats, setLoading, setError, clearStats } =
  adminStatsSlice.actions;
export default adminStatsSlice.reducer;
