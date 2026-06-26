export const SEVERITY_BASE_URL = "/api/behavior/severities/";

export const SEVERITY_ENDPOINTS = {
  LIST: SEVERITY_BASE_URL,
  CREATE: SEVERITY_BASE_URL,
  GET: (id: number) => `${SEVERITY_BASE_URL}${id}/`,
  UPDATE: (id: number) => `${SEVERITY_BASE_URL}${id}/`,
  SOFT_DELETE: (id: number) => `${SEVERITY_BASE_URL}${id}/soft-delete/`,
} as const;

export const SEVERITY_PERMISSIONS = {
  GET: "behavior.view_severity",
  CREATE: "behavior.create_severity",
  UPDATE: "behavior.update_severity",
  DELETE: "behavior.delete_severity",
} as const;
