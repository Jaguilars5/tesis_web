export const EVALUATION_TYPES_THUNK_PREFIX = "grading";
export const EVALUATION_TYPES_ENDPOINTS = { LIST: "/api/grading/evaluation-types/" } as const;
export const EVALUATION_TYPES_THUNKS = {
  FETCH: `${EVALUATION_TYPES_THUNK_PREFIX}/fetchEvaluationTypes`,
  GET: `${EVALUATION_TYPES_THUNK_PREFIX}/fetchEvaluationType`,
  CREATE: `${EVALUATION_TYPES_THUNK_PREFIX}/createEvaluationType`,
  UPDATE: `${EVALUATION_TYPES_THUNK_PREFIX}/updateEvaluationType`,
  DELETE: `${EVALUATION_TYPES_THUNK_PREFIX}/deleteEvaluationType`,
};
