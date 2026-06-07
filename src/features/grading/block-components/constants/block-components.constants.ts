export const BLOCK_COMPONENTS_THUNK_PREFIX = "grading";
export const BLOCK_COMPONENTS_ENDPOINTS = { LIST: "/api/grading/block-components/" } as const;
export const BLOCK_COMPONENTS_THUNKS = {
  FETCH: `${BLOCK_COMPONENTS_THUNK_PREFIX}/fetchBlockComponents`,
  GET: `${BLOCK_COMPONENTS_THUNK_PREFIX}/fetchBlockComponent`,
  CREATE: `${BLOCK_COMPONENTS_THUNK_PREFIX}/createBlockComponent`,
  UPDATE: `${BLOCK_COMPONENTS_THUNK_PREFIX}/updateBlockComponent`,
  DELETE: `${BLOCK_COMPONENTS_THUNK_PREFIX}/deleteBlockComponent`,
};
