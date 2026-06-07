export const SUBJECT_ACADEMIC_CONFIG_ENDPOINTS = {
  LIST: "/api/academic/subject-academic-configs/",
} as const;

export const SUBJECT_ACADEMIC_CONFIG_THUNKS = {
  FETCH: "academic/fetchSubjectAcademicConfigs",
  GET: "academic/fetchSubjectAcademicConfig",
  CREATE: "academic/createSubjectAcademicConfig",
  UPDATE: "academic/updateSubjectAcademicConfig",
  DELETE: "academic/deleteSubjectAcademicConfig",
} as const;
