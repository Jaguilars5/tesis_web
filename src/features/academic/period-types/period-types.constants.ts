export const PERIOD_TYPE_ENDPOINTS = {
  LIST: "/api/academic/period-types/",
  DETAIL: (id: number) => `/api/academic/period-types/${id}/`,
  SOFT_DELETE: (id: number) =>
    `/api/academic/period-types/${id}/soft-delete/`,
} as const;

export const PERIOD_TYPE_PERMISSIONS = {
  GET: "academic.view_period_type",
  CREATE: "academic.create_period_type",
  UPDATE: "academic.update_period_type",
  DELETE: "academic.delete_period_type",
} as const;
