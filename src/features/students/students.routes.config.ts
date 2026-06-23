import { Users } from "lucide-react";
import { lazy } from "react";

import { UserRoleEnum } from "@features/auth";
import { ENROLLMENT_PERMISSIONS } from "@features/students/enrollments";
import { REPRESENTATIVE_PERMISSIONS } from "@features/students/representative";
import { STUDENT_PERMISSIONS } from "@features/students/student";

import type { RoutesConfigItem } from "@app/routes.config";
import { STUDENTS_ROUTES } from "./students.routes";

export const studentsRoutes: RoutesConfigItem[] = [
  {
    key: "students",
    isVisibleInNavbar: true,
    icon: Users,
    title: "Estudiantes",
    order: 5,
    permission: [STUDENT_PERMISSIONS.GET],
    roles: [UserRoleEnum.DIRECTOR],
    children: [
      {
        key: "students",
        path: STUDENTS_ROUTES.STUDENTS,
        element: lazy(
          () =>
            import("@features/students/student/StudentPage"),
        ),
        permission: [STUDENT_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Estudiantes",
        isVisibleInNavbar: true,
        icon: null,
        order: 1,
      },
      {
        key: "student-representatives",
        path: STUDENTS_ROUTES.STUDENT_REPRESENTATIVES,
        element: lazy(
          () =>
            import("@features/students/representative/RepresentativePage"),
        ),
        permission: [REPRESENTATIVE_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Representantes",
        isVisibleInNavbar: true,
        icon: null,
        order: 2,
      },
      {
        key: "enrollments",
        path: STUDENTS_ROUTES.ENROLLMENTS,
        element: lazy(
          () =>
            import("@features/students/enrollments/EnrollmentsPage"),
        ),
        permission: [ENROLLMENT_PERMISSIONS.GET],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Matrículas",
        isVisibleInNavbar: true,
        icon: null,
        order: 3,
      },
      {
        key: "enrollments-new",
        path: STUDENTS_ROUTES.ENROLLMENT_NEW,
        element: lazy(
          () =>
            import("@features/students/enrollments/EnrollmentWizardPage"),
        ),
        permission: [ENROLLMENT_PERMISSIONS.CREATE],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Nueva Matrícula",
        isVisibleInNavbar: false,
        icon: null,
        order: 1,
      },
      {
        key: "enrollments-edit",
        path: STUDENTS_ROUTES.ENROLLMENT_EDIT,
        element: lazy(
          () =>
            import("@features/students/enrollments/EnrollmentEditPage"),
        ),
        permission: [ENROLLMENT_PERMISSIONS.UPDATE],
        roles: [UserRoleEnum.DIRECTOR],
        title: "Editar Matrícula",
        isVisibleInNavbar: false,
        icon: null,
        order: 1,
      },
    ],
  },
];
