export const ACADEMIC_PERIOD_ENDPOINTS = {
  LIST: "/api/academic/academic-period/",
} as const;

export const ACADEMIC_PERIOD_THUNKS = {
  FETCH: "academic/fetchAcademicPeriods",
  GET: "academic/fetchAcademicPeriod",
  CREATE: "academic/createAcademicPeriod",
  UPDATE: "academic/updateAcademicPeriod",
  DELETE: "academic/deleteAcademicPeriod",
};

export const ACADEMIC_PERIOD_TYPE_OPTIONS = [
  { label: "Regular", value: "REGULAR" },
  { label: "Supletorio", value: "SUPLETORIO" },
  { label: "Refuerzo", value: "REFUERZO" },
] as const;
