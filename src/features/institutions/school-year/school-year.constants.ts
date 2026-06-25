const SCHOOL_YEAR_BASE_URL = "/api/institutions/school-year/";

export const SCHOOL_YEAR_ENDPOINTS = {
  GET: (id: number) => `${SCHOOL_YEAR_BASE_URL}${id}/`,
  LIST: SCHOOL_YEAR_BASE_URL,
  CREATE: SCHOOL_YEAR_BASE_URL,
  UPDATE: (id: number) => `${SCHOOL_YEAR_BASE_URL}${id}/`,
  SOFT_DELETE: (id: number) => `${SCHOOL_YEAR_BASE_URL}${id}/soft-delete/`,
} as const;

export const SCHOOL_YEAR_PERMISSIONS = {
  GET: "institutions.view_school_year",
  CREATE: "institutions.create_school_year",
  UPDATE: "institutions.update_school_year",
  DELETE: "institutions.delete_school_year",
} as const;
