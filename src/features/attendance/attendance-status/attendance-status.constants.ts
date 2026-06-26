export const ATTENDANCE_STATUS_BASE_URL = "/api/attendance/attendance-statuses/";

export const ATTENDANCE_STATUS_ENDPOINTS = {
  LIST: ATTENDANCE_STATUS_BASE_URL,
  CREATE: ATTENDANCE_STATUS_BASE_URL,
  GET: (id: number) => `${ATTENDANCE_STATUS_BASE_URL}${id}/`,
  UPDATE: (id: number) => `${ATTENDANCE_STATUS_BASE_URL}${id}/`,
  SOFT_DELETE: (id: number) => `${ATTENDANCE_STATUS_BASE_URL}${id}/soft-delete/`,
} as const;

export const ATTENDANCE_STATUS_PERMISSIONS = {
  GET: "attendance.view_attendance_status",
  CREATE: "attendance.create_attendance_status",
  UPDATE: "attendance.update_attendance_status",
  DELETE: "attendance.delete_attendance_status",
} as const;
