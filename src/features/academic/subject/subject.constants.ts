export const SUBJECT_ENDPOINTS = {
  LIST: "/api/academic/subject/",
  DETAIL: (id: number) => `/api/academic/subject/${id}/`,
  SOFT_DELETE: (id: number) => `/api/academic/subject/${id}/soft-delete/`,
} as const;

export const SUBJECT_PERMISSIONS = {
  GET: "academic.view_subject",
  CREATE: "academic.create_subject",
  UPDATE: "academic.update_subject",
  DELETE: "academic.delete_subject",
} as const;
