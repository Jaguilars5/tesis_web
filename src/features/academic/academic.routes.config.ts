import { BookOpen } from "lucide-react";
import { lazy } from "react";

import { ACADEMIC_PERIOD_PERMISSIONS } from "@features/academic/academic-period";
import { INTERDISCIPLINARY_PROJECT_PERMISSIONS } from "@features/academic/interdisciplinary-project";
import { SUBJECT_PERMISSIONS } from "@features/academic/subject";
import { SUBJECT_ACADEMIC_CONFIG_PERMISSIONS } from "@features/academic/subject-academic-config";
import { SUBJECT_OFFERING_PERMISSIONS } from "@features/academic/subject-offering";
import { SUBJECT_PROJECT_PERMISSIONS } from "@features/academic/subject-project";
import { TEACHER_SUBJECT_SECTION_PERMISSIONS } from "@features/academic/teacher-subject-section";
import { UserRoleEnum } from "@features/auth";

import { ACADEMIC_ROUTES } from "./academic.routes";
import { PERIOD_TYPE_PERMISSIONS } from "./period-types";

import type { RoutesConfigItem } from "@app/routes.config";

export const academicRoutes: RoutesConfigItem[] = [
  {
    key: "academic",
    isVisibleInNavbar: true,
    icon: BookOpen,
    title: "Académico",
    order: 3,
    permission: [SUBJECT_PERMISSIONS.GET],
    roles: [UserRoleEnum.DIRECTOR],
    children: [
      {
        key: "subjects",
        path: ACADEMIC_ROUTES.SUBJECTS,
        element: lazy(
          () => import("@features/academic/subject/pages/SubjectPage"),
        ),
        permission: [SUBJECT_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Materias",
        isVisibleInNavbar: true,
        icon: null,
        order: 1,
      },
      {
        key: "academic-periods",
        path: ACADEMIC_ROUTES.ACADEMIC_PERIODS,
        element: lazy(
          () =>
            import("@features/academic/academic-period/pages/AcademicPeriodPage"),
        ),
        permission: [ACADEMIC_PERIOD_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Periodos Academicos",
        isVisibleInNavbar: true,
        icon: null,
        order: 2,
      },
      {
        key: "subject-academic-configs",
        path: ACADEMIC_ROUTES.SUBJECT_ACADEMIC_CONFIGS,
        element: lazy(
          () =>
            import("@features/academic/subject-academic-config/pages/SubjectAcademicConfigPage"),
        ),
        permission: [SUBJECT_ACADEMIC_CONFIG_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Materia x Grado",
        isVisibleInNavbar: true,
        icon: null,
        order: 3,
      },
      {
        key: "teacher-subject-sections",
        path: ACADEMIC_ROUTES.TEACHER_SUBJECT_SECTIONS,
        element: lazy(
          () =>
            import("@features/academic/teacher-subject-section/pages/TeacherSubjectSectionPage"),
        ),
        permission: [TEACHER_SUBJECT_SECTION_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Asignacion Docente",
        isVisibleInNavbar: true,
        icon: null,
        order: 4,
      },
      {
        key: "subject-offerings",
        path: ACADEMIC_ROUTES.SUBJECT_OFFERINGS,
        element: lazy(
          () =>
            import("@features/academic/subject-offering/pages/SubjectOfferingPage"),
        ),
        permission: [SUBJECT_OFFERING_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Ofertas de Materia",
        isVisibleInNavbar: true,
        icon: null,
        order: 5,
      },
      {
        key: "interdisciplinary-projects",
        path: ACADEMIC_ROUTES.INTERDISCIPLINARY_PROJECTS,
        element: lazy(
          () =>
            import("@features/academic/interdisciplinary-project/pages/InterdisciplinaryProjectPage"),
        ),
        permission: [INTERDISCIPLINARY_PROJECT_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Proyectos Interdisc.",
        isVisibleInNavbar: true,
        icon: null,
        order: 6,
      },
      {
        key: "subject-projects",
        path: ACADEMIC_ROUTES.SUBJECT_PROJECTS,
        element: lazy(
          () =>
            import("@features/academic/subject-project/pages/SubjectProjectPage"),
        ),
        permission: [SUBJECT_PROJECT_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Materias de Proyectos",
        isVisibleInNavbar: true,
        icon: null,
        order: 7,
      },
      {
        key: "period-types",
        path: ACADEMIC_ROUTES.PERIOD_TYPES,
        element: lazy(
          () => import("@features/academic/period-types/pages/PeriodTypePage"),
        ),
        permission: [PERIOD_TYPE_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Tipos de Período",
        isVisibleInNavbar: true,
        icon: null,
        order: 8,
      },
    ],
  },
];
