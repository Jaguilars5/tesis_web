export const EARLY_ALERT_ENDPOINTS = {
  LIST: "/api/analytics/early-alerts/",
  DETAIL: (id: number) => `/api/analytics/early-alerts/${id}/`,
  SOFT_DELETE: (id: number) => `/api/analytics/early-alerts/${id}/soft-delete/`,
  MARK_ATTENDED: (id: number) => `/api/analytics/early-alerts/${id}/mark-attended/`,
} as const;

export const EARLY_ALERT_PERMISSIONS = {
  GET: "analytics.view_early_alert",
  CREATE: "analytics.create_early_alert",
  UPDATE: "analytics.update_early_alert",
  DELETE: "analytics.delete_early_alert",
} as const;
