export const PERIOD_TYPE_THUNK_PREFIX = "academic";
export const PERIOD_TYPE_ENDPOINTS = { LIST: "/api/academic/period-types/" } as const;
export const PERIOD_TYPE_THUNKS = {
  FETCH: `${PERIOD_TYPE_THUNK_PREFIX}/fetchPeriodTypes`,
  GET: `${PERIOD_TYPE_THUNK_PREFIX}/fetchPeriodType`,
  CREATE: `${PERIOD_TYPE_THUNK_PREFIX}/createPeriodType`,
  UPDATE: `${PERIOD_TYPE_THUNK_PREFIX}/updatePeriodType`,
  DELETE: `${PERIOD_TYPE_THUNK_PREFIX}/deletePeriodType`,
};
