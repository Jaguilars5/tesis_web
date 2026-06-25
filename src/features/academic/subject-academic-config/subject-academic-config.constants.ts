export const SUBJECT_ACADEMIC_CONFIG_BASE_URL =
  "/api/academic/subject-academic-configs/";

export const SUBJECT_ACADEMIC_CONFIG_ENDPOINTS = {
  GET: (id: number) => `${SUBJECT_ACADEMIC_CONFIG_BASE_URL}${id}/`,
  LIST: SUBJECT_ACADEMIC_CONFIG_BASE_URL,
  CREATE: SUBJECT_ACADEMIC_CONFIG_BASE_URL,
  UPDATE: (id: number) => `${SUBJECT_ACADEMIC_CONFIG_BASE_URL}${id}/`,
  SOFT_DELETE: (id: number) =>
    `${SUBJECT_ACADEMIC_CONFIG_BASE_URL}${id}/soft-delete/`,
} as const;

export const SUBJECT_ACADEMIC_CONFIG_PERMISSIONS = {
  GET: "academic.view_subject_config",
  CREATE: "academic.create_subject_config",
  UPDATE: "academic.update_subject_config",
  DELETE: "academic.delete_subject_config",
} as const;
