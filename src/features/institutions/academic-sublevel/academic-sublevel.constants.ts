export const ACADEMIC_SUBLEVEL_BASE_URL = "/api/institutions/academic-sublevel/";

export const ACADEMIC_SUBLEVEL_ENDPOINTS = {
  GET: (id: number) => `${ACADEMIC_SUBLEVEL_BASE_URL}${id}/`,
  LIST: ACADEMIC_SUBLEVEL_BASE_URL,
  CREATE: ACADEMIC_SUBLEVEL_BASE_URL,
  UPDATE: (id: number) => `${ACADEMIC_SUBLEVEL_BASE_URL}${id}/`,
  SOFT_DELETE: (id: number) =>
    `${ACADEMIC_SUBLEVEL_BASE_URL}${id}/soft-delete/`,
} as const;
export const ACADEMIC_SUBLEVEL_PERMISSIONS = {
  GET: "institutions.view_academic_sublevel",
  CREATE: "institutions.create_academic_sublevel",
  UPDATE: "institutions.update_academic_sublevel",
  DELETE: "institutions.delete_academic_sublevel",
} as const;
