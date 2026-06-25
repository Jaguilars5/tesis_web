export const ACADEMIC_GRADE_BASE_URL = "/api/institutions/academic-grades/";

export const ACADEMIC_GRADE_ENDPOINTS = {
  GET: (id: number) => `${ACADEMIC_GRADE_BASE_URL}${id}/`,
  LIST: ACADEMIC_GRADE_BASE_URL,
  CREATE: ACADEMIC_GRADE_BASE_URL,
  UPDATE: (id: number) => `${ACADEMIC_GRADE_BASE_URL}${id}/`,
  SOFT_DELETE: (id: number) => `${ACADEMIC_GRADE_BASE_URL}${id}/soft-delete/`,
} as const;

export const ACADEMIC_GRADE_PERMISSIONS = {
  GET: "institutions.view_academic_grade",
  CREATE: "institutions.create_academic_grade",
  UPDATE: "institutions.update_academic_grade",
  DELETE: "institutions.delete_academic_grade",
} as const;
