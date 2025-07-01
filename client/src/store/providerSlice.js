import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  providers: [],
};

const providerSlice = createSlice({
  name: "provider",
  initialState,
  reducers: {
    setProviders: (state, action) => {
      state.providers = action.payload;
    },
  },
});

export const { setProviders } = providerSlice.actions;
export default providerSlice.reducer;
