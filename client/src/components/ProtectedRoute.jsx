import { Navigate } from "react-router-dom";
import { useLoggedUser } from "../hooks/useLoggedUser";

export const ProtectedRoute = ({ children }) => {
  const user = useLoggedUser();

  if (!user?.id) {
    return <Navigate to="/" replace />;
  }

  return children;
};
