import { lazy } from "react";

import { UserRoleEnum } from "@features/auth";
import { ACADEMIC_LEVEL_PERMISSIONS } from "@features/institutions/academic-level";
import { ACADEMIC_SUBNIVEL_PERMISSIONS } from "@features/institutions/academic-subnivel";
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
          () =>
            import("@features/institutions/school-year/pages/SchoolYearsPage"),
        ),
        permission: [SCHOOL_YEAR_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Anos Escolares",
        isVisibleInNavbar: true,
        icon: null,
        order: 2,
      },
      {
        key: "academic-grades",
        path: INSTITUTIONS_ROUTES.ACADEMIC_GRADES,
        element: lazy(
          () =>
            import("@features/institutions/academic-grade/presentation/pages/AcademicGradePage"),
        ),
        permission: [SCHOOL_YEAR_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Grados Académicos",
        isVisibleInNavbar: true,
        icon: null,
        order: 3,
      },
      {
        key: "academic-levels",
        path: INSTITUTIONS_ROUTES.ACADEMIC_LEVELS,
        element: lazy(
          () =>
            import("@features/institutions/academic-level/pages/AcademicLevelPage"),
        ),
        permission: [ACADEMIC_LEVEL_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Niveles Académicos",
        isVisibleInNavbar: true,
        icon: null,
        order: 4,
      },
      {
        key: "sections",
        path: INSTITUTIONS_ROUTES.SECTIONS,
        element: lazy(
          () => import("@features/institutions/section/pages/SectionPage"),
        ),
        permission: [SECTION_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Paralelos",
        isVisibleInNavbar: true,
        icon: null,
        order: 5,
      },
      {
        key: "academic-subnivels",
        path: INSTITUTIONS_ROUTES.ACADEMIC_SUBNIVELS,
        element: lazy(
          () =>
            import("@features/institutions/academic-subnivel/pages/AcademicSubnivelPage"),
        ),
        permission: [ACADEMIC_SUBNIVEL_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Subniveles Académicos",
        isVisibleInNavbar: true,
        icon: null,
        order: 6,
      },
    ],
  },
];
