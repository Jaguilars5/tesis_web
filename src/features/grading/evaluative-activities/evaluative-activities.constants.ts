export const EVALUATIVE_ACTIVITY_BASE_URL = "/api/grading/evaluative-activities/";

export const EVALUATIVE_ACTIVITY_ENDPOINTS = {
  LIST: EVALUATIVE_ACTIVITY_BASE_URL,
  CREATE: EVALUATIVE_ACTIVITY_BASE_URL,
  GET: (id: number) => `${EVALUATIVE_ACTIVITY_BASE_URL}${id}/`,
  UPDATE: (id: number) => `${EVALUATIVE_ACTIVITY_BASE_URL}${id}/`,
  SOFT_DELETE: (id: number) => `${EVALUATIVE_ACTIVITY_BASE_URL}${id}/soft-delete/`,
} as const;

export const EVALUATIVE_ACTIVITY_PERMISSIONS = {
  GET: "grading.view_evaluative_activity",
  CREATE: "grading.create_evaluative_activity",
  UPDATE: "grading.update_evaluative_activity",
  DELETE: "grading.delete_evaluative_activity",
} as const;
