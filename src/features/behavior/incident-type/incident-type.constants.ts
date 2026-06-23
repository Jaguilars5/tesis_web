export const INCIDENT_TYPE_ENDPOINTS = {
  LIST: "/api/behavior/incident-types/",
  DETAIL: (id: number) => `/api/behavior/incident-types/${id}/`,
  SOFT_DELETE: (id: number) => `/api/behavior/incident-types/${id}/soft-delete/`,
} as const;
export const INCIDENT_TYPE_PERMISSIONS = {
  GET: "behavior.view_incident_type", CREATE: "behavior.create_incident_type", UPDATE: "behavior.update_incident_type", DELETE: "behavior.delete_incident_type",
} as const;
