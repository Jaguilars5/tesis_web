export const COMPONENT_INDICATORS_THUNK_PREFIX = "grading";
export const COMPONENT_INDICATORS_ENDPOINTS = { LIST: "/api/grading/component-indicators/" } as const;
export const COMPONENT_INDICATORS_THUNKS = {
  FETCH: `${COMPONENT_INDICATORS_THUNK_PREFIX}/fetchComponentIndicators`,
  GET: `${COMPONENT_INDICATORS_THUNK_PREFIX}/fetchComponentIndicator`,
  CREATE: `${COMPONENT_INDICATORS_THUNK_PREFIX}/createComponentIndicator`,
  UPDATE: `${COMPONENT_INDICATORS_THUNK_PREFIX}/updateComponentIndicator`,
  DELETE: `${COMPONENT_INDICATORS_THUNK_PREFIX}/deleteComponentIndicator`,
};
