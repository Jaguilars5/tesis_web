export const QUALITATIVE_SCALES_THUNK_PREFIX = "grading";
export const QUALITATIVE_SCALES_ENDPOINTS = { LIST: "/api/grading/qualitative-scales/" } as const;
export const QUALITATIVE_SCALES_THUNKS = {
  FETCH: `${QUALITATIVE_SCALES_THUNK_PREFIX}/fetchQualitativeScales`,
  GET: `${QUALITATIVE_SCALES_THUNK_PREFIX}/fetchQualitativeScale`,
  CREATE: `${QUALITATIVE_SCALES_THUNK_PREFIX}/createQualitativeScale`,
  UPDATE: `${QUALITATIVE_SCALES_THUNK_PREFIX}/updateQualitativeScale`,
  DELETE: `${QUALITATIVE_SCALES_THUNK_PREFIX}/deleteQualitativeScale`,
};
