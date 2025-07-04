import { configureStore } from "@reduxjs/toolkit";
import providerReducer from "./slices/providerSlice";

export const store = configureStore({
  reducer: {
    provider: providerReducer,
  },
  devTools: process.env.NODE_ENV !== "production", // Enable DevTools in development
});
