import { Navigate, Outlet, useLocation } from "react-router";
import { useAppSelector } from "../../store/hooks";
import { selectIsAuthenticated, selectIsInitializing } from "../../store/authSlice";
import Loader from "../Loader/Loader";

export default function ProtectedRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isInitializing = useAppSelector(selectIsInitializing);
  const location = useLocation();

  if (isInitializing) {
    return <Loader fullPage label="Checking session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
