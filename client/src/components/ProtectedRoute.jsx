import { Navigate } from "react-router-dom";
import { useLoggedUser } from "../hooks/useLoggedUser";

export const ProtectedRoute = ({ children }) => {
  const userId = useLoggedUser();

  if (!userId) {
    return <Navigate to="/" replace />;
  }

  return children;
};
