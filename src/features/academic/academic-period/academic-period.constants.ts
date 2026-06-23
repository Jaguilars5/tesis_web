export const ACADEMIC_PERIOD_ENDPOINTS = {
  LIST: "/api/academic/academic-period/",
  DETAIL: (id: number) => `/api/academic/academic-period/${id}/`,
  SOFT_DELETE: (id: number) =>
    `/api/academic/academic-period/${id}/soft-delete/`,
} as const;

export const ACADEMIC_PERIOD_PERMISSIONS = {
  GET: "academic.view_period",
  CREATE: "academic.create_period",
  UPDATE: "academic.update_period",
  DELETE: "academic.delete_period",
} as const;
