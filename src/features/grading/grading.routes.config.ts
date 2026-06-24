import { GraduationCap } from "lucide-react";
import { lazy } from "react";

import { UserRoleEnum } from "@features/auth";
import {
  ACTIVITY_TYPES_PERMISSIONS,
  BLOCK_COMPONENTS_PERMISSIONS,
  EVALUATION_BLOCKS_PERMISSIONS,
  EVALUATIVE_ACTIVITY_PERMISSIONS,
  GRADE_HISTORY_PERMISSIONS,
  PERIOD_GRADE_SUMMARIES_PERMISSIONS,
  QUALITATIVE_SCALE_SUBLEVEL_PERMISSIONS,
  QUALITATIVE_SCALES_PERMISSIONS,
  STUDENT_NOTES_PERMISSIONS,
} from "@features/grading";

import { STUDENT_ROUTES } from "@features/student/student.routes";

import { GRADING_ROUTES } from "./grading.routes";

import type { RoutesConfigItem } from "@app/routes.config";

export const gradingRoutes: RoutesConfigItem[] = [
  {
    key: "grading",
    isVisibleInNavbar: true,
    icon: GraduationCap,
    title: "Calificaciones",
    order: 4,
    permission: [EVALUATIVE_ACTIVITY_PERMISSIONS.GET],
    roles: [UserRoleEnum.DIRECTOR, UserRoleEnum.TEACHER, UserRoleEnum.STUDENT],
    children: [
      // ===================== PARAMÉTRICAS =====================
      {
        key: "activity-types",
        path: GRADING_ROUTES.ACTIVITY_TYPES,
        element: lazy(
          () => import("@features/grading/activity-types/ActivityTypesPage"),
        ),
        permission: [ACTIVITY_TYPES_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Tipos de Actividad",
        isVisibleInNavbar: true,
        icon: null,
        order: 1,
      },
      {
        key: "qualitative-scales",
        path: GRADING_ROUTES.QUALITATIVE_SCALES,
        element: lazy(
          () =>
            import("@features/grading/qualitative-scales/QualitativeScalesPage"),
        ),
        permission: [QUALITATIVE_SCALES_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Escalas Cualitativas",
        isVisibleInNavbar: true,
        icon: null,
        order: 2,
      },
      {
        key: "qualitative-scale-sublevels",
        path: GRADING_ROUTES.QUALITATIVE_SCALE_SUBLEVELS,
        element: lazy(
          () =>
            import("@features/grading/qualitative-scale-sublevels/QualitativeScaleSublevelsPage"),
        ),
        permission: [QUALITATIVE_SCALE_SUBLEVEL_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Escalas x Subnivel",
        isVisibleInNavbar: true,
        icon: null,
        order: 3,
      },
      // ===================== MAESTRAS =====================
      {
        key: "evaluation-blocks",
        path: GRADING_ROUTES.EVALUATION_BLOCKS,
        element: lazy(
          () =>
            import("@features/grading/evaluation-blocks/EvaluationBlocksPage"),
        ),
        permission: [EVALUATION_BLOCKS_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Bloques de Evaluación",
        isVisibleInNavbar: true,
        icon: null,
        order: 4,
      },
      {
        key: "block-components",
        path: GRADING_ROUTES.BLOCK_COMPONENTS,
        element: lazy(
          () =>
            import("@features/grading/block-components/BlockComponentsPage"),
        ),
        permission: [BLOCK_COMPONENTS_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Componentes de Bloque",
        isVisibleInNavbar: true,
        icon: null,
        order: 5,
      },
      // ===================== TRANSACCIONALES =====================
      {
        key: "evaluative-activities",
        path: GRADING_ROUTES.EVALUATIVE_ACTIVITIES,
        element: lazy(
          () =>
            import("@features/grading/evaluative-activities/EvaluativeActivitiesPage"),
        ),
        permission: [EVALUATIVE_ACTIVITY_PERMISSIONS.GET],
        roles: [UserRoleEnum.TEACHER],
        title: "Actividades Evaluativas",
        isVisibleInNavbar: true,
        icon: null,
        order: 6,
      },
      {
        key: "gradebook",
        path: GRADING_ROUTES.GRADEBOOK,
        element: lazy(
          () => import("@features/grading/gradebook/GradebookPage"),
        ),
        permission: [STUDENT_NOTES_PERMISSIONS.GET],
        roles: [UserRoleEnum.TEACHER],
        title: "Calificar",
        isVisibleInNavbar: true,
        icon: null,
        order: 7,
      },
      {
        key: "student-notes",
        path: GRADING_ROUTES.STUDENT_NOTES,
        element: lazy(
          () => import("@features/grading/student-notes/StudentNotesPage"),
        ),
        permission: [STUDENT_NOTES_PERMISSIONS.GET],
        roles: [UserRoleEnum.TEACHER],
        title: "Notas de Estudiantes",
        isVisibleInNavbar: true,
        icon: null,
        order: 8,
      },
      {
        key: "period-grade-summaries",
        path: GRADING_ROUTES.PERIOD_GRADE_SUMMARIES,
        element: lazy(
          () =>
            import("@features/grading/period-grade-summaries/PeriodGradeSummariesPage"),
        ),
        permission: [PERIOD_GRADE_SUMMARIES_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Resúmenes de Notas",
        isVisibleInNavbar: false,
        icon: null,
        order: 9,
      },
      {
        key: "grade-history",
        path: GRADING_ROUTES.GRADE_HISTORY,
        element: lazy(
          () => import("@features/grading/grade-history/GradeHistoryPage"),
        ),
        permission: [GRADE_HISTORY_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Historial de Notas",
        isVisibleInNavbar: false,
        icon: null,
        order: 10,
      },
      {
        key: "student-grades",
        path: STUDENT_ROUTES.GRADES,
        element: lazy(() => import("@features/student/StudentGradesPage")),
        permission: [],
        roles: [UserRoleEnum.STUDENT],
        title: "Mis Calificaciones",
        isVisibleInNavbar: true,
        icon: null,
        order: 12,
      },
    ],
  },
];
