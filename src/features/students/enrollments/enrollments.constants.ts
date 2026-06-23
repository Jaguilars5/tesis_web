export const ENROLLMENT_ENDPOINTS = {
  LIST: "/api/students/enrollments/",
  DETAIL: (id: number) => `/api/students/enrollments/${id}/`,
  SOFT_DELETE: (id: number) =>
    `/api/students/enrollments/${id}/soft-delete/`,
  BY_SECTION: "/api/students/enrollments/by-section/",
} as const;
export const ENROLLMENT_PERMISSIONS = {
  GET: "students.view_enrollment",
  CREATE: "students.create_enrollment",
  UPDATE: "students.update_enrollment",
  DELETE: "students.delete_enrollment",
} as const;
