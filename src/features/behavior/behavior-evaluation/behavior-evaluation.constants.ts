export const BEHAVIOR_EVALUATION_BASE_URL = "/api/behavior/behavior-evaluations/";

export const BEHAVIOR_EVALUATION_ENDPOINTS = {
  LIST: BEHAVIOR_EVALUATION_BASE_URL,
  GET: (id: number) => `${BEHAVIOR_EVALUATION_BASE_URL}${id}/`,
  UPDATE: (id: number) => `${BEHAVIOR_EVALUATION_BASE_URL}${id}/`,
  CALCULATE: `${BEHAVIOR_EVALUATION_BASE_URL}calculate/`,
  RELATED_INCIDENTS: (id: number) => `${BEHAVIOR_EVALUATION_BASE_URL}${id}/related_incidents/`,
} as const;

export const BEHAVIOR_EVALUATION_PERMISSIONS = {
  GET: "behavior.view_behavior_evaluation",
  CREATE: "behavior.create_behavior_evaluation",
  UPDATE: "behavior.update_behavior_evaluation",
  DELETE: "behavior.delete_behavior_evaluation",
} as const;
