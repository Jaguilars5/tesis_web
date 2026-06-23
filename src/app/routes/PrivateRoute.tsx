import { Navigate, Outlet, useLocation } from "react-router-dom";

import { tokenManager } from "@features/auth/auth-token.manager";
import {
  selectIsAuthenticated,
  selectIsInitializing,
  selectMustChangePassword,
} from "@features/auth/auth.slice";

import { useAppSelector } from "../../shared/redux/hooks";

export function PrivateRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isInitializing = useAppSelector(selectIsInitializing);
  const mustChangePassword = useAppSelector(selectMustChangePassword);
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

  if (mustChangePassword && location.pathname !== "/change-password") {
    return <Navigate to="/change-password" replace />;
  }

  return <Outlet />;
}
