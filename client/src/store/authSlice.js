import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  role: null,
  loading: true, // Track if auth check is in progress
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.user?.accountType || null;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { login, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
