import { Navigate } from "react-router-dom";

import { PROTECTED_ROUTES } from "@app/routes";
import { tokenManager } from "@features/auth/auth-token.manager";
import { selectIsAuthenticated } from "@features/auth/auth.slice";

import { useAppSelector } from "../../shared/redux/hooks";

import type { ReactNode } from "react";

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
