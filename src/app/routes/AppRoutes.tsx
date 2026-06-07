import { publicRoutes } from "@app/routes.config";
import { Layout } from "@shared/components/Layout/Layout";
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { useAllowedRoutes } from "../../shared/hooks/useAllowedRoutes";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";

const NotFoundPage = lazy(() => import("@shared/pages/NotFoundPage"));

export const AppRoutes = () => {
  const allowedRoutes = useAllowedRoutes();

  return (
    <Suspense
      fallback={
        <div
          className="size-6 rounded-full border-[3px] border-primary/20 border-t-primary animate-spin"
          aria-label="Cargando"
        />
      }
    >
      <Routes>
        {publicRoutes.map(
          (route) =>
            route.element && (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <PublicRoute>
                    <route.element />
                  </PublicRoute>
                }
              />
            ),
        )}

        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            {allowedRoutes.map(
              (route) =>
                route.element && (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={<route.element />}
                  />
                ),
            )}
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};
