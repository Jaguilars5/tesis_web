export const GRADE_HISTORY_THUNK_PREFIX = "grading";
export const GRADE_HISTORY_ENDPOINTS = { LIST: "/api/grading/grade-history/" } as const;
export const GRADE_HISTORY_THUNKS = {
  FETCH: `${GRADE_HISTORY_THUNK_PREFIX}/fetchGradeHistory`,
  GET: `${GRADE_HISTORY_THUNK_PREFIX}/fetchGradeHistoryItem`,
};
