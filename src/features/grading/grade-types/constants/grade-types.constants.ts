export const GRADE_TYPES_THUNK_PREFIX = "grading";
export const GRADE_TYPES_ENDPOINTS = { LIST: "/api/grading/grade-types/" } as const;
export const GRADE_TYPES_THUNKS = {
  FETCH: `${GRADE_TYPES_THUNK_PREFIX}/fetchGradeTypes`,
  GET: `${GRADE_TYPES_THUNK_PREFIX}/fetchGradeType`,
  CREATE: `${GRADE_TYPES_THUNK_PREFIX}/createGradeType`,
  UPDATE: `${GRADE_TYPES_THUNK_PREFIX}/updateGradeType`,
  DELETE: `${GRADE_TYPES_THUNK_PREFIX}/deleteGradeType`,
};
