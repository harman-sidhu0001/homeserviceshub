import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const GuestRoute = ({ children }) => {
  const { user, role } = useSelector((state) => state.auth);
  return (user && role === "user") || role === "both" ? (
    <Navigate to="/" replace />
  ) : (
    children
  );
};

export const Provider = ({ children }) => {
  const { user, role } = useSelector((state) => state.auth);
  return (user && role === "provider") || role === "both" ? (
    <Navigate to="/provider-profile" replace />
  ) : (
    children
  );
};

export default GuestRoute;
