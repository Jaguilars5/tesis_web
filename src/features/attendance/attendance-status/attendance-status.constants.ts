export const ATTENDANCE_STATUS_ENDPOINTS = {
  LIST: "/api/attendance/attendance-statuses/",
  DETAIL: (id: number) => `/api/attendance/attendance-statuses/${id}/`,
} as const;

export const ATTENDANCE_STATUS_PERMISSIONS = {
  GET: "attendance.view_attendance_status",
  CREATE: "attendance.create_attendance_status",
  UPDATE: "attendance.update_attendance_status",
  DELETE: "attendance.delete_attendance_status",
} as const;
