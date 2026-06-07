import { LayoutDashboard } from "lucide-react";
import { lazy } from "react";

import { PROTECTED_ROUTES } from "./routes";

import type { LucideIcon } from "lucide-react";

import { academicRoutes } from "@features/academic/academic.routes.config";
import type { UserRoleT } from "@features/auth/domain/entities/auth.types";
import { gradingRoutes } from "@features/grading/grading.routes.config";
import { institutionsRoutes } from "@features/institutions/institutions.routes.config";

const DashboardPage = lazy(
  () => import("@features/dashboard/pages/DashboardPage"),
);

const LoginPage = lazy(() => import("@features/auth/pages/LoginPage"));
const DesignSystemPage = lazy(
  () => import("@features/design-system/pages/DesignSystemPage"),
);

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
  {
    key: "design-system",
    path: "/design-system",
    element: DesignSystemPage,
    permission: [],
    roles: [],
    title: "Design System",
    icon: null,
    isVisibleInNavbar: false,
    order: 2,
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
  ...institutionsRoutes,
  ...academicRoutes,
  ...gradingRoutes,
];
