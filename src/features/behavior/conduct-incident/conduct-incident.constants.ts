export const CONDUCT_INCIDENT_BASE_URL = "/api/behavior/conduct-incidents/";

export const CONDUCT_INCIDENT_ENDPOINTS = {
  LIST: CONDUCT_INCIDENT_BASE_URL,
  CREATE: CONDUCT_INCIDENT_BASE_URL,
  GET: (id: number) => `${CONDUCT_INCIDENT_BASE_URL}${id}/`,
  UPDATE: (id: number) => `${CONDUCT_INCIDENT_BASE_URL}${id}/`,
  SOFT_DELETE: (id: number) => `${CONDUCT_INCIDENT_BASE_URL}${id}/soft-delete/`,
} as const;

export const CONDUCT_INCIDENT_PERMISSIONS = {
  GET: "behavior.view_conduct_incident",
  CREATE: "behavior.create_conduct_incident",
  UPDATE: "behavior.update_conduct_incident",
  DELETE: "behavior.delete_conduct_incident",
} as const;
