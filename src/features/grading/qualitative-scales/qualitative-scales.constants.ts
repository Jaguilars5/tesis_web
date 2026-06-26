export const QUALITATIVE_SCALES_BASE_URL = "/api/grading/qualitative-scales/";

export const QUALITATIVE_SCALES_ENDPOINTS = {
  LIST: QUALITATIVE_SCALES_BASE_URL,
  CREATE: QUALITATIVE_SCALES_BASE_URL,
  GET: (id: number) => `${QUALITATIVE_SCALES_BASE_URL}${id}/`,
  UPDATE: (id: number) => `${QUALITATIVE_SCALES_BASE_URL}${id}/`,
  SOFT_DELETE: (id: number) => `${QUALITATIVE_SCALES_BASE_URL}${id}/soft-delete/`,
} as const;

export const QUALITATIVE_SCALES_PERMISSIONS = {
  GET: "grading.view_qualitative_scale",
  CREATE: "grading.create_qualitative_scale",
  UPDATE: "grading.update_qualitative_scale",
  DELETE: "grading.delete_qualitative_scale",
} as const;
