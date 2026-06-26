export const PERIOD_GRADE_SUMMARIES_BASE_URL = "/api/grading/period-grade-summaries/";

export const PERIOD_GRADE_SUMMARIES_ENDPOINTS = {
  LIST: PERIOD_GRADE_SUMMARIES_BASE_URL,
  CREATE: PERIOD_GRADE_SUMMARIES_BASE_URL,
  GET: (id: number) => `${PERIOD_GRADE_SUMMARIES_BASE_URL}${id}/`,
  UPDATE: (id: number) => `${PERIOD_GRADE_SUMMARIES_BASE_URL}${id}/`,
  SOFT_DELETE: (id: number) => `${PERIOD_GRADE_SUMMARIES_BASE_URL}${id}/soft-delete/`,
} as const;

export const PERIOD_GRADE_SUMMARIES_PERMISSIONS = {
  GET: "grading.view_grade_summary",
  CREATE: "grading.create_grade_summary",
  UPDATE: "grading.update_grade_summary",
  DELETE: "grading.delete_grade_summary",
} as const;
