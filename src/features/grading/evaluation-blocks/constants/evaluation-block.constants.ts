export const EVALUATION_BLOCKS_THUNK_PREFIX = "grading";

export const EVALUATION_BLOCKS_ENDPOINTS = {
  LIST: "/api/grading/evaluation-blocks/list/",
  GET: "/api/grading/evaluation-blocks/get/",
  ADD: "/api/grading/evaluation-blocks/add/",
  UPDATE: "/api/grading/evaluation-blocks/update/",
  DELETE: "/api/grading/evaluation-blocks/delete/",
} as const;

export const EVALUATION_BLOCKS_THUNKS = {
  FETCH: `${EVALUATION_BLOCKS_THUNK_PREFIX}/fetchEvaluationBlocks`,
  GET: `${EVALUATION_BLOCKS_THUNK_PREFIX}/fetchEvaluationBlock`,
  CREATE: `${EVALUATION_BLOCKS_THUNK_PREFIX}/createEvaluationBlock`,
  UPDATE: `${EVALUATION_BLOCKS_THUNK_PREFIX}/updateEvaluationBlock`,
  DELETE: `${EVALUATION_BLOCKS_THUNK_PREFIX}/deleteEvaluationBlock`,
};
