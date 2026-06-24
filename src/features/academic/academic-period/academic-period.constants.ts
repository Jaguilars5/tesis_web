export const ACADEMIC_PERIOD_ENDPOINTS = {
  GET: (id: number) => `/api/academic/academic-periods/${id}/`,
  LIST: "/api/academic/academic-periods/",
  POST: "/api/academic/academic-periods/",
  PATCH: (id: number) => `/api/academic/academic-periods/${id}/`,
  SOFT_DELETE: (id: number) =>
    `/api/academic/academic-periods/${id}/soft-delete/`,
} as const;

export const ACADEMIC_PERIOD_PERMISSIONS = {
  GET: "academic.view_period",
  CREATE: "academic.create_period",
  UPDATE: "academic.update_period",
  DELETE: "academic.delete_period",
} as const;
