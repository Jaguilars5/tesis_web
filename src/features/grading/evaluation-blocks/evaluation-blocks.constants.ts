export const EVALUATION_BLOCKS_BASE_URL = "/api/grading/evaluation-blocks/";

export const EVALUATION_BLOCKS_ENDPOINTS = {
  LIST: EVALUATION_BLOCKS_BASE_URL,
  CREATE: EVALUATION_BLOCKS_BASE_URL,
  GET: (id: number) => `${EVALUATION_BLOCKS_BASE_URL}${id}/`,
  UPDATE: (id: number) => `${EVALUATION_BLOCKS_BASE_URL}${id}/`,
  SOFT_DELETE: (id: number) => `${EVALUATION_BLOCKS_BASE_URL}${id}/soft-delete/`,
} as const;

export const EVALUATION_BLOCKS_PERMISSIONS = {
  GET: "grading.view_evaluation_block",
  CREATE: "grading.create_evaluation_block",
  UPDATE: "grading.update_evaluation_block",
  DELETE: "grading.delete_evaluation_block",
} as const;
