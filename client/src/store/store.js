import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import providerReducer from "./providerSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    provider: providerReducer,
  },
});
