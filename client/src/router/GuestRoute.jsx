import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const GuestRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  console.log(user);
  return user ? <Navigate to="/" replace /> : children;
};

export default GuestRoute;
