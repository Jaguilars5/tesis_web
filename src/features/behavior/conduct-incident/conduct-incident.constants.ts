export const CONDUCT_INCIDENT_ENDPOINTS = {
  LIST: "/api/behavior/conduct-incidents/",
  DETAIL: (id: number) => `/api/behavior/conduct-incidents/${id}/`,
} as const;

export const CONDUCT_INCIDENT_PERMISSIONS = {
  GET: "behavior.view_conduct_incident",
  CREATE: "behavior.create_conduct_incident",
  UPDATE: "behavior.update_conduct_incident",
  DELETE: "behavior.delete_conduct_incident",
} as const;
