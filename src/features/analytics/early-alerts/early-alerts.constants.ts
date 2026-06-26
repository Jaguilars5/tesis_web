export const EARLY_ALERT_BASE_URL = "/api/analytics/early-alerts/";

export const EARLY_ALERT_ENDPOINTS = {
  LIST: EARLY_ALERT_BASE_URL,
  CREATE: EARLY_ALERT_BASE_URL,
  GET: (id: number) => `${EARLY_ALERT_BASE_URL}${id}/`,
  UPDATE: (id: number) => `${EARLY_ALERT_BASE_URL}${id}/`,
  SOFT_DELETE: (id: number) => `${EARLY_ALERT_BASE_URL}${id}/soft-delete/`,
  MARK_ATTENDED: (id: number) => `${EARLY_ALERT_BASE_URL}${id}/mark-attended/`,
} as const;

export const EARLY_ALERT_PERMISSIONS = {
  GET: "analytics.view_early_alert",
  CREATE: "analytics.create_early_alert",
  UPDATE: "analytics.update_early_alert",
  DELETE: "analytics.delete_early_alert",
} as const;
