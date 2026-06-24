export const STUDENT_ENDPOINTS = {
  LIST: "/api/students/student/",
  DETAIL: (id: number) => `/api/students/student/${id}/`,
  SOFT_DELETE: (id: number) => `/api/students/student/${id}/soft-delete/`,
  ASSIGN_REPRESENTATIVE: (id: number) => `/api/students/student/${id}/assign-representative/`,
} as const;
export const STUDENT_PERMISSIONS = {
  GET: "students.view_student",
  CREATE: "students.create_student",
  UPDATE: "students.update_student",
  DELETE: "students.delete_student",
} as const;
