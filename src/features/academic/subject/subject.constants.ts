export const SUBJECT_BASE_URL = "/api/academic/subjects/";

export const SUBJECT_ENDPOINTS = {
  GET: (id: number) => `${SUBJECT_BASE_URL}${id}/`,
  LIST: SUBJECT_BASE_URL,
  CREATE: SUBJECT_BASE_URL,
  UPDATE: (id: number) => `${SUBJECT_BASE_URL}${id}/`,
  SOFT_DELETE: (id: number) => `${SUBJECT_BASE_URL}${id}/soft-delete/`,
} as const;

export const SUBJECT_PERMISSIONS = {
  GET: "academic.view_subject",
  CREATE: "academic.create_subject",
  UPDATE: "academic.update_subject",
  DELETE: "academic.delete_subject",
} as const;
