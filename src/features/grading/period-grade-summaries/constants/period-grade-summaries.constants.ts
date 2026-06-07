export const PERIOD_GRADE_SUMMARIES_THUNK_PREFIX = "grading";

export const PERIOD_GRADE_SUMMARIES_ENDPOINTS = {
  LIST: "/api/grading/period-grade-summaries/",
} as const;

export const PERIOD_GRADE_SUMMARIES_THUNKS = {
  FETCH: `${PERIOD_GRADE_SUMMARIES_THUNK_PREFIX}/fetchPeriodGradeSummaries`,
  GET: `${PERIOD_GRADE_SUMMARIES_THUNK_PREFIX}/fetchPeriodGradeSummary`,
  CREATE: `${PERIOD_GRADE_SUMMARIES_THUNK_PREFIX}/createPeriodGradeSummary`,
  UPDATE: `${PERIOD_GRADE_SUMMARIES_THUNK_PREFIX}/updatePeriodGradeSummary`,
  DELETE: `${PERIOD_GRADE_SUMMARIES_THUNK_PREFIX}/deletePeriodGradeSummary`,
};
