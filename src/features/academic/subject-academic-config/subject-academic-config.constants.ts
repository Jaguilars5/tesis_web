export const SUBJECT_ACADEMIC_CONFIG_ENDPOINTS = {
  LIST: "/api/academic/subject-academic-configs/",
  DETAIL: (id: number) => `/api/academic/subject-academic-configs/${id}/`,
  SOFT_DELETE: (id: number) => `/api/academic/subject-academic-configs/${id}/soft-delete/`,
} as const;

export const SUBJECT_ACADEMIC_CONFIG_PERMISSIONS = {
  GET: "academic.view_subject_config",
  CREATE: "academic.create_subject_config",
  UPDATE: "academic.update_subject_config",
  DELETE: "academic.delete_subject_config",
} as const;
