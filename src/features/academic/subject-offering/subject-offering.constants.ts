export const SUBJECT_OFFERING_BASE_URL = "/api/academic/subject-offerings/";

export const SUBJECT_OFFERING_ENDPOINTS = {
  GET: (id: number) => `${SUBJECT_OFFERING_BASE_URL}${id}/`,
  LIST: SUBJECT_OFFERING_BASE_URL,
  CREATE: SUBJECT_OFFERING_BASE_URL,
  UPDATE: (id: number) => `${SUBJECT_OFFERING_BASE_URL}${id}/`,
  SOFT_DELETE: (id: number) => `${SUBJECT_OFFERING_BASE_URL}${id}/soft-delete/`,
} as const;

export const SUBJECT_OFFERING_PERMISSIONS = {
  GET: "academic.view_subject_offering",
  CREATE: "academic.create_subject_offering",
  UPDATE: "academic.update_subject_offering",
  DELETE: "academic.delete_subject_offering",
} as const;
