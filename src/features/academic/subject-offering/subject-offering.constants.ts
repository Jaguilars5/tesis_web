export const SUBJECT_OFFERING_ENDPOINTS = {
  LIST: "/api/academic/subject-offerings/",
  DETAIL: (id: number) => `/api/academic/subject-offerings/${id}/`,
  SOFT_DELETE: (id: number) => `/api/academic/subject-offerings/${id}/soft-delete/`,
} as const;

export const SUBJECT_OFFERING_PERMISSIONS = {
  GET: "academic.view_subject_offering",
  CREATE: "academic.create_subject_offering",
  UPDATE: "academic.update_subject_offering",
  DELETE: "academic.delete_subject_offering",
} as const;
