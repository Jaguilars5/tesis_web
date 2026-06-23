import { BookOpen } from "lucide-react";
import { lazy } from "react";

import { ACADEMIC_PERIOD_PERMISSIONS } from "@features/academic/academic-period";
import { SUBJECT_PERMISSIONS } from "@features/academic/subject";
import { SUBJECT_ACADEMIC_CONFIG_PERMISSIONS } from "@features/academic/subject-academic-config";
import { SUBJECT_OFFERING_PERMISSIONS } from "@features/academic/subject-offering";
import { TEACHER_SUBJECT_SECTION_PERMISSIONS } from "@features/academic/teacher-subject-section";
import { UserRoleEnum } from "@features/auth";

import { TEACHER_ROUTES } from "@features/teacher/teacher.routes";

import { ACADEMIC_ROUTES } from "./academic.routes";
import { CLASS_SCHEDULE_PERMISSIONS } from "./class-schedule";
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
    roles: [UserRoleEnum.DIRECTOR, UserRoleEnum.TEACHER],
    children: [
      {
        key: "period-types",
        path: ACADEMIC_ROUTES.PERIOD_TYPES,
        element: lazy(
          () =>
            import("@features/academic/period-types/PeriodTypePage"),
        ),
        permission: [PERIOD_TYPE_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Tipos de Período",
        isVisibleInNavbar: true,
        icon: null,
        order: 1,
      },
      {
        key: "academic-periods",
        path: ACADEMIC_ROUTES.ACADEMIC_PERIODS,
        element: lazy(
          () => import("@features/academic/academic-period/AcademicPeriodPage"),
        ),
        permission: [ACADEMIC_PERIOD_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Periodos Academicos",
        isVisibleInNavbar: true,
        icon: null,
        order: 2,
      },
      {
        key: "subjects",
        path: ACADEMIC_ROUTES.SUBJECTS,
        element: lazy(
          () =>
            import("@features/academic/subject/SubjectPage"),
        ),
        permission: [SUBJECT_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Materias",
        isVisibleInNavbar: true,
        icon: null,
        order: 3,
      },

      {
        key: "subject-academic-configs",
        path: ACADEMIC_ROUTES.SUBJECT_ACADEMIC_CONFIGS,
        element: lazy(
          () =>
            import("@features/academic/subject-academic-config/SubjectAcademicConfigPage"),
        ),
        permission: [SUBJECT_ACADEMIC_CONFIG_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Materia x Grado",
        isVisibleInNavbar: true,
        icon: null,
        order: 4,
      },

      {
        key: "subject-offerings",
        path: ACADEMIC_ROUTES.SUBJECT_OFFERINGS,
        element: lazy(
          () =>
            import("@features/academic/subject-offering/SubjectOfferingPage"),
        ),
        permission: [SUBJECT_OFFERING_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Ofertas de Materia",
        isVisibleInNavbar: true,
        icon: null,
        order: 5,
      },

      {
        key: "teacher-subject-sections",
        path: ACADEMIC_ROUTES.TEACHER_SUBJECT_SECTIONS,
        element: lazy(
          () =>
            import("@features/academic/teacher-subject-section/TeacherSubjectSectionPage"),
        ),
        permission: [TEACHER_SUBJECT_SECTION_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Asignacion Docente",
        isVisibleInNavbar: true,
        icon: null,
        order: 6,
      },

      {
        key: "class-schedules",
        path: ACADEMIC_ROUTES.CLASS_SCHEDULES,
        element: lazy(
          () =>
            import("@features/academic/class-schedule/ClassSchedulePage"),
        ),
        permission: [CLASS_SCHEDULE_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Horarios",
        isVisibleInNavbar: true,
        icon: null,
        order: 7,
      },
      {
        key: "teacher-schedule",
        path: TEACHER_ROUTES.SCHEDULE,
        element: lazy(
          () => import("@features/teacher/TeacherSchedulePage"),
        ),
        permission: [],
        roles: [UserRoleEnum.TEACHER],
        title: "Mi Horario",
        isVisibleInNavbar: true,
        icon: null,
        order: 8,
      },
      {
        key: "teacher-activities",
        path: TEACHER_ROUTES.ACTIVITIES,
        element: lazy(
          () => import("@features/teacher/TeacherActivitiesPage"),
        ),
        permission: [],
        roles: [UserRoleEnum.TEACHER],
        title: "Actividades",
        isVisibleInNavbar: true,
        icon: null,
        order: 9,
      },
      {
        key: "teacher-grading",
        path: TEACHER_ROUTES.GRADING,
        element: lazy(
          () => import("@features/teacher/TeacherGradingPage"),
        ),
        permission: [],
        roles: [UserRoleEnum.TEACHER],
        title: "Calificaciones",
        isVisibleInNavbar: true,
        icon: null,
        order: 10,
      },
      {
        key: "teacher-attendance",
        path: TEACHER_ROUTES.ATTENDANCE,
        element: lazy(
          () => import("@features/teacher/TeacherAttendancePage"),
        ),
        permission: [],
        roles: [UserRoleEnum.TEACHER],
        title: "Asistencia",
        isVisibleInNavbar: true,
        icon: null,
        order: 11,
      },
      {
        key: "teacher-incidents",
        path: TEACHER_ROUTES.INCIDENTS,
        element: lazy(
          () => import("@features/teacher/TeacherIncidentsPage"),
        ),
        permission: [],
        roles: [UserRoleEnum.TEACHER],
        title: "Incidentes",
        isVisibleInNavbar: true,
        icon: null,
        order: 12,
      },
    ],
  },
];
