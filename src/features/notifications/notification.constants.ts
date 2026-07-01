export const NOTIFICATION_BASE_URL = "/api/notifications/notifications";

export const NOTIFICATION_ENDPOINTS = {
  LIST: NOTIFICATION_BASE_URL,
  UNREAD_COUNT: `${NOTIFICATION_BASE_URL}/unread-count/`,
  MARK_READ: (id: number) => `${NOTIFICATION_BASE_URL}/${id}/mark-read/`,
  MARK_ALL_READ: `${NOTIFICATION_BASE_URL}/mark-all-read/`,
} as const;
