import { BarChart3, Beaker, LayoutDashboard, Settings2 } from "lucide-react";
import { lazy } from "react";

import { PROTECTED_ROUTES, PROFILE_ROUTE } from "./routes";

import type { LucideIcon } from "lucide-react";

import { academicRoutes } from "@features/academic/academic.routes.config";
import { attendanceRoutes } from "@features/attendance/attendance.routes.config";
import { UserRoleEnum } from "@features/auth/auth.constants";
import type { UserRoleT } from "@features/auth/auth.types";
import { behaviorRoutes } from "@features/behavior/behavior.routes.config";
import { gradingRoutes } from "@features/grading/grading.routes.config";
import { iamRoutes } from "@features/iam/iam.routes.config";
import { institutionsRoutes } from "@features/institutions/institutions.routes.config";
import { studentsRoutes } from "@features/students/students.routes.config";
import { ANALYTICS_RISK_PERMISSIONS } from "@features/analytics/analytics.constants";
import { EARLY_ALERT_PERMISSIONS } from "@features/analytics/early-alerts/early-alerts.constants";
import { SCORING_CONFIG_PERMISSIONS } from "@features/analytics/scoring-config";

const DashboardPage = lazy(() => import("@features/dashboard/DashboardPage"));

const LoginPage = lazy(() => import("@features/auth/LoginPage"));
export interface BaseRoutesConfig {
  key: string;
  icon: LucideIcon | null;
  isVisibleInNavbar: boolean;
  permission: string[];
  roles: UserRoleT[];
  title: string;
  order: number;
}

export interface RouteConfig extends BaseRoutesConfig {
  path: string;
  element: ReturnType<typeof lazy>;
}

export interface RoutesConfigGroup extends BaseRoutesConfig {
  path?: string;
  element?: never;
  children: RouteConfig[];
}

export type RoutesConfigItem = RouteConfig | RoutesConfigGroup;

export const publicRoutes: RouteConfig[] = [
  {
    key: "login",
    path: "/login",
    element: LoginPage,
    permission: [],
    roles: [],
    title: "Inicio de Sesión",
    icon: null,
    isVisibleInNavbar: false,
    order: 1,
  },
];

export const protectedRoutes: RoutesConfigItem[] = [
  {
    key: "dashboard",
    path: PROTECTED_ROUTES.DASHBOARD,
    element: DashboardPage,
    permission: [],
    roles: [],
    title: "Dashboard",
    isVisibleInNavbar: true,
    icon: LayoutDashboard,
    order: 1,
  },
  {
    key: "profile",
    path: PROFILE_ROUTE,
    element: lazy(() => import("@features/profile/ProfilePage")),
    permission: [],
    roles: [],
    title: "Mi Perfil",
    isVisibleInNavbar: false,
    icon: null,
    order: 1,
  },
  ...institutionsRoutes,
  ...academicRoutes,
  ...gradingRoutes,
  ...attendanceRoutes,
  ...behaviorRoutes,
  ...studentsRoutes,
  ...iamRoutes,
  {
    key: "analytics",
    isVisibleInNavbar: true,
    icon: BarChart3,
    title: "Analítica",
    order: 6,
    permission: [ANALYTICS_RISK_PERMISSIONS.VIEW],
    roles: [UserRoleEnum.DIRECTOR, UserRoleEnum.COUNSELOR],
    children: [
      {
        key: "early-alerts",
        path: PROTECTED_ROUTES.ANALYTICS_EARLY_ALERTS,
        element: lazy(
          () => import("@features/analytics/early-alerts/EarlyAlertPage"),
        ),
        permission: [EARLY_ALERT_PERMISSIONS.GET],
        roles: [
          UserRoleEnum.DIRECTOR,
          UserRoleEnum.TEACHER,
          UserRoleEnum.COUNSELOR,
        ],
        title: "Alertas Tempranas",
        isVisibleInNavbar: true,
        icon: null,
        order: 1,
      },
      {
        key: "risk-scores",
        path: PROTECTED_ROUTES.ANALYTICS_RISK_SCORES,
        element: lazy(() => import("@features/analytics/RiskScoreListPage")),
        permission: [ANALYTICS_RISK_PERMISSIONS.VIEW],
        roles: [UserRoleEnum.DIRECTOR, UserRoleEnum.TEACHER],
        title: "Riesgo Académico",
        isVisibleInNavbar: true,
        icon: null,
        order: 1,
      },
      {
        key: "risk-scores-detail",
        path: PROTECTED_ROUTES.ANALYTICS_RISK_SCORE_DETAIL,
        element: lazy(() => import("@features/analytics/RiskScoreDetailPage")),
        permission: [ANALYTICS_RISK_PERMISSIONS.VIEW],
        roles: [UserRoleEnum.DIRECTOR, UserRoleEnum.TEACHER],
        title: "Detalle de Riesgo",
        isVisibleInNavbar: false,
        icon: null,
        order: 1,
      },
      {
        key: "scoring-config",
        path: PROTECTED_ROUTES.ANALYTICS_SCORING_CONFIG,
        element: lazy(() =>
          import("@features/analytics/scoring-config").then((m) => ({
            default: m.ScoringConfigPage,
          })),
        ),
        permission: [SCORING_CONFIG_PERMISSIONS.VIEW],
        roles: [UserRoleEnum.DIRECTOR, UserRoleEnum.RECTOR],
        title: "Motor de Riesgo",
        isVisibleInNavbar: true,
        icon: Settings2,
        order: 2,
      },
      {
        key: "model-evaluator",
        path: PROTECTED_ROUTES.ANALYTICS_MODEL_EVALUATOR,
        element: lazy(() => import("@features/analytics/model-evaluator/ModelEvaluatorPage")),
        permission: [ANALYTICS_RISK_PERMISSIONS.VIEW],
        roles: [UserRoleEnum.DIRECTOR, UserRoleEnum.RECTOR, UserRoleEnum.TEACHER],
        title: "Simulador de Riesgo",
        isVisibleInNavbar: true,
        icon: Beaker,
        order: 3,
      },
    ],
  },
];
