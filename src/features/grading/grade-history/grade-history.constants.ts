export const GRADE_HISTORY_BASE_URL = "/api/grading/grade-history/";

export const GRADE_HISTORY_ENDPOINTS = {
  LIST: GRADE_HISTORY_BASE_URL,
  GET: (id: number) => `${GRADE_HISTORY_BASE_URL}${id}/`,
} as const;

export const GRADE_HISTORY_PERMISSIONS = {
  GET: "grading.view_grade_history",
} as const;
