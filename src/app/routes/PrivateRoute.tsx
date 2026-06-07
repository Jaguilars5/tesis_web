import { Navigate, Outlet, useLocation } from "react-router-dom";
import {
  selectIsAuthenticated,
  selectIsInitializing,
} from "../../features/auth/reducers/auth.selectors";
import { tokenManager } from "../../features/auth/infrastructure/repositories/auth-token.repository";
import { useAppSelector } from "../../shared/redux/hooks";

export function PrivateRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isInitializing = useAppSelector(selectIsInitializing);
  const location = useLocation();

  if (isInitializing) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50">
        <div
          className="size-6 rounded-full border-[3px] border-primary/20 border-t-primary animate-spin"
          aria-label="Verificando sesion"
        />
      </div>
    );
  }

  if (!isAuthenticated || !tokenManager.hasAccessToken()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
