export const BLOCK_COMPONENTS_BASE_URL = "/api/grading/block-components/";

export const BLOCK_COMPONENTS_ENDPOINTS = {
  LIST: BLOCK_COMPONENTS_BASE_URL,
  CREATE: BLOCK_COMPONENTS_BASE_URL,
  GET: (id: number) => `${BLOCK_COMPONENTS_BASE_URL}${id}/`,
  UPDATE: (id: number) => `${BLOCK_COMPONENTS_BASE_URL}${id}/`,
  SOFT_DELETE: (id: number) => `${BLOCK_COMPONENTS_BASE_URL}${id}/soft-delete/`,
} as const;

export const BLOCK_COMPONENTS_PERMISSIONS = {
  GET: "grading.view_block_component",
  CREATE: "grading.create_block_component",
  UPDATE: "grading.update_block_component",
  DELETE: "grading.delete_block_component",
} as const;
