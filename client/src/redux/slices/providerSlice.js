import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedProvider: null,
};

const providerSlice = createSlice({
  name: "provider",
  initialState,
  reducers: {
    setSelectedProvider: (state, action) => {
      state.selectedProvider = action.payload;
    },
    clearSelectedProvider: (state) => {
      state.selectedProvider = null;
    },
  },
});

export const { setSelectedProvider, clearSelectedProvider } =
  providerSlice.actions;

export default providerSlice.reducer;
