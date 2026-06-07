export const SUBJECT_ENDPOINTS = {
  LIST: "/api/academic/subject/",
} as const;

export const SUBJECT_THUNKS = {
  FETCH: "academic/fetchSubjects",
  GET: "academic/fetchSubject",
  CREATE: "academic/createSubject",
  UPDATE: "academic/updateSubject",
  DELETE: "academic/deleteSubject",
};
