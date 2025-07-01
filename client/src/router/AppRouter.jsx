import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ServicesPage from "../pages/ServicesPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProviderLoginPage from "../pages/ProviderLoginPage";
import ProviderRegisterPage from "../pages/ProviderRegisterPage";
import GuestRoute from "./GuestRoute";
import ProtectedRoute from "./ProtectedRoute";

const AppRouter = () => (
  <Routes>
    {/* ✅ Public route */}
    <Route path="/" element={<HomePage />} />
    <Route path="/services" element={<ServicesPage />} />
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
    <Route path="/provider-login" element={<ProviderLoginPage />} />
    <Route path="/provider-register" element={<ProviderRegisterPage />} />

    {/* ✅ Protected routes */}
    <Route element={<ProtectedRoute />}>
      <Route path="/profile" element={<div>Profile Page</div>} />
      <Route
        path="/request-service"
        element={<div>Request A Services Page</div>}
      />
      {/* <Route path="/provider-dashboard" element={<ProviderDashboard />} /> */}
    </Route>
  </Routes>
);

export default AppRouter;
