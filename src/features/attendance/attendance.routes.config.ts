import { ClipboardList } from "lucide-react";
import { lazy } from "react";

import { UserRoleEnum } from "@features/auth";
import { ATTENDANCE_PERMISSIONS } from "@features/attendance/attendance";
import { ATTENDANCE_STATUS_PERMISSIONS } from "@features/attendance/attendance-status";
import { ABSENCE_TYPE_PERMISSIONS } from "@features/attendance/absence-type";
import { STUDENT_ROUTES } from "@features/student/student.routes";
import { TEACHER_ROUTES } from "@features/teacher/teacher.routes";

import { ATTENDANCE_ROUTES } from "./attendance.routes";

import type { RoutesConfigItem } from "@app/routes.config";

export const attendanceRoutes: RoutesConfigItem[] = [
  {
    key: "attendance",
    isVisibleInNavbar: true,
    icon: ClipboardList,
    title: "Asistencia",
    order: 7,
    permission: [ATTENDANCE_STATUS_PERMISSIONS.GET],
    roles: [UserRoleEnum.DIRECTOR, UserRoleEnum.TEACHER, UserRoleEnum.COUNSELOR, UserRoleEnum.STUDENT],
    children: [
      {
        key: "take-attendance",
        path: ATTENDANCE_ROUTES.TAKE_ATTENDANCE,
        element: lazy(
          () =>
            import("@features/attendance/take-attendance/TakeAttendancePage"),
        ),
        permission: [ATTENDANCE_PERMISSIONS.CREATE],
        roles: [UserRoleEnum.DIRECTOR, UserRoleEnum.COUNSELOR],
        title: "Tomar Asistencia",
        isVisibleInNavbar: true,
        icon: null,
        order: 0,
      },
      {
        key: "attendance-summary",
        path: ATTENDANCE_ROUTES.ATTENDANCE_SUMMARY,
        element: lazy(
          () =>
            import("@features/attendance/attendance/AttendanceSummaryPage"),
        ),
        permission: [ATTENDANCE_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR, UserRoleEnum.COUNSELOR],
        title: "Resumen de Asistencia",
        isVisibleInNavbar: true,
        icon: null,
        order: 1,
      },
      {
        key: "attendances",
        path: ATTENDANCE_ROUTES.ATTENDANCES,
        element: lazy(
          () =>
            import("@features/attendance/attendance/AttendancePage"),
        ),
        permission: [ATTENDANCE_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR, UserRoleEnum.COUNSELOR],
        title: "Asistencias",
        isVisibleInNavbar: true,
        icon: null,
        order: 0,
      },
      {
        key: "teacher-attendance",
        path: TEACHER_ROUTES.ATTENDANCE,
        element: lazy(
          () => import("@features/teacher/TeacherAttendancePage"),
        ),
        permission: [],
        roles: [UserRoleEnum.TEACHER],
        title: "Tomar Asistencia",
        isVisibleInNavbar: true,
        icon: null,
        order: 5,
      },
      {
        key: "attendance-statuses",
        path: ATTENDANCE_ROUTES.ATTENDANCE_STATUSES,
        element: lazy(
          () =>
            import("@features/attendance/attendance-status/AttendanceStatusPage"),
        ),
        permission: [ATTENDANCE_STATUS_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Estados de Asistencia",
        isVisibleInNavbar: true,
        icon: null,
        order: 0,
      },
      {
        key: "absence-types",
        path: ATTENDANCE_ROUTES.ABSENCE_TYPES,
        element: lazy(
          () =>
            import("@features/attendance/absence-type/AbsenceTypePage"),
        ),
        permission: [ABSENCE_TYPE_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Tipos de Ausencia",
        isVisibleInNavbar: true,
        icon: null,
        order: 1,
      },
      {
        key: "student-attendance",
        path: STUDENT_ROUTES.ATTENDANCE,
        element: lazy(
          () => import("@features/student/StudentAttendancePage"),
        ),
        permission: [],
        roles: [UserRoleEnum.STUDENT],
        title: "Mi Asistencia",
        isVisibleInNavbar: true,
        icon: null,
        order: 6,
      },
    ],
  },
];
