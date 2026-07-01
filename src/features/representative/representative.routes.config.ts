import { Users } from "lucide-react";
import { lazy } from "react";

import { UserRoleEnum } from "@features/auth";

import { REPRESENTATIVE_SELF_ROUTES } from "./representative.constants";

import type { RoutesConfigItem } from "@app/routes.config";

export const representativeRoutes: RoutesConfigItem[] = [
  {
    key: "representative-tracking",
    isVisibleInNavbar: true,
    icon: Users,
    title: "Mis Representados",
    order: 5,
    permission: [],
    roles: [UserRoleEnum.REPRESENTATIVE],
    children: [
      {
        key: "representative-grades",
        path: REPRESENTATIVE_SELF_ROUTES.GRADES,
        element: lazy(() => import("./RepresentativeGradesPage")),
        permission: [],
        roles: [UserRoleEnum.REPRESENTATIVE],
        title: "Calificaciones",
        isVisibleInNavbar: true,
        icon: null,
        order: 1,
      },
      {
        key: "representative-attendance",
        path: REPRESENTATIVE_SELF_ROUTES.ATTENDANCE,
        element: lazy(() => import("./RepresentativeAttendancePage")),
        permission: [],
        roles: [UserRoleEnum.REPRESENTATIVE],
        title: "Asistencia",
        isVisibleInNavbar: true,
        icon: null,
        order: 2,
      },
      {
        key: "representative-conduct",
        path: REPRESENTATIVE_SELF_ROUTES.CONDUCT,
        element: lazy(() => import("./RepresentativeConductPage")),
        permission: [],
        roles: [UserRoleEnum.REPRESENTATIVE],
        title: "Conducta",
        isVisibleInNavbar: true,
        icon: null,
        order: 3,
      },
    ],
  },
];
