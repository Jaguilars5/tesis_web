export const ATTENDANCE_BASE_URL = "/api/attendance/attendances/";

export const ATTENDANCE_ENDPOINTS = {
  LIST: ATTENDANCE_BASE_URL,
  CREATE: ATTENDANCE_BASE_URL,
  GET: (id: number) => `${ATTENDANCE_BASE_URL}${id}/`,
  UPDATE: (id: number) => `${ATTENDANCE_BASE_URL}${id}/`,
} as const;

export const ATTENDANCE_PERMISSIONS = {
  GET: "attendance.view_attendance",
  CREATE: "attendance.create_attendance",
  UPDATE: "attendance.update_attendance",
} as const;
