export const ACADEMIC_LEVEL_BASE_URL = "/api/institutions/academic-levels/";

export const ACADEMIC_LEVEL_ENDPOINTS = {
  GET: (id: number) => `${ACADEMIC_LEVEL_BASE_URL}${id}/`,
  LIST: ACADEMIC_LEVEL_BASE_URL,
  CREATE: ACADEMIC_LEVEL_BASE_URL,
  UPDATE: (id: number) => `${ACADEMIC_LEVEL_BASE_URL}${id}/`,
  SOFT_DELETE: (id: number) => `${ACADEMIC_LEVEL_BASE_URL}${id}/soft-delete/`,
} as const;

export const ACADEMIC_LEVEL_PERMISSIONS = {
  GET: "institutions.view_academic_level",
  CREATE: "institutions.create_academic_level",
  UPDATE: "institutions.update_academic_level",
  DELETE: "institutions.delete_academic_level",
} as const;
