import { ClipboardCheck } from "lucide-react";
import { lazy } from "react";

import { UserRoleEnum } from "@features/auth";
import { BEHAVIOR_EVALUATION_PERMISSIONS } from "@features/behavior/behavior-evaluation";
import { CONDUCT_INCIDENT_PERMISSIONS } from "@features/behavior/conduct-incident";
import { INCIDENT_TYPE_PERMISSIONS } from "@features/behavior/incident-type";
import { SEVERITY_PERMISSIONS } from "@features/behavior/severity";
import { STUDENT_ROUTES } from "@features/student/student.routes";

import { BEHAVIOR_ROUTES } from "./behavior.routes";

import type { RoutesConfigItem } from "@app/routes.config";

export const behaviorRoutes: RoutesConfigItem[] = [
  {
    key: "behavior",
    isVisibleInNavbar: true,
    icon: ClipboardCheck,
    title: "Conducta",
    order: 6,
    permission: [
      BEHAVIOR_EVALUATION_PERMISSIONS.GET,
      CONDUCT_INCIDENT_PERMISSIONS.GET,
    ],
    roles: [UserRoleEnum.DIRECTOR, UserRoleEnum.TEACHER, UserRoleEnum.STUDENT],
    children: [
      {
        key: "conduct-incidents",
        path: BEHAVIOR_ROUTES.CONDUCT_INCIDENTS,
        element: lazy(
          () =>
            import("@features/behavior/conduct-incident/ConductIncidentPage"),
        ),
        permission: [CONDUCT_INCIDENT_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR, UserRoleEnum.TEACHER],
        title: "Incidentes de Conducta",
        isVisibleInNavbar: true,
        icon: null,
        order: 0,
      },
      {
        key: "severities",
        path: BEHAVIOR_ROUTES.SEVERITIES,
        element: lazy(
          () =>
            import("@features/behavior/severity/SeverityPage"),
        ),
        permission: [SEVERITY_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Severidades",
        isVisibleInNavbar: true,
        icon: null,
        order: 0,
      },
      {
        key: "incident-types",
        path: BEHAVIOR_ROUTES.INCIDENT_TYPES,
        element: lazy(
          () =>
            import("@features/behavior/incident-type/IncidentTypePage"),
        ),
        permission: [INCIDENT_TYPE_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Tipos de Incidente",
        isVisibleInNavbar: true,
        icon: null,
        order: 1,
      },
      {
        key: "behavior-evaluations",
        path: BEHAVIOR_ROUTES.BEHAVIOR_EVALUATIONS,
        element: lazy(
          () =>
            import("@features/behavior/behavior-evaluation/BehaviorEvaluationPage"),
        ),
        permission: [BEHAVIOR_EVALUATION_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Evaluaciones de Conducta",
        isVisibleInNavbar: true,
        icon: null,
        order: 2,
      },
      {
        key: "student-conduct",
        path: STUDENT_ROUTES.CONDUCT,
        element: lazy(
          () => import("@features/student/StudentConductPage"),
        ),
        permission: [],
        roles: [UserRoleEnum.STUDENT],
        title: "Mi Conducta",
        isVisibleInNavbar: true,
        icon: null,
        order: 4,
      },
    ],
  },
];
