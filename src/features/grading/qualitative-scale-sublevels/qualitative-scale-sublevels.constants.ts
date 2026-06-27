export const QUALITATIVE_SCALE_SUBLEVEL_BASE_URL = "/api/grading/qualitative-scale-sublevels/";

export const QUALITATIVE_SCALE_SUBLEVEL_ENDPOINTS = {
  LIST: QUALITATIVE_SCALE_SUBLEVEL_BASE_URL,
  CREATE: QUALITATIVE_SCALE_SUBLEVEL_BASE_URL,
  GET: (id: number) => `${QUALITATIVE_SCALE_SUBLEVEL_BASE_URL}${id}/`,
  UPDATE: (id: number) => `${QUALITATIVE_SCALE_SUBLEVEL_BASE_URL}${id}/`,
  SOFT_DELETE: (id: number) => `${QUALITATIVE_SCALE_SUBLEVEL_BASE_URL}${id}/soft-delete/`,
} as const;

export const QUALITATIVE_SCALE_SUBLEVEL_PERMISSIONS = {
  GET: "grading.view_qualitative_scale",
  CREATE: "grading.create_qualitative_scale",
  UPDATE: "grading.update_qualitative_scale",
  DELETE: "grading.delete_qualitative_scale",
} as const;
