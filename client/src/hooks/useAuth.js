import { useSelector } from "react-redux";

const useAuth = () => {
  const { user, role } = useSelector((state) => state.auth);
  return {
    user,
    role,
  };
};

export default useAuth;
