export const ATTENDANCE_ENDPOINTS = {
  LIST: "/api/attendance/attendances/",
  DETAIL: (id: number) => `/api/attendance/attendances/${id}/`,
} as const;

export const ATTENDANCE_PERMISSIONS = {
  GET: "attendance.view_attendance",
  CREATE: "attendance.create_attendance",
  UPDATE: "attendance.update_attendance",
} as const;
