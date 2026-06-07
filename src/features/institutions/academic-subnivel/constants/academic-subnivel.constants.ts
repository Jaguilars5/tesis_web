export const ACADEMIC_SUBNIVEL_THUNK_PREFIX = "institutions";

export const ACADEMIC_SUBNIVEL_ENDPOINTS = {
  LIST: "/api/institutions/academic-subnivel/",
} as const;

export const ACADEMIC_SUBNIVEL_THUNKS = {
  FETCH: `${ACADEMIC_SUBNIVEL_THUNK_PREFIX}/fetchAcademicSubnivels`,
  GET: `${ACADEMIC_SUBNIVEL_THUNK_PREFIX}/fetchAcademicSubnivel`,
  CREATE: `${ACADEMIC_SUBNIVEL_THUNK_PREFIX}/createAcademicSubnivel`,
  UPDATE: `${ACADEMIC_SUBNIVEL_THUNK_PREFIX}/updateAcademicSubnivel`,
  DELETE: `${ACADEMIC_SUBNIVEL_THUNK_PREFIX}/deleteAcademicSubnivel`,
};
