export const PERIOD_TYPE_BASE_URL = "/api/academic/period-types/";

export const PERIOD_TYPE_ENDPOINTS = {
  GET: (id: number) => `${PERIOD_TYPE_BASE_URL}${id}/`,
  LIST: PERIOD_TYPE_BASE_URL,
  CREATE: PERIOD_TYPE_BASE_URL,
  UPDATE: (id: number) => `${PERIOD_TYPE_BASE_URL}${id}/`,
  SOFT_DELETE: (id: number) => `${PERIOD_TYPE_BASE_URL}${id}/soft-delete/`,
} as const;

export const PERIOD_TYPE_PERMISSIONS = {
  GET: "academic.view_period_type",
  CREATE: "academic.create_period_type",
  UPDATE: "academic.update_period_type",
  DELETE: "academic.delete_period_type",
} as const;
