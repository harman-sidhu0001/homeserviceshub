import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  loaded: false,
  loading: false,
  error: null,
};

const adminUsersSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {
    setUsers(state, action) {
      state.users = action.payload;
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
    clearUsers(state) {
      state.users = [];
      state.loaded = false;
      state.error = null;
    },
    removeUser(state, action) {
      state.users = state.users.filter((u) => u._id !== action.payload);
    },
  },
});

export const { setUsers, setLoading, setError, clearUsers, removeUser } =
  adminUsersSlice.actions;
export default adminUsersSlice.reducer;
