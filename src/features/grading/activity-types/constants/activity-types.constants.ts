export const ACTIVITY_TYPES_THUNK_PREFIX = "grading";
export const ACTIVITY_TYPES_ENDPOINTS = { LIST: "/api/grading/activity-types/" } as const;
export const ACTIVITY_TYPES_THUNKS = {
  FETCH: `${ACTIVITY_TYPES_THUNK_PREFIX}/fetchActivityTypes`,
  GET: `${ACTIVITY_TYPES_THUNK_PREFIX}/fetchActivityType`,
  CREATE: `${ACTIVITY_TYPES_THUNK_PREFIX}/createActivityType`,
  UPDATE: `${ACTIVITY_TYPES_THUNK_PREFIX}/updateActivityType`,
  DELETE: `${ACTIVITY_TYPES_THUNK_PREFIX}/deleteActivityType`,
};
