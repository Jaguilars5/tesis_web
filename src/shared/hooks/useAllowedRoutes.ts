import { useMemo } from "react";

import { protectedRoutes } from "@app/routes.config";
import {
  selectAuthUser,
  selectUserPermissions,
} from "@features/auth/auth.slice";
import { useAppSelector } from "@shared/redux/hooks";
import { hasPermission } from "@shared/utils/permissions";

import type { RouteConfig } from "@app/routes.config";

export const useAllowedRoutes = () => {
  const permissions = useAppSelector(selectUserPermissions);
  const user = useAppSelector(selectAuthUser);

  return useMemo(() => {
    const allowed: RouteConfig[] = [];

    for (const route of protectedRoutes) {
      if (
        route.roles.length > 0 &&
        user?.role &&
        !route.roles.includes(user.role)
      ) {
        continue;
      }

      if (route.permission.length > 0) {
        const hasAccess = route.permission.some((p) =>
          hasPermission(permissions, p),
        );
        if (!hasAccess) continue;
      }

      if ("children" in route && route.children) {
        for (const child of route.children) {
          if (
            child.roles.length > 0 &&
            user?.role &&
            !child.roles.includes(user.role)
          ) {
            continue;
          }
          if (child.permission.length > 0) {
            const childHasAccess = child.permission.some((p) =>
              hasPermission(permissions, p),
            );
            if (!childHasAccess) continue;
          }
          allowed.push(child);
        }
      } else {
        allowed.push(route as RouteConfig);
      }
    }

    return allowed;
  }, [permissions, user]);
};
