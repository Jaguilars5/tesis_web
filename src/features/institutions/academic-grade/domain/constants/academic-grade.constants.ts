export const ACADEMIC_GRADE_THUNK_PREFIX = "institutions";

export const ACADEMIC_GRADE_ENDPOINTS = {
  LIST: "/api/institutions/academic-grades/",
} as const;

export const ACADEMIC_GRADE_THUNKS = {
  FETCH: `${ACADEMIC_GRADE_THUNK_PREFIX}/fetchAcademicGrades`,
  GET: `${ACADEMIC_GRADE_THUNK_PREFIX}/fetchAcademicGrade`,
  CREATE: `${ACADEMIC_GRADE_THUNK_PREFIX}/createAcademicGrade`,
  UPDATE: `${ACADEMIC_GRADE_THUNK_PREFIX}/updateAcademicGrade`,
  DELETE: `${ACADEMIC_GRADE_THUNK_PREFIX}/deleteAcademicGrade`,
};
