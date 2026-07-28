import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function ProtectedRoute({
  children,
  allowedRole,
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (
    allowedRole &&
    user.role !== allowedRole
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;