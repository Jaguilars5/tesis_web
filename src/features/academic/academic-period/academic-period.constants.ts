export const ACADEMIC_PERIOD_BASE_URL = "/api/academic/academic-periods/";

export const ACADEMIC_PERIOD_ENDPOINTS = {
  GET: (id: number) => `${ACADEMIC_PERIOD_BASE_URL}${id}/`,
  LIST: ACADEMIC_PERIOD_BASE_URL,
  CREATE: ACADEMIC_PERIOD_BASE_URL,
  UPDATE: (id: number) => `${ACADEMIC_PERIOD_BASE_URL}${id}/`,
  SOFT_DELETE: (id: number) => `${ACADEMIC_PERIOD_BASE_URL}${id}/soft-delete/`,
  BULK_CREATE: `${ACADEMIC_PERIOD_BASE_URL}bulk/`,
} as const;

export const ACADEMIC_PERIOD_PERMISSIONS = {
  GET: "academic.view_period",
  CREATE: "academic.create_period",
  UPDATE: "academic.update_period",
  DELETE: "academic.delete_period",
} as const;
