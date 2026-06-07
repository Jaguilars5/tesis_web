export const SUBJECT_OFFERING_THUNK_PREFIX = "academic";

export const SUBJECT_OFFERING_ENDPOINTS = {
  LIST: "/api/academic/subject-offerings/",
} as const;

export const SUBJECT_OFFERING_THUNKS = {
  FETCH: `${SUBJECT_OFFERING_THUNK_PREFIX}/fetchSubjectOfferings`,
  GET: `${SUBJECT_OFFERING_THUNK_PREFIX}/fetchSubjectOffering`,
  CREATE: `${SUBJECT_OFFERING_THUNK_PREFIX}/createSubjectOffering`,
  UPDATE: `${SUBJECT_OFFERING_THUNK_PREFIX}/updateSubjectOffering`,
  DELETE: `${SUBJECT_OFFERING_THUNK_PREFIX}/deleteSubjectOffering`,
};
