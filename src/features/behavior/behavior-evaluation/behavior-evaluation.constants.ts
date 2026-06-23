export const BEHAVIOR_EVALUATION_ENDPOINTS = {
  LIST: "/api/behavior/behavior-evaluations/",
  DETAIL: (id: number) => `/api/behavior/behavior-evaluations/${id}/`,
  CALCULATE: "/api/behavior/behavior-evaluations/calculate/",
  RELATED_INCIDENTS: (id: number) => `/api/behavior/behavior-evaluations/${id}/related_incidents/`,
} as const;

export const BEHAVIOR_EVALUATION_PERMISSIONS = {
  GET: "behavior.view_behavior_evaluation",
  CREATE: "behavior.create_behavior_evaluation",
  UPDATE: "behavior.update_behavior_evaluation",
  DELETE: "behavior.delete_behavior_evaluation",
} as const;
