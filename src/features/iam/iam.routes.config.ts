import { Shield } from "lucide-react";
import { lazy } from "react";

import { UserRoleEnum } from "@features/auth";

import { PERMISSION_PERMISSIONS } from "./permission";
import { ROLE_PERMISSIONS } from "./roles";
import { USER_PERMISSIONS } from "./users";
import { IAM_ROUTES } from "./iam.routes";

import type { RoutesConfigItem } from "@app/routes.config";

export const iamRoutes: RoutesConfigItem[] = [
  {
    key: "iam",
    isVisibleInNavbar: true,
    icon: Shield,
    title: "Seguridad",
    order: 8,
    permission: [USER_PERMISSIONS.GET],
    roles: [UserRoleEnum.DIRECTOR, UserRoleEnum.RECTOR],
    children: [
      {
        key: "users",
        path: IAM_ROUTES.USERS,
        element: lazy(() => import("@features/iam/users/UsersPage")),
        permission: [USER_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR, UserRoleEnum.RECTOR],
        title: "Usuarios",
        isVisibleInNavbar: true,
        icon: null,
        order: 1,
      },
      {
        key: "roles",
        path: IAM_ROUTES.ROLES,
        element: lazy(() => import("@features/iam/roles/RolesPage")),
        permission: [ROLE_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR, UserRoleEnum.RECTOR],
        title: "Roles",
        isVisibleInNavbar: true,
        icon: null,
        order: 2,
      },
      {
        key: "permissions",
        path: IAM_ROUTES.PERMISSIONS,
        element: lazy(() => import("@features/iam/permission/PermissionPage")),
        permission: [PERMISSION_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR, UserRoleEnum.RECTOR],
        title: "Permisos",
        isVisibleInNavbar: true,
        icon: null,
        order: 3,
      },
    ],
  },
];
