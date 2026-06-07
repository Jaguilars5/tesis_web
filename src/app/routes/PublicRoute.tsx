import { PROTECTED_ROUTES } from "@app/routes";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { selectIsAuthenticated } from "../../features/auth/reducers/auth.selectors";
import { tokenManager } from "../../features/auth/infrastructure/repositories/auth-token.repository";
import { useAppSelector } from "../../shared/redux/hooks";

type PublicRouteProps = {
  children: ReactNode;
};

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (isAuthenticated && tokenManager.hasAccessToken()) {
    return <Navigate to={PROTECTED_ROUTES.DASHBOARD} replace />;
  }

  return children;
};
