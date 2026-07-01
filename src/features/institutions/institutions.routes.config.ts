import { lazy } from "react";

import { UserRoleEnum } from "@features/auth";
import { ACADEMIC_GRADE_PERMISSIONS } from "@features/institutions/academic-grade";
import { ACADEMIC_LEVEL_PERMISSIONS } from "@features/institutions/academic-level";
import { ACADEMIC_SUBLEVEL_PERMISSIONS } from "@features/institutions/academic-sublevel";
import { SCHOOL_YEAR_PERMISSIONS } from "@features/institutions/school-year";
import { SECTION_PERMISSIONS } from "@features/institutions/section";

import type { RoutesConfigItem } from "@app/routes.config";
import { INSTITUTIONS_ROUTES } from "./institutions.routes";

export const institutionsRoutes: RoutesConfigItem[] = [
  {
    key: "institutions",
    isVisibleInNavbar: true,
    icon: null,
    title: "Institución",
    order: 2,
    permission: [SCHOOL_YEAR_PERMISSIONS.GET],
    roles: [UserRoleEnum.DIRECTOR],
    children: [
      {
        key: "school-years",
        path: INSTITUTIONS_ROUTES.SCHOOL_YEARS,
        element: lazy(
          () => import("@features/institutions/school-year/SchoolYearsPage"),
        ),
        permission: [SCHOOL_YEAR_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Años Escolares",
        isVisibleInNavbar: true,
        icon: null,
        order: 2,
      },
      {
        key: "academic-levels",
        path: INSTITUTIONS_ROUTES.ACADEMIC_LEVELS,
        element: lazy(
          () =>
            import("@features/institutions/academic-level/AcademicLevelPage"),
        ),
        permission: [ACADEMIC_LEVEL_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR, UserRoleEnum.TEACHER],
        title: "Niveles Académicos",
        isVisibleInNavbar: true,
        icon: null,
        order: 3,
      },
      {
        key: "academic-subnivels",
        path: INSTITUTIONS_ROUTES.ACADEMIC_SUBLEVELS,
        element: lazy(
          () =>
            import("@features/institutions/academic-sublevel/AcademicSubLevelPage"),
        ),
        permission: [ACADEMIC_SUBLEVEL_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Sub Niveles Académicos",
        isVisibleInNavbar: true,
        icon: null,
        order: 4,
      },
      {
        key: "academic-grades",
        path: INSTITUTIONS_ROUTES.ACADEMIC_GRADES,
        element: lazy(
          () =>
            import("@features/institutions/academic-grade/AcademicGradePage"),
        ),
        permission: [ACADEMIC_GRADE_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR, UserRoleEnum.TEACHER],
        title: "Grados Académicos",
        isVisibleInNavbar: true,
        icon: null,
        order: 5,
      },

      {
        key: "sections",
        path: INSTITUTIONS_ROUTES.SECTIONS,
        element: lazy(
          () => import("@features/institutions/section/SectionPage"),
        ),
        permission: [SECTION_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR, UserRoleEnum.TEACHER],
        title: "Paralelos",
        isVisibleInNavbar: true,
        icon: null,
        order: 6,
      },
    ],
  },
];
