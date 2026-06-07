export const SUBJECT_PROJECT_ENDPOINTS = {
  LIST: "/api/academic/subject-projects/",
} as const;

export const SUBJECT_PROJECT_THUNKS = {
  FETCH: "academic/fetchSubjectProjects",
  GET: "academic/fetchSubjectProject",
  CREATE: "academic/createSubjectProject",
  UPDATE: "academic/updateSubjectProject",
  DELETE: "academic/deleteSubjectProject",
};
