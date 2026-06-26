export const INCIDENT_TYPE_BASE_URL = "/api/behavior/incident-types/";

export const INCIDENT_TYPE_ENDPOINTS = {
  LIST: INCIDENT_TYPE_BASE_URL,
  CREATE: INCIDENT_TYPE_BASE_URL,
  GET: (id: number) => `${INCIDENT_TYPE_BASE_URL}${id}/`,
  UPDATE: (id: number) => `${INCIDENT_TYPE_BASE_URL}${id}/`,
  SOFT_DELETE: (id: number) => `${INCIDENT_TYPE_BASE_URL}${id}/soft-delete/`,
} as const;

export const INCIDENT_TYPE_PERMISSIONS = {
  GET: "behavior.view_incident_type",
  CREATE: "behavior.create_incident_type",
  UPDATE: "behavior.update_incident_type",
  DELETE: "behavior.delete_incident_type",
} as const;
