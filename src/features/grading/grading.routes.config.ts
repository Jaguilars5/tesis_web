import { GraduationCap } from "lucide-react";
import { lazy } from "react";

import { UserRoleEnum } from "@features/auth";
import {
  ACTIVITY_TYPES_PERMISSIONS,
  BLOCK_COMPONENTS_PERMISSIONS,
  COMPONENT_INDICATORS_PERMISSIONS,
  EVALUATION_BLOCKS_PERMISSIONS,
  EVALUATION_TYPES_PERMISSIONS,
  GRADE_HISTORY_PERMISSIONS,
  GRADE_TYPES_PERMISSIONS,
  PERIOD_GRADE_SUMMARIES_PERMISSIONS,
  PROJECT_NOTES_PERMISSIONS,
  PROMOTION_STATUSES_PERMISSIONS,
  QUALITATIVE_SCALES_PERMISSIONS,
  RECOVERY_PROCESS_TYPES_PERMISSIONS,
  RECOVERY_PROCESSES_PERMISSIONS,
  STUDENT_NOTES_PERMISSIONS,
} from "@features/grading";

import { GRADING_ROUTES } from "./grading.routes";

import type { RoutesConfigItem } from "@app/routes.config";

export const gradingRoutes: RoutesConfigItem[] = [
  {
    key: "grading",
    isVisibleInNavbar: true,
    icon: GraduationCap,
    title: "Calificaciones",
    order: 4,
    permission: [EVALUATION_BLOCKS_PERMISSIONS.GET],
    roles: [UserRoleEnum.DIRECTOR, UserRoleEnum.TEACHER],
    children: [
      {
        key: "evaluation-blocks",
        path: GRADING_ROUTES.EVALUATION_BLOCKS,
        element: lazy(
          () =>
            import("@features/grading/evaluation-blocks/pages/EvaluationBlocksPage"),
        ),
        permission: [EVALUATION_BLOCKS_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR, UserRoleEnum.TEACHER],
        title: "Bloques de Evaluación",
        isVisibleInNavbar: true,
        icon: null,
        order: 1,
      },
      {
        key: "block-components",
        path: GRADING_ROUTES.BLOCK_COMPONENTS,
        element: lazy(
          () =>
            import("@features/grading/block-components/pages/BlockComponentsPage"),
        ),
        permission: [BLOCK_COMPONENTS_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR, UserRoleEnum.TEACHER],
        title: "Componentes de Bloque",
        isVisibleInNavbar: true,
        icon: null,
        order: 2,
      },
      {
        key: "component-indicators",
        path: GRADING_ROUTES.COMPONENT_INDICATORS,
        element: lazy(
          () =>
            import("@features/grading/component-indicators/pages/ComponentIndicatorsPage"),
        ),
        permission: [COMPONENT_INDICATORS_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR, UserRoleEnum.TEACHER],
        title: "Indicadores",
        isVisibleInNavbar: true,
        icon: null,
        order: 3,
      },
      {
        key: "student-notes",
        path: GRADING_ROUTES.STUDENT_NOTES,
        element: lazy(
          () =>
            import("@features/grading/student-notes/pages/StudentNotesPage"),
        ),
        permission: [STUDENT_NOTES_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR, UserRoleEnum.TEACHER],
        title: "Notas de Estudiantes",
        isVisibleInNavbar: true,
        icon: null,
        order: 4,
      },
      {
        key: "project-notes",
        path: GRADING_ROUTES.PROJECT_NOTES,
        element: lazy(
          () =>
            import("@features/grading/project-notes/pages/ProjectNotesPage"),
        ),
        permission: [PROJECT_NOTES_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR, UserRoleEnum.TEACHER],
        title: "Notas de Proyectos",
        isVisibleInNavbar: true,
        icon: null,
        order: 5,
      },
      {
        key: "period-grade-summaries",
        path: GRADING_ROUTES.PERIOD_GRADE_SUMMARIES,
        element: lazy(
          () =>
            import("@features/grading/period-grade-summaries/pages/PeriodGradeSummariesPage"),
        ),
        permission: [PERIOD_GRADE_SUMMARIES_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR, UserRoleEnum.TEACHER],
        title: "Resúmenes de Notas",
        isVisibleInNavbar: true,
        icon: null,
        order: 6,
      },
      {
        key: "recovery-processes",
        path: GRADING_ROUTES.RECOVERY_PROCESSES,
        element: lazy(
          () =>
            import("@features/grading/recovery-processes/pages/RecoveryProcessesPage"),
        ),
        permission: [RECOVERY_PROCESSES_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR, UserRoleEnum.TEACHER],
        title: "Procesos de Recuperación",
        isVisibleInNavbar: true,
        icon: null,
        order: 7,
      },
      {
        key: "grade-history",
        path: GRADING_ROUTES.GRADE_HISTORY,
        element: lazy(
          () =>
            import("@features/grading/grade-history/pages/GradeHistoryPage"),
        ),
        permission: [GRADE_HISTORY_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR, UserRoleEnum.TEACHER],
        title: "Historial de Notas",
        isVisibleInNavbar: true,
        icon: null,
        order: 8,
      },
      {
        key: "grade-types",
        path: GRADING_ROUTES.GRADE_TYPES,
        element: lazy(
          () => import("@features/grading/grade-types/pages/GradeTypesPage"),
        ),
        permission: [GRADE_TYPES_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Tipos de Calificación",
        isVisibleInNavbar: true,
        icon: null,
        order: 9,
      },
      {
        key: "qualitative-scales",
        path: GRADING_ROUTES.QUALITATIVE_SCALES,
        element: lazy(
          () =>
            import("@features/grading/qualitative-scales/pages/QualitativeScalesPage"),
        ),
        permission: [QUALITATIVE_SCALES_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Escalas Cualitativas",
        isVisibleInNavbar: true,
        icon: null,
        order: 10,
      },
      {
        key: "evaluation-types",
        path: GRADING_ROUTES.EVALUATION_TYPES,
        element: lazy(
          () =>
            import("@features/grading/evaluation-types/pages/EvaluationTypesPage"),
        ),
        permission: [EVALUATION_TYPES_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Tipos de Evaluación",
        isVisibleInNavbar: true,
        icon: null,
        order: 11,
      },
      {
        key: "activity-types",
        path: GRADING_ROUTES.ACTIVITY_TYPES,
        element: lazy(
          () =>
            import("@features/grading/activity-types/pages/ActivityTypesPage"),
        ),
        permission: [ACTIVITY_TYPES_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Tipos de Actividad",
        isVisibleInNavbar: true,
        icon: null,
        order: 12,
      },
      {
        key: "promotion-statuses",
        path: GRADING_ROUTES.PROMOTION_STATUSES,
        element: lazy(
          () =>
            import("@features/grading/promotion-statuses/pages/PromotionStatusesPage"),
        ),
        permission: [PROMOTION_STATUSES_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Estados de Promoción",
        isVisibleInNavbar: true,
        icon: null,
        order: 13,
      },
      {
        key: "recovery-process-types",
        path: GRADING_ROUTES.RECOVERY_PROCESS_TYPES,
        element: lazy(
          () =>
            import("@features/grading/recovery-process-types/pages/RecoveryProcessTypesPage"),
        ),
        permission: [RECOVERY_PROCESS_TYPES_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Tipos de Recuperación",
        isVisibleInNavbar: true,
        icon: null,
        order: 14,
      },
    ],
  },
];
