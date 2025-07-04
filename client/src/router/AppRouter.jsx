import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ServicesPage from "../pages/ServicesPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProviderLoginPage from "../pages/ProviderLoginPage";
import ProviderRegisterPage from "../pages/ProviderRegisterPage";
import ServiceProvidersPage from "../pages/ServiceProvidersPage";
import GuestRoute, { Provider } from "./GuestRoute";
import ProtectedRoute from "./ProtectedRoute";
import ProviderProfilePage from "../pages/ProviderProfilePage";
import UserProfileView from "../view/userView/UserProfilePage";

const AppRouter = () => (
  <Routes>
    {/* ✅ Public route */}
    <Route path="/" element={<HomePage />} />
    <Route path="/services" element={<ServicesPage />} />
    <Route path="/service" element={<ServiceProvidersPage />} />
    <Route path="/provider/:id" element={<ProviderProfilePage />} />
    <Route path="/how-it-works" element={<div>How It Works Page</div>} />
    <Route path="/contact" element={<div>Contact Page</div>} />

    {/* ✅ Guest-only routes - User Auth */}
    <Route
      path="/login"
      element={
        <GuestRoute>
          <LoginPage />
        </GuestRoute>
      }
    />
    <Route
      path="/register"
      element={
        <GuestRoute>
          <RegisterPage />
        </GuestRoute>
      }
    />

    {/* ✅ Guest-only routes - Provider Auth */}
    <Route
      path="/provider-login"
      element={
        <Provider>
          <ProviderLoginPage />
        </Provider>
      }
    />
    <Route
      path="/provider-register"
      element={
        <Provider>
          <ProviderRegisterPage />
        </Provider>
      }
    />

    {/* ✅ Protected routes */}
    <Route element={<ProtectedRoute />}>
      <Route path="/profile/:id" element={<UserProfileView />} />
      <Route
        path="/request-service"
        element={<div>Request A Services Page</div>}
      />
      {/* <Route path="/provider-dashboard" element={<ProviderDashboard />} /> */}
    </Route>
  </Routes>
);

export default AppRouter;
