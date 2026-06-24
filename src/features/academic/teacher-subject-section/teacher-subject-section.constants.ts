export const TEACHER_SUBJECT_SECTION_ENDPOINTS = {
  LIST: "/api/academic/teacher-subject-sections/",
  DETAIL: (id: number) => `/api/academic/teacher-subject-sections/${id}/`,
  SOFT_DELETE: (id: number) =>
    `/api/academic/teacher-subject-sections/${id}/soft-delete/`,
} as const;

export const TEACHER_ENDPOINTS = {
  LIST: "/api/iam/users/teachers/",
} as const;

export const TEACHER_SUBJECT_SECTION_PERMISSIONS = {
  GET: "academic.view_teacher_subject",
  CREATE: "academic.create_teacher_subject",
  UPDATE: "academic.update_teacher_subject",
  DELETE: "academic.delete_teacher_subject",
} as const;
