export const INTERDISCIPLINARY_PROJECT_THUNK_PREFIX = "academic";

export const INTERDISCIPLINARY_PROJECT_ENDPOINTS = {
  LIST: "/api/academic/interdisciplinary-projects/",
} as const;

export const INTERDISCIPLINARY_PROJECT_THUNKS = {
  FETCH: `${INTERDISCIPLINARY_PROJECT_THUNK_PREFIX}/fetchInterdisciplinaryProjects`,
  GET: `${INTERDISCIPLINARY_PROJECT_THUNK_PREFIX}/fetchInterdisciplinaryProject`,
  CREATE: `${INTERDISCIPLINARY_PROJECT_THUNK_PREFIX}/createInterdisciplinaryProject`,
  UPDATE: `${INTERDISCIPLINARY_PROJECT_THUNK_PREFIX}/updateInterdisciplinaryProject`,
  DELETE: `${INTERDISCIPLINARY_PROJECT_THUNK_PREFIX}/deleteInterdisciplinaryProject`,
};
