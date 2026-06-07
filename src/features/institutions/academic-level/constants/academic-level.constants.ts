export const ACADEMIC_LEVEL_THUNK_PREFIX = "institutions";

export const ACADEMIC_LEVEL_ENDPOINTS = {
  LIST: "/api/institutions/academic-levels/",
} as const;

export const ACADEMIC_LEVEL_THUNKS = {
  FETCH: `${ACADEMIC_LEVEL_THUNK_PREFIX}/fetchAcademicLevels`,
  GET: `${ACADEMIC_LEVEL_THUNK_PREFIX}/fetchAcademicLevel`,
  CREATE: `${ACADEMIC_LEVEL_THUNK_PREFIX}/createAcademicLevel`,
  UPDATE: `${ACADEMIC_LEVEL_THUNK_PREFIX}/updateAcademicLevel`,
  DELETE: `${ACADEMIC_LEVEL_THUNK_PREFIX}/deleteAcademicLevel`,
};
