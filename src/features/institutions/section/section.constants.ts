export const SECTION_BASE_URL = "/api/institutions/section/";

export const SECTION_ENDPOINTS = {
  GET: (id: number) => `${SECTION_BASE_URL}${id}/`,
  LIST: SECTION_BASE_URL,
  CREATE: SECTION_BASE_URL,
  UPDATE: (id: number) => `${SECTION_BASE_URL}${id}/`,
  SOFT_DELETE: (id: number) => `${SECTION_BASE_URL}${id}/soft-delete/`,
} as const;

export const SECTION_PERMISSIONS = {
  GET: "institutions.view_section",
  CREATE: "institutions.create_section",
  UPDATE: "institutions.update_section",
  DELETE: "institutions.delete_section",
} as const;
