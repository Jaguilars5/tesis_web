export const SCHOOL_YEAR_THUNK_PREFIX = "institutions";

export const SCHOOL_YEAR_ENDPOINTS = {
  LIST: "/api/institutions/school-year/",
} as const;

export const SCHOOL_YEAR_THUNKS = {
  FETCH: `${SCHOOL_YEAR_THUNK_PREFIX}/fetchSchoolYears`,
  GET: `${SCHOOL_YEAR_THUNK_PREFIX}/fetchSchoolYear`,
  CREATE: `${SCHOOL_YEAR_THUNK_PREFIX}/createSchoolYear`,
  UPDATE: `${SCHOOL_YEAR_THUNK_PREFIX}/updateSchoolYear`,
  DELETE: `${SCHOOL_YEAR_THUNK_PREFIX}/deleteSchoolYear`,
};
