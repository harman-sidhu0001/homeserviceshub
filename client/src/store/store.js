import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import providerReducer from "./providerSlice";
import adminUsersReducer from "./adminUsersSlice";
import adminProvidersReducer from "./adminProvidersSlice";
import adminRequestsReducer from "./adminRequestsSlice";
import adminStatsReducer from "./adminStatsSlice";
import adminVerificationReducer from "./adminVerificationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    provider: providerReducer,
    adminUsers: adminUsersReducer,
    adminProviders: adminProvidersReducer,
    adminRequests: adminRequestsReducer,
    adminStats: adminStatsReducer,
    adminVerification: adminVerificationReducer,
  },
});
