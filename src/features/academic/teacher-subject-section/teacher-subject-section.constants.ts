export const TEACHER_SUBJECT_SECTION_BASE_URL = "/api/academic/teacher-subject-sections/";

export const TEACHER_SUBJECT_SECTION_ENDPOINTS = {
  LIST: TEACHER_SUBJECT_SECTION_BASE_URL,
  CREATE: TEACHER_SUBJECT_SECTION_BASE_URL,
  GET: (id: number) => `${TEACHER_SUBJECT_SECTION_BASE_URL}${id}/`,
  UPDATE: (id: number) => `${TEACHER_SUBJECT_SECTION_BASE_URL}${id}/`,
  SOFT_DELETE: (id: number) =>
    `${TEACHER_SUBJECT_SECTION_BASE_URL}${id}/soft-delete/`,
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
