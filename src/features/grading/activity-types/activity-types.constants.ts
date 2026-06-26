export const ACTIVITY_TYPES_BASE_URL = "/api/grading/activity-types/";

export const ACTIVITY_TYPES_ENDPOINTS = {
  LIST: ACTIVITY_TYPES_BASE_URL,
  CREATE: ACTIVITY_TYPES_BASE_URL,
  GET: (id: number) => `${ACTIVITY_TYPES_BASE_URL}${id}/`,
  UPDATE: (id: number) => `${ACTIVITY_TYPES_BASE_URL}${id}/`,
  SOFT_DELETE: (id: number) => `${ACTIVITY_TYPES_BASE_URL}${id}/soft-delete/`,
} as const;

export const ACTIVITY_TYPES_PERMISSIONS = {
  GET: "grading.view_activity_type",
  CREATE: "grading.create_activity_type",
  UPDATE: "grading.update_activity_type",
  DELETE: "grading.delete_activity_type",
} as const;
